import { patientService } from "../services/patientService.js";

// GET /api/patients/search: Tìm kiếm và lọc bệnh nhân
export const searchPatients = (req, res) => {
  try {
    const data = patientService.searchPatients(req.query);
    return res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
      errors: error.validationErrors
    });
  }
};

// GET /api/patients: Lấy toàn bộ danh sách bệnh nhân
export const getAllPatients = (req, res) => {
  try {
    const data = patientService.getAllPatients();
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/patients/:id: Lấy chi tiết 1 bệnh nhân
export const getPatientById = (req, res) => {
  try {
    const data = patientService.getPatientById(req.params.id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/patients: Thêm mới bệnh nhân
export const createPatient = (req, res) => {
  try {
    const newPatient = patientService.createPatient(req.body);
    res.status(201).json({
      success: true,
      message: "Tiếp đón bệnh nhân thành công",
      data: newPatient
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// PUT /api/patients/:id: Cập nhật thông tin bệnh nhân
export const updatePatient = (req, res) => {
  try {
    const updated = patientService.updatePatient(req.params.id, req.body);
    res.json({
      success: true,
      message: "Cập nhật hồ sơ bệnh nhân thành công",
      data: updated
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// DELETE /api/patients/:id: Xóa hồ sơ bệnh nhân
export const deletePatient = (req, res) => {
  try {
    const deleted = patientService.deletePatient(req.params.id);
    res.json({
      success: true,
      message: `Đã xóa bệnh nhân ${deleted.name} (${deleted.patient_code}) khỏi hệ thống`,
      data: deleted
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};
