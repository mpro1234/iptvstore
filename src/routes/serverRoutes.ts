import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createServer,
  updateServer,
  deleteServer,
  getAllServers,
  addProductToServer,
  getServerById,
} from "../controllers/serverController";

const router = express.Router();

// إنشاء سيرفر جديد (متاح فقط للسوبر أدمن والأدمن)
router.post("/create", authenticate("admin"), createServer);

// تعديل سيرفر موجود (متاح فقط للسوبر أدمن والأدمن)
router.put("/update/:serverId", authenticate("admin"), updateServer);

// حذف سيرفر (متاح فقط للسوبر أدمن والأدمن)
router.delete("/delete/:serverId", authenticate("admin"), deleteServer);

// عرض جميع السيرفرات (متاح للجميع)
router.get("/all", getAllServers);

router.put(
  "/:serverId/add-product/:productId",
  authenticate("admin"),
  addProductToServer
);
router.get("/:serverId", getServerById);

export default router;
