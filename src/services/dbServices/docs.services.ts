import DocumentModel from "../../models/document.model"; // Ensure correct path
import mongoose from "mongoose";

// Create a new document
export const createDocument = async (userId: mongoose.Types.ObjectId, content: string, metadata: any) => {
    const newDocument = new DocumentModel({
        user: userId,
        content,
        metadata,
    });
    return await newDocument.save(); // Return the saved document
};

// Fetch documents by user ID
export const getDocumentsByUserId = async (userId: mongoose.Types.ObjectId) => {
    return await DocumentModel.find({ user: userId, isDeleted: false });
};

// Service to delete a document by document ID and user ID
export const deleteDocumentById = async (userId: mongoose.Types.ObjectId, documentId: string) => {
    // Use DocumentModel to ensure consistency with the import
    const result = await DocumentModel.findOneAndDelete({ _id: documentId, user: userId }); // Find the document by ID and user ID, then delete it
    return result !== null; // Return true if a document was deleted, otherwise false
};
