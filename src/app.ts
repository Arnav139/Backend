import express from "express";
import cors from "cors";
import Documentrouter from "./routes/document";
import userRouter from "./routes/user";
import logger from "./config/logger";
import routes from "./routes";
import envConf from "./config/envConf";
import connectDB from "./config/db";

const app = express();
const port = 8000;

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(express.json());
app.use('/', routes);

// app.use("/api/documents", Documentrouter);
// app.use("/api/users", userRouter);

app.listen(port, async () => {
    logger.info(`Server is running on port ${port}`);
    await connectDB();
});
