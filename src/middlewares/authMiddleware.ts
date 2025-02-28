import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // عنوان الـ Frontend
  })
);

// واجهة للبيانات التي يتم إرجاعها من JWT
export interface IDecodedToken {
  userId: string;
  role: "user" | "admin" | "super-admin";
  iat: number;
  exp: number;
  // إضافة حقول إضافية إذا لزم
  email?: string;
}
// توسيع واجهة Request لإضافة خاصية user
declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken; // استخدام النوع الصحيح هنا
    }
  }
}


// Middleware للمصادقة
export const authenticate = (
  requiredRole: "user" | "admin" | "super-admin"
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // التحقق من وجود التوكن في headers أو cookies
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.token;

      if (!token) {
         res.status(401).json({ message: "مطلوب مصادقة للوصول" });
         return;
      }

      // فك تشفير التوكن مع معالجة الأخطاء التفصيلية
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IDecodedToken;

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
    } catch (err) {
      // معالجة أنواع الأخطاء المختلفة
      if (err instanceof jwt.TokenExpiredError) {
         res
          .status(401)
          .json({ message: "انتهت صلاحية الجلسة، يرجى إعادة التسجيل" });
          return;
      }

      if (err instanceof jwt.JsonWebTokenError) {
         res.status(401).json({ message: "توكن غير صحيح" });
         return;
      }

      console.error("خطأ في المصادقة:", err);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  };
};
