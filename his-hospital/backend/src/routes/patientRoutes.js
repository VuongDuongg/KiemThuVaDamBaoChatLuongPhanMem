import { Router } from "express";
import { mockPatients, setMockPatients } from "../data/mockPatients.js";
import { validatePatientSearchParams, parseAndValidateDate } from "../validators/patientValidator.js";

const router = Router();

// GET /api/patients/search: Tìm kiếm và lọc bệnh nhân
router.get("/search", (req, res) => {
  const {
    name,
    identity_card_number,
    phone,
    patient_code,
    from_date,
    to_date,
    department,
    status,
    gender
  } = req.query;

  // 1. Kiểm tra tính hợp lệ của tham số đầu vào
  const validation = validatePatientSearchParams(req.query);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu tìm kiếm không hợp lệ",
      errors: validation.errors
    });
  }

  // 2. Kiểm tra nếu tất cả các tiêu chí đều trống -> Trả về mặc định hôm nay
  const isAllEmpty =
    (!name || name.trim() === "") &&
    (!identity_card_number || identity_card_number.trim() === "") &&
    (!phone || phone.trim() === "") &&
    (!patient_code || patient_code.trim() === "") &&
    (!from_date || from_date.trim() === "") &&
    (!to_date || to_date.trim() === "") &&
    (!department || department === "Tất cả") &&
    (!status || status === "Tất cả") &&
    (!gender || gender === "Tất cả");

  if (isAllEmpty) {
    const todayPatients = mockPatients.filter((p) => p.reception_date === "16/09/2026");
    return res.json({
      success: true,
      message: "Danh sách bệnh nhân tiếp nhận trong ngày",
      total: todayPatients.length,
      data: todayPatients
    });
  }

  // 3. Tiến hành lọc theo điều kiện kết hợp (AND logic)
  const filtered = mockPatients.filter((p) => {
    if (name && name.trim()) {
      if (!p.name.toLowerCase().includes(name.trim().toLowerCase())) return false;
    }
    if (identity_card_number && identity_card_number.trim()) {
      if (p.identity_card_number !== identity_card_number.trim()) return false;
    }
    if (phone && phone.trim()) {
      if (p.phone !== phone.trim()) return false;
    }
    if (patient_code && patient_code.trim()) {
      if (p.patient_code.toUpperCase() !== patient_code.trim().toUpperCase()) return false;
    }
    if (department && department !== "Tất cả") {
      if (p.department !== department) return false;
    }
    if (status && status !== "Tất cả") {
      if (p.status !== status) return false;
    }
    if (gender && gender !== "Tất cả") {
      if (p.gender !== gender) return false;
    }
    if (from_date && from_date.trim()) {
      const fDate = parseAndValidateDate(from_date);
      const pDate = parseAndValidateDate(p.reception_date);
      if (pDate && fDate && pDate < fDate) return false;
    }
    if (to_date && to_date.trim()) {
      const tDate = parseAndValidateDate(to_date);
      const pDate = parseAndValidateDate(p.reception_date);
      if (pDate && tDate && pDate > tDate) return false;
    }
    return true;
  });

  return res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

// GET /api/patients: Lấy toàn bộ danh sách bệnh nhân
router.get("/", (req, res) => {
  res.json({
    success: true,
    total: mockPatients.length,
    data: mockPatients
  });
});

// POST /api/patients: Thêm mới bệnh nhân
router.post("/", (req, res) => {
  const { name, gender, birth_date, phone, identity_card_number, department, address, symptoms } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Họ và tên bắt buộc và tối thiểu 2 ký tự" });
  }
  if (!identity_card_number || !/^\d{12}$/.test(identity_card_number.trim())) {
    return res.status(400).json({ success: false, message: "Số CCCD phải gồm đúng 12 chữ số" });
  }
  if (!phone || !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
    return res.status(400).json({ success: false, message: "Số điện thoại phải 10 số đầu mạng VN hợp lệ" });
  }

  const nextIndex = mockPatients.length + 1;
  const newPatient = {
    id: "P" + String(nextIndex).padStart(3, "0"),
    patient_code: "BN" + String(nextIndex).padStart(6, "0"),
    name: name.trim(),
    gender: gender || "Nam",
    birth_date: birth_date || "01/01/1990",
    phone: phone.trim(),
    identity_card_number: identity_card_number.trim(),
    department: department || "Khoa Nội",
    reception_date: "16/09/2026",
    status: "Chờ khám",
    address: address || "Hà Nội",
    symptoms: symptoms || "Khám ban đầu"
  };

  mockPatients.unshift(newPatient);

  res.status(201).json({
    success: true,
    message: "Tiếp đón bệnh nhân thành công",
    data: newPatient
  });
});

// PUT /api/patients/:id: Cập nhật thông tin bệnh nhân
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const patientIndex = mockPatients.findIndex((p) => p.id === id || p.patient_code === id);

  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
  }

  const existing = mockPatients[patientIndex];
  const { name, gender, birth_date, phone, identity_card_number, department, status, address, symptoms } = req.body;

  if (name && name.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Họ và tên phải có ít nhất 2 ký tự" });
  }
  if (identity_card_number && !/^\d{12}$/.test(identity_card_number.trim())) {
    return res.status(400).json({ success: false, message: "Số CCCD phải gồm đúng 12 chữ số" });
  }
  if (phone && !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
    return res.status(400).json({ success: false, message: "Số điện thoại 10 số đầu mạng VN hợp lệ" });
  }

  const updatedPatient = {
    ...existing,
    ...(name && { name: name.trim() }),
    ...(gender && { gender }),
    ...(birth_date && { birth_date }),
    ...(phone && { phone: phone.trim() }),
    ...(identity_card_number && { identity_card_number: identity_card_number.trim() }),
    ...(department && { department }),
    ...(status && { status }),
    ...(address && { address }),
    ...(symptoms && { symptoms })
  };

  mockPatients[patientIndex] = updatedPatient;

  res.json({
    success: true,
    message: "Cập nhật hồ sơ bệnh nhân thành công",
    data: updatedPatient
  });
});

// DELETE /api/patients/:id: Xóa hồ sơ bệnh nhân
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const patientIndex = mockPatients.findIndex((p) => p.id === id || p.patient_code === id);

  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
  }

  const deleted = mockPatients.splice(patientIndex, 1)[0];
  res.json({
    success: true,
    message: `Đã xóa bệnh nhân ${deleted.name} (${deleted.patient_code}) khỏi hệ thống`,
    data: deleted
  });
});

export default router;
