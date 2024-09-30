import mongoose, { Schema, Document as MongooseDocument } from "mongoose";

// Define the interface for the Metadata subdocument
interface Metadata {
    useCase: string;
    primaryKey: string;
    researchLevel: number; // restricted between 0 and 100
    personality: string[];
    tone: string;
    language: string;
}

// Define the interface for the main Document
interface IDocument extends MongooseDocument {
    user: mongoose.Schema.Types.ObjectId; // foreign key to User model
    content: string;
    metadata: Metadata;
    isDeleted: boolean;
    isFavorite: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the schema for the Metadata subdocument
const MetadataSchema = new Schema({
    useCase: { type: String },
    primaryKey: { type: String },
    researchLevel: { type: Number, min: 0, max: 100 },
    personality: [{ type: String }],
    tone: { type: String },
    language: { type: String },
});

// Define the schema for the main Document
const DocumentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String },
        metadata: { type: MetadataSchema },
        isDeleted: { type: Boolean, default: false },
        isFavorite: { type: Boolean, default: false },
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Create the Document model using the interface and schema
const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
