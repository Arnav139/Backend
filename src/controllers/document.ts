import { Request, Response } from "express";
import dbServices from "../services/dbServices";
import { aiWriter } from "../helper/ai";
import {exec, execFile} from "child_process"
import { stdout } from "process";
import { Types } from "mongoose";

interface AuthenticatedRequest extends Request {
    user?: any;
    body:any;
    params:any
}

 
export default class document{

// Create a new document
    // static createDocumentController = async (req: AuthenticatedRequest, res: Response) => {
    //     try {
    //         const userId = req.user;
    //         const { metadata } = req.body;
    //         const content = "Dummy Data";
    //         const newDocument = await dbServices.document.createDocument(userId, content, metadata);
    //         res.status(201).json(newDocument);
    //     } catch (error) {
    //         console.error("Error creating document:", error);
    //         res.status(500).json({ error: "Internal Server Error" });
    //     }
    // };

    static extractExcerptAndKeywords=async(input:any)=> {
        // Use regex to extract the excerpt and keywords
        const excerptMatch = input.match(/\*\*Excerpt\*\*:\s*([\s\S]*?)\n\n/);
        const keywordsMatch = input.match(/\*\*Keywords\*\*:\s*([\s\S]*)/);
        
        if (!excerptMatch || !keywordsMatch) {
            console.error("Error: Could not extract excerpt or keywords");
            return null;
        }
    
        const excerpt = excerptMatch[1].trim();
        const keywords = keywordsMatch[1].split(',').map((keyword:any) => keyword.trim());
    
        return {
            excerpt: excerpt,
            keywords: keywords
        };
    }
    

    static createDocumentController = async (req: AuthenticatedRequest, res: Response):Promise<any> => {
        try {
            // let userId = "66fb951822f626ed85d3db2c";
            let UserId= req.user.userId;
            // console.log(UserId)
            const { metadata} = req.body;  // Assuming these fields come from the request body
            const ai=await aiWriter(metadata.title,metadata.personality,metadata.tone) 
            let cleanedArticle;
            let cleanedExcerpt;
            if (ai) {
                cleanedArticle = ai.article.replace(/\n\s*\+\s*/g, '');
                cleanedExcerpt = ai.excerpt.replace(/\n\s*\+\s*/g, '');
                ai.article = cleanedArticle;
                ai.excerpt = cleanedExcerpt;
            }
            const keyword = await this.extractExcerptAndKeywords(cleanedExcerpt);
            await dbServices.document.createDocument(UserId, cleanedArticle, metadata,keyword);
            res.status(201).send({status:true,message:"Document Created Successfully",data:cleanedArticle});
        } catch (error:any) {
            console.error("Error creating document:", error);
            res.status(500).send({ status: false ,error: error.message });
        }
    };

    // Fetch documents by user ID
    static getDocumentsByUserIdController = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user.userId;
            const documents = await dbServices.document.getDocumentsByUserId(userId);
            res.status(200).json({status:true,documents});
        } catch (error) {
            console.error("Error fetching documents:", error);
            res.status(500).json({status:false, error: "Internal Server Error" });
        }
    };

    // Delete a document by user ID
    static deleteDocumentByUserId = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user.userId;
            const documentId = req.params.documentId;
            const result = await dbServices.document.deleteDocumentById(userId, parseInt(documentId));
            if (result) {
                res.status(200).json({ status:true,message: "Document deleted successfully" });
            } else {
                res.status(404).json({status:false, message: "Document not found or not authorized to delete" });
            }
        } catch (error:any) {
            console.error("Error deleting document:", error);
            res.status(500).json({status:false, error: error.message });
        }
    };

    // toggle  isFavorite of document by document ID
    static toggleIsFavoriteByDocumentId = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user.userId;
            const documentId = req.params.documentId;
            const result = await dbServices.document.updateIsFavoriteByDocumentId(userId, parseInt(documentId));
            if (result) {
                res.status(200).json({status:true, message: "Document isFavorite updated successfully"});
            } else {
                res.status(400).json({
                    status:false,
                    message: "Document not found or not authorized to update isFavorite",
                });
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            res.status(500).json({status:false, error: "Internal Server Error" });
        }
    };
}