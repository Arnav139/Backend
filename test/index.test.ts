import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { loginEventBody, registerEventBody,registerEventFieldMissingBody} from "./helper";

const commonurl = 'http://localhost:3000/api';

// Mocked fetch function with the correct typing for TypeScript
type FetchMock = jest.MockedFunction<typeof fetch>;

describe("Test API Routes", () => {
    let fetchMock: FetchMock;

    beforeEach(() => {
        fetchMock = jest.fn() as FetchMock;  
        global.fetch = fetchMock;  
    });
     
    test("Test1: should create a user in DB via /register", async () => {
        fetchMock.mockResolvedValueOnce({
            status: 200,
            json: async () => ({
                status: true,
                message: "User registered successfully"
            }),
        } as Response);

        const response = await fetch(`${commonurl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerEventBody),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            status: true,
            message: expect.any(String),
        });
    });

    test("Test2: Should log in successfully via /login", async () => {
        fetchMock.mockResolvedValueOnce({
            status: 200,
            json: async () => ({
                status: true,
                message: "Login successful"
            }),
        } as Response);

        const response = await fetch(`${commonurl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginEventBody),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            status: true,
            message: expect.any(String),
        });
    });

    test("Test3: should no register if a field is missing /register",async()=>{
        fetchMock.mockResolvedValueOnce({
            status: 404,
            json: async () => ({
                status: true,
                message: "Registeration failed due to missing field"
            }),
        } as Response)

        const response = await fetch(`${commonurl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerEventFieldMissingBody),
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({
            status: true,
            message: expect.any(String),
        });
    })
});
