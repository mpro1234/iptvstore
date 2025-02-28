import express from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { uploadImage } from "../controllers/uploadController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// Route لرفع الصور
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file uploaded");
    const { url } = await uploadImage(req.file);
    res.json({ imageUrl: url });
  } catch (error) {
    const err = error as Error; // تحويل نوع الخطأ

    res.status(500).json({ error: err.message });
  }
});

export default router;
