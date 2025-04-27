import mongoose, { Document, Schema } from "mongoose";

export interface IProductRating extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  status: "pending" | "approved" | "rejected";
  isVisible: boolean;
  createdAt: Date;
}

const productRatingSchema = new Schema<IProductRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isVisible: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProductRating>(
  "ProductRating",
  productRatingSchema
);
