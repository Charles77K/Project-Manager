const express = require("express");
const projectController = require("../controllers/projectController");

const projectRouter = express.Router();

projectRouter
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

module.exports = projectRouter;
