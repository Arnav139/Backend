// tests/users.test.ts
import request from "supertest";
import { app, server } from "../src/app"; // Ensure your Express app is exported from app.ts
import { disconnectDB } from "../src/config/db";
import { User } from "../src/models/user.model";

beforeEach(async () => {
  // Optional: You can set a prefix for test users
  const testUserEmailPrefix = "test_";
  await User.deleteMany({ email: { $regex: `^${testUserEmailPrefix}` } });
});

afterAll(async () => {
  // Close the server after tests
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });

  // Disconnect from MongoDB
  await disconnectDB();
});

describe("User Registration Tests", () => {
  const testUserEmail = "test_john.doe@example.com"; // Use a unique email for tests

  test("1. Should register a new user successfully", async () => {
    const response = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user.email).toBe(testUserEmail);
  });

  test("2. Should not register a user with an existing email", async () => {
    await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });

    const response = await request(app).post("/api/users/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });
    expect(response.status).toBe(409);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("User already exists with this email");
  });

  test("3. Should return validation error for missing firstName", async () => {
    const response = await request(app).post("/api/users/register").send({
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined(); // Check that errors exist
    expect(response.body.errors["body.firstName"]).toBe("Required"); // Check specific error message
  });

  test("4. Should return validation error for invalid email", async () => {
    const response = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "invalidEmail",
      phoneNumber: 1234567890,
      password: "password123",
    });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors["body.email"]).toContain("Invalid email");
  });

  test("5. Should return validation error for missing password", async () => {
    const response = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "",
    });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors["body.password"]).toContain(
      "Password should be at least 1 characters"
    );
  });
});

describe("User Login Tests", () => {
  const testUserEmail = "test_john.doe@example.com"; // Ensure it's the same as above

  beforeEach(async () => {
    // Clean up the database and register a user before login tests
    await User.deleteMany({ email: { $regex: `^test_` } });
    await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });
  });

  test("6. Should log in user successfully", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: testUserEmail,
      password: "password123",
    });
    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user.email).toBe(testUserEmail);
  });

  test("7. Should not log in with invalid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: testUserEmail,
      password: "wrongpassword",
    });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test("8. Should return error for non-existing user", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    console.log(response.body);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("9. Should return validation error for missing email", async () => {
    const response = await request(app).post("/api/users/login").send({
      password: "password123",
    });

    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors["body.email"]).toContain("Required");
  });
});

describe("User Logout Tests", () => {
  let refreshToken: string;
  const testUserEmail = "test_john.doe@example.com"; // Ensure it's the same as above

  beforeEach(async () => {
    // Clean up the database and register a user before logout tests
    await User.deleteMany({ email: { $regex: `^test_` } });
    const response = await request(app).post("/api/users/register").send({
      firstName: "John",
      lastName: "Doe",
      email: testUserEmail,
      phoneNumber: 1234567890,
      password: "password123",
    });
    refreshToken = response.body.refreshToken; // Store the refresh token for logout tests
  });

  test("10. Should log out user successfully", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .send({ refreshToken });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Logout successful");
  });

  test("11. Should return error for missing refresh token", async () => {
    const response = await request(app).post("/api/users/logout").send({});
    console.log(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors["body.refreshToken"]).toContain("Required");
  });

  test("12. Should return error for invalid refresh token", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .send({ refreshToken: "invalidToken" });
    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("User not found or already logged out");
  });
});
