import { Request, response, Response } from "express";
import { users } from "../models/schema";
import dbServices from "../services/dbServices";

export default class User {
    static registerUser = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        try {
            console.log(req.body);
            const newUser = await dbServices.user.registerUser({
                firstName,
                lastName,
                email,
                phoneNumber,
                password,
            });
            console.log("NewUser::", newUser);
            if (!newUser) {
                throw new Error(" error in user Registration");
            }
            res.status(200).json({
                status: true,
                message: "User registered successfully",
                data: newUser,
            });
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    };

    // Controller for handling user login
    static loginUser = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        try {
            const user = await dbServices.user.loginUser(email, password);
            res.status(200).json({ status: true, message: "user Logged In", data: user });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Server error" });
        }
    };
}
