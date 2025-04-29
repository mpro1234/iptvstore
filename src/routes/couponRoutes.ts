import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createCoupon,
  getActiveCoupons,
  applyCoupon,
} from "../controllers/couponController";

const router = express.Router();

// CRUD للأدمن
router.post("/", authenticate("admin"), createCoupon);

// جلب الكوبونات الصالحة للجميع (مثلاً في صفحة الدفع)
router.get("/active", getActiveCoupons);

// تطبيق كوبون على السلة
router.post("/apply", authenticate("user"), applyCoupon);

export default router;
