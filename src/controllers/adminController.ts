import { Request, Response } from "express";
import User, { IUser } from "../models/User";

// إضافة أدمن جديد بواسطة السوبر أدمن
export const addAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // التحقق مما إذا كان المستخدم موجودًا بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    // إنشاء الأدمن الجديد
    const newAdmin = new User({
      email,
      password, // يجب تشفيرها قبل الحفظ
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// حذف أدمن بواسطة السوبر أدمن
export const deleteAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { adminId } = req.params;

    // التحقق مما إذا كان الأدمن موجودًا
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      res.status(400).json({ message: "Admin not found" });
      return;
    }

    // حذف الأدمن
    await User.findByIdAndDelete(adminId);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
