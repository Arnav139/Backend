import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller";
import {
    validateLoginDataMiddleware,
    validateRegistrationDataMiddleware,
} from "../validation/userValidation";

const userRouter = Router();

// Define routes for user-related endpoints
userRouter.post("/login", validateLoginDataMiddleware, loginUser);
userRouter.post("/register", validateRegistrationDataMiddleware, registerUser);
userRouter.post("/logout", logoutUser);
export default userRouter;
