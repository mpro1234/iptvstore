import mongoose, { Document, Schema } from "mongoose";

export interface IServer extends Document {
  name: string; // اسم السيرفر
  description: string; // وصف السيرفر
  image: string; // رابط صورة السيرفر
  createdBy: mongoose.Types.ObjectId; // الشخص الذي أنشأ السيرفر
  createdAt: Date; // تاريخ إنشاء السيرفر
}

const serverSchema = new Schema<IServer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // الشخص الذي أنشأ السيرفر
   createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IServer>("Server", serverSchema);
