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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConf_1 = __importDefault(require("../config/envConf"));
const verifyAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Retrieve token from cookies or Authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        // Verify token with JWT
        const decodedToken = jsonwebtoken_1.default.verify(token, envConf_1.default.accessTokenSecret);
        // Find user based on decoded token _id
        const user = yield user_model_1.User.findById(decodedToken._id).select("-password");
        if (!user) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        if (user.refreshToken === "") {
            res.status(401).json({ message: "Unauthorized: Token Expired" });
            return;
        }
        user.refreshToken = "hidden";
        // Attach user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token or user" });
    }
});
exports.verifyAccessToken = verifyAccessToken;
