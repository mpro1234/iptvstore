import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import blogRoutes from "./routes/blogRoutes";
import serverRoutes from "./routes/serverRoutes";
import commentRoutes from "./routes/commentRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/authRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import cartRoutes from "./routes/cartRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// التهيئة الأولية
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:["http://localhost:5173" , "https://www.soofrah.com","https://soofrah.com"],// أو '*' للسماح للجميع
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true, // إذا كنت تستخدم الكوكيز/التوكن
  })
);

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    // تفعيل وضع التصحيح لرؤية كل خطوات الاتصال
    mongoose.set("debug", true);

    // الاتصال مع إعدادات متقدمة
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 60000, // 60 ثانية
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });

    console.log("🛢️  تم الاتصال مع قاعدة البيانات بنجاح");

    // تأخير تنفيذ createSuperAdmin لضمان اكتمال الاتصال
    setTimeout(async () => {
      await createSuperAdmin();
    }, 2000); // انتظر 2 ثانية إضافية
  } catch (error) {
    console.error("❌ فشل الاتصال مع قاعدة البيانات:", error);
    process.exit(1);
  }
};
// تشغيل الخادم
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
  });
};

// التسلسل الزمني للتشغيل
(async () => {
  await connectDB();
  startServer();
})();

const createSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    // تحقق من وجود المتغيرات البيئية
    if (!superAdminEmail || !superAdminPassword) {
      throw new Error(
        "❌ SUPER_ADMIN_EMAIL أو SUPER_ADMIN_PASSWORD غير مُعرف في .env"
      );
    }

    // تأخير اختياري لضمان اكتمال الفهارس
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ابحث عن المستخدم باستخدام await مع معالجة الأخطاء
    const superAdmin = await User.findOne({ email: superAdminEmail }).catch(
      (err) => {
        console.error("❌ فشل في البحث عن المستخدم:", err);
        throw err;
      }
    );

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
      await User.create({
        email: superAdminEmail,
        password: hashedPassword,
        role: "super-admin",
      });
      console.log("✅ Super Admin created successfully");
    }
  } catch (error) {
    console.error("❌ فشل في إنشاء Super Admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes); // <-- تأكد من صحة المسار
app.use("/api/comments", commentRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api", uploadRoutes);

