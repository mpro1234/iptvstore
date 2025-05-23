// models/Cart.ts
import { Schema, model, Document } from "mongoose";

interface CartProduct {
  productId: Schema.Types.ObjectId;
  quantity: number;
  priceUsed: number; // إضافة هذا الحقل
}

interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  products: CartProduct[];
  createdAt: Date; // يولِّده Mongoose
  updatedAt: Date; // يولِّده Mongoose
}

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      priceUsed: {
        // إضافة هذا الحقل
        type: Number,
        required: true,
      },
    },
    { timestamps: true }, // ← هذا يُضيف createdAt و updatedAt تلقائياً
  ],
});

export default model<ICart>("Cart", cartSchema);
