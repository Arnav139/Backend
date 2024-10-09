import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createDocument,
    getDocumentsByUserId,
    deleteDocumentById,
    updateIsFavoriteByDocumentId,
    updateContentByDocumentId,
} from "../services/dbServices/docs.services";

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

        const content = "Dummy Data";
        const newDocument = await createDocument(userId, content, metadata);
        res.status(201).json({
            status: true,
            message: "Document added successfully",
            document: newDocument,
        });
    } catch (error) {
        console.error("Error creating document:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ status: false, message });
    }
};

// Fetch documents by user ID
export const getDocumentsByUserIdController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documents = await getDocumentsByUserId(userId);
        res.status(200).json({
            status: true,
            message: "Documents fetched successfully",
            documents: documents,
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ status: false, message });
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
            res.status(200).json({
                status: true,
                message: "Document deleted successfully",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Document not found or not authorized to delete",
            });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ status: false, message });
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
            res.status(200).json({
                status: true,
                message: "Document isFavorite updated successfully",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Document not found or not authorized to update isFavorite",
            });
        }
    } catch (error) {
        console.error("Error deleting document:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ status: false, message });
    }
};

// Update document content by documentId
export const updateDocumentByDocumentId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;
        const { content } = req.body;

        // Call the service to update the content field of the Document
        const result = await updateContentByDocumentId(userId, documentId, content);

        if (result) {
            res.status(200).json({
                status: true,
                message: "Document content updated successfully",
            });
        } else {
            res.status(404).json({
                status: false,
                message: "Document not found or not authorized to update content",
            });
        }
    } catch (error) {
        console.error("Error updating document:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        res.status(500).json({ status: false, message });
    }
};

