"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContentMiddleware = exports.validateMetadataMiddleware = exports.metadataSchema = void 0;
const zod_1 = require("zod");
// Define the metadata schema using Zod
exports.metadataSchema = zod_1.z.object({
    useCase: zod_1.z.string().min(1, { message: "useCase is required" }),
    primaryKey: zod_1.z.string().min(1, { message: "primaryKey is required" }),
    researchLevel: zod_1.z
        .number()
        .int()
        .min(1, { message: "Minimum value is 1" })
        .max(100, { message: "Maximum value is 100" }),
    personality: zod_1.z.array(zod_1.z.string()).min(1, { message: "personality array cannot be empty" }),
    tone: zod_1.z.array(zod_1.z.string()).min(1, { message: "tone array cannot be empty" }),
    language: zod_1.z.string().min(1, { message: "language is required" }),
});
// Validation schema for the content field
const contentSchema = zod_1.z.object({
    content: zod_1.z.string().min(0, { message: "Content is required" }),
});
// Middleware to validate metadata
const validateMetadataMiddleware = (req, res, next) => {
    const { metadata } = req.body;
    console.log("metadata", metadata);
    // If metadata is missing, return early after sending the response
    if (!metadata) {
        res.status(400).json({ message: "Invalid request!, metaData missing" });
        return;
    }
    const validationResult = exports.metadataSchema.safeParse(metadata);
    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    }
    else {
        next();
    }
};
exports.validateMetadataMiddleware = validateMetadataMiddleware;
// Middleware to validate the content field
const validateContentMiddleware = (req, res, next) => {
    const { content } = req.body;
    const validationResult = contentSchema.safeParse({ content });
    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    }
    else {
        next();
    }
};
exports.validateContentMiddleware = validateContentMiddleware;
