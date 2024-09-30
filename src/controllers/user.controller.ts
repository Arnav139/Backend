import { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import envConf from "../config/envConf";

// Controller for handling user login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;  // Explicitly return to stop execution
    }

    // Check if the entered password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;  // Explicitly return to stop execution
    }

    // Generate access token and refresh token using secrets from envConf
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      envConf.accessTokenSecret,
      { expiresIn: envConf.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      envConf.refreshTokenSecret,
      { expiresIn: envConf.refreshTokenExpiry }
    );

    // Optionally, save the refresh token to the user document in the database
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


