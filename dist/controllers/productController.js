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
exports.getOfferedProducts = exports.getProductById = exports.searchProducts = exports.filterProducts = exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Server_1 = __importDefault(require("../models/Server"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// إنشاء منتج جديد
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, server, price, discountedPrice, image, createdAt, } = req.body;
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId); // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
            return;
        }
        // التحقق من وجود السيرفر
        const serverExists = yield Server_1.default.findById(server);
        if (!serverExists) {
            res.status(404).json({ message: "السيرفر غير موجود." });
            return;
        }
        const newProduct = new Product_1.default({
            name,
            description,
            server: server,
            price,
            discountedPrice,
            image,
            comments: [],
            createdBy: user._id,
            createdAt,
        });
        yield newProduct.save();
        res
            .status(201)
            .json({ message: "Product created successfully", product: newProduct });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createProduct = createProduct;
// تعديل منتج موجود
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const updates = req.body;
        // التحقق من صحة البيانات عند تفعيل العرض
        if (updates.isOnOffer) {
            if (!updates.discountedPrice ||
                updates.discountedPrice >= updates.price) {
                res.status(400).json({ message: "سعر العرض غير صالح" });
                return;
            }
        }
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(productId, updates, {
            new: true,
        });
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateProduct = updateProduct;
// حذف منتج
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const deletedProduct = yield Product_1.default.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
// عرض جميع المنتجات
const getAllProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllProducts = getAllProducts;
// فلترة المنتجات
const filterProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minPrice, maxPrice, serverType } = req.query;
        const query = {};
        if (minPrice)
            query.price = { $gte: parseFloat(minPrice) };
        if (maxPrice)
            query.price = Object.assign(Object.assign({}, query.price), { $lte: parseFloat(maxPrice) });
        if (serverType)
            query.serverType = serverType;
        const products = yield Product_1.default.find(query);
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.filterProducts = filterProducts;
// البحث عن منتجات
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            res.status(400).json({ message: 'Query parameter is required' });
            return;
        }
        const products = yield Product_1.default.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // بحث بالاسم
                { description: { $regex: query, $options: 'i' } }, // بحث بالوصف
            ],
        });
        res.status(200).json({ products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.searchProducts = searchProducts;
// الحصول على منتج بواسطة الـ ID
// controllers/productController.ts
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // <-- تغيير نوع الإرجاع إلى void
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "معرّف غير صالح" });
            return; // <-- إضافة return لتجنب تنفيذ الكود التالي
        }
        const product = yield Product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "المنتج غير موجود" });
            return; // <-- إضافة return هنا أيضًا
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
});
exports.getProductById = getProductById;
const getOfferedProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({
            isOnOffer: true,
            offerExpiry: { $gt: new Date() },
        });
        res.status(200).json({ products });
    }
    catch (error) {
        // ... معالجة الأخطاء
    }
});
exports.getOfferedProducts = getOfferedProducts;
