import dayjs from "dayjs";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { patientRepository } from "../repositories/patientRepository.js";
import { EntityFactory } from "../patterns/factory/entityFactory.js";
import { StandardBillingStrategy, PaymentMethodValidatorStrategy } from "../patterns/strategy/billingStrategy.js";
import { InvoiceStateMachine, INVOICE_STATES } from "../patterns/state/invoiceState.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";

class InvoiceService {
  constructor() {
    this.billingStrategy = new StandardBillingStrategy();
  }

  getInvoices(filters = {}) {
    const { status, patient_code, invoice_code, item_type } = filters;
    let list = invoiceRepository.findAll();

    if (status && status !== "ALL") {
      list = list.filter((inv) => inv.status === status);
    }
    if (patient_code) {
      list = list.filter((inv) =>
        inv.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
      );
    }
    if (invoice_code) {
      list = list.filter((inv) =>
        inv.invoice_code.toLowerCase().includes(invoice_code.trim().toLowerCase())
      );
    }
    if (item_type && item_type !== "ALL") {
      list = list.filter((inv) => inv.item_type === item_type);
    }

    return list;
  }

  getInvoiceStats() {
    const all = invoiceRepository.findAll();
    const totalInvoices = all.length;
    const paidInvoices = all.filter((inv) => inv.status === "PAID");
    const unpaidInvoices = all.filter((inv) => inv.status === "UNPAID");

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.patient_pay || 0), 0);
    const pendingRevenue = unpaidInvoices.reduce((sum, inv) => sum + (inv.patient_pay || 0), 0);
    const totalInsurance = paidInvoices.reduce((sum, inv) => sum + (inv.insurance_discount || 0), 0);

    const revenueByType = {
      TIEN_KHAM: paidInvoices.filter(i => i.item_type === "TIEN_KHAM").reduce((s, i) => s + (i.patient_pay || 0), 0),
      CAN_LAM_SANG: paidInvoices.filter(i => i.item_type === "CAN_LAM_SANG").reduce((s, i) => s + (i.patient_pay || 0), 0),
      TIEN_THUOC: paidInvoices.filter(i => i.item_type === "TIEN_THUOC").reduce((s, i) => s + (i.patient_pay || 0), 0)
    };

    return {
      total_invoices: totalInvoices,
      paid_count: paidInvoices.length,
      unpaid_count: unpaidInvoices.length,
      total_revenue: totalRevenue,
      pending_revenue: pendingRevenue,
      total_insurance_covered: totalInsurance,
      revenue_by_type: revenueByType
    };
  }

  getInvoiceById(idOrCode) {
    const invoice = invoiceRepository.findByIdOrCode(idOrCode);
    if (!invoice) {
      const error = new Error("Không tìm thấy hóa đơn");
      error.statusCode = 404;
      throw error;
    }
    return invoice;
  }

  createInvoice(payload) {
    const {
      patient_code,
      patient_name,
      item_type,
      description,
      total_amount,
      insurance_discount = 0,
      payment_method = "CHUA_THANH_TOAN",
      cashier = "Trần Văn Thu Ngân"
    } = payload;

    if (!patient_code || !patient_name || total_amount === undefined || total_amount === null) {
      const error = new Error("Thiếu thông tin bắt buộc (mã BN, tên BN, tổng số tiền)");
      error.statusCode = 400;
      throw error;
    }

    // Áp dụng Billing Strategy kiểm tra tính hợp lệ của tiền và BHYT
    const calculation = this.billingStrategy.calculate(total_amount, insurance_discount);

    const nextId = invoiceRepository.getNextId();
    const newInvoice = EntityFactory.createInvoice({
      patient_code,
      patient_name,
      item_type,
      description,
      total_amount: calculation.totalAmount,
      insurance_discount: calculation.insuranceDiscount,
      patient_pay: calculation.patientPay,
      payment_method,
      cashier
    }, nextId);

    invoiceRepository.create(newInvoice);

    // Phát sự kiện phân tán: Hóa đơn mới phát sinh
    eventBus.emitEvent(EVENT_TYPES.INVOICE_CREATED, {
      invoice: newInvoice,
      message: `Hóa đơn mới [${newInvoice.invoice_code}] cho BN ${newInvoice.patient_name} (${newInvoice.patient_pay.toLocaleString()}đ)`
    });

    return newInvoice;
  }

  processPayment(idOrCode, paymentDetails = {}) {
    const { payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân" } = paymentDetails;

    // Validate payment method qua Strategy
    PaymentMethodValidatorStrategy.validate(payment_method);

    const invoice = invoiceRepository.findByIdOrCode(idOrCode);
    if (!invoice) {
      const error = new Error("Không tìm thấy hóa đơn");
      error.statusCode = 404;
      throw error;
    }

    if (invoice.status === INVOICE_STATES.PAID) {
      const error = new Error("Hóa đơn này đã được thanh toán trước đó");
      error.statusCode = 400;
      throw error;
    }

    // Chuyển trạng thái qua State Machine
    InvoiceStateMachine.transition(invoice, INVOICE_STATES.PAID);
    invoice.payment_method = payment_method;
    invoice.paid_at = dayjs().format("DD/MM/YYYY HH:mm");
    invoice.cashier = cashier;

    // Cập nhật trạng thái bệnh nhân nếu cần
    const patient = patientRepository.findByIdOrCode(invoice.patient_code);
    if (patient && patient.status === "Chờ thanh toán") {
      patient.status = "Đã khám";
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code: patient.patient_code,
        status: "Đã khám",
        message: `Bệnh nhân [${patient.name}] đã hoàn tất thanh toán viện phí.`
      });
    }

    // Phát sự kiện phân tán tới Thu ngân, Bác sĩ, Lễ tân, KTV CLS
    eventBus.emitEvent(EVENT_TYPES.INVOICE_PAID, {
      invoice,
      patient_code: invoice.patient_code,
      message: `Hóa đơn [${invoice.invoice_code}] đã được thanh toán thành công qua [${payment_method}] bởi ${cashier}`
    });

    return invoice;
  }
}

export const invoiceService = new InvoiceService();
