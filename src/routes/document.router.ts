import { Router } from "express";
import { createDocumentController, getDocumentsByUserIdController } from "../controllers/document.controller";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post("/create", createDocumentController);

// Route for fetching documents by user ID
Documentrouter.get("/:userId", getDocumentsByUserIdController);

export default Documentrouter;