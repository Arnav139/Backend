import { z } from "zod";

// Validation schema for user login
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password must be at least 1 characters long" }),
});

// Validation schema for user registration
const registerSchema = z.object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.number().nonnegative({ message: "Invalid phone number" }),
    password: z.string().min(1, { message: "Password must be at least 1 characters long" }),
});

// Create a function to validate login Data
export const validateLoginData = (loginData: unknown) => {
    return loginSchema.safeParse(loginData);
};

// Create a function to validate Registration Data
export const validateRegistrationData = (registrationData: unknown) => {
    return registerSchema.safeParse(registrationData);
};
