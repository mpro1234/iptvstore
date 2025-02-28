import express from "express";
import { register, login } from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getUserStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// Endpoint لتسجيل مستخدم جديد
router.post("/register", register);

// Endpoint لتسجيل الدخول
router.post("/login", login);

router.get("/stats", authenticate("admin"), getUserStats);

// جلب جميع المستخدمين (متاح فقط لـ super-admin)
router.get("/all", authenticate("super-admin"), getAllUsers);

// إنشاء مستخدم جديد (متاح فقط لـ super-admin)
router.post("/create", authenticate("super-admin"), createUser);

// تحديث مستخدم موجود (متاح فقط لـ super-admin)
router.put("/update/:id", authenticate("super-admin"), updateUser);

// حذف مستخدم (متاح فقط لـ super-admin)
router.delete("/delete/:id", authenticate("super-admin"), deleteUser);
export default router;
