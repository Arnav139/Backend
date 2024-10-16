import express from "express";
import cors from "cors";
import logger from "./config/logger";
import router from "./routes";
import connectDB from "./config/db";

const app = express();
const port = process.env.port || 8000

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use('/', router);



const server = app.listen(port, async () => {
    logger.info(`Server is running on port ${port}`);
    // await connectDB();
});

export {app,server};