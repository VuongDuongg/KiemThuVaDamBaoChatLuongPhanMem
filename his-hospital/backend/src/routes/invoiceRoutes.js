import express from "express";
import {
  getInvoices,
  getInvoiceStats,
  getPendingCharges,
  getInvoiceById,
  createInvoice,
  processInvoicePayment
} from "../controllers/invoiceController.js";

const router = express.Router();

// GET /api/invoices - Danh sách hóa đơn có bộ lọc
router.get("/", getInvoices);

// GET /api/invoices/stats - Thống kê doanh thu & viện phí
router.get("/stats", getInvoiceStats);

// GET /api/invoices/pending-charges - Lập hóa đơn viện phí UC-THUNGAN-05
router.get("/pending-charges", getPendingCharges);

// GET /api/invoices/:id - Chi tiết hóa đơn
router.get("/:id", getInvoiceById);

// POST /api/invoices - Tạo mới hóa đơn
router.post("/", createInvoice);

// POST /api/invoices/:id/pay - Thu ngân xác nhận thu tiền
router.post("/:id/pay", processInvoicePayment);

export default router;
