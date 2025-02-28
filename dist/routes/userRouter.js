"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// جلب جميع المستخدمين (متاح فقط لـ super-admin)
router.get('/all', (0, authMiddleware_1.authenticate)('super-admin'), userController_1.getAllUsers);
// إنشاء مستخدم جديد (متاح فقط لـ super-admin)
router.post('/create', (0, authMiddleware_1.authenticate)('super-admin'), userController_1.createUser);
// تحديث مستخدم موجود (متاح فقط لـ super-admin)
router.put('/update/:id', (0, authMiddleware_1.authenticate)('super-admin'), userController_1.updateUser);
// حذف مستخدم (متاح فقط لـ super-admin)
router.delete('/delete/:id', (0, authMiddleware_1.authenticate)('super-admin'), userController_1.deleteUser);
exports.default = router;
