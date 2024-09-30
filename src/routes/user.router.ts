import { Router } from "express";
import { loginUser } from "../controllers/user.controller";

const userRouter = Router();

// Define routes for user-related endpoints
userRouter.post("/login", loginUser);

// Example route for registration (if needed in future)
// userRouter.post("/register", registerUser);

export default userRouter;
