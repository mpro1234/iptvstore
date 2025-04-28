import { Request, Response } from "express";
import Product from "../models/Product";
import Server from "../models/Server";
import User from "../models/User";
import mongoose from "mongoose";
// إنشاء منتج جديد
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      server,
      price,
      discountedPrice,
      image,
      createdAt,
    } = req.body;

    const user = await User.findById(req.user?.userId); // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
    if (!user) {
      res.status(404).json({ message: "المستخدم غير موجود." });
      return;
    }
    // التحقق من وجود السيرفر
    const serverExists = await Server.findById(server);
    if (!serverExists) {
      res.status(404).json({ message: "السيرفر غير موجود." });
      return;
    }
    const newProduct = new Product({
      name,
      description,
      server: server,
      price,
      discountedPrice,
      image,
      comments: [],
      createdBy: user._id,
      createdAt,
    });

    await newProduct.save();
    // 4. ربط المنتج بالسيرفر بدون تكرار
    await Server.findByIdAndUpdate(req.body.server, {
      $addToSet: { products: newProduct._id },
    });

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// تعديل منتج موجود
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    // التحقق من صحة البيانات عند تفعيل العرض
    if (updates.isOnOffer) {
      if (
        !updates.discountedPrice ||
        updates.discountedPrice >= updates.price
      ) {
        res.status(400).json({ message: "سعر العرض غير صالح" });
        return;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/productController.ts
export const getProductsByServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const products = await Product.find({ server: serverId });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب المنتجات" });
  }
};

// حذف منتج
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    await Server.findByIdAndUpdate(deletedProduct.server, {
      $pull: { products: deletedProduct._id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض جميع المنتجات
export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// فلترة المنتجات
export const filterProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { minPrice, maxPrice, serverType } = req.query;

    const query: any = {};
    if (minPrice) query.price = { $gte: parseFloat(minPrice as string) };
    if (maxPrice)
      query.price = { ...query.price, $lte: parseFloat(maxPrice as string) };
    if (serverType) query.serverType = serverType;

    const products = await Product.find(query);
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// البحث عن منتجات
export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({ message: "Query parameter is required" });
      return;
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query as string, $options: "i" } }, // بحث بالاسم
        { description: { $regex: query as string, $options: "i" } }, // بحث بالوصف
      ],
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  // <-- تغيير نوع الإرجاع إلى void
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "معرّف غير صالح" });
      return; // <-- إضافة return لتجنب تنفيذ الكود التالي
    }

    const product = await Product.findById(id)
      .populate("server", "name image")
      .populate("comments.userId", "name avatarUrl")
      .populate("ratings.userId", "name");

    if (!product) {
      res.status(404).json({ message: "المنتج غير موجود" });
      return;
    }

    // هنا نعيد المنتج مباشرةً بدون حقل data
    res.status(200).json(product);
  } catch (error) {
    console.error("خطأ في جلب المنتج:", error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

export const getOfferedProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find({
      isOnOffer: true,
      offerExpiry: { $gt: new Date() },
    });
    res.status(200).json({ products });
  } catch (error) {}
};
