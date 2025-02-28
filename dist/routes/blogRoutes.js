"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const blogController_1 = require("../controllers/blogController");
const router = express_1.default.Router();
// إنشاء مقالة جديدة (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", (0, authMiddleware_1.authenticate)("admin"), blogController_1.createBlog);
// تعديل مقالة موجودة (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:blogId", (0, authMiddleware_1.authenticate)("admin"), blogController_1.updateBlog);
// حذف مقالة (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:blogId", (0, authMiddleware_1.authenticate)("admin"), blogController_1.deleteBlog);
// إضافة تعليق إلى مقالة (متاح للعملاء)
router.post("/comment/:blogId", (0, authMiddleware_1.authenticate)("user"), blogController_1.addCommentToBlog);
// الحصول على مقالة واحدة
router.get("/:id", blogController_1.getBlogById);
// زيادة عداد المشاهدات
router.patch("/views/:id", blogController_1.incrementViews);
router.get("/", blogController_1.getAllBlogs); // <-- أضف هذا السطر
router.get("/all", blogController_1.getAllBlogs);
exports.default = router;
