import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller";
import validator from "../validation";
import { validateRequest } from "../middlewares/validateRequest";

const userRouter = Router();

userRouter.post("/login", validateRequest(validator.userValidators.loginUserSchema), loginUser);
userRouter.post(
    "/register",
    validateRequest(validator.userValidators.registerUserSchema),
    registerUser
);
userRouter.post("/logout", validateRequest(validator.userValidators.logoutUserSchema), logoutUser);

export default userRouter;
