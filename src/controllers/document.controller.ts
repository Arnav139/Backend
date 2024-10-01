import { Request, Response } from "express";
import mongoose from "mongoose";
import { createDocument, getDocumentsByUserId } from "../services/dbServices/docs.services"; // Adjust the path as needed

// Create a new document
export const createDocumentController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user;
    const { content, metadata } = req.body;

    const newDocument = await createDocument(userId, content, metadata);
    res.status(201).json(newDocument);
  } catch (error) {
    console.log("aye gye error",error)
    res.status(500).json({  error });
  }
};

// Fetch documents by user ID
export const getDocumentsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const documents = await getDocumentsByUserId(userId);
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error });
  }
};
