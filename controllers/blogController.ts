import Blog from "../models/blogModel";
import { Response, Request, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { upload } from "../utils/multer";
import APIFeatures from "../utils/apiFeatures";

export const uploadBlogImage = upload("../public/blogs").single("photo");

export const getAllBlogs = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const features = new APIFeatures(Blog.find(), req.query)
      .filter()
      .paginate()
      .limitFields()
      .sort();
    const blogs = await features.query;

    res.status(200).json({
      message: "All Blogs",
      status: "success",
      length: blogs.length,
      blogs,
    });
  }
);

export const createBlog = catchAsync(async (req: Request, res: Response) => {
  const { title, content, author } = req.body;

  const uploadedPhoto = req.file?.filename;

  const blog = new Blog({
    title,
    content,
    author,
    photo: uploadedPhoto,
  });

  const savedBlog = await blog.save();

  res.status(201).json({
    message: "Blog created successfully",
    status: "success",
    savedBlog,
  });
});

export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new AppError("blog not found", 404);
  }

  let updatedImage = blog.photo;
  if (req.file) {
    updatedImage = req.file.filename;
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.author = author || blog.author;
  blog.photo = updatedImage || blog.photo;

  const updatedBlog = await blog.save();

  res.status(200).json({
    message: "Blog updated successfully",
    status: "success",
    blog: updatedBlog,
  });
});

export const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    res.status(200).json({
      message: "Blog fetched successfully",
      status: "success",
      blog,
    });
  }
);

export const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    res.status(204).json({
      message: "Blog deleted successfully",
      status: "success",
    });
  }
);
