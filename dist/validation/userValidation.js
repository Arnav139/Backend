"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationDataMiddleware = exports.validateLoginDataMiddleware = void 0;
const zod_1 = require("zod");
// Validation schema for user login
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(1, { message: "Password must be at least 1 characters long" }),
});
// Validation schema for user registration
const registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, { message: "First name is required" }),
    lastName: zod_1.z.string().min(1, { message: "Last name is required" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phoneNumber: zod_1.z.number().nonnegative({ message: "Invalid phone number" }),
    password: zod_1.z.string().min(1, { message: "Password must be at least 1 characters long" }),
});
// Middleware to validate the login Data
const validateLoginDataMiddleware = (req, res, next) => {
    const { email, password } = req.body;
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    }
    else {
        next();
    }
};
exports.validateLoginDataMiddleware = validateLoginDataMiddleware;
// Middleware to validate the Registration Data
const validateRegistrationDataMiddleware = (req, res, next) => {
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
    }
    else {
        next();
    }
};
exports.validateRegistrationDataMiddleware = validateRegistrationDataMiddleware;
