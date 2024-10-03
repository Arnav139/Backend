"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userValidation_1 = require("../validation/userValidation");
const userRouter = (0, express_1.Router)();
// Define routes for user-related endpoints
userRouter.post("/login", userValidation_1.validateLoginDataMiddleware, user_controller_1.loginUser);
userRouter.post("/register", userValidation_1.validateRegistrationDataMiddleware, user_controller_1.registerUser);
userRouter.post("/logout", user_controller_1.logoutUser);
exports.default = userRouter;
