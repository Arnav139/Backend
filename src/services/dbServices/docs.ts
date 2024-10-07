import DocumentModel from "../../models/document.model"; 
import mongoose from "mongoose";


export default class document{

    static createDocument = async (
        userId: mongoose.Types.ObjectId,
        content: any,
        metadata: any,
        keyword:any
    ) => {
        try {
            const newDocument = new DocumentModel({
                user: userId,
                content,
                metadata,
                keyword
    
            });
            return await newDocument.save();
            
        } catch (error:any) {
            throw new Error(error)
        }
    };

    static updateDocument= async (
        userId: mongoose.Types.ObjectId,
        docId:mongoose.Types.ObjectId,
        content: any,        
    ) => {
        try {
            const updatedDocument = await DocumentModel.findOneAndUpdate(
                { user: userId, _id: docId },   // Query to find the document by userId
                { content: content }, // Update the content field
                { new: true, upsert: true } // Return the updated document, and create it if it doesn't exist
            );
            
            return updatedDocument;
            
        } catch (error:any) {
            throw new Error(error)
        }
    };

    // Fetch documents by user ID
    static getDocumentsByUserId = async (userId: mongoose.Types.ObjectId) => {
        try {
            return await DocumentModel.find({ user: userId, isDeleted: false }).select("-user");
            
        } catch (error:any) {
            throw new Error(error)
        }
    };

    // Service to delete a document by document ID and user ID
    static deleteDocumentById = async (userId: mongoose.Types.ObjectId, documentId: string) => {
        try {
            // Find the document and update its isDeleted field to true
                const result = await DocumentModel.findOneAndUpdate(
                    { _id: documentId, user: userId }, 
                    { isDeleted: true }, 
                    { new: true } 
                );

                return result !== null; // Return true if the document was found and updated
                    
        } catch (error:any) {
            throw new Error(error)
        }
    };


    static updateIsFavoriteByDocumentId = async (
        userId: mongoose.Types.ObjectId,
        documentId: string
    ) => {
        try {
            const document = await DocumentModel.findOne({ _id: documentId, user: userId });
                if (!document) {
                    return false;
                }

                document.isFavorite = !document.isFavorite;
                const result = await document.save();

                return result !== null;
            
            
        } catch (error:any) {
            throw new Error(error)
        }
    }
}