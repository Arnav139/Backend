import cors from "cors";
import express from "express";
import { connectDB } from "../src/config/db";
import routes from "./routes";

const app = express();
const port = 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/", routes);

const server = app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});

export { app, server };
