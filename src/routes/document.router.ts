// src/routes/document.routes.ts

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
    validateCreateDocument,
    validateUpdateContent,
    validateGetDocuments,
    validateDeleteDocument,
    validateToggleIsFavorite,
} from "../validation"; // Updated imports

const DocumentRouter = Router();

// Route for creating a new document (with metadata in the body)
DocumentRouter.post("/create", validateCreateDocument, verifyAccessToken, createDocumentController);

// Route for fetching documents by user ID
DocumentRouter.get("/", verifyAccessToken, validateGetDocuments, getDocumentsByUserIdController);

// Route to delete a document by documentId
DocumentRouter.delete(
    "/:documentId",
    validateDeleteDocument,
    verifyAccessToken,
    deleteDocumentByUserId
);

// Route to toggle isFavorite
DocumentRouter.put(
    "/:documentId",
    validateToggleIsFavorite,
    verifyAccessToken,
    toggleIsFavoriteByDocumentId
);

// Route to update content by documentId
DocumentRouter.put(
    "/updateContent/:documentId",
    validateUpdateContent,
    verifyAccessToken,
    updateDocumentByDocumentId
);

export default DocumentRouter;
