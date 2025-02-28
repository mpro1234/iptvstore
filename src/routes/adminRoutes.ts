import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { addAdmin, deleteAdmin } from "../controllers/adminController";

const router = express.Router();

// إضافة أدمن جديد (متاح فقط للسوبر أدمن)
router.post("/add-admin", authenticate("super-admin"), addAdmin);

// حذف أدمن (متاح فقط للسوبر أدمن)
router.delete(
  "/delete-admin/:adminId",
  authenticate("super-admin"),
  deleteAdmin
);

export default router;
