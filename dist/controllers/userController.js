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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = exports.getUserStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// إحصائيات المستخدمين
const getUserStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.default.countDocuments();
        const admins = yield User_1.default.countDocuments({ role: "admin" });
        const superAdmins = yield User_1.default.countDocuments({ role: "super-admin" });
        res.status(200).json({
            totalUsers,
            admins,
            superAdmins,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserStats = getUserStats;
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find().select("-password"); // استبعاد كلمة المرور
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين." });
    }
});
exports.getAllUsers = getAllUsers;
// إنشاء مستخدم جديد
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        // التحقق من وجود المستخدم
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل." });
            return;
        }
        // تشفير كلمة المرور
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // إنشاء المستخدم
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role,
        });
        yield user.save();
        res.status(201).json({ message: "تم إنشاء المستخدم بنجاح.", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء المستخدم." });
    }
});
exports.createUser = createUser;
// تحديث مستخدم موجود
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const userId = req.params.id;
        // التحقق من وجود المستخدم
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
            return;
        }
        // تحديث البيانات
        user.name = name;
        user.email = email;
        user.role = role;
        // تحديث كلمة المرور إذا تم إرسالها
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        yield user.save();
        res.status(200).json({ message: "تم تحديث المستخدم بنجاح.", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء تحديث المستخدم." });
    }
});
exports.updateUser = updateUser;
// حذف مستخدم
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        // التحقق من وجود المستخدم
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
        }
        yield User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "تم حذف المستخدم بنجاح." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم." });
    }
});
exports.deleteUser = deleteUser;
