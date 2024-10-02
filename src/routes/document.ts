import { Router } from "express";
import controller from "../controllers";

import { verifyAccessToken } from "../config/jwt";

const router = Router();


// Route for creating a new document
router.post("/create", verifyAccessToken, controller.document.createDocumentController);

// Route for fetching documents by user ID
router.get("/", verifyAccessToken,controller.document.getDocumentsByUserIdController);

//route to delete documents by user ID
router.delete("/:documentId", verifyAccessToken, controller.document.deleteDocumentByUserId);

//route to toggle isFavorite
router.put("/:documentId", verifyAccessToken, controller.document.toggleIsFavoriteByDocumentId);

export default router;
