// import { describe, test, expect, beforeEach, jest } from "@jest/globals";
// import { loginEventBody, registerEventBody,registerEventFieldMissingBody} from "./helper";

// const commonurl = 'http://localhost:3000/api';

// // Mocked fetch function with the correct typing for TypeScript
// type FetchMock = jest.MockedFunction<typeof fetch>;

// describe("Test API Routes", () => {
//     let fetchMock: FetchMock;

//     beforeEach(() => {
//         fetchMock = jest.fn() as FetchMock;
//         global.fetch = fetchMock;
//     });

//     test("Test1: should create a user in DB via /register", async () => {
//         fetchMock.mockResolvedValueOnce({
//             status: 201,
//             json: async () => ({
//                 status: true,
//                 message: "User registered successfully"
//             }),
//         } as Response);

//         const response = await fetch(`${commonurl}/users/register`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registerEventBody),
//         });

//         expect(response.status).toBe(201);
//         const data = await response.json();
//         expect(data).toEqual({
//             status: true,
//             message: expect.any(String),
//         });
//     });

//     test("Test2: Should log in successfully via /login", async () => {
//         fetchMock.mockResolvedValueOnce({
//             status: 200,
//             json: async () => ({
//                 status: true,
//                 message: "Login successful"
//             }),
//         } as Response);

//         const response = await fetch(`${commonurl}/users/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(loginEventBody),
//         });

//         expect(response.status).toBe(200);
//         const data = await response.json();
//         expect(data).toEqual({
//             status: true,
//             message: expect.any(String),
//         });
//     });

//     test("Test3: should no register if a field is missing /register",async()=>{
//         fetchMock.mockResolvedValueOnce({
//             status: 404,
//             json: async () => ({
//                 status: true,
//                 message: "Registeration failed due to missing field"
//             }),
//         } as Response)

//         const response = await fetch(`${commonurl}/users/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(registerEventFieldMissingBody),
//         });

//         expect(response.status).toBe(404);
//         const data = await response.json();
//         expect(data).toEqual({
//             status: true,
//             message: expect.any(String),
//         });
//     })
// });

import request from "supertest";
import { app, server } from "../src/app"; // Ensure your Express app is exported from app.ts
import { disconnectDB } from "../src/config/db";
import postgresdb from "../src/config/db"; // Import the Drizzle instance
import { users } from "../src/models/schema"; // Adjust based on your schema structure
import { sql } from "drizzle-orm";
// import logger from "./logger"; // Adjust the path to your logger

beforeEach(async () => {
  // Delete test users (PostgreSQL-style deletion using Drizzle)
  const testUserEmailPrefix = "test_";

  // Convert to lowercase to perform case-insensitive comparison
  await postgresdb
    .delete(users)
    .where(
      sql`LOWER(${users.email}) LIKE LOWER(${testUserEmailPrefix} || '%')`
    );
});

afterAll(async () => {
 // Close the server after tests
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
    console.log("server closed")
  });

  // Disconnect from PostgreSQL
  await disconnectDB();
});

describe("User Registration Tests", () => {
  const testUserEmail = "test_john.doe@example.com"; // Use a unique email for tests

  test.skip("1. Should register a new user successfully", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890, // Ensure the phone number is a number
        password: "password123",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(typeof response.body.data).toBe("string");
      expect(response.body.data).not.toBe(""); // Checks that it is not an empty string
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test.skip("2. Should not register a new user if first name empty", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: "1234567890", // Ensure the phone number is a number
        password: "password123",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      console.log({
        "Test Description":
          " Should not register a new user if first name empty",
        errorMessage: "First name is required",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors["body.firstName"]).toBe(
        "First name is required"
      );
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
  test.skip("3. Should not register a new user if last name is empty", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "",
        email: testUserEmail,
        phoneNumber: "1234567890", // Ensure the phone number is a number
        password: "password123",
      });

      // Log the request and response
      console.info(    // console.log({
      //   "Test Description": "Login Test",
      //   errorMessage: "Password should be at least 6 characters",
      // });
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      console.log({
        "Test Description":
          " Should not register a new user if Last name empty",
        errorMessage: "Last name is required",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors["body.lastName"]).toBe(
        "Last name is required"
      );
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
  test.skip("4. Should not register a new user if email field is not like email", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "iamemail",
        phoneNumber: "1234567890", // Ensure the phone number is a number
        password: "password123",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      console.log({
        "Test Description":
          " Should not register a new user if Email field is empty",
        errorMessage: "email is required",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors["body.email"]).toBe("Invalid email");
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
  test.skip("5. Phone number should be of exactly 10 digit of number", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 12343678,
        password: "password123",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      console.log({
        "Test Description": "Phone number Test",
        errorMessage: "Phone number must be exactly 10 digits long",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors["body.phoneNumber"]).toBe(
        "Phone number must be exactly 10 digits long"
      );
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
  test.skip("6. Password must contain minnimum 6 character", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "@#w2",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      console.log({
        "Test Description": "Password Test",
        errorMessage: "Password should be at least 6 characters",
      });
      expect(response.status).toBe(400);
      expect(response.body.errors["body.password"]).toBe(
        "Password should be at least 6 characters"
      );
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
  test.skip("7. Do not resister already existing user", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "iampassword",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      const response2 = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890,
        password: "iampassword",
      });

      // Log the request and response
      console.info(
        `Request to register user: ${JSON.stringify(response2.body)}`
      );
      console.log({
        "Test Description": "Already existing user test",
        errorMessage: "Error: User already exists with this email",
      });
      expect(response2.status).toBe(500);
      expect(response2.body.status).toBe(false);
      expect(response2.body.message).toBe(
        "Error: User already exists with this email"
      );
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow to fail the test
    }
  });
});

describe("User login tests", () => {
  const testUserEmail = "test_john.doe@example.com"; // Use a unique email for tests
  test.skip("8. Successfully Login User", async () => {
    try {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: testUserEmail,
        phoneNumber: 1234567890, // Ensure the phone number is a number
        password: "password123",
      });
      console.info(
        `Request to register user: ${JSON.stringify(response.body)}`
      );

      const response2 = await request(app).post("/user/login").send({
        email: testUserEmail,
        password: "password123",
      });

      // Log the request and response
      console.info(`Request to login user: ${JSON.stringify(response2.body)}`);
      
      expect(response2.status).toBe(200);
      expect(response2.body.status).toBe(true);
      expect(response2.body.message).toBe("user Logged In");
      expect(typeof response2.body.data.token).toBe("string");
      expect(response2.body.data.token).not.toBe("");

    } catch (error) {
      console.error("Error during user login:", error);
      throw error; // Rethrow to fail the test
    }
  });

  test.skip("9. Should return error for non-existing user", async () => {
    try {
      const response = await request(app).post("/user/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      console.info(
        `Response for login attempt with non-existing user: ${JSON.stringify(
          response.body
        )} :  ${JSON.stringify(
          response.status
        )} `
      );

      expect(response.status).toBe(500);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe("Server error");
    } catch (error) {
      console.error("Error during user login:", error);
      throw error; // Rethrow to fail the test
    }
  });
  // test("10. Should return error for wrong password", async () => {
  //   try {

  //     const response = await request(app).post("/user/register").send({
  //       firstName: "John",
  //       lastName: "Doe",
  //       email: testUserEmail,
  //       phoneNumber: 1234567890, // Ensure the phone number is a number
  //       password: "password123",
  //     });

  //     const response2 = await request(app).post("/user/login").send({
  //       email: testUserEmail,
  //       password: "wrognPassword",
  //     });

  //     console.info(
  //       `Response for login attempt with non-existing user: ${JSON.stringify(
  //         response2.body
  //       )} :  ${JSON.stringify(
  //         response2.status
  //       )} `
  //     );

  //     expect(response2.status).toBe(500);
  //     expect(response2.body.status).toBe(false);
  //     expect(response2.body.message).toBe("Server error");
  //   } catch (error) {
  //     console.error("Error during user login:", error);
  //     throw error; // Rethrow to fail the test
  //   }
  // });

  //As login functionality has been handled from frontend only there is no need to write login/logout tests

  describe("User Google Login Test",()=>{
    test("10. Should login with valid token", async () => {
      try {
        const token = process.env.TOKEN
        console.log(`token:- ${token}`)
        const response = await request(app).get(`/user/google-login?token=${token}`);
  
        console.info(
          `Response for google login attempt with token: ${JSON.stringify(
            response.body
          )} :  ${JSON.stringify(
            response.status
          )} `
        );
  
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe("LogedIn with Google");
        expect(typeof response.body.genToken).toBe("string");
        expect(response.body.genToken).not.toBe("");
      } catch (error) {
        console.error("Error during user login:", error);
        throw error; // Rethrow to fail the test
      }
    });
  })
    test("11. Should not login with invalid token", async () => {
      try {
        const token = process.env.TOKEN
        console.log(`token:- ${token}`)
        const response = await request(app).get(`/user/google-login?token=wrogntoken`);
  
        console.info(
          `Response for google login attempt with token: ${JSON.stringify(
            response.body
          )} :  ${JSON.stringify(
            response.status
          )} `
        );
  
        expect(response.status).toBe(404);
        expect(typeof response.body).toBe("object");
        expect(response.body).toEqual({});
      } catch (error) {
        console.error("Error during user login:", error);
        throw error; // Rethrow to fail the test
      }
    });
  })

