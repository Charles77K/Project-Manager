import { Schema, model, Document } from "mongoose";

export interface BlogTypes extends Document {
  title: string;
  photo: string;
  content: string;
  author: string;
  createdAt: Date;
}

const BlogSchema = new Schema({
  title: { type: String, required: true },
  photo: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Blog = model<BlogTypes>("Blog", BlogSchema);

export default Blog;
