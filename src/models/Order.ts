import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrder extends Document {
  userId: {
    id: string; // إضافة ID إذا لزم الأمر
    name: string;
    email: string;
  };
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
  userId: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // مرجع لنوع User
        required: true,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],

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
