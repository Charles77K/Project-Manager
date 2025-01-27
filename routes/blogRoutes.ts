import express from "express";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  uploadBlogImage,
} from "../controllers/blogController";

const blogRouter = express.Router();

blogRouter.route("/").get(getAllBlogs).post(uploadBlogImage, createBlog);

blogRouter.route("/:id").patch(uploadBlogImage, updateBlog);

export default blogRouter;
