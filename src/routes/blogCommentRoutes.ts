import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  addBlogComment,
  deleteBlogComment,
  getBlogComments,
  updateBlogComment,
} from "../controllers/blogCommentController";

const router = express.Router();

// User adds comment on a blog
router.post("/blog/:blogId/comment", authenticate("user"), addBlogComment);

// Public fetch approved comments
router.get("/blog/:blogId/comments", getBlogComments);
// User updates own comment
router.put("/comment/:commentId", authenticate("user"), updateBlogComment);

// User deletes own comment
router.delete("/comment/:commentId", authenticate("user"), deleteBlogComment);

export default router;
