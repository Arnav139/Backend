import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
    deleteDocumentByUserId,
    toggleIsFavoriteByDocumentId,
    updateDocumentByDocumentId,
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";
import validator from "../validation";
import { validateRequest } from "../middlewares/validateRequest";

const DocumentRouter = Router();

DocumentRouter.post(
    "/create",
    validateRequest(validator.DocumentValidators.createDocumentSchema),
    verifyAccessToken,
    createDocumentController
);

// Route for fetching documents by user ID
DocumentRouter.get(
    "/",
    verifyAccessToken,
    validateRequest(validator.DocumentValidators.getDocumentsSchema),
    getDocumentsByUserIdController
);

// Route to delete a document by documentId
DocumentRouter.delete(
    "/:documentId",

    validateRequest(validator.DocumentValidators.deleteDocumentSchema),
    verifyAccessToken,
    deleteDocumentByUserId
);

// Route to toggle isFavorite
DocumentRouter.put(
    "/:documentId",

    validateRequest(validator.DocumentValidators.toggleIsFavoriteSchema),
    verifyAccessToken,
    toggleIsFavoriteByDocumentId
);

// Route to update content by documentId
DocumentRouter.put(
    "/updateContent/:documentId",

    validateRequest(validator.DocumentValidators.updateContentSchema),
    verifyAccessToken,
    updateDocumentByDocumentId
);

export default DocumentRouter;

