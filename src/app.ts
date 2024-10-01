// user route
import express from "express";
import Documentrouter from "./routes/document.router";
import userRouter from "./routes/user.router";
import envConf from "./config/envConf";
import connectDB from "./config/db";

const app = express();
const port = parseInt(envConf.port, 10) || 8000;
app.use(express.json());
app.use("/api/documents", Documentrouter);

app.use("/api/users", userRouter);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});
