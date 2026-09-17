import express from "express";
import {
  getLabServices,
  getLabOrders,
  getLabOrderById,
  createLabOrder,
  startLabOrder,
  updateLabResult
} from "../controllers/labController.js";

const router = express.Router();

// GET /api/lab/services - Danh mục dịch vụ Cận lâm sàng
router.get("/services", getLabServices);

// GET /api/lab/orders - Hàng đợi chỉ định CLS & PACS
router.get("/orders", getLabOrders);

// GET /api/lab/orders/:id - Chi tiết chỉ định CLS
router.get("/orders/:id", getLabOrderById);

// POST /api/lab/orders - Tạo chỉ định CLS mới
router.post("/orders", createLabOrder);

// POST /api/lab/orders/:id/start - Kỹ thuật viên bắt đầu thực hiện ca CLS
router.post("/orders/:id/start", startLabOrder);

// POST & PUT /api/lab/orders/:id/results - Kỹ thuật viên nhập kết quả CLS
router.post("/orders/:id/results", updateLabResult);
router.put("/orders/:id/results", updateLabResult);
router.put("/orders/:id/result", updateLabResult);

export default router;
