import { consultationService } from "../services/consultationService.js";

// GET /api/consultations - Danh sách hồ sơ bệnh án
export const getConsultations = (req, res) => {
  try {
    const data = consultationService.getConsultations(req.query);
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/consultations/:id - Chi tiết 1 hồ sơ bệnh án
export const getConsultationById = (req, res) => {
  try {
    const data = consultationService.getConsultationById(req.params.id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/consultations - Bác sĩ tạo / cập nhật hồ sơ khám bệnh lâm sàng
export const createConsultation = (req, res) => {
  try {
    const newConsultation = consultationService.createConsultation(req.body);
    res.status(201).json({
      success: true,
      message: "Lưu hồ sơ khám bệnh thành công",
      data: newConsultation
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// POST /api/consultations/:id/prescribe - Bác sĩ kê đơn thuốc
export const addPrescription = (req, res) => {
  try {
    const updatedConsultation = consultationService.addPrescription(req.params.id, req.body.items);
    res.json({
      success: true,
      message: "Kê đơn thuốc thành công và sinh hóa đơn viện phí",
      data: updatedConsultation
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};
