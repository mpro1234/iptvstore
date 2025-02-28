import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createOrder,
  getAllOrders,
  getMonthlyRevenue,
  getOrderStats,
  getWeeklyOrders,
  updateOrderStatus,
  getOrderDetails,
} from "../controllers/orderController";

const router = express.Router();

// إنشاء طلب جديد
router.post("/create", authenticate("user"), createOrder);

// عرض جميع الطلبات (متاح فقط للسوبر أدمن والأدمن)
router.get("/all", authenticate("admin"), getAllOrders);

// تحديث حالة الطلب (متاح فقط للسوبر أدمن والأدمن)
router.put("/update-status/:orderId", authenticate("admin"), updateOrderStatus);
router.get("/stats", authenticate("admin"), getOrderStats);

router.get("/:id", authenticate("user"), getOrderDetails);

router.get(
  "/reports/monthly-revenue",
  authenticate("admin"),
  getMonthlyRevenue
);

// تقرير الطلبات الأسبوعية (متاح فقط للسوبر أدمن والأدمن)
router.get("/reports/weekly-orders", authenticate("admin"), getWeeklyOrders);

export default router;
