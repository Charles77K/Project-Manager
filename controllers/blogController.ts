import path from "path";
import Blog from "../models/blogModel";
import multer from "multer";
import { Response, Request } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, path.join(__dirname, "../public/blogs"));
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
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

export const uploadBlogImage = upload.single("photo");

export const getAllBlogs = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const blogs = await Blog.find();

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
