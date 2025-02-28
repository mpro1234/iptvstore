"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // يمكن أن يحتوي على HTML للتنسيق
    image: { type: String, required: true },
    comments: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }, // ربط مع نموذج المستخدم
            text: { type: String, required: true }, // نص التعليق
            createdAt: { type: Date, default: Date.now }, // <-- أضف هذا
        },
    ],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }, // الشخص الذي أنشأ المنتج
    createdAt: { type: Date, default: Date.now },
    excerpt: { type: String, required: true, maxlength: 160 },
    category: { type: String, required: true },
    authorName: { type: String }, // يمكن جلبها من نموذج المستخدم
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
});
exports.default = mongoose_1.default.model("Blog", blogSchema);
