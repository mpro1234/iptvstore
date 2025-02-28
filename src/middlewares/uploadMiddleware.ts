// src/middlewares/uploadMiddleware.ts
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// استخدم memoryStorage بدل diskStorage
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter });
