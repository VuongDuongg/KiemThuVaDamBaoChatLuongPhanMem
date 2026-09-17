import dayjs from "dayjs";
import { globalData } from "../data/seedData.js";

// GET /api/lab/services - Danh mục dịch vụ Cận lâm sàng
export const getLabServices = (req, res) => {
  res.json({
    success: true,
    total: globalData.labServices.length,
    data: globalData.labServices
  });
};

// GET /api/lab/orders - Danh sách hàng đợi chỉ định CLS
export const getLabOrders = (req, res) => {
  const { status, type, patient_code, order_code } = req.query;
  let results = [...globalData.labOrders];

  if (status && status !== "ALL") {
    results = results.filter((ord) => ord.status === status);
  }
  if (type && type !== "ALL") {
    results = results.filter((ord) => ord.type === type);
  }
  if (patient_code) {
    results = results.filter((ord) =>
      ord.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
    );
  }
  if (order_code) {
    results = results.filter((ord) =>
      ord.order_code.toLowerCase().includes(order_code.trim().toLowerCase())
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
};

// GET /api/lab/orders/:id - Chi tiết chỉ định CLS
export const getLabOrderById = (req, res) => {
  const { id } = req.params;
  const order = globalData.labOrders.find(
    (o) => String(o.id) === String(id) || o.order_code === id
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định Cận lâm sàng" });
  }

  res.json({
    success: true,
    data: order
  });
};

// POST /api/lab/orders - Bác sĩ tạo chỉ định Cận lâm sàng mới
export const createLabOrder = (req, res) => {
  const {
    consultation_id,
    patient_code,
    patient_name,
    doctor = "BS. Lê Hoàng Nam",
    service_code
  } = req.body;

  if (!service_code) {
    return res.status(400).json({ success: false, message: "Mã dịch vụ cận lâm sàng không được để trống" });
  }

  const service = globalData.labServices.find((s) => s.service_code === service_code);
  if (!service) {
    return res.status(400).json({ success: false, message: "Mã dịch vụ cận lâm sàng không tồn tại trong danh mục" });
  }

  const nextIndex = globalData.labOrders.length + 1;
  const orderCode = `CLS${String(nextIndex).padStart(6, "0")}`;

  const newOrder = {
    id: nextIndex,
    order_code: orderCode,
    consultation_id: consultation_id || nextIndex,
    patient_code,
    patient_name: patient_name || "Bệnh nhân",
    doctor,
    technician: null,
    service_code: service.service_code,
    service_name: service.service_name,
    type: service.type,
    price: service.price,
    status: "PENDING",
    payment_status: "PAID",
    results: null,
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    completed_at: null
  };

  globalData.labOrders.unshift(newOrder);

  // Tạo hóa đơn viện phí CLS
  const nextInvId = globalData.invoices.length + 1;
  globalData.invoices.unshift({
    id: nextInvId,
    invoice_code: `HD${String(nextInvId).padStart(6, "0")}`,
    patient_code,
    patient_name: patient_name || "Bệnh nhân",
    item_type: "CAN_LAM_SANG",
    description: `Chỉ định CLS: ${service.service_name}`,
    total_amount: service.price,
    insurance_discount: 0,
    patient_pay: service.price,
    payment_method: "VIETQR",
    status: "PAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: dayjs().format("DD/MM/YYYY HH:mm"),
    cashier: "Trần Văn Thu Ngân"
  });

  const p = globalData.patients.find((pt) => pt.patient_code === patient_code);
  if (p) {
    p.status = "Chờ kết quả CLS";
  }

  res.status(201).json({
    success: true,
    message: `Đã tạo phiếu chỉ định ${orderCode} cho bệnh nhân`,
    data: newOrder
  });
};

// POST /api/lab/orders/:id/start - Bắt đầu thực hiện ca CLS
export const startLabOrder = (req, res) => {
  const { id } = req.params;
  const { technician = "KTV. Đặng Quốc Việt" } = req.body;

  const orderIndex = globalData.labOrders.findIndex(
    (o) => String(o.id) === String(id) || o.order_code === id
  );

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định Cận lâm sàng" });
  }

  const order = globalData.labOrders[orderIndex];
  order.technician = technician;
  order.status = "PROCESSING";

  res.json({
    success: true,
    message: `Đã tiếp nhận thực hiện chỉ định ${order.order_code}`,
    data: order
  });
};

// POST & PUT /api/lab/orders/:id/results - Nhập kết quả CLS
export const updateLabResult = (req, res) => {
  const { id } = req.params;
  const { technician = "KTV. Đặng Quốc Việt", results } = req.body;

  const orderIndex = globalData.labOrders.findIndex(
    (o) => String(o.id) === String(id) || o.order_code === id
  );

  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định Cận lâm sàng" });
  }

  if (!results || (!results.parameters && !results.conclusion && !results.findings)) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập kết quả hoặc kết luận cận lâm sàng" });
  }

  const order = globalData.labOrders[orderIndex];
  order.technician = technician;
  order.results = results;
  order.status = "COMPLETED";
  order.completed_at = dayjs().format("DD/MM/YYYY HH:mm");

  const consultation = globalData.consultations.find(
    (c) => c.patient_code === order.patient_code
  );
  if (consultation) {
    if (!consultation.lab_orders) consultation.lab_orders = [];
    consultation.lab_orders.push({
      order_code: order.order_code,
      service_name: order.service_name,
      status: "COMPLETED",
      result: results?.conclusion || "Đã có kết quả xét nghiệm"
    });
  }

  const p = globalData.patients.find((pt) => pt.patient_code === order.patient_code);
  if (p && p.status === "Chờ kết quả CLS") {
    p.status = "Đang khám";
  }

  res.json({
    success: true,
    message: `Đã hoàn tất nhập kết quả cho phiếu ${order.order_code}`,
    data: order
  });
};
