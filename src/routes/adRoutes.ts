// routes/adRoutes.ts
import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getAllAds,
  createAd,
  updateAd,
  deleteAd,
} from "../controllers/adController";

const router = express.Router();

// كل المستخدمين يرون الإعلانات
router.get("/all", getAllAds);

// فقط الأدمن/سوبر-أدمن يمكنه إدارة الإعلانات
router.post("/create", authenticate("admin"), createAd);
router.put("/update/:adId", authenticate("admin"), updateAd);
router.delete("/delete/:adId", authenticate("admin"), deleteAd);

export default router;
