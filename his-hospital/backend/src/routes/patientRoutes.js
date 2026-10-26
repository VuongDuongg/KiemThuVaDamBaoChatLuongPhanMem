import { Router } from "express";
import {
  searchPatients,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from "../controllers/patientController.js";

const router = Router();

// GET /api/patients/search - Tìm kiếm và lọc bệnh nhân
router.get("/search", searchPatients);

// GET /api/patients - Lấy toàn bộ danh sách bệnh nhân
router.get("/", getAllPatients);

// GET /api/patients/:id - Lấy chi tiết bệnh nhân
router.get("/:id", getPatientById);

// POST /api/patients - Tiếp đón & thêm mới bệnh nhân
router.post("/", createPatient);

// PUT /api/patients/:id - Cập nhật hồ sơ bệnh nhân
router.put("/:id", updatePatient);

// DELETE /api/patients/:id - Xóa hồ sơ bệnh nhân
router.delete("/:id", deletePatient);

export default router;
