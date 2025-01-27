const Project = require("../models/projectModel");
import { Request, Response } from "express";
import multer from "multer";
const path = require("path");

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

exports.uploadProjectImages = upload.array("images", 5);

//Get all projects
exports.getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      message: "All Projects",
      status: "success",
      length: projects.length,
      projects,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
      status: "error",
    });
    console.log(err);
  }
};

//Create Project
exports.createProject = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
      status: "error",
    });
    console.log(err);
  }
};

//update Project
exports.updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, git, stack, link, developers } = req.body;

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      res.status(400).json({ error: "No files uploaded" });
      return;
    }

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ message: "Project not found", status: "error" });
      return;
    }

    const updatedImages = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.filename)
      : project.images;

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
  } catch (err: any) {
    res.status(400).json({ message: err.message, status: "error" });
    console.log(err);
  }
};
