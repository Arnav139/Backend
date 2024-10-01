import { User } from "../../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import envConf from "../../config/envConf";

export const registerUser = async (userData: any) => {
    const { phoneNumber, email, firstName, lastName, password } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
    });

    return await newUser.save();
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, user };
};

export const refreshToken = async (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, envConf.refreshTokenSecret) as any;
        const user = await User.findById(decoded._id);
        if (!user) throw new Error("User not found");

        // Generate new access token
        const accessToken = user.generateAccessToken();
        return { accessToken };
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
};
