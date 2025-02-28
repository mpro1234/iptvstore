import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// تسجيل مستخدم جديد
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone } = req.body;
    // التحقق من وجود الحقول المطلوبة
    if (!name || !email || !password || !phone) {
       res.status(400).json({ message: "جميع الحقول مطلوبة" });
       return;
    }
    // التحقق مما إذا كان المستخدم موجودًا بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم الجديد
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,

      role: role || "user", // الافتراضي هو "user"
    });

    await newUser.save();

    // إنشاء JWT Token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// تسجيل الدخول
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
      return;
    }

    // التحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
      return;
    }

    // إنشاء JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول." });
  }
};


