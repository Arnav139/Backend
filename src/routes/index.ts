import { Router } from "express";
import Documentrouter from "./document.router";
import userRouter from "./user.router";

const router = Router();

router.get("/", (req, res) => {
    res.send(`
    <h1>Welcome to the Home Page</h1>
    <p>This is Home API of Backend Task.</p>
  `);
});

router.use("/api/documents", Documentrouter);
router.use("/api/users", userRouter);

export default router;
