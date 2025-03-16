// models/Server.ts (يمكن إعادة تسميته إلى Category إذا أردت)
import mongoose, { Document, Schema } from "mongoose";

export interface IServer extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  columns: number; // <-- إضافة حقل عدد الأعمدة
  products: mongoose.Types.ObjectId[]; // <-- إضافة علاقة بالمنتجات
}

const serverSchema = new Schema<IServer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  columns: { type: Number, default: 3 }, // 2/3/4 أعمدة
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }], // علاقة مع المنتجات
});

export default mongoose.model<IServer>("Server", serverSchema);
