import { Request, Response } from "express";
import Rating from "../models/Rating";

// إضافة تقييم لمنتج
export const addRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, rating, comment } = req.body;

    const newRating = new Rating({
      userId,
      productId,
      rating,
      comment,
    });

    await newRating.save();
    res
      .status(201)
      .json({ message: "Rating added successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض تقييمات منتج معين
export const getProductRatings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ productId }).populate("userId");
    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
