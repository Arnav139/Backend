import { Request, Response } from "express";
import { User } from "../models/user.model";
import dbServices from "../services/dbServices";


export default class user{

        // Controller for handling user registration
    static registerUser = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, phoneNumber, password } = req.body;

        try {
            // Call the service to register a new user
            const newUser = await dbServices.user.registerUser({
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
            res.status(200).json({status:true,
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
            res.status(500).json({ status:false,message: error.message }); // Conflict status
        }
    };

// Controller for handling user login
    static loginUser = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            // Check if the user exists
            const user = await dbServices.user.loginUser(email , password);
            // Return the tokens and user details in the response
            res.status(200).json({status: true , message: "user Logged In" , data : user})
        } catch (error:any) {
            res.status(500).json({status:false, message: error.message });
        }
    };



    // Controller for handling user logout
    static logoutUser = async (req: Request, res: Response): Promise<void> => {
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

            user.refreshToken = "";

            await user.save();

            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({ message: "Server error during logout" });
        }
    };

}