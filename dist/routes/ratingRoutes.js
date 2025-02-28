"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = require("../controllers/ratingController");
const router = express_1.default.Router();
// إضافة تقييم لمنتج
router.post("/add", ratingController_1.addRating);
// عرض تقييمات منتج معين
router.get("/:productId", ratingController_1.getProductRatings);
exports.default = router;
