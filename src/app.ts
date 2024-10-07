import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import routes from "./routes";

const app = express();
const port = 8000;

// rate limit settings
const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: "Too many requests from this IP, please try again after 5 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(apiLimiter);

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use("/", routes);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});
