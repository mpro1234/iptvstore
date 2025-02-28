"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("./models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const serverRoutes_1 = __importDefault(require("./routes/serverRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const authRoutes_2 = __importDefault(require("./routes/authRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
// التهيئة الأولية
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // أو '*' للسماح للجميع
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
    ],
    credentials: true, // إذا كنت تستخدم الكوكيز/التوكن
}));
// الاتصال بقاعدة البيانات
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // تفعيل وضع التصحيح لرؤية كل خطوات الاتصال
        mongoose_1.default.set("debug", true);
        // الاتصال مع إعدادات متقدمة
        yield mongoose_1.default.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 60000, // 60 ثانية
            socketTimeoutMS: 60000,
            connectTimeoutMS: 60000,
        });
        console.log("🛢️  تم الاتصال مع قاعدة البيانات بنجاح");
        // تأخير تنفيذ createSuperAdmin لضمان اكتمال الاتصال
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield createSuperAdmin();
        }), 2000); // انتظر 2 ثانية إضافية
    }
    catch (error) {
        console.error("❌ فشل الاتصال مع قاعدة البيانات:", error);
        process.exit(1);
    }
});
// تشغيل الخادم
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    });
};
// التسلسل الزمني للتشغيل
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    startServer();
}))();
const createSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
        // تحقق من وجود المتغيرات البيئية
        if (!superAdminEmail || !superAdminPassword) {
            throw new Error("❌ SUPER_ADMIN_EMAIL أو SUPER_ADMIN_PASSWORD غير مُعرف في .env");
        }
        // تأخير اختياري لضمان اكتمال الفهارس
        yield new Promise((resolve) => setTimeout(resolve, 1000));
        // ابحث عن المستخدم باستخدام await مع معالجة الأخطاء
        const superAdmin = yield User_1.default.findOne({ email: superAdminEmail }).catch((err) => {
            console.error("❌ فشل في البحث عن المستخدم:", err);
            throw err;
        });
        if (!superAdmin) {
            const hashedPassword = yield bcryptjs_1.default.hash(superAdminPassword, 10);
            yield User_1.default.create({
                name: "Super Admin",
                email: superAdminEmail,
                password: hashedPassword,
                role: "super-admin",
            });
            console.log("✅ Super Admin created successfully");
        }
    }
    catch (error) {
        console.error("❌ فشل في إنشاء Super Admin:", error);
        process.exit(1);
    }
});
createSuperAdmin();
connectDB();
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/servers", serverRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/users", authRoutes_2.default);
app.use("/api/cart", cartRoutes_1.default); // <-- تأكد من صحة المسار
app.use("/api/comments", commentRoutes_1.default);
app.use("/api/ratings", ratingRoutes_1.default);
app.use("/api", uploadRoutes_1.default);
