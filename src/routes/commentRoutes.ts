import express from "express";
import {
  addProductComment,
  addBlogComment,
  getProductComments,
  getBlogComments,
  getCommentStats,
} from "../controllers/commentController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// إضافة تعليق على منتج
router.post("/product/add", addProductComment);

// عرض تعليقات منتج
router.get("/product/:productId", getProductComments);

// إضافة تعليق على مقالة
router.post("/blog/add", addBlogComment);

// عرض تعليقات مقالة
router.get("/blog/:blogId", getBlogComments);

router.get("/stats", authenticate("admin"), getCommentStats);

export default router;
