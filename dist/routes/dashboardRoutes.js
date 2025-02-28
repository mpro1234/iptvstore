"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
// Route للحصول على بيانات لوحة التحكم
router.get("/dashboard", (0, authMiddleware_1.authenticate)("super-admin"), dashboardController_1.getDashboard);
exports.default = router;
