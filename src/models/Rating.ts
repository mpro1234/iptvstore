import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId; // ID المستخدم الذي قام بالتقييم
  productId: mongoose.Types.ObjectId; // ID المنتج الذي تم تقييمه
  rating: number; // التقييم (من 1 إلى 5)
  comment?: string; // تعليق اختياري
}

const ratingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ربط مع نموذج المستخدم
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // ربط مع نموذج المنتج
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
});

export default mongoose.model<IRating>("Rating", ratingSchema);
