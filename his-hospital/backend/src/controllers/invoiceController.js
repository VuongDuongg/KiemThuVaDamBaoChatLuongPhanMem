import { invoiceService } from "../services/invoiceService.js";

// GET /api/invoices - Danh sách hóa đơn có bộ lọc
export const getInvoices = (req, res) => {
  try {
    const data = invoiceService.getInvoices(req.query);
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/stats - Thống kê doanh thu & viện phí
export const getInvoiceStats = (req, res) => {
  try {
    const stats = invoiceService.getInvoiceStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/pending-charges - UC-THUNGAN-05: Lập hóa đơn viện phí
export const getPendingCharges = (req, res) => {
  try {
    const data = invoiceService.getPendingCharges(req.query);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      errorCode: error.errorCode || "VALIDATION_ERROR",
      message: error.message,
      errors: error.validationErrors
    });
  }
};

// GET /api/invoices/:id - Chi tiết hóa đơn
export const getInvoiceById = (req, res) => {
  try {
    const data = invoiceService.getInvoiceById(req.params.id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/invoices - Tạo hóa đơn mới
export const createInvoice = (req, res) => {
  try {
    const newInvoice = invoiceService.createInvoice(req.body);
    res.status(201).json({
      success: true,
      message: "Tạo hóa đơn thành công",
      data: newInvoice
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// POST /api/invoices/:id/pay - Thu ngân xác nhận thu tiền
export const processInvoicePayment = (req, res) => {
  try {
    const updatedInvoice = invoiceService.processPayment(req.params.id, req.body);
    res.json({
      success: true,
      message: `Thanh toán thành công hóa đơn ${updatedInvoice.invoice_code} qua ${updatedInvoice.payment_method}`,
      data: updatedInvoice
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};
