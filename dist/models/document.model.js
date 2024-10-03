"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the Metadata subdocument
const MetadataSchema = new mongoose_1.Schema({
    useCase: { type: String },
    primaryKey: { type: String },
    researchLevel: { type: Number, min: 0, max: 100 },
    personality: [{ type: String }],
    tone: [{ type: String }],
    language: { type: String },
});
// Define the schema for the main Document
const DocumentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    metadata: { type: MetadataSchema },
    isDeleted: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
}, { timestamps: true });
// Create the Document model using the interface and schema
const DocumentModel = mongoose_1.default.model("Document", DocumentSchema);
exports.default = DocumentModel;
