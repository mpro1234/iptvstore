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
exports.deleteAdmin = exports.addAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
// إضافة أدمن جديد بواسطة السوبر أدمن
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // التحقق مما إذا كان المستخدم موجودًا بالفعل
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Admin already exists" });
            return;
        }
        // إنشاء الأدمن الجديد
        const newAdmin = new User_1.default({
            email,
            password, // يجب تشفيرها قبل الحفظ
            role: "admin",
        });
        yield newAdmin.save();
        res.status(201).json({ message: "Admin added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addAdmin = addAdmin;
// حذف أدمن بواسطة السوبر أدمن
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        // التحقق مما إذا كان الأدمن موجودًا
        const admin = yield User_1.default.findById(adminId);
        if (!admin || admin.role !== "admin") {
            res.status(400).json({ message: "Admin not found" });
            return;
        }
        // حذف الأدمن
        yield User_1.default.findByIdAndDelete(adminId);
        res.status(200).json({ message: "Admin deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteAdmin = deleteAdmin;
