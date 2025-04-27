import { Request, Response } from "express";
import Ad from "../models/Ad";
import mongoose from "mongoose";

// تغيير نوع الدوال لتتوافق مع توقعات Express
export const getAllAds = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: ads });
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في جلب الإعلانات" });
  }
};

export const createAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { imageUrl, link } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "غير مصرح" });
      return; // إرجاع void بدلاً من Response
    }

    const ad = new Ad({
      imageUrl,
      link,
      createdBy: userId,
    });
    await ad.save();
    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: "فشل في إنشاء الإعلان" });
  }
};

// تطبيق نفس التغييرات على باقي الدوال (updateAd و deleteAd)
export const updateAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adId } = req.params;
    const updates = req.body;

    const updated = await Ad.findByIdAndUpdate(adId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ success: false, message: "الإعلان غير موجود" });
      return; // إرجاع void
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "فشل في تحديث الإعلان" });
  }
};

export const deleteAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adId } = req.params;
    const deleted = await Ad.findByIdAndDelete(adId);

    if (!deleted) {
      res.status(404).json({ success: false, message: "الإعلان غير موجود" });
      return; // إرجاع void
    }

    res.json({ success: true, message: "تم حذف الإعلان" });
  } catch (error) {
    res.status(500).json({ success: false, message: "فشل في حذف الإعلان" });
  }
};
