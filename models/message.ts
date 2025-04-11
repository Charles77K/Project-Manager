import { model, Schema, Document } from "mongoose";
import { z } from "zod";

export const zodMessageSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
}

const messageSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = model<IMessage>("Message", messageSchema);

export default Message;
