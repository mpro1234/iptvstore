import { Request, Response } from "express";
import Server from "../models/Server";
import mongoose from "mongoose";

// إنشاء سيرفر جديد
export const createServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, image } = req.body;

    // التحقق من وجود المستخدم الذي أنشأ السيرفر
    const userId = req.user?.userId; // افترض أن `req.user` يحتوي على بيانات المستخدم الحالي
    if (!userId) {
      res.status(400).json({ message: "المستخدم غير موجود." });
      return;
    }

    // إنشاء السيرفر
    const server = new Server({
      name,
      description,
      image,
      createdBy: userId,
    });

    await server.save();

    res.status(201).json({ message: "تم إنشاء السيرفر بنجاح.", server });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء السيرفر." });
  }
};

// تعديل سيرفر موجود
// controllers/serverController.ts
export const updateServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;
    const updates = req.body;

    // التحقق من صلاحية عدد الأعمدة
    if (updates.columns && ![2, 3, 4].includes(updates.columns)) {
      res.status(400).json({ message: "عدد الأعمدة المسموح به: 2، 3، أو 4" });
      return;
    }

    const updatedServer = await Server.findByIdAndUpdate(serverId, updates, {
      new: true,
    }).populate("products");

    if (!updatedServer) {
      res.status(404).json({ message: "السيرفر غير موجود" });
      return;
    }

    res.status(200).json({
      message: "تم تحديث السيرفر بنجاح",
      server: updatedServer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};
// دالة جديدة لإضافة منتج للسيرفر
export const addProductToServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId, productId } = req.params;

    const server = await Server.findByIdAndUpdate(
      serverId,
      { $addToSet: { products: productId } },
      { new: true }
    );

    if (!server) {
      res.status(404).json({ message: "السيرفر غير موجود" });
      return;
    }

    res.status(200).json({
      message: "تمت إضافة المنتج للسيرفر",
      server,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// حذف سيرفر
export const deleteServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;

    const deletedServer = await Server.findByIdAndDelete(serverId);
    if (!deletedServer) {
      res.status(404).json({ message: "Server not found" });
      return;
    }

    res.status(200).json({ message: "Server deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// عرض جميع السيرفرات
export const getAllServers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const servers = await Server.find().populate("createdBy"); // جلب بيانات المستخدم الذي أنشأ السيرفر
    res.status(200).json({ servers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب السيرفرات." });
  }
};

export const getServerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;

    // التحقق من صحة الـ ID
    if (!mongoose.Types.ObjectId.isValid(serverId)) {
      res.status(400).json({ message: "معرّف السيرفر غير صالح" });
      return;
    }

    // البحث عن السيرفر مع تضمين بيانات المستخدم المنشئ
    const server = await Server.findById(serverId)
      .populate("createdBy", "username email")
      .populate({
        path: "products",
        model: "Product",
        select: "name price image",
      });

    if (!server) {
      res.status(404).json({ message: "لم يتم العثور على السيرفر" });
      return;
    }

    res.status(200).json({
      message: "تم جلب بيانات السيرفر بنجاح",
      server: {
        _id: server._id,
        name: server.name,
        description: server.description,
        image: server.image,
        createdBy: server.createdBy,
        createdAt: server.createdAt,
      },
    });
  } catch (error) {
    console.error("خطأ في جلب السيرفر:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات السيرفر" });
  }
};
