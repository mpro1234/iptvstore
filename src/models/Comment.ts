import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId; // ID المستخدم الذي أضاف التعليق
  text: string; // نص التعليق
  productId?: mongoose.Types.ObjectId; // ID المنتج المرتبط بالتعليق (اختياري)
  blogId?: mongoose.Types.ObjectId; // ID المقالة المرتبطة بالتعليق (اختياري)
  createdAt: Date; // تاريخ إنشاء التعليق
}

const commentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>("Comment", commentSchema);
