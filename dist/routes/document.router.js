"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_controller_1 = require("../controllers/document.controller");
const jwt_1 = require("../config/jwt");
const documentValidation_1 = require("../validation/documentValidation");
const Documentrouter = (0, express_1.Router)();
// Route for creating a new document
Documentrouter.post("/create", documentValidation_1.validateMetadataMiddleware, jwt_1.verifyAccessToken, document_controller_1.createDocumentController);
// Route for fetching documents by user ID
Documentrouter.get("/", jwt_1.verifyAccessToken, document_controller_1.getDocumentsByUserIdController);
// Route to delete documents by user ID
Documentrouter.delete("/:documentId", jwt_1.verifyAccessToken, document_controller_1.deleteDocumentByUserId);
// Route to toggle isFavorite
Documentrouter.put("/:documentId", jwt_1.verifyAccessToken, document_controller_1.toggleIsFavoriteByDocumentId);
// Route to update content
Documentrouter.put("/updateContent/:documentId", documentValidation_1.validateContentMiddleware, // Apply content validation middleware
jwt_1.verifyAccessToken, // Apply token verification middleware
document_controller_1.updateDocumentByDocumentId // Controller to update the document
);
exports.default = Documentrouter;
