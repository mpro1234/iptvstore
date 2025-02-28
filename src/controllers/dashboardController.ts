import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";

// الحصول على إحصائيات لوحة التحكم
export const getDashboard = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // جلب عدد المستخدمين
    const totalUsers = await User.countDocuments();

    // جلب عدد الطلبات
    const totalOrders = await Order.countDocuments();

    // جلب الإيرادات الشهرية
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // تجميع حسب الشهر
          totalRevenue: { $sum: "$totalPrice" }, // حساب الإيرادات
        },
      },
      {
        $sort: { _id: 1 }, // ترتيب حسب الشهر
      },
    ]);

    // إرجاع البيانات كـ JSON
    res.status(200).json({
      totalUsers,
      totalOrders,
      monthlyRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
