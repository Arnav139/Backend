import express from "express";
import cors from "cors";
import logger from "./config/logger";
import router from "./routes";
import envConf from "./config/envConf";
import connectDB from "./config/db";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use('/', router);



app.listen(envConf.port, async () => {
    logger.info(`Server is running on port ${envConf.port}`);
    await connectDB();
});
