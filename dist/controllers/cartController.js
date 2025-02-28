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
exports.getCartCount = exports.getCart = exports.addToCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
// controllers/cartController.ts
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { productId, quantity } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }
        let cart = yield Cart_1.default.findOne({ userId });
        if (!cart) {
            cart = new Cart_1.default({
                userId,
                products: [],
            });
        }
        const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity || 1;
        }
        else {
            cart.products.push({ productId, quantity: quantity || 1 });
        }
        yield cart.save();
        // حساب العدد الإجمالي للكميات
        const totalCount = cart.products.reduce((sum, p) => sum + p.quantity, 0);
        res.status(200).json({ success: true, totalCount });
        return;
    }
    catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: "خطأ في الخادم" });
        return;
    }
});
exports.addToCart = addToCart;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }
        const cart = yield Cart_1.default.findOne({ userId }).populate("products.productId", "name price image");
        const products = (cart === null || cart === void 0 ? void 0 : cart.products.map((p) => ({
            productId: p.productId._id.toString(),
            name: p.productId.name,
            price: p.productId.price,
            quantity: p.quantity, // لن يظهر الخطأ هنا الآن
            image: p.productId.image,
        }))) || [];
        res.status(200).json({ products });
    }
    catch (error) {
        next(error);
        console.error(error);
        res.status(500).json({ message: "خطأ في الخادم" });
    }
});
exports.getCart = getCart;
// controllers/cartController.ts
const getCartCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }
        const cart = yield Cart_1.default.findOne({ userId });
        const count = (cart === null || cart === void 0 ? void 0 : cart.products.reduce((sum, p) => sum + p.quantity, 0)) || 0;
        res.json({ count });
        return;
    }
    catch (error) {
        next(error);
        res.status(500).json({ message: "خطأ في الخادم" });
        return;
    }
});
exports.getCartCount = getCartCount;
