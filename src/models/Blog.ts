import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string; // عنوان المقالة
  content: string; // محتوى المقالة (يمكن أن يحتوي على HTML للتنسيق)
  image: string; // رابط صورة المقالة
  comments: {
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date; // <-- أضف هذا الحقل
  }[]; // التعليقات (مرتبطة بالمستخدمين)
  createdBy: mongoose.Types.ObjectId; // الشخص أو المشرف الذي أنشأ المنتج
  createdAt: Date; // تاريخ إنشاء المنتج
  excerpt: string; // ملخص المقال
  category: string; // التصنيف
  authorName: string; // اسم المؤلف (نسخ احتياطي)
  views: number; // عدد المشاهدات
  featured: boolean;
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true }, // يمكن أن يحتوي على HTML للتنسيق
  image: { type: String, required: true },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ربط مع نموذج المستخدم
      text: { type: String, required: true }, // نص التعليق
      createdAt: { type: Date, default: Date.now }, // <-- أضف هذا
    },
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // الشخص الذي أنشأ المنتج
  createdAt: { type: Date, default: Date.now },
  excerpt: { type: String, required: true, maxlength: 160 },
  category: { type: String, required: true },
  authorName: { type: String }, // يمكن جلبها من نموذج المستخدم
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
});

export default mongoose.model<IBlog>("Blog", blogSchema);
