import dayjs from "dayjs";
import { globalData } from "../data/seedData.js";

// GET /api/invoices - Danh sách hóa đơn có bộ lọc
export const getInvoices = (req, res) => {
  const { status, patient_code, invoice_code, item_type } = req.query;
  let results = [...globalData.invoices];

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
};

// GET /api/invoices/stats - Thống kê doanh thu & viện phí
export const getInvoiceStats = (req, res) => {
  const totalInvoices = globalData.invoices.length;
  const paidInvoices = globalData.invoices.filter((inv) => inv.status === "PAID");
  const unpaidInvoices = globalData.invoices.filter((inv) => inv.status === "UNPAID");

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.patient_pay || 0), 0);
  const pendingRevenue = unpaidInvoices.reduce((sum, inv) => sum + (inv.patient_pay || 0), 0);
  const totalInsurance = paidInvoices.reduce((sum, inv) => sum + (inv.insurance_discount || 0), 0);

  const revenueByType = {
    TIEN_KHAM: paidInvoices.filter(i => i.item_type === "TIEN_KHAM").reduce((s, i) => s + (i.patient_pay || 0), 0),
    CAN_LAM_SANG: paidInvoices.filter(i => i.item_type === "CAN_LAM_SANG").reduce((s, i) => s + (i.patient_pay || 0), 0),
    TIEN_THUOC: paidInvoices.filter(i => i.item_type === "TIEN_THUOC").reduce((s, i) => s + (i.patient_pay || 0), 0)
  };

  res.json({
    success: true,
    data: {
      total_invoices: totalInvoices,
      paid_count: paidInvoices.length,
      unpaid_count: unpaidInvoices.length,
      total_revenue: totalRevenue,
      pending_revenue: pendingRevenue,
      total_insurance_covered: totalInsurance,
      revenue_by_type: revenueByType
    }
  });
};

// GET /api/invoices/:id - Chi tiết hóa đơn
export const getInvoiceById = (req, res) => {
  const { id } = req.params;
  const invoice = globalData.invoices.find(
    (inv) => String(inv.id) === String(id) || inv.invoice_code === id
  );

  if (!invoice) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
  }

  res.json({
    success: true,
    data: invoice
  });
};

// POST /api/invoices - Tạo hóa đơn mới
export const createInvoice = (req, res) => {
  const {
    patient_code,
    patient_name,
    item_type,
    description,
    total_amount,
    insurance_discount = 0,
    payment_method = "CHUA_THANH_TOAN",
    cashier = "Trần Văn Thu Ngân"
  } = req.body;

  if (!patient_code || !patient_name || total_amount === undefined || total_amount === null) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin bắt buộc (mã BN, tên BN, tổng số tiền)"
    });
  }

  const numTotal = Number(total_amount);
  if (isNaN(numTotal) || numTotal <= 0) {
    return res.status(400).json({
      success: false,
      message: "Tổng tiền hóa đơn phải lớn hơn 0"
    });
  }

  const numDiscount = Number(insurance_discount) || 0;
  if (numDiscount > numTotal) {
    return res.status(400).json({
      success: false,
      message: "Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)"
    });
  }

  const patientPay = Math.max(0, numTotal - numDiscount);

  const nextIndex = globalData.invoices.length + 1;
  const newInvoice = {
    id: nextIndex,
    invoice_code: `HD${String(nextIndex).padStart(6, "0")}`,
    patient_code,
    patient_name,
    item_type: item_type || "TIEN_KHAM",
    description: description || "Thanh toán viện phí",
    total_amount: numTotal,
    insurance_discount: numDiscount,
    patient_pay: patientPay,
    payment_method,
    status: payment_method === "CHUA_THANH_TOAN" ? "UNPAID" : "PAID",
    created_at: dayjs().format("DD/MM/YYYY HH:mm"),
    paid_at: payment_method === "CHUA_THANH_TOAN" ? null : dayjs().format("DD/MM/YYYY HH:mm"),
    cashier
  };

  globalData.invoices.unshift(newInvoice);

  res.status(201).json({
    success: true,
    message: "Tạo hóa đơn thành công",
    data: newInvoice
  });
};

// POST /api/invoices/:id/pay - Thu ngân xác nhận thu tiền
export const processInvoicePayment = (req, res) => {
  const { id } = req.params;
  const { payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân" } = req.body;

  const validMethods = ["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({
      success: false,
      message: "Phương thức thanh toán không hợp lệ (hỗ trợ: TIEN_MAT, VIETQR, THE, CHUYEN_KHOAN)"
    });
  }

  const invoiceIndex = globalData.invoices.findIndex(
    (inv) => String(inv.id) === String(id) || inv.invoice_code === id
  );

  if (invoiceIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
  }

  const invoice = globalData.invoices[invoiceIndex];
  if (invoice.status === "PAID") {
    return res.status(400).json({ success: false, message: "Hóa đơn này đã được thanh toán trước đó" });
  }

  invoice.status = "PAID";
  invoice.payment_method = payment_method;
  invoice.paid_at = dayjs().format("DD/MM/YYYY HH:mm");
  invoice.cashier = cashier;

  const patient = globalData.patients.find((p) => p.patient_code === invoice.patient_code);
  if (patient && patient.status === "Chờ thanh toán") {
    patient.status = "Đã khám";
  }

  res.json({
    success: true,
    message: `Thanh toán thành công hóa đơn ${invoice.invoice_code} qua ${payment_method}`,
    data: invoice
  });
};
