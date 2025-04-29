import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // السعر الأساسي
    discountedPrice?: number; // السعر بعد الخصم (اختياري)
    isOnOffer: boolean; // إضافة حقل جديد لتحديد إذا كان العرض مفعل
  }[];
  totalPrice: number;
  status: string;
  coupon: mongoose.Types.ObjectId;
  usedPoints?: number; // لو نظام النقاط مرتبط
  discountAmount?: number; // قيمة الخصم المطبَّق
  finalPrice?: number; // السعر بعد الخصم

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // مرجع لنوع User
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // مرجع لنوع Product
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discountedPrice: {
        type: Number,
      },
      isOnOffer: {
        type: Boolean,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "completed",
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: false,
    default: null,
  },
  discountAmount: { type: Number, default: 0 },
  finalPrice: { type: Number, required: true },
  usedPoints: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IOrder>("Order", orderSchema);
