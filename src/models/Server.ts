// models/Server.ts (يمكن إعادة تسميته إلى Category إذا أردت)
import mongoose, { Document, Schema } from "mongoose";

export interface IServer extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  columns?: number; // عدد الأعمدة (فقط إذا كان العرض grid)
  products: mongoose.Types.ObjectId[]; // <-- إضافة علاقة بالمنتجات
    displayType: 'grid' | 'list' | 'slider'; // نوع العرض المطلوب

}

const serverSchema = new Schema<IServer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  displayType: { 
    type: String, 
    enum: ['grid', 'list', 'slider'], 
    default: 'grid' 
  },
  columns: { 
    type: Number, 
    default: 3,
    validate: {
      validator: (v: number) => [2, 3, 4].includes(v),
      message: 'يجب أن يكون عدد الأعمدة 2، 3، أو 4'
    }
  },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // علاقة مع المنتجات
});

export default mongoose.model<IServer>("Server", serverSchema);
