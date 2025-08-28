import { Schema, model, Document } from "mongoose";

interface Developer {
  name: string;
  github?: string;
  linkedin?: string;
  role: string;
}

export interface ProjectType extends Document {
  title: string;
  subtitle?: string;
  images: string[];
  shortDescription: string;
  longDescription: string;
  git?: string;
  link?: string;
  type: "mobile" | "web" | "desktop" | "api";
  category?: string;
  status: "ongoing" | "completed" | "upcoming";
  technologies: string[];
  features: string[];
  client?: string;
  developers: Developer[];
  testimonials?: {
    name: string;
    feedback: string;
    role?: string;
  }[];
  stackDetails?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    devops?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const DeveloperSchema = new Schema<Developer>({
  name: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String },
  role: { type: String, required: true },
});

const ProjectSchema = new Schema<ProjectType>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    images: [{ type: String }],
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    git: { type: String },
    client: { type: String },
    link: { type: String },
    type: {
      type: String,
      enum: ["mobile", "web", "desktop", "api"],
      required: true,
    },
    category: { type: String },
    status: {
      type: String,
      enum: ["ongoing", "completed", "upcoming"],
      default: "completed",
    },
    technologies: [{ type: String }],
    features: [{ type: String }],
    developers: [DeveloperSchema],
    testimonials: [
      {
        name: { type: String },
        feedback: { type: String },
        role: { type: String },
      },
    ],
    stackDetails: {
      frontend: [{ type: String }],
      backend: [{ type: String }],
      database: [{ type: String }],
      devops: [{ type: String }],
    },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Project = model<ProjectType>("Project", ProjectSchema);

export default Project;
