import express from "express";
import cors from "cors";
import Documentrouter from "./routes/document.router";
import userRouter from "./routes/user.router";
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

app.get("/", (req, res) => {
    res.send(`
    <h1>Welcome to the Home Page</h1>
    <p>This is Home API of Backend Task.</p>
  `);
});
app.use("/api/documents", Documentrouter);
app.use("/api/users", userRouter);

app.listen(port, async () => {
    await connectDB();
    console.log(`Server is running on port ${port}`);
});
