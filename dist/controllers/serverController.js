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
exports.getAllServers = exports.deleteServer = exports.updateServer = exports.createServer = void 0;
const Server_1 = __importDefault(require("../models/Server"));
// إنشاء سيرفر جديد
const createServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, image } = req.body;
        // التحقق من وجود المستخدم الذي أنشأ السيرفر
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
        if (!userId) {
            res.status(400).json({ message: "المستخدم غير موجود." });
            return;
        }
        // إنشاء السيرفر
        const server = new Server_1.default({
            name,
            description,
            image,
            createdBy: userId,
        });
        yield server.save();
        res.status(201).json({ message: "تم إنشاء السيرفر بنجاح.", server });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء السيرفر." });
    }
});
exports.createServer = createServer;
// تعديل سيرفر موجود
const updateServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const updates = req.body;
        const updatedServer = yield Server_1.default.findByIdAndUpdate(serverId, updates, {
            new: true,
        });
        if (!updatedServer) {
            res.status(404).json({ message: "Server not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Server updated successfully", server: updatedServer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateServer = updateServer;
// حذف سيرفر
const deleteServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const deletedServer = yield Server_1.default.findByIdAndDelete(serverId);
        if (!deletedServer) {
            res.status(404).json({ message: "Server not found" });
            return;
        }
        res.status(200).json({ message: "Server deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteServer = deleteServer;
// عرض جميع السيرفرات
const getAllServers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servers = yield Server_1.default.find().populate("createdBy"); // جلب بيانات المستخدم الذي أنشأ السيرفر
        res.status(200).json({ servers });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب السيرفرات." });
    }
});
exports.getAllServers = getAllServers;
