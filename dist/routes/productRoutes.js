"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// إنشاء منتج جديد (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", (0, authMiddleware_1.authenticate)("admin"), productController_1.createProduct);
// تعديل منتج موجود (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:productId", (0, authMiddleware_1.authenticate)("admin"), productController_1.updateProduct);
// حذف منتج (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:productId", (0, authMiddleware_1.authenticate)("admin"), productController_1.deleteProduct);
// عرض جميع المنتجات (متاح للجميع)
router.get("/all", productController_1.getAllProducts);
router.get("/filter", productController_1.filterProducts);
router.get("/search", productController_1.searchProducts);
router.get("/offers", productController_1.getOfferedProducts);
// routes/productRoutes.ts
router.get('/:id', productController_1.getProductById); // <-- بدون أقواس إضافية
exports.default = router;
