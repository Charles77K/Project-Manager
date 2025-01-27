import Project from "../models/projectModel";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, "../public/projects"));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mineType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mineType && extName) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export const uploadProjectImages = upload.array("images", 5);

//Get all projects
export const getAllProjects = catchAsync(
  async (req: Request, res: Response) => {
    const projects = await Project.find();
    res.status(200).json({
      message: "All Projects",
      status: "success",
      length: projects.length,
      projects,
    });
  }
);

//Create Project
export const createProject = catchAsync(async (req: Request, res: Response) => {
  const { title, description, git, stack, link, developers } = req.body;

  const images = req.files
    ? (req.files as Express.Multer.File[]).map((file) => file.filename)
    : [];

  const newProject = new Project({
    title,
    images,
    description,
    git,
    stack,
    link,
    developers,
  });

  const savedProject = await newProject.save();

  res.status(201).json({
    message: "Project created successfully",
    status: "success",
    project: savedProject,
  });
});

//update Project
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, git, stack, link, developers } = req.body;

  const project = await Project.findById(id);

  if (!project) {
    throw new AppError("Project not found", 404);
  }
  let updatedImages = project.images;
  if (req.files) {
    updatedImages = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    );
  }

  project.title = title || project.title;
  project.description = description || project.description;
  project.git = git || project.git;
  project.stack = stack || project.stack;
  project.link = link || project.link;
  project.images = updatedImages;
  project.developers = developers || project.developers;

  const updatedProject = await project.save();

  res.status(200).json({
    message: "Project updated successfully",
    status: "success",
    project: updatedProject,
  });
});
