import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
    deleteDocumentByUserId,
    toggleIsFavoriteByDocumentId,
    updateDocumentByDocumentId,
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post("/create", verifyAccessToken, createDocumentController);

// Route for fetching documents by user ID
Documentrouter.get("/", verifyAccessToken, getDocumentsByUserIdController);

// Route to delete documents by user ID
Documentrouter.delete("/:documentId", verifyAccessToken, deleteDocumentByUserId);

// Route to toggle isFavorite
Documentrouter.put("/:documentId", verifyAccessToken, toggleIsFavoriteByDocumentId);

// Route to update content
Documentrouter.put("/updateContent/:documentId", verifyAccessToken, updateDocumentByDocumentId);

export default Documentrouter;
