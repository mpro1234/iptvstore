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
exports.getCommentStats = exports.getBlogComments = exports.getProductComments = exports.addBlogComment = exports.addProductComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
// إضافة تعليق على منتج
const addProductComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, text, productId, createdAt } = req.body;
        const newComment = new Comment_1.default({
            userId,
            text,
            productId,
            createdAt,
        });
        yield newComment.save();
        res.status(201).json({
            message: "Comment added to product successfully",
            comment: newComment,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addProductComment = addProductComment;
// إضافة تعليق على مقالة
const addBlogComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, text, blogId, createdAt } = req.body;
        const newComment = new Comment_1.default({
            userId,
            text,
            blogId,
            createdAt,
        });
        yield newComment.save();
        res.status(201).json({
            message: "Comment added to blog successfully",
            comment: newComment,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addBlogComment = addBlogComment;
// عرض تعليقات منتج
const getProductComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const comments = yield Comment_1.default.find({ productId }).populate("userId");
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProductComments = getProductComments;
// عرض تعليقات مقالة
const getBlogComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { blogId } = req.params;
        const comments = yield Comment_1.default.find({ blogId }).populate("userId");
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getBlogComments = getBlogComments;
const getCommentStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalComments = yield Comment_1.default.countDocuments();
        const productComments = yield Comment_1.default.countDocuments({
            productId: { $exists: true },
        });
        const blogComments = yield Comment_1.default.countDocuments({
            blogId: { $exists: true },
        });
        res.status(200).json({
            totalComments,
            productComments,
            blogComments,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCommentStats = getCommentStats;
