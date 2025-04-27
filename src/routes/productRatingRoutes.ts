import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  addRating,
  deleteRating,
  getProductRatings,
  updateRating,
} from "../controllers/productRatingController";

const router = express.Router();

// User submits rating
router.post("/add", authenticate("user"), addRating);

// Public fetch approved ratings
router.get("/:productId", getProductRatings);
// User updates own rating
router.put("/:ratingId", authenticate("user"), updateRating);

// User deletes own rating
router.delete("/:ratingId", authenticate("user"), deleteRating);
export default router;
