import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId; // مرجع لنوع User
  products: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
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
