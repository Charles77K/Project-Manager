import express from "express";
import { contactFormLimiter } from "../middleware/rateLimit";
import {
  createMessage,
  getAllMessages,
} from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter
  .route("/")
  .get(getAllMessages)
  .post(contactFormLimiter, createMessage);

export default messageRouter;
