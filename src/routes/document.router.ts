import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post("/create", verifyAccessToken, createDocumentController);

// Route for fetching documents by user ID
Documentrouter.get("/:userId", verifyAccessToken, getDocumentsByUserIdController);

export default Documentrouter;
