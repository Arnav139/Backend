import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller";
import { validateLogin, validateLogout, validateRegister } from "../validation";

const userRouter = Router();

// Define routes for user-related endpoints using the new validation schema structure
userRouter.post("/login", validateLogin, loginUser);
userRouter.post("/register", validateRegister, registerUser);
userRouter.post("/logout", validateLogout, logoutUser);

export default userRouter;
