import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  addCommentToBlog,
  getBlogById,
 
  incrementViews
} from "../controllers/blogController";

const router = express.Router();

// إنشاء مقالة جديدة (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", authenticate("admin"), createBlog);

// تعديل مقالة موجودة (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:blogId", authenticate("admin"), updateBlog);

// حذف مقالة (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:blogId", authenticate("admin"), deleteBlog);



// إضافة تعليق إلى مقالة (متاح للعملاء)
router.post("/comment/:blogId", authenticate("user"), addCommentToBlog);

// الحصول على مقالة واحدة
router.get("/:id", getBlogById);

// زيادة عداد المشاهدات
router.patch("/views/:id", incrementViews);
router.get("/", getAllBlogs); // <-- أضف هذا السطر
router.get("/all", getAllBlogs);

export default router;
