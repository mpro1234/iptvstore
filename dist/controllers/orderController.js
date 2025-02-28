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
exports.getWeeklyOrders = exports.getMonthlyRevenue = exports.getOrderStats = exports.updateOrderStatus = exports.getOrderDetails = exports.getAllOrders = exports.createOrder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
// إنشاء طلب جديد
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, products, totalPrice } = req.body;
        const newOrder = new Order_1.default({
            userId,
            products,
            totalPrice,
            status: "completed",
        });
        yield newOrder.save();
        // حذف السلة بعد إنشاء الطلب
        yield Cart_1.default.findOneAndDelete({ userId });
        res.status(201).json({
            message: "تم إنشاء الطلب بنجاح",
            order: newOrder,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            message: "بيانات الطلب غير صحيحة",
        });
    }
});
exports.createOrder = createOrder;
// عرض جميع الطلبات (للمسؤول)
const getAllOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find().populate("products.productId");
        res.status(200).json({ orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllOrders = getAllOrders;
const getOrderDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }
        const { id } = req.params;
        // التحقق من صحة معرف الطلب
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "معرّف طلب غير صالح" });
            return;
        }
        const order = yield Order_1.default.findById(id)
            .populate("userId", "name email")
            .populate("products.productId", "name price image");
        if (!order) {
            res.status(404).json({ message: "الطلب غير موجود" });
            return;
        }
        // السماح للمشرفين بالوصول إلى أي طلب
        if (user.role !== "admin" && user.role !== "super-admin") {
            const orderUserId = order.userId._id.toString();
            if (orderUserId !== user.userId) {
                res.status(403).json({ message: "غير مصرح بالوصول لهذا الطلب" });
                return;
            }
        }
        // إعداد بيانات الطلب المرجعة
        const orderDetails = {
            _id: order._id,
            userId: {
                name: order.userId.name,
                email: order.userId.email,
            },
            products: order.products.map((item) => ({
                productId: {
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    image: item.productId.image,
                },
                quantity: item.quantity,
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
        res.status(200).json(orderDetails);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في الخادم" });
    }
});
exports.getOrderDetails = getOrderDetails;
// تحديث حالة الطلب (للمسؤول)
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const updatedOrder = yield Order_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const getOrderStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // الإحصائيات الأساسية
        const totalOrders = yield Order_1.default.countDocuments();
        const totalRevenueResult = yield Order_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]);
        const totalRevenue = ((_a = totalRevenueResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // الإيرادات الشهرية
        const monthlyRevenue = yield Order_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalPrice" },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { month: "$_id", revenue: 1, _id: 0 } },
        ]);
        res.status(200).json({
            totalOrders,
            totalRevenue,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            monthlyRevenue,
        });
    }
    catch (error) {
        console.error("إحصائيات الطلبات - الخطأ:", error);
        res.status(500).json({ message: "خطأ في الخادم" });
    }
});
exports.getOrderStats = getOrderStats;
// تقرير الإيرادات الشهرية
const getMonthlyRevenue = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monthlyRevenue = yield Order_1.default.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.status(200).json({ monthlyRevenue });
    }
    catch (error) {
        console.error("الإيرادات الشهرية - الخطأ:", error);
        res.status(500).json({ message: "خطأ في الخادم" });
    }
});
exports.getMonthlyRevenue = getMonthlyRevenue;
// تقرير الطلبات الأسبوعية
const getWeeklyOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const weeklyOrders = yield Order_1.default.aggregate([
            {
                $group: {
                    _id: { $week: "$createdAt" }, // تجميع حسب الأسبوع
                    totalOrders: { $sum: 1 }, // حساب عدد الطلبات
                },
            },
            {
                $sort: { _id: 1 }, // ترتيب حسب الأسبوع
            },
        ]);
        res.status(200).json({ weeklyOrders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getWeeklyOrders = getWeeklyOrders;
