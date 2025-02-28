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
exports.getProductRatings = exports.addRating = void 0;
const Rating_1 = __importDefault(require("../models/Rating"));
// إضافة تقييم لمنتج
const addRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, rating, comment } = req.body;
        const newRating = new Rating_1.default({
            userId,
            productId,
            rating,
            comment,
        });
        yield newRating.save();
        res
            .status(201)
            .json({ message: "Rating added successfully", rating: newRating });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.addRating = addRating;
// عرض تقييمات منتج معين
const getProductRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const ratings = yield Rating_1.default.find({ productId }).populate("userId");
        res.status(200).json({ ratings });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProductRatings = getProductRatings;
