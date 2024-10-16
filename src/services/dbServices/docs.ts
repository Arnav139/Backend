import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import mongoose from "mongoose";
import postgresdb from "../../config/db";
import DocumentModel from "../../models/document.model";
import { documents, users } from "../../models/schema";

export default class document{

    static createDocument = async (userId:number,content:any,metadata:any,keyword:any) => {
        try {
            const userDetails = await postgresdb.select().from(users).where(eq(users.id,userId))
            // console.log(userDetails)
            if (userDetails[0].credits == 0) throw new Error("Not Sufficient Credits to Create Document")
            const newDocument = await postgresdb.insert(documents).values({
                userId,      
                content,     
                metadata,     
                keyword      
            }).returning({content:documents.content});

            await postgresdb.update(users).set({credits:sql`${userDetails[0].credits} - 1`}).where(eq(users.id,userId)).execute()
            //  console.log(newDocument);
            return newDocument; 
        } catch (error: any) {
            throw new Error(error.message || "Failed to create document");
        }
    };
    static getDocumentsByUserId = async (userId: number): Promise<any> => {
        try {
            const getDocument = await postgresdb
                .select({
                    id:documents.id,
                    content:documents.content,
                    updatedAt:documents.updatedAt,
                    isFavorite:documents.isFavorite,
                }) 
                .from(documents) 
                .where(
                    and(
                        eq(documents.userId, userId), 
                        eq(documents.isDeleted, false) 
                    )
                )
                .execute();
    
            return getDocument;
        } catch (erro:any) {
            console.error(erro);
            throw new Error(erro);
        }
    };

  // Service to delete a document by document ID and user ID
  static deleteDocumentById = async (
    userId: number,
    documentId: number
  ): Promise<boolean> => {
    try {
      console.log(userId, documentId);
      const result = await postgresdb
        .update(documents)
        .set({ isDeleted: true })
        .where(
          and(
            eq(documents.id, documentId),
            eq(documents.userId, userId),
            eq(documents.isDeleted, false)
          )
        )
        .returning({ id: documents.id })
        .execute();
      return result.length > 0;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };

  static updateIsFavoriteByDocumentId = async (
    userId: number,
    documentId: number
  ): Promise<boolean> => {
    try {
      // Find the document to check its current `isFavorite` status
      const document = await postgresdb
        .select()
        .from(documents)
        .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
        .execute();

      if (document.length === 0) {
        return false;
      }
      const isFavorite = !document[0].isFavorite;
      const result = await postgresdb
        .update(documents)
        .set({ isFavorite: isFavorite })
        .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
        .returning({ id: documents.id })
        .execute();
      return result.length > 0;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  };

    static getDocumentsById = async (userId:number,documentId:number):Promise<any> => {
        try{
            const getDocument = await postgresdb.select().from(documents)
            .where(
                and(
                    eq(documents.userId,userId),
                    eq(documents.id,documentId),
                    eq(documents.isDeleted,false)
                )
            ).execute();
        return getDocument   
        }catch(error:any){
            throw new Error(error)
        }

    }

    static updateDoc = async(userId:number,documentId:number,content:string)=>{
        try{
           const updateDocumnet = await postgresdb.update(documents).set({
            content:content
           })
           .where(and(
            eq(documents.userId,userId),
            eq(documents.id,documentId),
            eq(documents.isDeleted,false)
        )).returning({
            id:documents.id,
            content:documents.content,
            userId:documents.userId,
        }).execute()
        console.log(updateDocumnet)
        return updateDocumnet;
        }catch(error:any){
            throw new Error(error)
        }
    }
  };
}
