import { z } from "zod";

// Define the MongoDB ObjectID validation
const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ID format");

export default class DocumentValidators {
    // Schema for creating a new document (metadata in body)
    static createDocumentSchema = z.object({
        body: z
            .object({
                metadata: z
                    .object({
                        useCase: z.string().min(1, { message: "useCase is required" }),
                        primaryKey: z.string().min(1, { message: "primaryKey is required" }),
                        researchLevel: z
                            .number()
                            .int()
                            .min(1, { message: "Minimum value is 1" })
                            .max(100, { message: "Maximum value is 100" }),
                        personality: z
                            .array(z.string())
                            .min(1, { message: "personality array cannot be empty" }),
                        tone: z.array(z.string()).min(1, { message: "tone array cannot be empty" }),
                        language: z.string().min(1, { message: "language is required" }),
                    })
                    .strict(),
            })
            .strict(),
        params: z.object({}).strict(),
        query: z.object({}).strict(),
    });

    // Schema for updating content (with documentId as a param)
    static updateContentSchema = z.object({
        body: z
            .object({
                content: z.string().min(1, { message: "Content is required" }),
            })
            .strict(),
        params: z
            .object({
                documentId: objectIdSchema,
            })
            .strict(),
        query: z.object({}).strict(),
    });

    // Schema for getting documents by user ID (with no body, params or query for now)
    static getDocumentsSchema = z.object({
        params: z.object({}).strict(),
        query: z.object({}).strict(),
    });

    // Schema for deleting a document by documentId
    static deleteDocumentSchema = z.object({
        params: z
            .object({
                documentId: objectIdSchema,
            })
            .strict(),
        query: z.object({}).strict(),
    });

    // Schema for toggling isFavorite with documentId in params
    static toggleIsFavoriteSchema = z.object({
        params: z
            .object({
                documentId: objectIdSchema,
            })
            .strict(),
        query: z.object({}).strict(),
    });
}
