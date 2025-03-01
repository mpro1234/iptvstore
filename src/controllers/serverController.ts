import { Request, Response } from "express";
import Server from "../models/Server";
import mongoose from "mongoose";

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
    const server = await Server.findById(serverId).populate(
      "createdBy",
      "username email"
    );

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
export const updateServer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { serverId } = req.params;
    const updates = req.body;

    const updatedServer = await Server.findByIdAndUpdate(serverId, updates, {
      new: true,
    });
    if (!updatedServer) {
      res.status(404).json({ message: "Server not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Server updated successfully", server: updatedServer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
