import { Schema, model, Document } from "mongoose";

interface ProjectType extends Document {
  title: string;
  images: string[];
  description: string;
  git: string;
  link: string;
  type: "mobile" | "web";
  developers: {
    name: string;
    github: string;
    stack: string[];
    email: string;
    link: string;
    role: string;
  }[];
  createdAt: Date;
}

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  git: { type: String, required: true },
  link: { type: String },
  type: { type: String },
  developers: [
    {
      name: { type: String, required: true },
      github: { type: String, required: true },
      stack: [{ type: String }],
      email: { type: String, required: true },
      link: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Project = model<ProjectType>("Project", ProjectSchema);

export default Project;
