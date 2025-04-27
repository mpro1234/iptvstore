import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  listPendingBlogComments,
  approveBlogComment,
  rejectBlogComment,
  toggleBlogCommentVisibility,
} from "../controllers/adminBlogCommentController";

const router = express.Router();

// Admin moderation
router.get("/pending", authenticate("admin"), listPendingBlogComments);
router.patch("/:commentId/approve", authenticate("admin"), approveBlogComment);
router.patch("/:commentId/reject", authenticate("admin"), rejectBlogComment);
router.patch(
  "/:commentId/visibility",
  authenticate("admin"),
  toggleBlogCommentVisibility
);

export default router;
