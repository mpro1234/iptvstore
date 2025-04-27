import { Request, Response } from "express";
import BlogComment from "../models/BlogComment";
import mongoose from "mongoose";

// User adds a comment (pending)
export const addBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { text } = req.body;
    const { blogId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newComment = new BlogComment({ userId, blogId, text });
    await newComment.save();

    res
      .status(201)
      .json({ message: "Comment submitted for review", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: fetch only approved & visible comments
export const getBlogComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params;
    const comments = await BlogComment.find({
      blogId,
      status: "approved",
      isVisible: true,
    })
      .populate("userId", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// User updates own comment
export const updateBlogComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const userId = req.user?.userId;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Invalid comment ID" });
    return;
  }

  const comment = await BlogComment.findById(commentId);
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }
  if (comment.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { text } = req.body;
  if (text !== undefined) comment.text = text;
  // After edit, require re-approval
  comment.status = "pending";
  comment.isVisible = false;

  await comment.save();
  res.status(200).json({ message: "Comment updated and pending review", comment });
};

// User deletes own comment
export const deleteBlogComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const userId = req.user?.userId;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Invalid comment ID" });
    return;
  }

  const comment = await BlogComment.findById(commentId);
  if (!comment) {
    res.status(404).json({ message: "Comment not found" });
    return;
  }
  if (comment.userId.toString() !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await comment.deleteOne();
  res.status(200).json({ message: "Comment deleted" });
};
