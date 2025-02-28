// controllers/cartController.ts
import { NextFunction, Request, Response } from "express";
import Cart, { ICart, PopulatedCartProduct } from "../models/Cart";
import { IProduct } from "../models/Product"; // تأكد من استيراد واجهة المنتج
import { Types } from "mongoose";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin" | "super-admin";
    iat: number;  
    exp: number;
  };
}

// تحديث واجهة المنتج لتشمل الحقول المطلوبة
interface PopulatedProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  image: string;
}

// تحديث واجهة عنصر السلة بعد populate
interface CartProduct {
  productId: PopulatedProduct; // استخدام الواجهة المحدثة
  quantity: number;
}

// واجهة للسلة بعد populate
interface PopulatedCart extends Document {
  userId: Types.ObjectId;
  products: CartProduct[];
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
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
      });
    }
    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ productId, quantity: quantity || 1 });
    }
    await cart.save();
    
    // حساب العدد الإجمالي للكميات
    const totalCount = cart.products.reduce((sum, p) => sum + p.quantity, 0);
    res.status(200).json({ success: true, totalCount });
    return;
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
    return;
  }
};
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
      products: PopulatedCartProduct[];
    }>("products.productId", "name price image");

    const products =
      cart?.products.map((p) => ({
        productId: p.productId._id.toString(),
        name: p.productId.name,
        price: p.productId.price,
        quantity: p.quantity, // لن يظهر الخطأ هنا الآن
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