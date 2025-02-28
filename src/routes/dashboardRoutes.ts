import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const router = express.Router();

// Route للحصول على بيانات لوحة التحكم
router.get("/dashboard", authenticate("super-admin"), getDashboard);

export default router;
