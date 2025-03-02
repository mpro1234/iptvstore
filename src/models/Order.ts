import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId; // مرجع لنوع User
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // السعر الأساسي
    discountedPrice?: number; // السعر بعد الخصم (اختياري)
    isOnOffer: boolean; // إضافة حقل جديد لتحديد إذا كان العرض مفعل
  }[];
  totalPrice: number;
  status: string;
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
    isOnOffer: { type: Boolean, default: false }, // إزالة required
    discountedPrice: { type: Number },
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
