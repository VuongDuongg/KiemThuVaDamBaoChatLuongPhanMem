import express from "express";
import {
  getConsultations,
  getConsultationById,
  createConsultation,
  addPrescription
} from "../controllers/consultationController.js";

const router = express.Router();

// GET /api/consultations - Danh sách hồ sơ bệnh án EMR
router.get("/", getConsultations);

// GET /api/consultations/:id - Chi tiết 1 bệnh án EMR
router.get("/:id", getConsultationById);

// POST /api/consultations - Tạo / cập nhật hồ sơ khám bệnh lâm sàng
router.post("/", createConsultation);

// POST /api/consultations/:id/prescribe - Bác sĩ kê đơn thuốc
router.post("/:id/prescribe", addPrescription);

export default router;
