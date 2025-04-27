/* controllers/adminProductRatingController.ts */
import { Request, Response } from "express";
import ProductRating from "../models/ProductRating";

export const listPendingRatings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const pending = await ProductRating.find({ status: "pending" })
      .populate("userId", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({ pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const updated = await ProductRating.findByIdAndUpdate(
      ratingId,
      { status: "approved", isVisible: true },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }
    res.status(200).json({ message: "Rating approved", rating: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectRating = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const updated = await ProductRating.findByIdAndUpdate(
      ratingId,
      { status: "rejected", isVisible: false },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }
    res.status(200).json({ message: "Rating rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleRatingVisibility = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const rating = await ProductRating.findById(ratingId);
    if (!rating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }
    rating.isVisible = !rating.isVisible;
    await rating.save();
    res
      .status(200)
      .json({ message: "Visibility toggled", isVisible: rating.isVisible });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
