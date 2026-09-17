import express from "express";
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine
} from "../controllers/medicineController.js";

const router = express.Router();

// GET /api/medicines - Danh mục thuốc & kho dược
router.get("/", getMedicines);

// GET /api/medicines/:id - Chi tiết thuốc
router.get("/:id", getMedicineById);

// POST /api/medicines - Thêm mới thuốc vào kho
router.post("/", createMedicine);

// PUT /api/medicines/:id - Cập nhật thông tin thuốc / số lượng tồn kho
router.put("/:id", updateMedicine);

// DELETE /api/medicines/:id - Xóa thuốc khỏi kho
router.delete("/:id", deleteMedicine);

export default router;
