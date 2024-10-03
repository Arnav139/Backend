import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createDocument,
    getDocumentsByUserId,
    deleteDocumentById,
    updateIsFavoriteByDocumentId,
    updateContentByDocumentId,
} from "../services/dbServices/docs.services"; // Adjust the path as needed
import { User } from "../models/user.model";
import { validateContent, validateMetadata } from "../validation/documentValidation";

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Create a new document
export const createDocumentController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user;
        const { metadata } = req.body;

        // If metadata is missing, return early after sending the response
        if (!metadata) {
            res.status(400).json({ message: "Invalid request!, metaData missing" });
            return;
        }

        const validationResult = validateMetadata(metadata);

        // If metadata validation fails, return early after sending the response
        if (!validationResult.success) {
            res.status(400).json({ message: validationResult.error.errors });
            return;
        }

        const content = "Dummy Data";
        const newDocument = await createDocument(userId, content, metadata);
        res.status(201).json(newDocument);
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch documents by user ID
export const getDocumentsByUserIdController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documents = await getDocumentsByUserId(userId);
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a document by user ID
export const deleteDocumentByUserId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;

        // Call the service to delete the document
        const result = await deleteDocumentById(userId, documentId);

        if (result) {
            res.status(200).json({ message: "Document deleted successfully" });
        } else {
            res.status(404).json({ message: "Document not found or not authorized to delete" });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// toggle  isFavorite of document by document ID
export const toggleIsFavoriteByDocumentId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;

        // Call the service to update IsFavorite field of Document
        const result = await updateIsFavoriteByDocumentId(userId, documentId);

        if (result) {
            res.status(200).json({ message: "Document isFavorite updated successfully" });
        } else {
            res.status(404).json({
                message: "Document not found or not authorized to update isFavorite",
            });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update document content by documentId
export const updateDocumentByDocumentId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;
        const { content } = req.body;
        const validationResult = validateContent({ content });

        // If content validation fails, return early after sending the response
        if (!validationResult.success) {
            res.status(400).json({ message: validationResult.error.errors });
            return;
        }

        // Call the service to update the content field of the Document
        const result = await updateContentByDocumentId(userId, documentId, content);

        if (result) {
            res.status(200).json({ message: "Document content updated successfully" });
        } else {
            res.status(404).json({
                message: "Document not found or not authorized to update content",
            });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
