import DocumentModel from "../../models/document.model"; 
import mongoose from "mongoose";

// Create a new document
export const createDocument = async (userId: mongoose.Types.ObjectId, content: string, metadata: any) => {
    const newDocument = new DocumentModel({
        user: userId,
        content,
        metadata,
    });
    return await newDocument.save(); 
};

// Fetch documents by user ID
export const getDocumentsByUserId = async (userId: mongoose.Types.ObjectId) => {
    return await DocumentModel.find({ user: userId, isDeleted: false });
};

// Service to delete a document by document ID and user ID
export const deleteDocumentById = async (userId: mongoose.Types.ObjectId, documentId: string) => {
    const result = await DocumentModel.findOneAndDelete({ _id: documentId, user: userId }); 
    return result !== null; 
};
