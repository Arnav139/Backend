import { Router } from "express";
import controller from "../controllers";
import { authenticateUser } from "../middleware";
import { validateRequest } from "../middleware";
import validators from "../validators";

const router = Router();

// Route for creating a new document
router.post(
    "/create",
    authenticateUser,
    validateRequest(validators.auth.createDocument),
    controller.document.createDocumentController
);

// Route for fetching documents by user ID
router.get(
    "/",
    authenticateUser,
    validateRequest(validators.auth.getDocumentsById),
    controller.document.getDocumentsByUserIdController
);

//route to delete documents by user ID
router.delete(
    "/:documentId",
    authenticateUser,
    validateRequest(validators.auth.deleteDocumentById),
    controller.document.deleteDocumentByUserId
);

//route to toggle isFavorite
router.put(
    "/:documentId",
    authenticateUser,
    validateRequest(validators.auth.updateDocumentIsFavourite),
    controller.document.toggleIsFavoriteByDocumentId
);

export default router;
