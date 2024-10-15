import { Router } from "express";
import controller from "../controllers";
import {authenticateUser, validateRequest} from '../middleware';
import validators from "../validators";



const router = Router();

// Define routes for user-related endpoints
router.post("/register", validateRequest(validators.auth.registerUserSchema),controller.user.registerUser); 
router.post("/login", validateRequest(validators.auth.loginUserSchema),controller.user.loginUser);
router.get("/google-login",controller.user.googleLogIn)
// router.post("/logout",validateRequest(validators.auth.logoutUserSchema),controller.user.logoutUser)
router.post("/checkout",authenticateUser,controller.Payment.payment)
router.post('/cashfree',authenticateUser, controller.Payment.createOrderCashfree);
router.get('/status/:orderId', controller.Payment.checkStatus)


export default router;
