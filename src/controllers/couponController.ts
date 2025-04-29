// controllers/couponController.ts
import { Request, Response } from "express";
import Coupon from "../models/Coupon";
import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";
import Server from "../models/Server";
import mongoose from "mongoose";

// إنشاء كوبون جديد
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "خطأ في إضافة الكوبون" });
  }
};

// جلب كل الكوبونات (للإدارة)
export const getAllCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "خطأ في جلب الكوبونات" });
  }
};

// جلب الكوبونات الصالحة حالياً (للمستخدم)
export const getActiveCoupons = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.json({ success: true, coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "خطأ في جلب الكوبونات" });
  }
};

// تعديل كوبون
export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: "الكوبون غير موجود" });
      return;
    }
    res.json({ success: true, coupon: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "خطأ في تعديل الكوبون" });
  }
};

// حذف كوبون
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "الكوبون غير موجود" });
      return;
    }
    res.json({ success: true, message: "تم حذف الكوبون" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "خطأ في حذف الكوبون" });
  }
};

// تطبيق الكوبون على سلة المستخدم
export const applyCoupon = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "معرّف مستخدم غير صالح" });
      return;
    }

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      res.status(404).json({ message: "رمز غير صالح" });
      return;
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      res.status(400).json({ message: "الكوبون غير متاح حالياً" });
      return;
    }
    if (coupon.usageLimit <= 0) {
      res.status(400).json({ message: "تم استنفاد الكوبون" });
      return;
    }
    const usedCount = await Order.countDocuments({
      coupon: coupon._id,
      userId,
    });
    if (usedCount >= coupon.usagePerUser) {
      res.status(400).json({ message: "لقد استخدمت هذا الكوبون مسبقاً" });
      return;
    }

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      res.status(404).json({ message: "السلة غير موجودة" });
      return;
    }

    // اجمع مجموع العناصر المؤهلة
    const prodIds = coupon.applicableProducts ?? [];
    const servIds = coupon.applicableServices ?? [];
    let eligibleTotal = 0;
    for (const item of cart.products) {
      const prod: any = item.productId;
      const byProd =
        prodIds.length === 0 || prodIds.includes(prod._id.toString());
      const byServ =
        servIds.length === 0 || servIds.includes(prod.service?.toString());
      if (byProd && byServ) {
        eligibleTotal += item.priceUsed * item.quantity;
      }
    }

    if (eligibleTotal === 0) {
      res.status(400).json({ message: "لا توجد عناصر صالحة لهذا الكوبون" });
      return;
    }
    if (coupon.minimumOrderValue && eligibleTotal < coupon.minimumOrderValue) {
      res
        .status(400)
        .json({ message: `المبلغ الأدنى: ${coupon.minimumOrderValue}` });
      return;
    }

    // حساب الخصم
    let discount =
      coupon.discountType === "fixed"
        ? coupon.amount
        : (eligibleTotal * coupon.amount) / 100;
    if (discount > eligibleTotal) discount = eligibleTotal;

    coupon.usageLimit--;
    await coupon.save();

    const subtotal = cart.products.reduce(
      (sum, p) => sum + p.priceUsed * p.quantity,
      0
    );

    res.json({
      success: true,
      discount,
      newTotal: subtotal - discount,
      couponId: coupon._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في تطبيق الكوبون" });
  }
};
