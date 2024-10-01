import { Request, Response } from "express";
import mongoose from "mongoose";
import { createDocument, getDocumentsByUserId, deleteDocumentById } from "../services/dbServices/docs.services"; // Adjust the path as needed
import { User } from "../models/user.model";

interface AuthenticatedRequest extends Request {
    user?: any; 
}

// Create a new document
export const createDocumentController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user; // Assuming req.user contains the authenticated user ID
        const { content, metadata } = req.body;

        const newDocument = await createDocument(userId, content, metadata);
        res.status(201).json(newDocument);
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Fetch documents by user ID
export const getDocumentsByUserIdController = async (req: Request, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
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

