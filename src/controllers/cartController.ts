// controllers/cartController.ts
import { NextFunction, Request, Response } from "express";
import Product from "../models/Product";
import { Types } from "mongoose";
import Cart from "../models/Cart";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin" | "super-admin";
    iat: number;
    exp: number;
  };
}

// تحديث واجهة عنصر السلة بعد populate
interface CartProduct {
  productId: PopulatedProduct;
  quantity: number;
  priceUsed: number; // إضافة هذا الحقل
}

interface PopulatedProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  discountedPrice?: number;
  isOnOffer?: boolean;
  image: string;
}
// controllers/cartController.ts
export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    // جلب بيانات المنتج أولاً
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "المنتج غير موجود" });
      return;
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
      });
    }

    // تحديد السعر المستخدم
    const finalPrice =
      product.isOnOffer && product.discountedPrice
        ? product.discountedPrice
        : product.price;

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
      existingProduct.priceUsed = finalPrice; // تحديث السعر إذا تغير
    } else {
      cart.products.push({
        productId,
        quantity: quantity || 1,
        priceUsed: finalPrice, // حفظ السعر المستخدم
      });
    }

    await cart.save();

    const totalCount = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    res.status(200).json({ success: true, totalCount });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
// controllers/cartController.ts
export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    const cart = await Cart.findOne({ userId }).populate<{
      products: (CartProduct & { productId: PopulatedProduct })[];
    }>("products.productId", "name price discountedPrice isOnOffer image");

    const products =
      cart?.products.map((p) => ({
        productId: p.productId._id.toString(),
        name: p.productId.name,
        originalPrice: p.productId.price,
        price: p.priceUsed, // استخدام السعر المحفوظ
        isOnOffer: p.productId.isOnOffer,
        discountedPrice: p.productId.discountedPrice,
        quantity: p.quantity,
        image: p.productId.image,
      })) || [];

    res.status(200).json({ products });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
// controllers/cartController.ts
export const getCartCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }
    const cart = await Cart.findOne({ userId });
    const count = cart?.products.reduce((sum, p) => sum + p.quantity, 0) || 0;
    res.json({ count });
    return;
  } catch (error) {
    next(error);
    res.status(500).json({ message: "خطأ في الخادم" });
    return;
  }
};

// controllers/cartController.ts
export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({ message: "الكمية غير صالحة" });
      return;
    }

    // جلب بيانات المنتج أولاً
    const product = await Product.findById(productId); // إضافة هذا السطر
    if (!product) {
      res.status(404).json({ message: "المنتج غير موجود" });
      return;
    }

    const finalPrice =
      product.isOnOffer && product.discountedPrice
        ? product.discountedPrice
        : product.price;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "السلة غير موجودة" });
      return;
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      res.status(404).json({ message: "المنتج غير موجود في السلة" });
      return;
    }

    // تحديث السعر والكمية
    cart.products[productIndex].quantity = quantity;
    cart.products[productIndex].priceUsed = finalPrice;

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate<{
      products: (CartProduct & { productId: PopulatedProduct })[];
    }>("products.productId", "name price discountedPrice isOnOffer image");

    res.status(200).json({
      success: true,
      products: updatedCart?.products.map((p) => ({
        productId: p.productId._id.toString(),
        name: p.productId.name,
        originalPrice: p.productId.price,
        price: p.priceUsed,
        isOnOffer: p.productId.isOnOffer,
        discountedPrice: p.productId.discountedPrice,
        quantity: p.quantity,
        image: p.productId.image,
      })),
    });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
// controllers/cartController.ts
export const deleteCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: "السلة غير موجودة" });
      return;
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    if (cart.products.length === initialLength) {
      res.status(404).json({ message: "المنتج غير موجود في السلة" });
      return;
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate<{
      products: (CartProduct & { productId: PopulatedProduct })[];
    }>("products.productId", "name price discountedPrice isOnOffer image");

    res.status(200).json({
      success: true,
      products: updatedCart?.products.map((p) => ({
        productId: p.productId._id.toString(),
        name: p.productId.name,
        originalPrice: p.productId.price,
        price: p.priceUsed,
        isOnOffer: p.productId.isOnOffer,
        discountedPrice: p.productId.discountedPrice,
        quantity: p.quantity,
        image: p.productId.image,
      })),
    });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

export const getAbandonedCarts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // اختيار السلات التي لم تُحدَّث خلال آخر 48 ساعة
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const abandoned = await Cart.find({
      updatedAt: { $lt: cutoff },
      "products.0": { $exists: true }, // تحتوي على عنصر واحد على الأقل
    })
      .populate("userId", "email name")
      .select("userId products updatedAt");

    res.status(200).json({ count: abandoned.length, carts: abandoned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
