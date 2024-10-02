import { Request, Response } from "express";
import dbServices from "../services/dbServices";

interface AuthenticatedRequest extends Request {
    user?: any;
}


export default class document{

// Create a new document
    static createDocumentController = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user;
            const { metadata } = req.body;

            const content = "Dummy Data";
            const newDocument = await dbServices.document.createDocument(userId, content, metadata);
            res.status(201).json(newDocument);
        } catch (error) {
            console.error("Error creating document:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    // Fetch documents by user ID
    static getDocumentsByUserIdController = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user;
            const documents = await dbServices.document.getDocumentsByUserId(userId);
            res.status(200).json(documents);
        } catch (error) {
            console.error("Error fetching documents:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    // Delete a document by user ID
    static deleteDocumentByUserId = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user;
            const documentId = req.params.documentId;

            // Call the service to delete the document
            const result = await dbServices.document.deleteDocumentById(userId, documentId);

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
    static toggleIsFavoriteByDocumentId = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user;
            const documentId = req.params.documentId;

            // Call the service to update IsFavorite field of Document
            const result = await dbServices.document.updateIsFavoriteByDocumentId(userId, documentId);

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
}