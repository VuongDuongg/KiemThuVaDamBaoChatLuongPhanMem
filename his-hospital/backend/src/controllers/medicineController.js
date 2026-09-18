import { medicineService } from "../services/medicineService.js";

// GET /api/medicines - Danh mục thuốc & Kho dược
export const getMedicines = (req, res) => {
  try {
    const data = medicineService.getMedicines(req.query);
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/medicines/:id - Chi tiết thuốc
export const getMedicineById = (req, res) => {
  try {
    const data = medicineService.getMedicineById(req.params.id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/medicines - Thêm thuốc mới vào kho
export const createMedicine = (req, res) => {
  try {
    const newMed = medicineService.createMedicine(req.body);
    res.status(201).json({
      success: true,
      message: "Thêm mới thuốc vào kho thành công",
      data: newMed
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// PUT /api/medicines/:id - Cập nhật thông tin / tồn kho thuốc
export const updateMedicine = (req, res) => {
  try {
    const updated = medicineService.updateMedicine(req.params.id, req.body);
    res.json({
      success: true,
      message: "Cập nhật thuốc thành công",
      data: updated
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// DELETE /api/medicines/:id - Xóa thuốc khỏi kho
export const deleteMedicine = (req, res) => {
  try {
    const deleted = medicineService.deleteMedicine(req.params.id);
    res.json({
      success: true,
      message: `Đã xóa thuốc ${deleted.medicine_name} khỏi kho`,
      data: deleted
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};
