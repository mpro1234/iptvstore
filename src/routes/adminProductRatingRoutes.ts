/* routes/adminProductRatingRoutes.ts */
import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  listPendingRatings,
  approveRating,
  rejectRating,
  toggleRatingVisibility,
} from "../controllers/adminProductRatingController";

const router = express.Router();

// Admin moderation
router.get("/pending", authenticate("admin"), listPendingRatings);
router.patch("/:ratingId/approve", authenticate("admin"), approveRating);
router.patch("/:ratingId/reject", authenticate("admin"), rejectRating);
router.patch(
  "/:ratingId/visibility",
  authenticate("admin"),
  toggleRatingVisibility
);

export default router;
