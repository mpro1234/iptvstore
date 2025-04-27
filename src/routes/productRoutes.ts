import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  filterProducts,
  searchProducts,
  getProductById,
  getOfferedProducts,
  getProductsByServer,
} from "../controllers/productController";

const router = express.Router();

// إنشاء منتج جديد (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", authenticate("admin"), createProduct);

// تعديل منتج موجود (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:productId", authenticate("admin"), updateProduct);

// حذف منتج (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:productId", authenticate("admin"), deleteProduct);

// عرض جميع المنتجات (متاح للجميع)
router.get("/all", getAllProducts);
router.get("/server/:serverId", getProductsByServer);      // ← هنا

router.get("/filter", filterProducts);

router.get("/search", searchProducts);
router.get("/offers", getOfferedProducts);

// routes/productRoutes.ts

router.get('/:id', getProductById); // <-- بدون أقواس إضافية
export default router;
