import { Router } from "express";
// import controller from controllers -> user.controller
import { loginUser } from "../controllers/user.controller";
const userRouter = Router();

// router.post('/register', registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
