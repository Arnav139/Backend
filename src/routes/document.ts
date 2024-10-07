import { Router } from "express";
import controller from "../controllers";
import { verifyAccessToken } from "../config/jwt"; 
import { validateRequest } from "../middleware";
import validators from "../validators";

const router = Router();


// Route for creating a new document
router.post("/create",validateRequest(validators.auth.createDocument) ,controller.document.createDocumentController);

// Route for fetching documents by user ID
router.get("/", verifyAccessToken,validateRequest(validators.auth.getDocumentsById) ,controller.document.getDocumentsByUserIdController);

//route to delete documents by user ID
router.delete("/:documentId", verifyAccessToken,validateRequest(validators.auth.deleteDocumentById) , controller.document.deleteDocumentByUserId);

//route to toggle isFavorite
router.put("/:documentId", verifyAccessToken,validateRequest(validators.auth.updateDocumentIsFavourite) , controller.document.toggleIsFavoriteByDocumentId);

export default router;
