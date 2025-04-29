// models/Coupon.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string; // الكود الفريد
  discountType: "fixed" | "percentage";
  amount: number; // إذا percentage: 0–100، أما fixed: قيمة ثابتة بالريال
  startDate: Date;
  endDate: Date;
  usageLimit: number; // إجمالي مرات الاستخدام
  usagePerUser: number; // حد الاستخدام لكل مستخدم
  minimumOrderValue?: number; // شرط الحد الأدنى للطلب
  allowedProducts?: mongoose.Types.ObjectId[]; // منتجات محددة
  allowedCategories?: mongoose.Types.ObjectId[]; // فئات محددة
  userGroups?: string[]; // مجموعات مستخدمين (مثلاً VIP)
  canBeCombined: boolean; // هل يُسمح بالدمج مع كوبونات/خصومات أخرى
  isActive: boolean; // تفعيل/إيقاف
  createdAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["fixed", "percentage"], required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 0 },
  usagePerUser: { type: Number, default: 1 },
  minimumOrderValue: { type: Number },
  allowedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  allowedCategories: [{ type: Schema.Types.ObjectId, ref: "Server" }],
  userGroups: [{ type: String }],
  canBeCombined: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICoupon>("Coupon", couponSchema);
