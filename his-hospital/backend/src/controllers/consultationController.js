import dayjs from "dayjs";
import { globalData } from "../data/seedData.js";

// GET /api/consultations - Danh sách hồ sơ bệnh án
export const getConsultations = (req, res) => {
  const { patient_code, status } = req.query;
  let results = [...globalData.consultations];

  if (patient_code) {
    results = results.filter((c) =>
      c.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
    );
  }
  if (status) {
    results = results.filter((c) => c.status === status);
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
};

// GET /api/consultations/:id - Chi tiết 1 hồ sơ bệnh án
export const getConsultationById = (req, res) => {
  const { id } = req.params;
  const consultation = globalData.consultations.find(
    (c) => String(c.id) === String(id) || c.patient_code === id
  );

  if (!consultation) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh án" });
  }

  res.json({
    success: true,
    data: consultation
  });
};

// POST /api/consultations - Bác sĩ tạo / cập nhật hồ sơ khám bệnh lâm sàng
export const createConsultation = (req, res) => {
  const {
    patient_code,
    patient_name,
    gender,
    birth_date,
    doctor = "BS. Lê Hoàng Nam",
    department = "Khoa Nội",
    vitals,
    symptoms,
    icd10_code,
    icd10_name,
    doctor_notes,
    treatment_plan
  } = req.body;

  if (!patient_code || !symptoms || !icd10_code) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin bệnh nhân, triệu chứng và mã chẩn đoán ICD-10"
    });
  }

  // Validate vitals
  if (vitals) {
    if (vitals.blood_pressure && !/^\d{2,3}\/\d{2,3}$/.test(vitals.blood_pressure.trim())) {
      return res.status(400).json({ success: false, message: "Huyết áp phải có định dạng chuẩn (VD: 120/80)" });
    }
    if (vitals.pulse !== undefined && (vitals.pulse < 30 || vitals.pulse > 200)) {
      return res.status(400).json({ success: false, message: "Mạch đập phải từ 30 đến 200 lần/phút" });
    }
    if (vitals.temperature !== undefined && (vitals.temperature < 34.0 || vitals.temperature > 43.0)) {
      return res.status(400).json({ success: false, message: "Thân nhiệt không hợp lệ (phải từ 34.0°C đến 43.0°C)" });
    }
    if (vitals.spo2 !== undefined && (vitals.spo2 < 50 || vitals.spo2 > 100)) {
      return res.status(400).json({ success: false, message: "SpO2 phải từ 50% đến 100%" });
    }
  }

  const nextIndex = globalData.consultations.length + 1;
  const newConsultation = {
    id: nextIndex,
    encounter_id: nextIndex,
    patient_code,
    patient_name: patient_name || "Bệnh nhân",
    gender: gender || "Nam",
    birth_date: birth_date || "01/01/1990",
    doctor,
    department,
    vitals: vitals || { blood_pressure: "120/80", pulse: 80, temperature: 37, spo2: 98 },
    symptoms,
    icd10_code,
    icd10_name: icd10_name || "Bệnh lý chung",
    doctor_notes: doctor_notes || "",
    treatment_plan: treatment_plan || "Điều trị ngoại trú",
    status: "COMPLETED",
    prescriptions: [],
    lab_orders: [],
    created_at: dayjs().format("DD/MM/YYYY HH:mm")
  };

  globalData.consultations.unshift(newConsultation);

  const p = globalData.patients.find((pt) => pt.patient_code === patient_code);
  if (p) {
    p.status = "Đã khám";
    p.doctor = doctor;
  }

  res.status(201).json({
    success: true,
    message: "Lưu hồ sơ khám bệnh thành công",
    data: newConsultation
  });
};

// POST /api/consultations/:id/prescribe - Bác sĩ kê đơn thuốc
export const addPrescription = (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  const consultation = globalData.consultations.find(
    (c) => String(c.id) === String(id) || c.patient_code === id
  );

  if (!consultation) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh án" });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Đơn thuốc phải có ít nhất một loại thuốc" });
  }

  let totalCost = 0;
  for (const item of items) {
    const qty = Number(item.quantity);
    if (!qty || qty <= 0) {
      return res.status(400).json({ success: false, message: "Số lượng thuốc phải là số nguyên dương" });
    }

    const med = globalData.medicines.find(
      (m) => m.id === item.medicine_id || m.medicine_code === item.medicine_code
    );

    if (med && med.stock_quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Số lượng thuốc trong kho không đủ cho ${med.medicine_name} (còn ${med.stock_quantity})`
      });
    }

    const unitPrice = med ? med.unit_price : 2000;
    item.unit_price = unitPrice;
    totalCost += unitPrice * qty;

    if (med) {
      med.stock_quantity -= qty;
    }
  }

  consultation.prescriptions = items;
  consultation.status = "COMPLETED";

  // Tạo hóa đơn tiền thuốc
  const nextInvId = globalData.invoices.length + 1;
  const medInvoice = {
    id: nextInvId,
    invoice_code: `HDT${String(nextInvId).padStart(6, "0")}`,
    patient_code: consultation.patient_code,
    patient_name: consultation.patient_name,
    item_type: "TIEN_THUOC",
    description: `Đơn thuốc điều trị BS. ${consultation.doctor}`,
    total_amount: totalCost,
    insurance_discount: 0,
    patient_pay: totalCost,
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  };

  globalData.invoices.unshift(medInvoice);

  const p = globalData.patients.find((pt) => pt.patient_code === consultation.patient_code);
  if (p) {
    p.status = "Chờ thanh toán";
  }

  res.json({
    success: true,
    message: "Kê đơn thuốc thành công và sinh hóa đơn viện phí",
    data: consultation
  });
};
