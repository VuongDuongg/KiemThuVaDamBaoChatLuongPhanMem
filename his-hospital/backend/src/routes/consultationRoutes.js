import express from "express";
import dayjs from "dayjs";
import { mockMedicines } from "./medicineRoutes.js";
import { mockInvoices } from "./invoiceRoutes.js";

const router = express.Router();

// Mock in-memory consultations (Bệnh án điện tử EMR của TV3)
let mockConsultations = [
  {
    id: 1,
    encounter_id: 1,
    patient_code: "BN000001",
    patient_name: "Nguyễn Văn An",
    gender: "Nam",
    birth_date: "15/05/1990",
    doctor: "BS. Trần Văn Bình",
    department: "Khoa Nội",
    vitals: {
      blood_pressure: "120/80",
      pulse: 78,
      temperature: 36.8,
      spo2: 98
    },
    symptoms: "Đau đầu từng cơn vùng trán, sốt nhẹ về chiều, mệt mỏi 2 ngày nay.",
    icd10_code: "J00",
    icd10_name: "Viêm mũi họng cấp tính [cảm thường]",
    treatment_plan: "Nghỉ ngơi, bù nước điện giải, uống thuốc hạ sốt giảm đau khi sốt trên 38.5 độ.",
    status: "COMPLETED",
    prescriptions: [
      { medicine_code: "MED001", medicine_name: "Paracetamol 500mg", quantity: 10, dosage: "Uống 1 viên/lần khi đau đầu hoặc sốt >= 38.5C, cách nhau 4-6h." },
      { medicine_code: "MED006", medicine_name: "Vitamin C 500mg", quantity: 10, dosage: "Uống 1 viên/ngày sau bữa ăn sáng." }
    ],
    lab_orders: [],
    created_at: dayjs().subtract(1, "day").format("DD/MM/YYYY HH:mm")
  },
  {
    id: 2,
    encounter_id: 2,
    patient_code: "BN000002",
    patient_name: "Trần Thị Bích",
    gender: "Nữ",
    birth_date: "20/11/1985",
    doctor: "BS. Nguyễn Văn Hùng",
    department: "Khoa Ngoại",
    vitals: {
      blood_pressure: "115/75",
      pulse: 82,
      temperature: 37.0,
      spo2: 99
    },
    symptoms: "Ngã chống tay phải, đau chói và sưng nề nhẹ vùng cổ tay phải.",
    icd10_code: "S60.2",
    icd10_name: "Đụng giập các phần khác của cổ tay và bàn tay",
    treatment_plan: "Chỉ định chụp X-quang khớp cổ tay để loại trừ gãy xương, cố định tạm thời.",
    status: "WAITING_LAB", // Đang chờ kết quả cận lâm sàng
    prescriptions: [],
    lab_orders: [
      { order_code: "CLS001", service_name: "Chụp X-quang khớp cổ tay thẳng nghiêng", status: "COMPLETED", result: "Không thấy hình ảnh gãy hay trật khớp cổ tay." }
    ],
    created_at: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm")
  }
];

// GET /api/consultations - Danh sách hồ sơ bệnh án
router.get("/", (req, res) => {
  const { patient_code, status } = req.query;
  let results = [...mockConsultations];

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
});

// POST /api/consultations - Bác sĩ tạo / cập nhật hồ sơ khám bệnh
router.post("/", (req, res) => {
  const {
    patient_code,
    patient_name,
    gender,
    birth_date,
    doctor,
    department,
    vitals,
    symptoms,
    icd10_code,
    icd10_name,
    treatment_plan
  } = req.body;

  if (!patient_code || !symptoms || !icd10_code) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ mã bệnh nhân, triệu chứng và mã chẩn đoán ICD-10!"
    });
  }

  // Validate vitals
  if (vitals) {
    if (vitals.pulse && (vitals.pulse < 30 || vitals.pulse > 220)) {
      return res.status(400).json({
        success: false,
        message: "Chỉ số mạch không hợp lệ (giới hạn sinh lý: 30 - 220 chu kỳ/phút)!"
      });
    }
    if (vitals.temperature && (vitals.temperature < 34 || vitals.temperature > 43)) {
      return res.status(400).json({
        success: false,
        message: "Thân nhiệt không hợp lệ (giới hạn sinh lý: 34.0°C - 43.0°C)!"
      });
    }
    if (vitals.spo2 && (vitals.spo2 < 50 || vitals.spo2 > 100)) {
      return res.status(400).json({
        success: false,
        message: "Chỉ số SpO2 phải từ 50% đến 100%!"
      });
    }
  }

  const newId = mockConsultations.length > 0 ? Math.max(...mockConsultations.map((c) => c.id)) + 1 : 1;
  const newConsultation = {
    id: newId,
    encounter_id: newId,
    patient_code,
    patient_name: patient_name || "Bệnh nhân",
    gender: gender || "Nam",
    birth_date: birth_date || "01/01/1990",
    doctor: doctor || "BS. Điều trị",
    department: department || "Khoa Nội",
    vitals: vitals || { blood_pressure: "120/80", pulse: 80, temperature: 36.5, spo2: 98 },
    symptoms,
    icd10_code: icd10_code.toUpperCase(),
    icd10_name: icd10_name || `Bệnh lý mã ${icd10_code}`,
    treatment_plan: treatment_plan || "Điều trị ngoại trú theo đơn thuốc.",
    status: "IN_PROGRESS",
    prescriptions: [],
    lab_orders: [],
    created_at: dayjs().format("DD/MM/YYYY HH:mm")
  };

  mockConsultations.unshift(newConsultation);
  res.status(201).json({
    success: true,
    message: "Lưu hồ sơ khám bệnh lâm sàng thành công!",
    data: newConsultation
  });
});

// POST /api/consultations/:id/prescribe - Kê đơn thuốc
router.post("/:id/prescribe", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const consultation = mockConsultations.find((c) => c.id === id);

  if (!consultation) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ bệnh án!" });
  }

  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Đơn thuốc phải có ít nhất một loại thuốc!" });
  }

  // Validate items
  let totalMedicineAmount = 0;
  for (const item of items) {
    if (!item.medicine_code || !item.quantity || Number(item.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số lượng từng loại thuốc kê đơn phải là số nguyên dương lớn hơn 0!"
      });
    }

    const medInStock = mockMedicines.find((m) => m.medicine_code === item.medicine_code);
    if (medInStock) {
      if (medInStock.stock_quantity < Number(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Thuốc ${medInStock.medicine_name} trong kho không đủ (chỉ còn ${medInStock.stock_quantity} ${medInStock.unit})!`
        });
      }
      totalMedicineAmount += medInStock.unit_price * Number(item.quantity);
      // Giảm trừ số lượng tồn kho
      medInStock.stock_quantity -= Number(item.quantity);
    }
  }

  consultation.prescriptions = items;
  consultation.status = "COMPLETED";

  // Tự động tạo hóa đơn tiền thuốc gửi sang TV2 (Thu ngân)
  const newInvoiceId = mockInvoices.length > 0 ? Math.max(...mockInvoices.map((i) => i.id)) + 1 : 1;
  mockInvoices.unshift({
    id: newInvoiceId,
    invoice_code: `HD${String(newInvoiceId).padStart(6, "0")}`,
    patient_code: consultation.patient_code,
    patient_name: consultation.patient_name,
    item_type: "TIEN_THUOC",
    description: `Đơn thuốc điều trị: ${consultation.icd10_name}`,
    total_amount: totalMedicineAmount,
    insurance_discount: Math.round(totalMedicineAmount * 0.2), // Hỗ trợ BHYT 20%
    patient_pay: Math.round(totalMedicineAmount * 0.8),
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  });

  res.json({
    success: true,
    message: `Đã hoàn tất kê ${items.length} loại thuốc và tạo hóa đơn tiền thuốc gửi sang Thu ngân!`,
    data: consultation
  });
});

export default router;
export { mockConsultations };
