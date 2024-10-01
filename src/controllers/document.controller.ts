import { Request, Response } from "express";
import mongoose from "mongoose";
import { createDocument, getDocumentsByUserId } from "../services/dbServices/docs.services"; // Adjust the path as needed
import { User } from "../models/user.model";
import userRouter from "./../routes/user.router";

interface AuthenticatedRequest extends Request {
    user?: any;
}
// Create a new document
export const createDocumentController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const { content, metadata } = req.body;

        const newDocument = await createDocument(userId, content, metadata);
        res.status(201).json(newDocument);
    } catch (error) {
        console.log("aye gye error", error);
        res.status(500).json({ error });
    }
};

// Fetch documents by user ID
export const getDocumentsByUserIdController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user;
        const documents = await getDocumentsByUserId(userId);
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error });
    }
};
