import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Cart from "../models/Cart";
import { IUser } from "../models/User";
import { IDecodedToken } from "../middlewares/authMiddleware";
import Coupon from "../models/Coupon";

interface IProduct {
  _id: mongoose.Types.ObjectId;
  price: number;
  // أضف باقي الخصائص حسب الحاجة
  isOnOffer: boolean; // إضافة حقل جديد لتحديد إذا كان العرض مفعل
  discountedPrice?: number; // السعر بعد الخصم (اختياري)
}
interface ICartProduct {
  productId: IProduct | mongoose.Types.ObjectId;
  quantity: number; // إضافة هذا الحقل
  discountedPrice?: number; // إضافة الخاصية هنا
}

interface IOrderDetails {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
}

interface AuthRequest extends Request {
  user?: IDecodedToken; // تعريف user كخياري (قد يكون undefined)
}
// أنواع البيانات المخصصة
interface IStatsResponse {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  monthlyRevenue: Array<{
    month: number;
    revenue: number;
  }>;
}

interface IMonthlyRevenueItem {
  _id: number;
  totalRevenue: number;
}
// إنشاء طلب جديد
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, couponId } = req.body;

    // جلب السلة وتأكد منها
    const cart = await Cart.findOne({ userId }).populate<{
      products: { productId: any; quantity: number }[];
    }>("products.productId");
    if (!cart) {
      res.status(404).json({ message: "السلة غير موجودة" });
      return;
    }

    // بناء مصفوفة المنتجات للطلب
    const orderProducts = cart.products.map((ci) => ({
      productId: ci.productId._id,
      quantity: ci.quantity,
      price: ci.productId.price,
      isOnOffer: ci.productId.isOnOffer,
      discountedPrice: ci.productId.discountedPrice,
    }));

    // حساب المجموع قبل الخصم
    const subtotal = cart.products.reduce((sum, ci) => {
      const price = ci.productId.discountedPrice ?? ci.productId.price;
      return sum + price * ci.quantity;
    }, 0);

    // إذا وُجد couponId، احسب الخصم
    let discountAmount = 0;
    if (couponId) {
      const coupon = await Coupon.findById(couponId);
      if (coupon) {
        if (coupon.discountType === "fixed") {
          discountAmount = coupon.amount;
        } else {
          discountAmount = (subtotal * coupon.amount) / 100;
        }
        // قلّل حد الاستخدام
        coupon.usageLimit--;
        await coupon.save();
      }
    }

    const finalPrice = subtotal - discountAmount;

    // إنشاء الطلب
    const newOrder = new Order({
      userId,
      products: orderProducts,
      coupon: couponId || null,
      discountAmount,
      totalPrice: subtotal,
      finalPrice,
      status: "completed",
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      message: "تم إنشاء الطلب بنجاح",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "بيانات الطلب غير صحيحة",
    });
  }
};
// عرض جميع الطلبات (للمسؤول)
export const getAllOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("userId", "name") // إضافة populate لـ userId مع اسم المستخدم
      .populate("products.productId");

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderDetails = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "غير مصرح" });
      return;
    }

    const { id } = req.params;

    // التحقق من صحة معرف الطلب
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "معرّف طلب غير صالح" });
      return;
    }

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "name price image isOnOffer discountedPrice"
      );

    if (!order) {
      res.status(404).json({ message: "الطلب غير موجود" });
      return;
    }

    // السماح للمشرفين بالوصول إلى أي طلب
    if (user.role !== "admin" && user.role !== "super-admin") {
      const orderUserId = order.userId.id.toString();
      if (orderUserId !== user.userId) {
        res.status(403).json({ message: "غير مصرح بالوصول لهذا الطلب" });
        return;
      }
    }

    // إعداد بيانات الطلب المرجعة
    const orderDetails = {
      _id: order._id,
      userId: {
        name: (order.userId as any).name,
        email: (order.userId as any).email,
      },
      products: order.products.map((item: any) => ({
        productId: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image,
          isOnOffer: item.isOnOffer,
          discountedPrice: item.discountedPrice,
        },
        quantity: item.quantity,
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// تحديث حالة الطلب (للمسؤول)
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getOrderStats = async (
  _req: Request,
  res: Response<IStatsResponse | { message: string }>
): Promise<void> => {
  try {
    // الإحصائيات الأساسية
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // الإيرادات الشهرية
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { month: "$_id", revenue: 1, _id: 0 } },
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("إحصائيات الطلبات - الخطأ:", error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// تقرير الإيرادات الشهرية
export const getMonthlyRevenue = async (
  _req: Request,
  res: Response<{ monthlyRevenue: IMonthlyRevenueItem[] } | { message: string }>
): Promise<void> => {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ monthlyRevenue });
  } catch (error) {
    console.error("الإيرادات الشهرية - الخطأ:", error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// تقرير الطلبات الأسبوعية
export const getWeeklyOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const weeklyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $week: "$createdAt" }, // تجميع حسب الأسبوع
          totalOrders: { $sum: 1 }, // حساب عدد الطلبات
        },
      },
      {
        $sort: { _id: 1 }, // ترتيب حسب الأسبوع
      },
    ]);

    res.status(200).json({ weeklyOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
