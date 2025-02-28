"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/cartRoutes.ts
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/add", (0, authMiddleware_1.authenticate)("user"), cartController_1.addToCart);
router.get("/", (0, authMiddleware_1.authenticate)("user"), cartController_1.getCart);
router.get("/count", (0, authMiddleware_1.authenticate)("user"), cartController_1.getCartCount);
exports.default = router;
