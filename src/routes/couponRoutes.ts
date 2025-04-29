import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createCoupon,
  getActiveCoupons,
  applyCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController";

const router = express.Router();

// CRUD للأدمن
router.post("/", authenticate("admin"), createCoupon);

// جلب الكوبونات الصالحة للجميع (مثلاً في صفحة الدفع)
router.get("/active", getActiveCoupons);

// تطبيق كوبون على السلة
router.get("/",authenticate("admin"), getAllCoupons);
router.post("/apply", authenticate("user"), applyCoupon);

router.put("/:id", authenticate("admin"), updateCoupon);
router.delete("/:id", authenticate("admin"), deleteCoupon);

export default router;
