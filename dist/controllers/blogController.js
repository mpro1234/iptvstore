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
exports.incrementViews = exports.getAllBlogs = exports.getBlogById = exports.addCommentToBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
// إنشاء مقالة جديدة
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, image, createdBy, createdAt, category, excerpt, featured, } = req.body;
        const user = yield User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId); // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
            return;
        }
        const newBlog = new Blog_1.default({
            title,
            content,
            image,
            comments: [],
            createdBy: user._id,
            createdAt,
            category,
            excerpt,
            featured,
        });
        yield newBlog.save();
        res
            .status(201)
            .json({ message: "Blog created successfully", blog: newBlog });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createBlog = createBlog;
// تعديل مقالة موجودة
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        const updates = req.body;
        const updatedBlog = yield Blog_1.default.findByIdAndUpdate(blogId, updates, {
            new: true,
        });
        if (!updatedBlog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Blog updated successfully", blog: updatedBlog });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateBlog = updateBlog;
// حذف مقالة
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        const deletedBlog = yield Blog_1.default.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteBlog = deleteBlog;
const addCommentToBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { blogId } = req.params;
        const { text } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "غير مصرح" });
            return;
        }
        const blog = yield Blog_1.default.findById(blogId);
        if (!blog) {
            res.status(404).json({ message: "المقالة غير موجودة" });
            return;
        }
        // إضافة التعليق مع التاريخ التلقائي
        blog.comments.push({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            text,
            createdAt: new Date(), // <-- سيتم تعبئته تلقائيًا من المخطط
        });
        yield blog.save();
        const updatedBlog = yield Blog_1.default.findById(blogId).populate("comments.userId", "name avatarUrl");
        res.status(200).json(updatedBlog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
}); // الحصول على مقالة واحدة مع populate بيانات المؤلف
exports.addCommentToBlog = addCommentToBlog;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id)
            .populate("createdBy", "name email avatarUrl")
            .populate("comments.userId", "name avatarUrl");
        if (!blog) {
            res.status(404).json({ message: "المقالة غير موجودة" });
            return;
        }
        res.status(200).json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
});
exports.getBlogById = getBlogById;
// الحصول على المقالات مع الترقيم والفرز
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;
        const blogs = yield Blog_1.default.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name');
        const total = yield Blog_1.default.countDocuments();
        res.status(200).json({
            blogs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBlogs: total
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
});
exports.getAllBlogs = getAllBlogs;
// زيادة عدد المشاهدات
const incrementViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!blog) {
            res.status(404).json({ message: "المقالة غير موجودة" });
            return;
        }
        res.status(200).json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "خطأ في السيرفر" });
    }
});
exports.incrementViews = incrementViews;
