import { Request, Response, NextFunction, RequestHandler } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import envConf from "../config/envConf";

// Define an interface to extend Express's Request object to include 'user'
interface AuthenticatedRequest extends Request {
    user?: any; 
}

const verifyAccessToken: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Retrieve token from cookies or Authorization header
        const token =
            req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        // Verify token with JWT
        const decodedToken = jwt.verify(token, envConf.accessTokenSecret) as { _id: string };

        // Find user based on decoded token _id
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token or user" });
    }
};

export { verifyAccessToken };
