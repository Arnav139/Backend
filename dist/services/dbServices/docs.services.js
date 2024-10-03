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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContentByDocumentId = exports.updateIsFavoriteByDocumentId = exports.deleteDocumentById = exports.getDocumentsByUserId = exports.createDocument = void 0;
const document_model_1 = __importDefault(require("../../models/document.model"));
// Create a new document
const createDocument = (userId, content, metadata) => __awaiter(void 0, void 0, void 0, function* () {
    const newDocument = new document_model_1.default({
        user: userId,
        content,
        metadata,
    });
    // Save the document and exclude the user field in the returned document
    const savedDocument = yield newDocument.save();
    // Return the saved document without the user field
    const _a = savedDocument.toObject(), { user } = _a, documentWithoutUser = __rest(_a, ["user"]);
    return documentWithoutUser;
});
exports.createDocument = createDocument;
// Fetch documents by user ID
const getDocumentsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield document_model_1.default.find({ user: userId, isDeleted: false }).select("-user");
});
exports.getDocumentsByUserId = getDocumentsByUserId;
// Service to delete a document by document ID and user ID
const deleteDocumentById = (userId, documentId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the document and update its isDeleted field to true
    const result = yield document_model_1.default.findOneAndUpdate({ _id: documentId, user: userId }, { isDeleted: true }, { new: true });
    return result !== null; // Return true if the document was found and updated
});
exports.deleteDocumentById = deleteDocumentById;
// Service to update isFavorite of document by document ID and user ID
const updateIsFavoriteByDocumentId = (userId, documentId) => __awaiter(void 0, void 0, void 0, function* () {
    const document = yield document_model_1.default.findOne({ _id: documentId, user: userId });
    if (!document) {
        return false;
    }
    document.isFavorite = !document.isFavorite;
    const result = yield document.save();
    return result !== null;
});
exports.updateIsFavoriteByDocumentId = updateIsFavoriteByDocumentId;
// Service to update a document's content by document ID and user ID
const updateContentByDocumentId = (userId, documentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the document and update its content field
    const result = yield document_model_1.default.findOneAndUpdate({ _id: documentId, user: userId }, { content }, { new: true });
    return result !== null;
});
exports.updateContentByDocumentId = updateContentByDocumentId;
