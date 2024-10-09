// // tests/users.test.ts
// import request from "supertest";
// import { app, server } from "../src/app"; // Ensure your Express app is exported from app.ts
// import { disconnectDB } from "../src/config/db";
// import { User } from "../src/models/user.model";

// beforeEach(async () => {
//   // Optional: You can set a prefix for test users
//   const testUserEmailPrefix = "test_";
//   await User.deleteMany({ email: { $regex: `^${testUserEmailPrefix}` } });
// });

// afterAll(async () => {
//   // Close the server after tests
//   await new Promise<void>((resolve) => {
//     server.close(() => {
//       resolve();
//     });
//   });

//   // Disconnect from MongoDB
//   await disconnectDB();
// });

// describe("User Registration Tests", () => {
//   const testUserEmail = "test_john.doe@example.com"; // Use a unique email for tests

//   test("1. Should register a new user successfully", async () => {
//     const response = await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });
//     expect(response.status).toBe(201);
//     expect(response.body.status).toBe(true);
//     expect(response.body.message).toBe("User registered successfully");
//     expect(response.body.user.email).toBe(testUserEmail);
//   });

//   test("2. Should not register a user with an existing email", async () => {
//     await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });

//     const response = await request(app).post("/api/users/register").send({
//       firstName: "Jane",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });
//     expect(response.status).toBe(409);
//     expect(response.body.status).toBe(false);
//     expect(response.body.message).toBe("User already exists with this email");
//   });

//   test("3. Should return validation error for missing firstName", async () => {
//     const response = await request(app).post("/api/users/register").send({
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined(); // Check that errors exist
//     expect(response.body.errors["body.firstName"]).toBe("Required"); // Check specific error message
//   });

//   test("4. Should return validation error for invalid email", async () => {
//     const response = await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: "invalidEmail",
//       phoneNumber: 1234567890,
//       password: "password123",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined();
//     expect(response.body.errors["body.email"]).toContain("Invalid email");
//   });

//   test("5. Should return validation error for missing password", async () => {
//     const response = await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined();
//     expect(response.body.errors["body.password"]).toContain(
//       "Password should be at least 1 characters"
//     );
//   });
// });

// describe("User Login Tests", () => {
//   const testUserEmail = "test_john.doe@example.com"; // Ensure it's the same as above

//   beforeEach(async () => {
//     // Clean up the database and register a user before login tests
//     await User.deleteMany({ email: { $regex: `^test_` } });
//     await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });
//   });

//   test("6. Should log in user successfully", async () => {
//     const response = await request(app).post("/api/users/login").send({
//       email: testUserEmail,
//       password: "password123",
//     });
//     console.log(response.body);

//     expect(response.status).toBe(200);
//     expect(response.body.status).toBe(true);
//     expect(response.body.message).toBe("Login successful");
//     expect(response.body.user.email).toBe(testUserEmail);
//   });

//   test("7. Should not log in with invalid credentials", async () => {
//     const response = await request(app).post("/api/users/login").send({
//       email: testUserEmail,
//       password: "wrongpassword",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.status).toBe(false);
//     expect(response.body.message).toBe("Invalid credentials");
//   });

//   test("8. Should return error for non-existing user", async () => {
//     const response = await request(app).post("/api/users/login").send({
//       email: "nonexistent@example.com",
//       password: "password123",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(404);
//     expect(response.body.status).toBe(false);
//     expect(response.body.message).toBe("User not found");
//   });

//   test("9. Should return validation error for missing email", async () => {
//     const response = await request(app).post("/api/users/login").send({
//       password: "password123",
//     });

//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined();
//     expect(response.body.errors["body.email"]).toContain("Required");
//   });
// });

// describe("User Logout Tests", () => {
//   let refreshToken: string;
//   const testUserEmail = "test_john.doe@example.com"; // Ensure it's the same as above

//   beforeEach(async () => {
//     // Clean up the database and register a user before logout tests
//     await User.deleteMany({ email: { $regex: `^test_` } });
//     const response = await request(app).post("/api/users/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: testUserEmail,
//       phoneNumber: 1234567890,
//       password: "password123",
//     });
//     refreshToken = response.body.refreshToken; // Store the refresh token for logout tests
//   });

//   test("10. Should log out user successfully", async () => {
//     const response = await request(app)
//       .post("/api/users/logout")
//       .send({ refreshToken });
//     expect(response.status).toBe(200);
//     expect(response.body.status).toBe(true);
//     expect(response.body.message).toBe("Logout successful");
//   });

//   test("11. Should return error for missing refresh token", async () => {
//     const response = await request(app).post("/api/users/logout").send({});
//     console.log(response.body);

//     expect(response.status).toBe(400);
//     expect(response.body.errors).toBeDefined();
//     expect(response.body.errors["body.refreshToken"]).toContain("Required");
//   });

//   test("12. Should return error for invalid refresh token", async () => {
//     const response = await request(app)
//       .post("/api/users/logout")
//       .send({ refreshToken: "invalidToken" });
//     expect(response.status).toBe(404);
//     expect(response.body.status).toBe(false);
//     expect(response.body.message).toBe("User not found or already logged out");
//   });
// });

// tests/users.test.ts
import request from "supertest";
import { app, server } from "../src/app"; // Ensure your Express app is exported from app.ts
import { disconnectDB } from "../src/config/db";
import { User } from "../src/models/user.model";
import logger from "./logger"; // Adjust the path to your logger

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
    try {
      const response = await request(app).post("/api/users/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "password123",
      });

      // Log the request and response
      logger.info(`Request to register user: ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user.email).toBe(testUserEmail);
    } catch (error) {
      logger.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("2. Should not register a user with an existing email", async () => {
    try {
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

      logger.info(
        `Response when trying to register existing email: ${JSON.stringify(
          response.body
        )}`
      );

      expect(response.status).toBe(409);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe("User already exists with this email");
    } catch (error) {
      logger.error("Error during registration with existing email:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("3. Should return validation error for missing firstName", async () => {
    try {
      const response = await request(app).post("/api/users/register").send({
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "password123",
      });

      logger.info(
        `Response for missing firstName: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined(); // Check that errors exist
      expect(response.body.errors["body.firstName"]).toBe("Required"); // Check specific error message
    } catch (error) {
      logger.error("Error during validation for missing firstName:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("4. Should return validation error for invalid email", async () => {
    try {
      const response = await request(app).post("/api/users/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "invalidEmail",
        phoneNumber: 1234567890,
        password: "password123",
      });

      logger.info(
        `Response for invalid email: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors["body.email"]).toContain("Invalid email");
    } catch (error) {
      logger.error("Error during validation for invalid email:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("5. Should return validation error for missing password", async () => {
    try {
      const response = await request(app).post("/api/users/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "",
      });

      logger.info(
        `Response for missing password: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors["body.password"]).toContain(
        "Password should be at least 1 characters"
      );
    } catch (error) {
      logger.error("Error during validation for missing password:", error);
      throw error; // Rethrow to fail the test
    }
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
    try {
      const response = await request(app).post("/api/users/login").send({
        email: testUserEmail,
        password: "password123",
      });

      logger.info(`Login response: ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.user.email).toBe(testUserEmail);
    } catch (error) {
      logger.error("Error during user login:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("7. Should not log in with invalid credentials", async () => {
    try {
      const response = await request(app).post("/api/users/login").send({
        email: testUserEmail,
        password: "wrongpassword",
      });

      logger.info(
        `Response for invalid login attempt: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    } catch (error) {
      logger.error("Error during invalid login attempt:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("8. Should return error for non-existing user", async () => {
    try {
      const response = await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      logger.info(
        `Response for login attempt with non-existing user: ${JSON.stringify(
          response.body
        )}`
      );

      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe("User not found");
    } catch (error) {
      logger.error("Error during login with non-existing user:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("9. Should return validation error for missing email", async () => {
    try {
      const response = await request(app).post("/api/users/login").send({
        password: "password123",
      });

      logger.info(
        `Response for login attempt with missing email: ${JSON.stringify(
          response.body
        )}`
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors["body.email"]).toContain("Required");
    } catch (error) {
      logger.error("Error during login with missing email:", error);
      throw error; // Rethrow to fail the test
    }
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
    try {
      const response = await request(app)
        .post("/api/users/logout")
        .set("Authorization", `Bearer ${refreshToken}`);

      logger.info(`Logout response: ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe("Logout successful");
    } catch (error) {
      logger.error("Error during user logout:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("11. Should return error for logout without token", async () => {
    try {
      const response = await request(app).post("/api/users/logout");

      logger.info(
        `Response for logout attempt without token: ${JSON.stringify(
          response.body
        )}`
      );

      expect(response.status).toBe(401);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe("Unauthorized");
    } catch (error) {
      logger.error("Error during logout without token:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test("12. Should return error for invalid refresh token", async () => {
    try {
      const response = await request(app)
        .post("/api/users/logout")
        .send({ refreshToken: "invalidToken" });

      logger.info(
        `Response for invalid refresh token: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        "User not found or already logged out"
      );
    } catch (error) {
      logger.error("Error during logout with invalid refresh token:", error);
      throw error; // Rethrow to fail the test
    }
  });
});
