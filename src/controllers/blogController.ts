import { Request, Response } from "express";
import Blog from "../models/Blog";
import User from "../models/User";
import mongoose from "mongoose";

// إنشاء مقالة جديدة
export const createBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
        const {
          title,
          content,
          image,
          createdBy,
          createdAt,
          category,
          excerpt,
          featured,
        } = req.body;

        const user = await User.findById(req.user?.userId); // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
        if (!user) {
          res.status(404).json({ message: "المستخدم غير موجود." });
          return;
        }

    const newBlog = new Blog({
      title,
      content,
      image,
      comments: [],
      createdBy: user._id,
      createdAt,
      category,
      excerpt,
      featured,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// تعديل مقالة موجودة
export const updateBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params;
    const updates = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updates, {
      new: true,
    });
    if (!updatedBlog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// حذف مقالة
export const deleteBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addCommentToBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: "المقالة غير موجودة" });
      return;
    }

    // إضافة التعليق مع التاريخ التلقائي
    blog.comments.push({
      userId: new mongoose.Types.ObjectId(userId),
      text,
      createdAt: new Date(), // <-- سيتم تعبئته تلقائيًا من المخطط
    });

    await blog.save();

    const updatedBlog = await Blog.findById(blogId).populate(
      "comments.userId",
      "name avatarUrl"
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};// الحصول على مقالة واحدة مع populate بيانات المؤلف
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("createdBy", "name email avatarUrl")
      .populate("comments.userId", "name avatarUrl");

    if (!blog) {
       res.status(404).json({ message: "المقالة غير موجودة" });
       return;
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

// الحصول على المقالات مع الترقيم والفرز
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name');

    const total = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

// زيادة عدد المشاهدات
export const incrementViews = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
       res.status(404).json({ message: "المقالة غير موجودة" });
       return;
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};