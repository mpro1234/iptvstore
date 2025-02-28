"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// إضافة تعليق على منتج
router.post("/product/add", commentController_1.addProductComment);
// عرض تعليقات منتج
router.get("/product/:productId", commentController_1.getProductComments);
// إضافة تعليق على مقالة
router.post("/blog/add", commentController_1.addBlogComment);
// عرض تعليقات مقالة
router.get("/blog/:blogId", commentController_1.getBlogComments);
router.get("/stats", (0, authMiddleware_1.authenticate)("admin"), commentController_1.getCommentStats);
exports.default = router;
