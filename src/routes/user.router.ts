import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";

const userRouter = Router();

// Define routes for user-related endpoints
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser); // Added registration route

export default userRouter;
