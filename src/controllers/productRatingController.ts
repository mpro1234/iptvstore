import { Request, Response } from "express";
import ProductRating from "../models/ProductRating";
import mongoose from "mongoose";

// User adds a rating (pending)
export const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId, rating, comment } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const newRating = new ProductRating({ userId, productId, rating, comment });
    await newRating.save();

    res
      .status(201)
      .json({ message: "Rating submitted for review", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Public: fetch approved & visible ratings
export const getProductRatings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const ratings = await ProductRating.find({
      productId,
      status: "approved",
      isVisible: true,
    })
      .populate("userId", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User updates own rating
export const updateRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(ratingId))
      res.status(400).json({ message: "Invalid rating ID" });

    const rating = await ProductRating.findById(ratingId);

    if (!rating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }

    if (rating.userId.toString() !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    const { rating: newScore, comment } = req.body;
    if (newScore) rating.rating = newScore;
    if (comment !== undefined) rating.comment = comment;

    rating.status = "pending"; // re-review after edit
    rating.isVisible = false;
    await rating.save();
    res
      .status(200)
      .json({ message: "Rating updated and pending review", rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User deletes own rating
export const deleteRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const userId = req.user?.userId;
    if (!mongoose.Types.ObjectId.isValid(ratingId))
      res.status(400).json({ message: "Invalid rating ID" });
    const rating = await ProductRating.findById(ratingId);
    if (!rating) {
      res.status(404).json({ message: "Rating not found" });

      return;
    }

    if (rating.userId.toString() !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    await rating.deleteOne();
    res.status(200).json({ message: "Rating deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
