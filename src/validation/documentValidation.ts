import { z } from "zod";

// Define the metadata schema using Zod
export const metadataSchema = z.object({
    useCase: z.string().nonempty({ message: "useCase is required" }),
    primaryKey: z.string().nonempty({ message: "primaryKey is required" }),
    researchLevel: z
        .number()
        .int()
        .min(1, { message: "Minimum value is 1" })
        .max(100, { message: "Maximum value is 100" }),
    personality: z.array(z.string()).nonempty({ message: "personality array cannot be empty" }),
    tone: z.array(z.string()).nonempty({ message: "tone array cannot be empty" }),
    language: z.string().nonempty({ message: "language is required" }),
});

// Create a function to validate metadata
export const validateMetadata = (metadata: unknown) => {
    return metadataSchema.safeParse(metadata);
};
