// tests/document.test.ts
import mongoose from "mongoose";
import request from "supertest";
import { app, server } from "../src/app"; // Ensure your Express app is exported from app.ts
import { disconnectDB } from "../src/config/db";
import DocumentModel from "../src/models/document.model";
import { User } from "../src/models/user.model"; // Import the User model

describe("Document Tests", () => {
  let userId: mongoose.Types.ObjectId; // This will hold the ID of the created user
  let token: string; // The token for the authenticated user
  let documentId: string; // This will store the ID of the created document for further tests

  beforeAll(async () => {
    // Create a unique test user email for each test run
    const testUserEmail = `test_document2_john.doe.${Date.now()}@example.com`; // Use a unique email
    const userResponse = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });

    console.log(userResponse.body);

    // Ensure user registration was successful and get the token
    expect(userResponse.status).toBe(201);
    expect(userResponse.body.status).toBe(true);
    expect(userResponse.body.user.email).toBe(testUserEmail);

    // Log in to retrieve the token
    const loginResponse = await request(app).post("/api/users/login").send({
      email: testUserEmail,
      password: "password123",
    });

    console.log(loginResponse.body);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.status).toBe(true);

    token = loginResponse.body.accessToken; // Assume the token is in the response body
    userId = loginResponse.body.user.id; // Store the user ID for cleanup
    console.log("User ID:", userId); // Check if userId is valid
  });

  afterEach(async () => {
    // Clean up any documents created during the tests
    await DocumentModel.deleteMany({ user: userId });
  });

  afterAll(async () => {
    // Clean up the test user after all tests
    await User.deleteMany({ email: "test_john.doe@example.com" });

    // Close the server and disconnect from the database
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });

    await disconnectDB();
  });
  describe("1. Document Creation Tests", () => {
    test("1.1: Should create a document successfully", async () => {
      const res = await request(app)
        .post("/api/documents/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          metadata: {
            useCase: "Research",
            primaryKey: "Document123",
            researchLevel: 5,
            personality: ["curious"],
            tone: ["informative"],
            language: "English",
          },
        });

      console.log(res.body);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.document).toHaveProperty("content");
      documentId = res.body.document._id; // Store the created document ID for further tests
    });

    test("1.2: Should return validation error for missing fields", async () => {
      const res = await request(app)
        .post("/api/documents/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          metadata: {
            // Missing required fields
          },
        });

      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errors).toEqual(
        expect.objectContaining({
          "body.metadata.useCase": "Required",
          "body.metadata.language": "Required",
          "body.metadata.personality": "Required",
          "body.metadata.primaryKey": "Required",
          "body.metadata.researchLevel": "Required",
          "body.metadata.tone": "Required",
        })
      );
    });

    test("1.3: Should return validation error for invalid researchLevel", async () => {
      const res = await request(app)
        .post("/api/documents/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          metadata: {
            useCase: "Research",
            primaryKey: "Document123",
            researchLevel: 101, // Invalid
            personality: ["curious"],
            tone: ["informative"],
            language: "English",
          },
        });

      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errors["body.metadata.researchLevel"]).toContain(
        "Maximum value is 100"
      );
    });

    test("1.4: Should return validation error for empty personality array", async () => {
      const res = await request(app)
        .post("/api/documents/create")
        .set("Authorization", `Bearer ${token}`)
        .send({
          metadata: {
            useCase: "Research",
            primaryKey: "Document123",
            researchLevel: 5,
            personality: [], // Invalid
            tone: ["informative"],
            language: "English",
          },
        });

      console.log(res.body);
      expect(res.status).toBe(400);
      expect(res.body.errors["body.metadata.personality"]).toContain(
        "personality array cannot be empty"
      );
    });
  });

  describe("2. Document Retrieval Tests", () => {
    test("2.1: Should fetch documents for user", async () => {
      // Create a document first
      const newDoc = new DocumentModel({
        user: userId,
        content: "Test content",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      await newDoc.save();

      const res = await request(app)
        .get("/api/documents")
        .set("Authorization", `Bearer ${token}`);

      console.log(res.body);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.documents).toHaveLength(1);
    });

    test("2.2: Should return 404 for non-existent user", async () => {
      // Try fetching documents for a non-existent user
      const nonExistentToken = "invalidToken"; // This token should not correspond to any valid user

      const res = await request(app)
        .get("/api/documents")
        .set("Authorization", `Bearer ${nonExistentToken}`);

      console.log(res.body);

      expect(res.status).toBe(401);

      expect(res.body.message).toBe("Unauthorized: Invalid token or user");
    });
  });

  describe("3. Document Deletion Tests", () => {
    test("3.1: Should delete a document successfully", async () => {
      const newDoc = new DocumentModel({
        user: userId,
        content: "Test content to delete",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      // Use type assertion when saving
      const savedDoc = await newDoc.save(); // Assertion here
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .delete(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Document deleted successfully");

      // Check if the document is indeed marked as deleted
      const deletedDoc = await DocumentModel.findById(documentId);
      expect(deletedDoc).not.toBeNull(); // Check that it still exists
      if (deletedDoc) {
        expect(deletedDoc.isDeleted).toBe(true); // Ensure it is marked as deleted
      }
    });

    test("3.2: Should return 404 for deleting non-existent document", async () => {
      const res = await request(app)
        .delete(`/api/documents/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to delete"
      );
    });

    test("3.3: Should return 403 for unauthorized document deletion", async () => {
      const otherUserId = new mongoose.Types.ObjectId(); // Simulate another user ID
      const newDoc = new DocumentModel({
        user: otherUserId,
        content: "Test content for unauthorized delete",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      const savedDoc = await newDoc.save();
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .delete(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${token}`); // Authenticated as another user
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to delete"
      );
    });
  });

  describe("4. Toggle Favorite Tests", () => {
    test("4.1: Should toggle favorite status successfully", async () => {
      const newDoc = new DocumentModel({
        user: userId,
        content: "Test content to toggle favorite",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      const savedDoc = await newDoc.save();
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .put(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Document isFavorite updated successfully");
    });

    test("4.2: Should return 404 for toggling favorite of non-existent document", async () => {
      const res = await request(app)
        .put(`/api/documents/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to update isFavorite"
      );
    });

    test("4.3: Should return 404 for unauthorized favorite toggle", async () => {
      const otherUserId = new mongoose.Types.ObjectId(); // Simulate another user ID
      const newDoc = new DocumentModel({
        user: otherUserId,
        content: "Test content for unauthorized favorite toggle",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      const savedDoc = await newDoc.save();
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .put(`/api/documents/${documentId}`)
        .set("Authorization", `Bearer ${token}`); // Authenticated as another user
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to update isFavorite"
      );
    });
  });

  describe("5. Document Update Tests", () => {
    test("5.1: Should update document content successfully", async () => {
      const newDoc = new DocumentModel({
        user: userId,
        content: "Test content to update",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      const savedDoc = await newDoc.save();
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .put(`/api/documents/updateContent/${documentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Updated content" });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.message).toBe("Document content updated successfully");
    });

    test("5.2: Should return 404 for updating non-existent document", async () => {
      const res = await request(app)
        .put(`/api/documents/updateContent/${new mongoose.Types.ObjectId()}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Some content" });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to update content"
      );
    });

    test("5.3: Should return 404 for unauthorized document update", async () => {
      const otherUserId = new mongoose.Types.ObjectId(); // Simulate another user ID
      const newDoc = new DocumentModel({
        user: otherUserId,
        content: "Test content for unauthorized update",
        metadata: {
          useCase: "Test Use Case",
          primaryKey: "Test123",
          researchLevel: 5,
          personality: ["friendly"],
          tone: ["casual"],
          language: "English",
        },
      });
      const savedDoc = await newDoc.save();
      documentId = (savedDoc._id as mongoose.Types.ObjectId).toString(); // Store the document ID

      const res = await request(app)
        .put(`/api/documents/updateContent/${documentId}`)
        .set("Authorization", `Bearer ${token}`) // Authenticated as another user
        .send({ content: "Some new content" });
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe(
        "Document not found or not authorized to update content"
      );
    });
  });
});
