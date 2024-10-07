import { Router } from "express";
import Documentrouter from "./document.router";
import userRouter from "./user.router";
import { publicApiLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.get("/", publicApiLimiter, (req, res) => {
    console.log("req", req);
    res.send(`
    <h1>Welcome to the Home Page</h1>
    <p>This is Home API of Backend Task.</p>
  `);
});

router.use("/api/documents", Documentrouter);
router.use("/api/users", userRouter);

export default router;
