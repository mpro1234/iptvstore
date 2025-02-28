import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// جلب جميع المستخدمين (متاح فقط لـ super-admin)
router.get('/all', authenticate('super-admin'), getAllUsers);

// إنشاء مستخدم جديد (متاح فقط لـ super-admin)
router.post('/create', authenticate('super-admin'), createUser);

// تحديث مستخدم موجود (متاح فقط لـ super-admin)
router.put('/update/:id', authenticate('super-admin'), updateUser);

// حذف مستخدم (متاح فقط لـ super-admin)
router.delete('/delete/:id', authenticate('super-admin'), deleteUser);

export default router;