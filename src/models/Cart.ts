// models/Cart.ts
import mongoose, { Document, Schema, model, Types } from "mongoose";

// واجهة المنتج (يجب أن تكون موجودة في ملف منفصل)
interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
}

// واجهة عنصر السلة
export interface ICartProduct {
  productId: Types.ObjectId; // قبل الـ populate
  quantity: number;
   priceUsed: number; // إضافة هذا الحقل

}

// واجهة السلة الرئيسية
export interface ICart extends Document {
  userId: Types.ObjectId;
  products: ICartProduct[];
}
export interface PopulatedCartProduct {
  productId: {
    _id: Types.ObjectId;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}
const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

export default model<ICart>("Cart", cartSchema);
