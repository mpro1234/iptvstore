import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

// إحصائيات المستخدمين
export const getUserStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const superAdmins = await User.countDocuments({ role: "super-admin" });

    res.status(200).json({
      totalUsers,
      admins,
      superAdmins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password"); // استبعاد كلمة المرور
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين." });
  }
};

// إنشاء مستخدم جديد
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل." });
      return;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({ message: "تم إنشاء المستخدم بنجاح.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء إنشاء المستخدم." });
  }
};

// تحديث مستخدم موجود
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;

    // التحقق من وجود المستخدم
    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ message: "المستخدم غير موجود." });
       return;
    }

    // تحديث البيانات
    user.name = name;
    user.email = email;
    user.role = role;

    // تحديث كلمة المرور إذا تم إرسالها
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "تم تحديث المستخدم بنجاح.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تحديث المستخدم." });
  }
};

// حذف مستخدم
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // التحقق من وجود المستخدم
    const user = await User.findById(userId);
    if (!user) {
       res.status(404).json({ message: "المستخدم غير موجود." });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "تم حذف المستخدم بنجاح." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم." });
  }
};