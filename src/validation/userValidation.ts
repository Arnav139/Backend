import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Validation schema for user login
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password must be at least 1 characters long" }),
});

// Validation schema for user registration
const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.number().nonnegative({ message: "Invalid phone number" }),
    password: z.string().min(1, { message: "Password must be at least 1 characters long" }),
});

// Middleware to validate the login Data
export const validateLoginDataMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { email, password } = req.body;
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    } else {
        next();
    }
};

// Middleware to validate the Registration Data
export const validateRegistrationDataMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const validationResult = loginSchema.safeParse({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    } else {
        next();
    }
};
