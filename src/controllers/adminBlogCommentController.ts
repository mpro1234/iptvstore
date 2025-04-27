/* controllers/adminBlogCommentController.ts */
import { Request, Response } from "express";
import BlogComment from "../models/BlogComment";

export const listPendingBlogComments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const pending = await BlogComment.find({ status: "pending" })
      .populate("userId", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({ pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const updated = await BlogComment.findByIdAndUpdate(
      commentId,
      { status: "approved", isVisible: true },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json({ message: "Comment approved", comment: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const updated = await BlogComment.findByIdAndUpdate(
      commentId,
      { status: "rejected", isVisible: false },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json({ message: "Comment rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleBlogCommentVisibility = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const comment = await BlogComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    comment.isVisible = !comment.isVisible;
    await comment.save();
    res
      .status(200)
      .json({ message: "Visibility toggled", isVisible: comment.isVisible });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
