import express from "express";
import { addRating, getProductRatings } from "../controllers/ratingController";

const router = express.Router();

// إضافة تقييم لمنتج
router.post("/add", addRating);

// عرض تقييمات منتج معين
router.get("/:productId", getProductRatings);

export default router;
