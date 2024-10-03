import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Define the metadata schema using Zod
export const metadataSchema = z.object({
    useCase: z.string().min(1, { message: "useCase is required" }),
    primaryKey: z.string().min(1, { message: "primaryKey is required" }),
    researchLevel: z
        .number()
        .int()
        .min(1, { message: "Minimum value is 1" })
        .max(100, { message: "Maximum value is 100" }),
    personality: z.array(z.string()).min(1, { message: "personality array cannot be empty" }),
    tone: z.array(z.string()).min(1, { message: "tone array cannot be empty" }),
    language: z.string().min(1, { message: "language is required" }),
});

// Validation schema for the content field
const contentSchema = z.object({
    content: z.string().min(0, { message: "Content is required" }),
});

// Middleware to validate metadata
export const validateMetadataMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { metadata } = req.body;
    console.log("metadata", metadata);

    // If metadata is missing, return early after sending the response
    if (!metadata) {
        res.status(400).json({ message: "Invalid request!, metaData missing" });
        return;
    }

    const validationResult = metadataSchema.safeParse(metadata);

    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    } else {
        next();
    }
};

// Middleware to validate the content field
export const validateContentMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { content } = req.body;
    const validationResult = contentSchema.safeParse({ content });

    if (!validationResult.success) {
        res.status(400).json({ message: validationResult.error.errors });
    } else {
        next();
    }
};
