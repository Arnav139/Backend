import DocumentModel from "../../models/document.model"; // Ensure correct path
import mongoose from "mongoose";

// Create a new document
export const createDocument = async (
    userId: mongoose.Types.ObjectId,
    content: string,
    metadata: any
) => {
    const newDocument = new DocumentModel({
        user: userId,
        content,
        metadata,
    });
    return await newDocument.save();
};

// Fetch documents by user ID
export const getDocumentsByUserId = async (userId: mongoose.Types.ObjectId) => {
    return await DocumentModel.find({ user: userId, isDeleted: false }).select("-user");
};

// Service to delete a document by document ID and user ID
export const deleteDocumentById = async (userId: mongoose.Types.ObjectId, documentId: string) => {
    // Find the document and update its isDeleted field to true
    const result = await DocumentModel.findOneAndUpdate(
        { _id: documentId, user: userId }, 
        { isDeleted: true }, 
        { new: true } 
    );

    return result !== null; // Return true if the document was found and updated
};

// Service to update isFavorite of document by document ID and user ID
export const updateIsFavoriteByDocumentId = async (
    userId: mongoose.Types.ObjectId,
    documentId: string
) => {
    const document = await DocumentModel.findOne({ _id: documentId, user: userId });
    if (!document) {
        return false;
    }

    document.isFavorite = !document.isFavorite;
    const result = await document.save();

    return result !== null;
};
