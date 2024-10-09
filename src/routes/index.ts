import express from "express";
import userROutes from "./user";
import docRoutes from "./document";
import passport from "../config/passport";

const router = express.Router();

const defaultRoutes = [
    {
        path: "/user",
        route: userROutes,
    },
    {
        path: "/documents",
        route: docRoutes,
    },
];

router.get("/", async (req, res): Promise<any> => {
    return res.status(200).send({ status: true, message: "Api is running" });
});

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const user = req.user as any;
        res.status(200).json({
            status: true,
            message: "User logged in with Google",
            data: user,
        });
    }
);

export default router;
