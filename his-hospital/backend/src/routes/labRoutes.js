import express from "express";
import dayjs from "dayjs";
import { mockConsultations } from "./consultationRoutes.js";
import { mockInvoices } from "./invoiceRoutes.js";

const router = express.Router();

// Danh mục dịch vụ Cận lâm sàng
const labServices = [
  { id: 1, service_code: "CLS_XN_MAU", service_name: "Tổng phân tích tế bào máu ngoại vi (18 thông số)", type: "LAB", price: 120000 },
  { id: 2, service_code: "CLS_XN_SINHHOA", service_name: "Định lượng Glucose & Ure máu", type: "LAB", price: 80000 },
  { id: 3, service_code: "CLS_XQUANG_PHOI", service_name: "Chụp X-quang tim phổi thẳng", type: "PACS", price: 180000 },
  { id: 4, service_code: "CLS_XQUANG_XUONG", service_name: "Chụp X-quang xương khớp tư thế thẳng nghiêng", type: "PACS", price: 200000 },
  { id: 5, service_code: "CLS_SIEUAM_BUNG", service_name: "Siêu âm ổ bụng tổng quát", type: "PACS", price: 220000 },
  { id: 6, service_code: "CLS_DIENTIM", service_name: "Điện tâm đồ (ECG 12 chuyển đạo)", type: "LAB", price: 90000 }
];

// Mock in-memory lab orders (Phiếu chỉ định cận lâm sàng TV4)
let mockLabOrders = [
  {
    id: 1,
    order_code: "CLS000001",
    consultation_id: 2,
    patient_code: "BN000002",
    patient_name: "Trần Thị Bích",
    doctor: "BS. Nguyễn Văn Hùng",
    technician: "KTV. Đặng Quốc Việt",
    service_code: "CLS_XQUANG_XUONG",
    service_name: "Chụp X-quang xương khớp tư thế thẳng nghiêng",
    type: "PACS",
    price: 200000,
    status: "COMPLETED", // PENDING, PROCESSING, COMPLETED
    payment_status: "PAID",
    results: {
      image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60",
      findings: "Cấu trúc xương cổ tay và các ngón tay liên tục, không thấy đường gãy xương. Khe khớp bình thường, không trật khớp.",
      conclusion: "Hình ảnh X-quang khớp cổ tay phải trong giới hạn bình thường."
    },
    created_at: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm"),
    completed_at: dayjs().subtract(100, "minute").format("DD/MM/YYYY HH:mm")
  },
  {
    id: 2,
    order_code: "CLS000002",
    consultation_id: 1,
    patient_code: "BN000001",
    patient_name: "Nguyễn Văn An",
    doctor: "BS. Trần Văn Bình",
    technician: null,
    service_code: "CLS_XN_MAU",
    service_name: "Tổng phân tích tế bào máu ngoại vi (18 thông số)",
    type: "LAB",
    price: 120000,
    status: "PROCESSING",
    payment_status: "PAID",
    results: {
      parameters: [
        { param: "Bạch cầu (WBC)", value: 11.8, unit: "G/L", normal_range: "4.0 - 10.0", alert: "HIGH" },
        { param: "Hồng cầu (RBC)", value: 4.6, unit: "T/L", normal_range: "3.8 - 5.5", alert: "NORMAL" },
        { param: "Huyết sắc tố (Hb)", value: 142, unit: "g/L", normal_range: "120 - 160", alert: "NORMAL" },
        { param: "Tiểu cầu (PLT)", value: 245, unit: "G/L", normal_range: "150 - 400", alert: "NORMAL" }
      ],
      conclusion: "Tăng nhẹ bạch cầu, phù hợp với phản ứng viêm cấp tính."
    },
    created_at: dayjs().subtract(1, "hour").format("DD/MM/YYYY HH:mm"),
    completed_at: null
  },
  {
    id: 3,
    order_code: "CLS000003",
    consultation_id: 3,
    patient_code: "BN000003",
    patient_name: "Lê Hoàng Long",
    doctor: "BS. Lê Thị Dung",
    technician: null,
    service_code: "CLS_XQUANG_PHOI",
    service_name: "Chụp X-quang tim phổi thẳng",
    type: "PACS",
    price: 180000,
    status: "PENDING",
    payment_status: "PAID",
    results: null,
    created_at: dayjs().subtract(20, "minute").format("DD/MM/YYYY HH:mm"),
    completed_at: null
  }
];

// GET /api/lab/services - Danh mục dịch vụ
router.get("/services", (req, res) => {
  res.json({ success: true, data: labServices });
});

// GET /api/lab/orders - Hàng đợi chỉ định cận lâm sàng
router.get("/orders", (req, res) => {
  const { status, type, patient_code } = req.query;
  let results = [...mockLabOrders];

  if (status && status !== "ALL") {
    results = results.filter((o) => o.status === status);
  }
  if (type && type !== "ALL") {
    results = results.filter((o) => o.type === type);
  }
  if (patient_code) {
    results = results.filter((o) =>
      o.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// POST /api/lab/orders - Bác sĩ chỉ định cận lâm sàng
router.post("/orders", (req, res) => {
  const { patient_code, patient_name, doctor, service_code, consultation_id } = req.body;

  const service = labServices.find((s) => s.service_code === service_code);
  if (!service) {
    return res.status(400).json({ success: false, message: "Mã dịch vụ cận lâm sàng không tồn tại!" });
  }

  const newId = mockLabOrders.length > 0 ? Math.max(...mockLabOrders.map((o) => o.id)) + 1 : 1;
  const order_code = `CLS${String(newId).padStart(6, "0")}`;

  const newOrder = {
    id: newId,
    order_code,
    consultation_id: consultation_id || null,
    patient_code: patient_code || "BN000001",
    patient_name: patient_name || "Bệnh nhân",
    doctor: doctor || "BS. Chỉ định",
    technician: null,
    service_code: service.service_code,
    service_name: service.service_name,
    type: service.type,
    price: service.price,
    status: "PENDING",
    payment_status: "UNPAID",
    results: null,
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    completed_at: null
  };

  mockLabOrders.unshift(newOrder);

  // Tự động tạo hóa đơn tiền dịch vụ CLS sang Thu ngân TV2
  const newInvoiceId = mockInvoices.length > 0 ? Math.max(...mockInvoices.map((i) => i.id)) + 1 : 1;
  mockInvoices.unshift({
    id: newInvoiceId,
    invoice_code: `HD${String(newInvoiceId).padStart(6, "0")}`,
    patient_code: newOrder.patient_code,
    patient_name: newOrder.patient_name,
    item_type: "CAN_LAM_SANG",
    description: `Chỉ định CLS: ${service.service_name}`,
    total_amount: service.price,
    insurance_discount: Math.round(service.price * 0.2),
    patient_pay: Math.round(service.price * 0.8),
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  });

  res.status(201).json({
    success: true,
    message: `Đã tạo phiếu chỉ định ${service.service_name} và lập hóa đơn thu phí!`,
    data: newOrder
  });
});

// POST /api/lab/orders/:id/start - KTV tiếp nhận lấy mẫu hoặc bắt đầu chụp
router.post("/orders/:id/start", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = mockLabOrders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Không tìm thấy phiếu chỉ định!" });
  }

  order.status = "PROCESSING";
  order.technician = req.body.technician || "KTV. Đặng Quốc Việt";

  res.json({
    success: true,
    message: `Đã tiếp nhận ca chỉ định ${order.order_code}!`,
    data: order
  });
});

// POST /api/lab/orders/:id/results - Nhập kết quả xét nghiệm / chẩn đoán hình ảnh và trả về EMR
router.post("/orders/:id/results", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = mockLabOrders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Không tìm thấy phiếu chỉ định!" });
  }

  const { results, conclusion } = req.body;
  if (!results && !conclusion) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập kết quả chỉ số xét nghiệm hoặc kết luận hình ảnh!"
    });
  }

  order.results = results || { conclusion };
  order.status = "COMPLETED";
  order.completed_at = dayjs().format("DD/MM/YYYY HH:mm");

  // Đồng bộ kết quả vào bệnh án EMR (TV3) nếu có consultation_id
  if (order.consultation_id) {
    const consultation = mockConsultations.find((c) => c.id === order.consultation_id);
    if (consultation) {
      if (!consultation.lab_orders) consultation.lab_orders = [];
      const existing = consultation.lab_orders.find((lo) => lo.order_code === order.order_code);
      if (existing) {
        existing.status = "COMPLETED";
        existing.result = order.results.conclusion || "Đã có kết quả xét nghiệm.";
      } else {
        consultation.lab_orders.push({
          order_code: order.order_code,
          service_name: order.service_name,
          status: "COMPLETED",
          result: order.results.conclusion || "Đã có kết quả xét nghiệm."
        });
      }
      consultation.status = "IN_PROGRESS"; // Sẵn sàng để bác sĩ kết luận và kê đơn
    }
  }

  res.json({
    success: true,
    message: `Đã lưu và trả kết quả chỉ định ${order.order_code} về Bệnh án điện tử của Bác sĩ!`,
    data: order
  });
});

export default router;
export { mockLabOrders, labServices };
