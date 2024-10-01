import { Router } from "express";
import {
    createDocumentController,
    getDocumentsByUserIdController,
    deleteDocumentByUserId
} from "../controllers/document.controller";
import { verifyAccessToken } from "../config/jwt";
import { verify } from "crypto";

const Documentrouter = Router();

// Route for creating a new document
Documentrouter.post("/create", verifyAccessToken, createDocumentController);

// Route for fetching documents by user ID
Documentrouter.get("/", verifyAccessToken, getDocumentsByUserIdController);

//route to delete documents by user ID
Documentrouter.delete("/:documentId",verifyAccessToken, deleteDocumentByUserId)

export default Documentrouter;
