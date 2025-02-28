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
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const uploadController_1 = require("../controllers/uploadController");
const router = express_1.default.Router();
// Route لرفع الصور
router.post("/upload", uploadMiddleware_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            throw new Error("No file uploaded");
        const { url } = yield (0, uploadController_1.uploadImage)(req.file);
        res.json({ imageUrl: url });
    }
    catch (error) {
        const err = error; // تحويل نوع الخطأ
        res.status(500).json({ error: err.message });
    }
}));
exports.default = router;
