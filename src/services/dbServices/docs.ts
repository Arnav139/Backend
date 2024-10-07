import postgresdb from "../../config/db";
import DocumentModel from "../../models/document.model"; 
import mongoose from "mongoose";
import { documents } from "../../models/schema";
import {and, desc, eq, inArray, sql,ne,asc} from "drizzle-orm";



export default class document{

    static createDocument = async (userId:string,content:any,metadata:any,keyword:any) => {
        try {
            const newDocument = await postgresdb.insert(documents).values({
                userId,      
                content,     
                metadata,    
                keyword      
            }).returning({content:documents.content});
            console.log(newDocument)
            return newDocument; 
        } catch (error: any) {
            throw new Error(error.message || "Failed to create document");
        }
    };
    // Fetch documents by user ID
    static getDocumentsByUserId = async (userId: number): Promise<any> => {
        try {
            const getDocument = await postgresdb
                .select() // Start a select query
                .from(documents) // Define the table you're querying
                .where(
                    and(
                        eq(documents.user, userId), // Match by userId
                        eq(documents.isDeleted, false) // Only get non-deleted documents
                    )
                )
                .execute(); // Execute the query
    
            return documents;
        } catch (erro:any) {
            console.error(erro);
            throw new Error(erro);
        }
    };

    // Service to delete a document by document ID and user ID
    static deleteDocumentById = async (userId: number, documentId: number): Promise<boolean> => {
        try {
            const result = await postgresdb
                .update(documents) 
                .set({ isDeleted: true })
                .where(
                    and(
                        eq(documents.id, documentId), 
                        eq(documents.user, userId)                     )
                )
                .returning({ id: documents.id }) 
                .execute(); 
            return result.length > 0;
        } catch (error:any) {
            console.error(error);
            throw new Error(error);
        }
    };


    static updateIsFavoriteByDocumentId = async (userId: number, documentId: number): Promise<boolean> => {
        try {
            // Find the document to check its current `isFavorite` status
            const document = await postgresdb
                .select()
                .from(documents)
                .where(
                    and(
                        eq(documents.id, documentId),
                        eq(documents.user, userId)
                    )
                ).execute();
    
            if (document.length === 0) {
                return false;
            }
            const isFavorite = !document[0].isFavorite;
            const result = await postgresdb
                .update(documents)
                .set({ isFavorite: isFavorite })
                .where(
                    and(
                        eq(documents.id, documentId),
                        eq(documents.user, userId)    
                    )
                )
                .returning({ id: documents.id }) 
                .execute();
            return result.length > 0;
        } catch (error:any) {
            console.error(error);
            throw new Error(error);
        }
    };
}