import Project, { ProjectType } from "../models/projectModel";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { upload, uploadToCloudinary } from "../utils/multer";
import APIFeatures from "../utils/apiFeatures";

export const uploadProjectImages = upload().array("images", 5);

const handleMultipleUploads = async (files: Express.Multer.File[]) => {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file));
    const results = await Promise.all(uploadPromises);
    return results.map((result) => result.secure_url);
  } catch (error) {
    throw new AppError("Error uploading images", 400);
  }
};

// Get all projects
export const getAllProjects = catchAsync(
  async (req: Request, res: Response) => {
    const features = new APIFeatures(Project.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const projects = await features.query;

    res.status(200).json({
      message: "All Projects",
      status: "success",
      length: projects.length,
      projects,
    });
  }
);

// Create Project
export const createProject = catchAsync(async (req: Request, res: Response) => {
  const imageUrls = req.files
    ? await handleMultipleUploads(req.files as Express.Multer.File[])
    : [];

  const newProject = new Project({
    ...req.body,
    images: imageUrls,
  });

  const savedProject = await newProject.save();

  res.status(201).json({
    message: "Project created successfully",
    status: "success",
    project: savedProject,
  });
});

// Update Project
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const updateData: Partial<ProjectType> = { ...req.body };

  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    updateData.images = await handleMultipleUploads(
      req.files as Express.Multer.File[]
    );
  }

  const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProject) {
    throw new AppError("Project not found", 404);
  }
  res.status(200).json({
    message: "Project updated successfully",
    status: "success",
    project: updatedProject,
  });
});

export const getSingleProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    res.status(200).json({
      message: "Project fetched successfully",
      status: "success",
      project,
    });
  }
);

export const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return next(new AppError("Project not found", 404));
    }

    res.status(204).json({
      message: "Project deleted successfully",
      status: "success",
    });
  }
);
