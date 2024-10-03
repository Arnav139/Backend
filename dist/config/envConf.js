"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnvVar = (key, fallback) => {
    const value = process.env[key];
    if (!value && !fallback) {
        console.error(`Error: Missing environment variable: ${key}`);
        process.exit(1);
    }
    return value || fallback || "";
};
const envConf = {
    mongoDbConnectionString: getEnvVar("MONGODB_CONNECTION_STRING"),
    port: getEnvVar("PORT", "3000"),
    corsOrigin: getEnvVar("CORS_ORIGIN", "*"),
    accessTokenSecret: getEnvVar("ACCESS_TOKEN_SECRET"),
    accessTokenExpiry: getEnvVar("ACCESS_TOKEN_EXPIRY", "7d"),
    refreshTokenSecret: getEnvVar("REFRESH_TOKEN_SECRET"),
    refreshTokenExpiry: getEnvVar("REFRESH_TOKEN_EXPIRY", "21d"),
};
exports.default = envConf;
