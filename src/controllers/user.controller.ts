import { Request, Response } from "express";
import { User } from "../models/user.model";

import { registerUser as registerUserService } from "../services/dbServices/userDB.services";

// Controller for handling user login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return; // Explicitly return to stop execution
        }

        // Check if the entered password is correct
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials" });
            return; // Explicitly return to stop execution
        }

        // Generate access token and refresh token using secrets from envConf
        const accessToken = user.generateAccessToken(); // Use the method from the User model
        const refreshToken = user.generateRefreshToken(); // Use the method from the User model

        // Save the refresh token to the user document in the database
        user.refreshToken = refreshToken;
        await user.save();

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
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Controller for handling user registration
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    try {
        // Call the service to register a new user
        const newUser = await registerUserService({
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
        await newUser.save();

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
    } catch (error: any) {
        // Specify any type for error to access error.message
        console.error("Registration error:", error);
        // Check for specific error messages
        if (error.message.includes("User already exists")) {
            res.status(409).json({ message: error.message }); // Conflict status
        } else {
            res.status(500).json({ message: "Server error" }); // General server error
        }
    }
};

// Controller for handling user logout
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
    }

    try {
        // Find the user associated with the given refresh token
        const user = await User.findOne({ refreshToken });

        if (!user) {
            res.status(404).json({ message: "User not found or already logged out" });
            return;
        }

        console.log("user before logout", user);

        user.refreshToken = "";

        console.log("user after logout", user);
        await user.save();

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
};
