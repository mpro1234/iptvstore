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
exports.authenticate = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // عنوان الـ Frontend
}));
// Middleware للمصادقة
const authenticate = (requiredRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // التحقق من وجود التوكن في headers أو cookies
            const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token);
            if (!token) {
                res.status(401).json({ message: "مطلوب مصادقة للوصول" });
                return;
            }
            // فك تشفير التوكن مع معالجة الأخطاء التفصيلية
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // إرفاق بيانات المستخدم مع الطلب
            req.user = decoded;
            // نظام الصلاحيات الهرمي
            const roleHierarchy = {
                user: 1,
                admin: 2,
                "super-admin": 3,
            };
            if (roleHierarchy[decoded.role] < roleHierarchy[requiredRole]) {
                res.status(403).json({
                    message: `صلاحياتك (${decoded.role}) غير كافية للوصول لهذا المورد`,
                });
                return;
            }
            next();
        }
        catch (err) {
            // معالجة أنواع الأخطاء المختلفة
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res
                    .status(401)
                    .json({ message: "انتهت صلاحية الجلسة، يرجى إعادة التسجيل" });
                return;
            }
            if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                res.status(401).json({ message: "توكن غير صحيح" });
                return;
            }
            console.error("خطأ في المصادقة:", err);
            res.status(500).json({ message: "خطأ داخلي في الخادم" });
        }
    });
};
exports.authenticate = authenticate;
