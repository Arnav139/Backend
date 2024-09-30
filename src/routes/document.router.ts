import { Router } from "express";
import { createDocumentController, getDocumentsByUserIdController } from "../controllers/document.controller";

const router = Router();

// Route for creating a new document
router.post("/create", createDocumentController);

// Route for fetching documents by user ID
router.get("/:userId", getDocumentsByUserIdController);

export default router;