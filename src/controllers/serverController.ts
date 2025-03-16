import { Request, Response } from "express";
import Server from "../models/Server";
import mongoose from "mongoose";
import { pick } from 'lodash';

// إنشاء سيرفر جديد
export const createServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, image } = req.body;
    const userId = req.user?.userId;

    // 1. التحقق من وجود userId وصحته
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
       res.status(400).json({ 
        success: false,
        message: "بيانات المستخدم غير صالحة" 
      });
      return;
    }

    // 2. تحويل userId إلى ObjectId
    const createdBy = new mongoose.Types.ObjectId(userId);

    // 3. إنشاء السيرفر مع القيم الصحيحة
    const server = new Server({
      name,
      description,
      image,
      createdBy, // الآن نوعه ObjectId
    });

    await server.save();

    res.status(201).json({
      success: true,
      message: "تم إنشاء السيرفر بنجاح",
      data: server
    });
  } catch (error) {
    console.error("خطأ في إنشاء السيرفر:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء إنشاء السيرفر"
    });
  }
};

// تحديث السيرفر
export const updateServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(serverId)) {
      res.status(400).json({ message: "معرّف السيرفر غير صالح" });
      return;
    }

    const allowedUpdates = ['name', 'description', 'image', 'displayType', 'columns'];
    const updates = pick(req.body, allowedUpdates);

    if (updates.columns && ![2, 3, 4].includes(updates.columns)) {
      res.status(400).json({ message: "عدد الأعمدة المسموح به: 2، 3، أو 4" });
      return;
    }

    const updatedServer = await Server.findByIdAndUpdate(
      serverId,
      updates,
      { new: true, runValidators: true }
    ).populate("products");

    if (!updatedServer) {
      res.status(404).json({ message: "لم يتم العثور على السيرفر" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "تم تحديث السيرفر بنجاح",
      data: updatedServer
    });
  } catch (error) {
    console.error("خطأ في تحديث السيرفر:", error);
    res.status(500).json({
      success: false,
      message: "فشل في تحديث السيرفر"
    });
  }
};

// إضافة منتج للسيرفر
export const addProductToServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId, productId } = req.params;

    [serverId, productId].forEach(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "المعرّف غير صالح" });
        return;
      }
    });

    const server = await Server.findByIdAndUpdate(
      serverId,
      { $addToSet: { products: productId } },
      { new: true }
    ).populate("products");

    if (!server) {
      res.status(404).json({ message: "لم يتم العثور على السيرفر" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "تمت إضافة المنتج بنجاح",
      data: server
    });
  } catch (error) {
    console.error("خطأ في إضافة المنتج:", error);
    res.status(500).json({
      success: false,
      message: "فشل في إضافة المنتج"
    });
  }
};

// حذف السيرفر
export const deleteServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
      res.status(400).json({ message: "معرّف السيرفر غير صالح" });
      return;
    }

    const deletedServer = await Server.findByIdAndDelete(serverId);

    if (!deletedServer) {
      res.status(404).json({ message: "لم يتم العثور على السيرفر" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "تم حذف السيرفر بنجاح"
    });
  } catch (error) {
    console.error("خطأ في حذف السيرفر:", error);
    res.status(500).json({
      success: false,
      message: "فشل في حذف السيرفر"
    });
  }
};

// الحصول على جميع السيرفرات
export const getAllServers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const servers = await Server.find()
      .populate("createdBy", "username email")
      .populate({
        path: "products",
        select: "name price image",
        options: { limit: 10 }
      });

    res.status(200).json({
      success: true,
      count: servers.length,
      data: servers
    });
  } catch (error) {
    console.error("خطأ في جلب السيرفرات:", error);
    res.status(500).json({
      success: false,
      message: "فشل في جلب السيرفرات"
    });
  }
};

// الحصول على سيرفر بواسطة ID
export const getServerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serverId)) {
      res.status(400).json({ message: "معرّف السيرفر غير صالح" });
      return;
    }

    const server = await Server.findById(serverId)
      .populate("createdBy", "username email")
      .populate({
        path: "products",
        select: "name price image description",
        options: { limit: 20 }
      });

    if (!server) {
      res.status(404).json({ message: "لم يتم العثور على السيرفر" });
      return;
    }

    res.status(200).json({
      success: true,
      data: server
    });
  } catch (error) {
    console.error("خطأ في جلب السيرفر:", error);
    res.status(500).json({
      success: false,
      message: "فشل في جلب بيانات السيرفر"
    });
  }
};
