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
exports.refreshToken = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = require("../../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConf_1 = __importDefault(require("../../config/envConf"));
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, email, firstName, lastName, password } = userData;
    // Check if user already exists
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }
    const newUser = new user_model_1.User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });
    return yield newUser.save();
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = yield user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Save refresh token
    user.refreshToken = refreshToken;
    yield user.save();
    return { accessToken, refreshToken, user };
});
exports.loginUser = loginUser;
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, envConf_1.default.refreshTokenSecret);
        const user = yield user_model_1.User.findById(decoded._id);
        if (!user)
            throw new Error("User not found");
        // Generate new access token
        const accessToken = user.generateAccessToken();
        return { accessToken };
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
});
exports.refreshToken = refreshToken;
