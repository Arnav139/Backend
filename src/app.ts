import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import routes from "./routes";
import { globalLimiter } from "./middlewares/rateLimiters";

const app = express();
const port = 8000;

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use(globalLimiter);
app.use("/", routes);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});
