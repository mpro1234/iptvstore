import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import adRoutes from "./routes/adRoutes";

// Middleware & Models
import User from "./models/User";

// Auth & Dashboard
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import couponRoutes from "./routes/couponRoutes";

// Blog & Comments
import blogRoutes from "./routes/blogRoutes";
import blogCommentRoutes from "./routes/blogCommentRoutes";
import adminBlogCommentRoutes from "./routes/adminBlogCommentRoutes";

// Servers (Categories) & Products
import serverRoutes from "./routes/serverRoutes";
import productRoutes from "./routes/productRoutes";

// Ratings
import productRatingRoutes from "./routes/productRatingRoutes";
import adminProductRatingRoutes from "./routes/adminProductRatingRoutes";

// Cart & Abandoned
import cartRoutes from "./routes/cartRoutes";

// Orders & Reports
import orderRoutes from "./routes/orderRoutes";

// File Uploads (if any)
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.soofrah.com",
      "https://soofrah.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const connectDB = async () => {
  try {
    mongoose.set("debug", true);
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });
    console.log("🛢️ Connected to MongoDB");

    // Create super-admin if not exists
    await new Promise((r) => setTimeout(r, 2000));
    await createSuperAdmin();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL!;
    const pass = process.env.SUPER_ADMIN_PASSWORD!;
    const existing = await User.findOne({ email });
    if (!existing) {
      const hash = await bcrypt.hash(pass, 10);
      await User.create({ email, password: hash, role: "super-admin" });
      console.log("✅ Super Admin created");
    }
  } catch (err) {
    console.error("❌ Failed to create Super Admin:", err);
  }
};

(async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();

// --- Mount all routes under /api ---

// Authentication
app.use("/api/auth", authRoutes);

// User profile & settings
app.use("/api/users", authRoutes); // duplicate of auth, or change to userRoutes if separate

// Admin dashboard actions
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Blog & comments
app.use("/api/blogs", blogRoutes);
app.use("/api/blogs", blogCommentRoutes); // public comment routes
app.use("/api/admin/blog-comments", adminBlogCommentRoutes);

// Servers (categories)
app.use("/api/servers", serverRoutes);

// Products & product-ratings
app.use("/api/products", productRoutes);
app.use("/api/ratings", productRatingRoutes);
app.use("/api/admin/ratings", adminProductRatingRoutes);

// Cart & abandoned-cart
app.use("/api/cart", cartRoutes);

// Orders & reports
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

// File uploads or others
app.use("/api/upload", uploadRoutes);
app.use("/api/ads", adRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});
