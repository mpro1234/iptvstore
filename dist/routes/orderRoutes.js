"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
// إنشاء طلب جديد
router.post("/create", (0, authMiddleware_1.authenticate)("user"), orderController_1.createOrder);
// عرض جميع الطلبات (متاح فقط للسوبر أدمن والأدمن)
router.get("/all", (0, authMiddleware_1.authenticate)("admin"), orderController_1.getAllOrders);
// تحديث حالة الطلب (متاح فقط للسوبر أدمن والأدمن)
router.put("/update-status/:orderId", (0, authMiddleware_1.authenticate)("admin"), orderController_1.updateOrderStatus);
router.get("/stats", (0, authMiddleware_1.authenticate)("admin"), orderController_1.getOrderStats);
router.get("/:id", (0, authMiddleware_1.authenticate)("user"), orderController_1.getOrderDetails);
router.get("/reports/monthly-revenue", (0, authMiddleware_1.authenticate)("admin"), orderController_1.getMonthlyRevenue);
// تقرير الطلبات الأسبوعية (متاح فقط للسوبر أدمن والأدمن)
router.get("/reports/weekly-orders", (0, authMiddleware_1.authenticate)("admin"), orderController_1.getWeeklyOrders);
exports.default = router;
