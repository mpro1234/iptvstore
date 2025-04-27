// routes/cartRoutes.ts
import express from "express";
import {
  addToCart,
  deleteCartItem,
  getAbandonedCarts,
  getCart,
  getCartCount,
  updateCartItem,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authenticate("user"), addToCart);
router.get("/", authenticate("user"), getCart);
router.get("/count", authenticate("user"), getCartCount);
router.put("/:productId", authenticate("user"), updateCartItem); // إضافة route التحديث
router.delete("/:productId", authenticate("user"), deleteCartItem); // إضافة route الحذف
router.get("/abandoned", authenticate("admin"), getAbandonedCarts);

export default router;
