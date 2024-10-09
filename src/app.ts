import express from "express";
import cors from "cors";
import logger from "./config/logger";
import router from "./routes";
import connectDB from "./config/db";
import session from "express-session";
import passport from "./config/passport";

const app = express();
const port = process.env.port;

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// Session management
app.use(
    session({
        secret: "your-session-secret", // Replace with a strong secret
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use("/", router);

app.listen(port, async () => {
    logger.info(`Server is running on port ${port}`);
    // await connectDB();
});
