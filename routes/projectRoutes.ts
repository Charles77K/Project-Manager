import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  uploadProjectImages,
} from "../controllers/projectController";

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(getAllProjects)
  .post(uploadProjectImages, createProject);

projectRouter.route("/:id").patch(uploadProjectImages, updateProject);

export default projectRouter;
