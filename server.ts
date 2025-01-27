import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");
import connectDB from "./config/db";

dotenv.config({
  path: "./config.env",
});

const projectRouter = require("./routes/ProjectRoutes");

const app: Application = express();

connectDB();

app.use(express.json());

app.use(cors());

// Import routes
app.use("/api/v1/projects", projectRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (): void => console.log(`Server running on port ${PORT}`));
