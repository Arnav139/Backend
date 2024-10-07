import { Router } from "express";
import controller from "../controllers";
import {validateRequest} from '../middleware';
import validators from "../validators";



const router = Router();

// Define routes for user-related endpoints
router.post("/register", validateRequest(validators.auth.registerUserSchema),controller.user.registerUser); 
router.post("/login", validateRequest(validators.auth.loginUserSchema),controller.user.loginUser);
// router.post("/logout",validateRequest(validators.auth.logoutUserSchema),controller.user.logoutUser)

export default router;
