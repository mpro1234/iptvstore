import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string; // اسم الباقة
  description: string; // وصف طويل للباقة
  server: mongoose.Types.ObjectId; // ربط مع نموذج السيرفر (Server)
  price: number; // السعر الأساسي
  discountedPrice?: number; // السعر بعد الخصم (اختياري)
  image: string; // رابط صورة المنتج
  comments: mongoose.Types.ObjectId[]; // قائمة بـ IDs التعليقات المرتبطة بالمنتج
  createdBy: mongoose.Types.ObjectId; // الشخص أو المشرف الذي أنشأ المنتج
  createdAt: Date; // تاريخ إنشاء المنتج
  isOnOffer: boolean; // إضافة حقل جديد لتحديد إذا كان العرض مفعل
  offerExpiry?: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  server: { type: Schema.Types.ObjectId, ref: "Server", required: true }, // ربط مع نموذج السيرفر
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: null }, // السعر بعد الخصم (اختياري)
  image: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // ربط مع نموذج التعليقات
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // الشخص الذي أنشأ المنتج
  createdAt: { type: Date, default: Date.now },
  isOnOffer: { type: Boolean, default: false },
  offerExpiry: { type: Date, default: null },
});

export default mongoose.model<IProduct>("Product", productSchema);
