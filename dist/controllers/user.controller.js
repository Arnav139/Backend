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
exports.logoutUser = exports.registerUser = exports.loginUser = void 0;
const user_model_1 = require("../models/user.model");
const userDB_services_1 = require("../services/dbServices/userDB.services");
// Controller for handling user login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if the entered password is correct
        const isPasswordCorrect = yield user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        // Generate access token and refresh token using secrets from envConf
        const accessToken = user.generateAccessToken(); // Use the method from the User model
        const refreshToken = user.generateRefreshToken(); // Use the method from the User model
        // Save the refresh token to the user document in the database
        user.refreshToken = refreshToken;
        yield user.save();
        // Return the tokens and user details in the response
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
// Controller for handling user registration
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
        // Call the service to register a new user
        const newUser = yield (0, userDB_services_1.registerUser)({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
        });
        // Generate access token and refresh token using secrets from envConf
        const accessToken = newUser.generateAccessToken(); // Use the method from the User model
        const refreshToken = newUser.generateRefreshToken(); // Use the method from the User model
        // Save the refresh token to the newUser document in the database
        newUser.refreshToken = refreshToken;
        yield newUser.save();
        // Return a success response
        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
            },
        });
    }
    catch (error) {
        // Specify any type for error to access error.message
        console.error("Registration error:", error);
        // Check for specific error messages
        if (error.message.includes("User already exists")) {
            res.status(409).json({ message: error.message }); // Conflict status
        }
        else {
            res.status(500).json({ message: "Server error" }); // General server error
        }
    }
});
exports.registerUser = registerUser;
// Controller for handling user logout
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
    }
    try {
        // Find the user associated with the given refresh token
        const user = yield user_model_1.User.findOne({ refreshToken });
        if (!user) {
            res.status(404).json({ message: "User not found or already logged out" });
            return;
        }
        console.log("user before logout", user);
        user.refreshToken = "";
        console.log("user after logout", user);
        yield user.save();
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
});
exports.logoutUser = logoutUser;
