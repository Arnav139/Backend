import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
    deleteDocumentByUserId,
    toggleIsFavoriteByDocumentId,
    updateDocumentByDocumentId,
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";
import {
    validateContentMiddleware,
    validateMetadataMiddleware,
} from "../validation/documentValidation";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post(
    "/create",
    validateMetadataMiddleware,
    verifyAccessToken,
    createDocumentController
);

// Route for fetching documents by user ID
Documentrouter.get("/", verifyAccessToken, getDocumentsByUserIdController);

// Route to delete documents by user ID
Documentrouter.delete("/:documentId", verifyAccessToken, deleteDocumentByUserId);

// Route to toggle isFavorite
Documentrouter.put("/:documentId", verifyAccessToken, toggleIsFavoriteByDocumentId);

// Route to update content
Documentrouter.put(
    "/updateContent/:documentId",
    validateContentMiddleware, // Apply content validation middleware
    verifyAccessToken, // Apply token verification middleware
    updateDocumentByDocumentId // Controller to update the document
);

export default Documentrouter;
