import express from "express";
import dayjs from "dayjs";

const router = express.Router();

// Mock in-memory invoices for Cashier (TV2)
let mockInvoices = [
  {
    id: 1,
    invoice_code: "HD000001",
    patient_code: "BN000001",
    patient_name: "Nguyễn Văn An",
    item_type: "TIEN_KHAM", // TIEN_KHAM, CAN_LAM_SANG, TIEN_THUOC
    description: "Khám chuyên khoa Nội tổng quát",
    total_amount: 150000,
    insurance_discount: 30000,
    patient_pay: 120000,
    payment_method: "TIEN_MAT",
    status: "PAID", // UNPAID, PAID, CANCELLED
    created_at: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm"),
    paid_at: dayjs().subtract(110, "minute").format("DD/MM/YYYY HH:mm"),
    cashier: "Trần Văn Thu Ngân"
  },
  {
    id: 2,
    invoice_code: "HD000002",
    patient_code: "BN000002",
    patient_name: "Trần Thị Bích",
    item_type: "CAN_LAM_SANG",
    description: "Chụp X-quang khớp cổ tay thẳng nghiêng",
    total_amount: 250000,
    insurance_discount: 50000,
    patient_pay: 200000,
    payment_method: "VIETQR",
    status: "PAID",
    created_at: dayjs().subtract(1, "hour").format("DD/MM/YYYY HH:mm"),
    paid_at: dayjs().subtract(50, "minute").format("DD/MM/YYYY HH:mm"),
    cashier: "Trần Văn Thu Ngân"
  },
  {
    id: 3,
    invoice_code: "HD000003",
    patient_code: "BN000003",
    patient_name: "Lê Hoàng Long",
    item_type: "TIEN_THUOC",
    description: "Đơn thuốc điều trị viêm phổi cấp",
    total_amount: 420000,
    insurance_discount: 84000,
    patient_pay: 336000,
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().subtract(30, "minute").format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  },
  {
    id: 4,
    invoice_code: "HD000004",
    patient_code: "BN000004",
    patient_name: "Phạm Thị Dung",
    item_type: "TIEN_KHAM",
    description: "Khám Sản định kỳ 24 tuần",
    total_amount: 200000,
    insurance_discount: 0,
    patient_pay: 200000,
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().subtract(15, "minute").format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  }
];

// GET /api/invoices - Danh sách hóa đơn có bộ lọc
router.get("/", (req, res) => {
  const { status, patient_code, invoice_code, item_type } = req.query;
  let results = [...mockInvoices];

  if (status && status !== "ALL") {
    results = results.filter((inv) => inv.status === status);
  }
  if (patient_code) {
    results = results.filter((inv) =>
      inv.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
    );
  }
  if (invoice_code) {
    results = results.filter((inv) =>
      inv.invoice_code.toLowerCase().includes(invoice_code.trim().toLowerCase())
    );
  }
  if (item_type && item_type !== "ALL") {
    results = results.filter((inv) => inv.item_type === item_type);
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// GET /api/invoices/stats - Thống kê doanh thu tài chính
router.get("/stats", (req, res) => {
  const paidInvoices = mockInvoices.filter((inv) => inv.status === "PAID");
  const unpaidInvoices = mockInvoices.filter((inv) => inv.status === "UNPAID");

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.patient_pay, 0);
  const totalUnpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.patient_pay, 0);

  res.json({
    success: true,
    data: {
      totalInvoices: mockInvoices.length,
      paidCount: paidInvoices.length,
      unpaidCount: unpaidInvoices.length,
      totalRevenue,
      totalUnpaidAmount
    }
  });
});

// POST /api/invoices - Lập hóa đơn mới
router.post("/", (req, res) => {
  const { patient_code, patient_name, item_type, description, total_amount, insurance_discount } = req.body;

  if (!patient_code || !patient_name || !item_type || total_amount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Thiếu các trường thông tin bắt buộc để lập hóa đơn!"
    });
  }

  if (Number(total_amount) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Tổng số tiền hóa đơn phải lớn hơn 0!"
    });
  }

  const discount = Number(insurance_discount) || 0;
  if (discount < 0 || discount > total_amount) {
    return res.status(400).json({
      success: false,
      message: "Mức giảm trừ bảo hiểm không hợp lệ (0 <= giảm trừ <= tổng tiền)!"
    });
  }

  const patient_pay = Number(total_amount) - discount;
  const newId = mockInvoices.length > 0 ? Math.max(...mockInvoices.map((i) => i.id)) + 1 : 1;
  const invoice_code = `HD${String(newId).padStart(6, "0")}`;

  const newInvoice = {
    id: newId,
    invoice_code,
    patient_code,
    patient_name,
    item_type,
    description: description || "Chi phí dịch vụ khám chữa bệnh",
    total_amount: Number(total_amount),
    insurance_discount: discount,
    patient_pay,
    payment_method: "CHUA_THANH_TOAN",
    status: "UNPAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: null,
    cashier: "Trần Văn Thu Ngân"
  };

  mockInvoices.unshift(newInvoice);
  res.status(201).json({
    success: true,
    message: "Lập hóa đơn thành công!",
    data: newInvoice
  });
});

// POST /api/invoices/:id/pay - Thu tiền & thanh toán hóa đơn
router.post("/:id/pay", (req, res) => {
  const invoiceId = parseInt(req.params.id, 10);
  const { payment_method } = req.body;

  const validMethods = ["TIEN_MAT", "VIETQR", "THE_NGAN_HANG"];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({
      success: false,
      message: "Phương thức thanh toán không hợp lệ (hỗ trợ: TIEN_MAT, VIETQR, THE_NGAN_HANG)!"
    });
  }

  const invoice = mockInvoices.find((i) => i.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy hóa đơn cần thanh toán!"
    });
  }

  if (invoice.status === "PAID") {
    return res.status(400).json({
      success: false,
      message: "Hóa đơn này đã được thanh toán trước đó!"
    });
  }

  invoice.status = "PAID";
  invoice.payment_method = payment_method;
  invoice.paid_at = dayjs().format("DD/MM/YYYY HH:mm");

  res.json({
    success: true,
    message: `Thanh toán thành công ${invoice.patient_pay.toLocaleString("vi-VN")} VNĐ cho hóa đơn ${invoice.invoice_code}!`,
    data: invoice
  });
});

export default router;
export { mockInvoices };
