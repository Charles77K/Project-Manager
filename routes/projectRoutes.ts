import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  uploadProjectImages,
  getSingleProject,
  deleteProject,
} from "../controllers/projectController";

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(getAllProjects)
  .post(uploadProjectImages, createProject);

projectRouter
  .route("/:id")
  .patch(uploadProjectImages, updateProject)
  .get(getSingleProject)
  .delete(deleteProject);

export default projectRouter;
