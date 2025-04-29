// controllers/couponController.ts
import { Request, Response } from "express";
import Coupon from "../models/Coupon";
import Cart from "../models/Cart";
import Order from "../models/Order";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: "خطاء في اضافة كوبون" });
  }
};

export const getActiveCoupons = async (_req: Request, res: Response) => {
  const now = new Date();
  const coupons = await Coupon.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
  res.json({ success: true, coupons });
};

export const applyCoupon = async (req: Request, res: Response) => {
  const { code, userId } = req.body;
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) {
    res.status(404).json({ message: "رمز غير صالح" });
    return;
  }

  // التحقق من الحدود الزمنية
  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    res.status(400).json({ message: "الكوبون غير متاح حالياً" });
    return;
  }
  // تحقق من عدد مرات الاستخدام الكلي
  if (coupon.usageLimit <= 0) {
    res.status(400).json({ message: "تم استنفاد الكوبون" });
    return;
  }
  // تحقق من استخدام هذا المستخدم
  const usedCount = await Order.countDocuments({ coupon: coupon._id, userId });
  if (usedCount >= coupon.usagePerUser) {
    res.status(400).json({ message: "لقد استخدمت هذا الكوبون مسبقاً" });
    return;
  }
  // جلب سلة المستخدم لحساب القيمة
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    res.status(404).json({ message: "السلة غير موجودة" });
    return;
  }

  const subtotal = cart.products.reduce(
    (sum, p) => sum + p.priceUsed * p.quantity,
    0
  );

  if (coupon.minimumOrderValue && subtotal < coupon.minimumOrderValue) {
    res
      .status(400)
      .json({ message: `المبلغ الأدنى: ${coupon.minimumOrderValue}` });
    return;
  }

  // حساب الخصم
  let discount = 0;
  if (coupon.discountType === "fixed") discount = coupon.amount;
  else discount = (subtotal * coupon.amount) / 100;

  // تحديث حدود الاستخدام
  coupon.usageLimit--;
  await coupon.save();

  res.json({
    success: true,
    discount,
    newTotal: subtotal - discount,
    couponId: coupon._id,
  });
  return;
};
