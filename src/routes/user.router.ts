import { Router } from "express";
import { loginUser, registerUser,logoutUser } from "../controllers/user.controller";

const userRouter = Router();

// Define routes for user-related endpoints
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser); // Added registration route
userRouter.post("/logout",logoutUser)
export default userRouter;
