const express = require("express");
const projectController = require("../controllers/projectController");

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.uploadProjectImages, projectController.createProject);

projectRouter
  .route("/:id")
  .patch(
    projectController.uploadProjectImages,
    projectController.updateProject
  );

module.exports = projectRouter;
