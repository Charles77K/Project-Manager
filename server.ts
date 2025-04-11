import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

const cors = require("cors");

dotenv.config({
  path: "./config.env",
});

import projectRouter from "./routes/projectRoutes";
import blogRouter from "./routes/blogRoutes";
import messageRouter from "./routes/messageRoutes";
import { globalErrorHandler } from "./utils/errorHandler";

const app: Application = express();

connectDB();

app.use(express.json());

app.use(cors());

// Import routes
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/message", messageRouter);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, (): void => console.log(`Server running on port ${PORT}`));

export default app;
