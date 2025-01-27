const Project = require("../models/projectModel");
import { Request, Response } from "express";

exports.getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      message: "All Projects",
      status: "success",
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

exports.createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, images, description, git, stack, link, developers } =
      req.body;

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
