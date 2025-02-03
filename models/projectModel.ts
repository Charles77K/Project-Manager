import { Schema, model, Document } from "mongoose";

interface ProjectType extends Document {
  title: string;
  images: string[];
  description: string;
  git: string;
  stack: string[];
  link: string;
  type: "mobile" | "web";
  developers: {
    name: string;
    github: string;
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
  stack: [{ type: String }],
  link: [{ type: String }],
  type: [{ type: String }],
  developers: [
    {
      name: { type: String, required: true },
      github: { type: String, required: true },
      email: { type: String, required: true },
      link: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});
const Project = model<ProjectType>("Project", ProjectSchema);

export default Project;
