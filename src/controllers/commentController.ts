import { Request, Response } from "express";
import Comment from "../models/Comment";

// إضافة تعليق على منتج
export const addProductComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, text, productId,  createdAt } = req.body;

    const newComment = new Comment({
      userId,
      text,
      productId,
      createdAt,
    });

    await newComment.save();
    res.status(201).json({
      message: "Comment added to product successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// إضافة تعليق على مقالة
export const addBlogComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, text, blogId, createdAt } = req.body;

    const newComment = new Comment({
      userId,
      text,
      blogId,
      createdAt,
    });

    await newComment.save();
    res.status(201).json({
      message: "Comment added to blog successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض تعليقات منتج
export const getProductComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId }).populate("userId");
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض تعليقات مقالة
export const getBlogComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId }).populate("userId");
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getCommentStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalComments = await Comment.countDocuments();
    const productComments = await Comment.countDocuments({
      productId: { $exists: true },
    });
    const blogComments = await Comment.countDocuments({
      blogId: { $exists: true },
    });

    res.status(200).json({
      totalComments,
      productComments,
      blogComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
