import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const multerStorage = (pathName: string): StorageEngine => {
  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, path.join(__dirname, pathName));
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  return storage;
};

export const upload = (pathName: string) => {
  return multer({
    storage: multerStorage(pathName),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const mineType = fileTypes.test(file.mimetype);
      const extName = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );

      if (mineType && extName) {
        return cb(null, true);
      }
      cb(new Error("Only image files are allowed!"));
    },
  });
};
