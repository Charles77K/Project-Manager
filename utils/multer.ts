import multer, { StorageEngine, FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { Request } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const multerStorage = (): StorageEngine => multer.memoryStorage();

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "projects",
        public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

const validateFileType = (file: Express.Multer.File): boolean => {
  const mimeTypeValid = ALLOWED_FILE_TYPES.test(file.mimetype);
  const extensionValid = ALLOWED_FILE_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  return mimeTypeValid && extensionValid;
};

export const upload = () => {
  return multer({
    storage: multerStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (!validateFileType(file)) {
        return cb(
          new Error("Only image files (jpeg, jpg, png, gif) are allowed")
        );
      }
      cb(null, true);
    },
  });
};
