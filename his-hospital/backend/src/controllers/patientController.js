import { globalData } from "../data/seedData.js";
import { validatePatientSearchParams, parseAndValidateDate } from "../validators/patientValidator.js";

// GET /api/patients/search: Tìm kiếm và lọc bệnh nhân
export const searchPatients = (req, res) => {
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

  // 2. Lọc theo điều kiện kết hợp (AND logic)
  const filtered = globalData.patients.filter((p) => {
    if (name && name.trim()) {
      if (!p.name.toLowerCase().includes(name.trim().toLowerCase())) return false;
    }
    if (identity_card_number && identity_card_number.trim()) {
      if (!p.identity_card_number.includes(identity_card_number.trim())) return false;
    }
    if (phone && phone.trim()) {
      if (!p.phone.includes(phone.trim())) return false;
    }
    if (patient_code && patient_code.trim()) {
      if (!p.patient_code.toUpperCase().includes(patient_code.trim().toUpperCase())) return false;
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
};

// GET /api/patients: Lấy toàn bộ danh sách bệnh nhân
export const getAllPatients = (req, res) => {
  res.json({
    success: true,
    total: globalData.patients.length,
    data: globalData.patients
  });
};

// GET /api/patients/:id: Lấy chi tiết 1 bệnh nhân
export const getPatientById = (req, res) => {
  const { id } = req.params;
  const patient = globalData.patients.find(
    (p) => String(p.id) === String(id) || p.patient_code === id
  );

  if (!patient) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
  }

  res.json({
    success: true,
    data: patient
  });
};

// POST /api/patients: Thêm mới bệnh nhân
export const createPatient = (req, res) => {
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

  const nextIndex = globalData.patients.length + 1;
  const newPatient = {
    id: nextIndex,
    patient_code: `BN2026${String(nextIndex).padStart(4, "0")}`,
    name: name.trim(),
    gender: gender || "Nam",
    birth_date: birth_date || "01/01/2000",
    phone: phone.trim(),
    identity_card_number: identity_card_number.trim(),
    department: department || "Khoa Nội Tổng Hợp",
    doctor: "BS. Chưa chỉ định",
    reception_date: new Date().toLocaleDateString("vi-VN"),
    status: "Chờ khám",
    address: address || "Hà Nội",
    symptoms: symptoms || "Đăng ký khám mới"
  };

  globalData.patients.unshift(newPatient);

  res.status(201).json({
    success: true,
    message: "Tiếp đón bệnh nhân thành công",
    data: newPatient
  });
};

// PUT /api/patients/:id: Cập nhật thông tin bệnh nhân
export const updatePatient = (req, res) => {
  const { id } = req.params;
  const patientIndex = globalData.patients.findIndex(
    (p) => String(p.id) === String(id) || p.patient_code === id
  );

  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
  }

  const existing = globalData.patients[patientIndex];
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

  globalData.patients[patientIndex] = updatedPatient;

  res.json({
    success: true,
    message: "Cập nhật hồ sơ bệnh nhân thành công",
    data: updatedPatient
  });
};

// DELETE /api/patients/:id: Xóa hồ sơ bệnh nhân
export const deletePatient = (req, res) => {
  const { id } = req.params;
  const patientIndex = globalData.patients.findIndex(
    (p) => String(p.id) === String(id) || p.patient_code === id
  );

  if (patientIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh nhân" });
  }

  const deleted = globalData.patients.splice(patientIndex, 1)[0];
  res.json({
    success: true,
    message: `Đã xóa bệnh nhân ${deleted.name} (${deleted.patient_code}) khỏi hệ thống`,
    data: deleted
  });
};
