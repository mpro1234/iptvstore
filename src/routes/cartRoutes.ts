// routes/cartRoutes.ts
import express from "express";
import {
  addToCart,
  getCart,
  getCartCount,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/add", authenticate("user"), addToCart);
router.get("/", authenticate("user"), getCart);
router.get("/count", authenticate("user"), getCartCount);

export default router;
