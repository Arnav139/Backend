import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
    deleteDocumentByUserId,
    toggleIsFavoriteByDocumentId,
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post("/create", verifyAccessToken, createDocumentController);

// Route for fetching documents by user ID
Documentrouter.get("/", verifyAccessToken, getDocumentsByUserIdController);

//route to delete documents by user ID
Documentrouter.delete("/:documentId", verifyAccessToken, deleteDocumentByUserId);

//route to toggle isFavorite
Documentrouter.put("/:documentId", verifyAccessToken, toggleIsFavoriteByDocumentId);

export default Documentrouter;
