"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const serverController_1 = require("../controllers/serverController");
const router = express_1.default.Router();
// إنشاء سيرفر جديد (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", (0, authMiddleware_1.authenticate)("admin"), serverController_1.createServer);
// تعديل سيرفر موجود (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:serverId", (0, authMiddleware_1.authenticate)("admin"), serverController_1.updateServer);
// حذف سيرفر (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:serverId", (0, authMiddleware_1.authenticate)("admin"), serverController_1.deleteServer);
// عرض جميع السيرفرات (متاح للجميع)
router.get("/all", serverController_1.getAllServers);
exports.default = router;
