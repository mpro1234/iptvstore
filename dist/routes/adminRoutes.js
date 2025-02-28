"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// إضافة أدمن جديد (متاح فقط للسوبر أدمن)
router.post("/add-admin", (0, authMiddleware_1.authenticate)("super-admin"), adminController_1.addAdmin);
// حذف أدمن (متاح فقط للسوبر أدمن)
router.delete("/delete-admin/:adminId", (0, authMiddleware_1.authenticate)("super-admin"), adminController_1.deleteAdmin);
exports.default = router;
