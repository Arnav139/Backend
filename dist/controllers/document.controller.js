"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentByDocumentId = exports.toggleIsFavoriteByDocumentId = exports.deleteDocumentByUserId = exports.getDocumentsByUserIdController = exports.createDocumentController = void 0;
const docs_services_1 = require("../services/dbServices/docs.services");
// Create a new document
const createDocumentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { metadata } = req.body;
        const content = "Dummy Data";
        const newDocument = yield (0, docs_services_1.createDocument)(userId, content, metadata);
        res.status(201).json(newDocument);
    }
    catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createDocumentController = createDocumentController;
// Fetch documents by user ID
const getDocumentsByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const documents = yield (0, docs_services_1.getDocumentsByUserId)(userId);
        res.status(200).json(documents);
    }
    catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getDocumentsByUserIdController = getDocumentsByUserIdController;
// Delete a document by user ID
const deleteDocumentByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;
        // Call the service to delete the document
        const result = yield (0, docs_services_1.deleteDocumentById)(userId, documentId);
        if (result) {
            res.status(200).json({ message: "Document deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Document not found or not authorized to delete" });
        }
    }
    catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteDocumentByUserId = deleteDocumentByUserId;
// toggle  isFavorite of document by document ID
const toggleIsFavoriteByDocumentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;
        // Call the service to update IsFavorite field of Document
        const result = yield (0, docs_services_1.updateIsFavoriteByDocumentId)(userId, documentId);
        if (result) {
            res.status(200).json({ message: "Document isFavorite updated successfully" });
        }
        else {
            res.status(404).json({
                message: "Document not found or not authorized to update isFavorite",
            });
        }
    }
    catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.toggleIsFavoriteByDocumentId = toggleIsFavoriteByDocumentId;
// Update document content by documentId
const updateDocumentByDocumentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const documentId = req.params.documentId;
        const { content } = req.body;
        // Call the service to update the content field of the Document
        const result = yield (0, docs_services_1.updateContentByDocumentId)(userId, documentId, content);
        if (result) {
            res.status(200).json({ message: "Document content updated successfully" });
        }
        else {
            res.status(404).json({
                message: "Document not found or not authorized to update content",
            });
        }
    }
    catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateDocumentByDocumentId = updateDocumentByDocumentId;
