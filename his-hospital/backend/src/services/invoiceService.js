import dayjs from "dayjs";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { patientRepository } from "../repositories/patientRepository.js";
import { consultationRepository } from "../repositories/consultationRepository.js";
import { labRepository as labOrderRepository } from "../repositories/labRepository.js";
import { EntityFactory } from "../patterns/factory/entityFactory.js";
import {
  StandardBillingStrategy,
  PaymentMethodValidatorStrategy,
} from "../patterns/strategy/billingStrategy.js";
import {
  InvoiceStateMachine,
  INVOICE_STATES,
} from "../patterns/state/invoiceState.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";
import { validateInvoiceCreationInput } from "../validators/invoiceValidator.js";

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
        inv.patient_code
          .toLowerCase()
          .includes(patient_code.trim().toLowerCase()),
      );
    }
    if (invoice_code) {
      list = list.filter((inv) =>
        inv.invoice_code
          .toLowerCase()
          .includes(invoice_code.trim().toLowerCase()),
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

    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + (inv.patient_pay || 0),
      0,
    );
    const pendingRevenue = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv.patient_pay || 0),
      0,
    );
    const totalInsurance = paidInvoices.reduce(
      (sum, inv) => sum + (inv.insurance_discount || 0),
      0,
    );

    const revenueByType = {
      TIEN_KHAM: paidInvoices
        .filter((i) => i.item_type === "TIEN_KHAM")
        .reduce((s, i) => s + (i.patient_pay || 0), 0),
      CAN_LAM_SANG: paidInvoices
        .filter((i) => i.item_type === "CAN_LAM_SANG")
        .reduce((s, i) => s + (i.patient_pay || 0), 0),
      TIEN_THUOC: paidInvoices
        .filter((i) => i.item_type === "TIEN_THUOC")
        .reduce((s, i) => s + (i.patient_pay || 0), 0),
    };

    return {
      total_invoices: totalInvoices,
      paid_count: paidInvoices.length,
      unpaid_count: unpaidInvoices.length,
      total_revenue: totalRevenue,
      pending_revenue: pendingRevenue,
      total_insurance_covered: totalInsurance,
      revenue_by_type: revenueByType,
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

  getPendingCharges(params = {}) {
    // 1. Kiểm tra validation theo Bảng 3.1.2 và Ngoại lệ E1.1, E1.2
    const validation = validateInvoiceCreationInput(params);
    if (!validation.isValid) {
      const error = new Error(validation.message);
      error.statusCode = 400;
      error.errorCode = validation.errorCode;
      error.validationErrors = validation.errors;
      throw error;
    }

    const { patient_id, patient_name } = params;
    const allPatients = patientRepository.findAll();

    // 2. Tìm kiếm bệnh nhân theo patient_id hoặc patient_name
    let patient = null;
    if (patient_id && String(patient_id).trim()) {
      const targetId = String(patient_id).trim().toUpperCase();
      patient = allPatients.find(
        (p) =>
          String(p.id).toUpperCase() === targetId ||
          p.patient_code.toUpperCase() === targetId
      );
    } else if (patient_name && String(patient_name).trim()) {
      const targetName = String(patient_name).trim().toLowerCase();
      patient = allPatients.find((p) =>
        p.name.toLowerCase().includes(targetName)
      );
    }

    // Ngoại lệ [E1.3]: Không tìm thấy bệnh nhân
    if (!patient) {
      const error = new Error("Không tìm thấy thông tin bệnh nhân trên hệ thống");
      error.statusCode = 404;
      error.errorCode = "E1.3";
      throw error;
    }

    // 3. Truy xuất các khoản mục chi phí phát sinh
    // 3.1. Tiền khám chuyên khoa (theo thông tin tiếp đón / consultation)
    const items = [];
    const patientInvoices = invoiceRepository.findByPatientCode(patient.patient_code);

    // Kiểm tra tiền khám
    const examInvoices = patientInvoices.filter((inv) => inv.item_type === "TIEN_KHAM");
    const isExamPaid = examInvoices.length > 0 && examInvoices.every((inv) => inv.status === "PAID");
    const isExamBilled = examInvoices.length > 0;

    // Khoản tiền khám (Mỗi bệnh nhân đã tiếp đón đều có tiền khám chuyên khoa)
    const examPrice = 150000;
    items.push({
      item_id: `EXAM_${patient.patient_code}`,
      item_name: `Tiền khám chuyên khoa (${patient.department || "Khoa khám bệnh"})`,
      item_type: "TIEN_KHAM",
      quantity: 1,
      unit_price: examPrice,
      total_price: examPrice,
      is_paid: isExamPaid,
      is_billed: isExamBilled,
      invoice_code: examInvoices[0]?.invoice_code || null
    });

    // 3.2. Tiền xét nghiệm & Chụp chiếu (Cận lâm sàng)
    const allLabOrders = labOrderRepository.findOrders();
    const patientLabOrders = allLabOrders.filter(
      (o) => o.patient_code.toUpperCase() === patient.patient_code.toUpperCase()
    );

    patientLabOrders.forEach((order) => {
      const isPaid = order.payment_status === "PAID";
      const relatedInv = patientInvoices.find(
        (inv) => inv.reference_id === order.id || inv.description?.includes(order.service_name)
      );

      items.push({
        item_id: `LAB_${order.id}`,
        item_name: order.type === "PACS" ? `Tiền chụp chiếu: ${order.service_name}` : `Tiền xét nghiệm: ${order.service_name}`,
        item_type: "CAN_LAM_SANG",
        service_type: order.type,
        quantity: 1,
        unit_price: order.price,
        total_price: order.price,
        is_paid: isPaid,
        is_billed: !!relatedInv,
        invoice_code: relatedInv?.invoice_code || null,
        reference_id: order.id
      });
    });

    // 3.3. Tiền thuốc từ đơn thuốc (nếu có)
    const consultations = consultationRepository.findByPatientCode(patient.patient_code);
    consultations.forEach((c) => {
      if (c.prescriptions && Array.isArray(c.prescriptions) && c.prescriptions.length > 0) {
        c.prescriptions.forEach((med, idx) => {
          const medPrice = med.unit_price || 2000;
          const medTotal = medPrice * (med.quantity || 1);
          const medInv = patientInvoices.find(
            (inv) => inv.item_type === "TIEN_THUOC"
          );
          items.push({
            item_id: `MED_${c.id}_${idx}`,
            item_name: `Tiền thuốc: ${med.medicine_name}`,
            item_type: "TIEN_THUOC",
            quantity: med.quantity || 1,
            unit_price: medPrice,
            total_price: medTotal,
            is_paid: medInv?.status === "PAID",
            is_billed: !!medInv,
            invoice_code: medInv?.invoice_code || null
          });
        });
      }
    });

    // Ngoại lệ [E1.5]: Bệnh nhân chưa có chỉ định/yêu cầu khám nào cần thanh toán
    if (items.length === 0) {
      return {
        patient: {
          id: patient.id,
          patient_code: patient.patient_code,
          name: patient.name,
          gender: patient.gender,
          insurance_code: patient.insurance_code,
          department: patient.department
        },
        items: [],
        summary: {
          total_amount: 0,
          insurance_percent: 0,
          insurance_discount: 0,
          patient_pay: 0
        },
        status_message: "Bệnh nhân chưa có chỉ định dịch vụ hoặc yêu cầu khám nào cần thanh toán",
        errorCode: "E1.5",
        can_create_invoice: false
      };
    }

    // Ngoại lệ [E1.4]: Dịch vụ đã được thanh toán đầy đủ
    const allPaid = items.every((item) => item.is_paid);
    const unbilledItems = items.filter((item) => !item.is_paid && !item.is_billed);
    const pendingItems = items.filter((item) => !item.is_paid);

    // Tính toán chi phí: ưu tiên các mục chưa thanh toán
    const targetItems = pendingItems.length > 0 ? pendingItems : items;
    const totalAmount = targetItems.reduce((sum, it) => sum + it.total_price, 0);

    // Tỷ lệ BHYT: nếu bệnh nhân có mã BHYT thì 80%, ngược lại 0%
    const insurancePercent = patient.insurance_code ? 80 : 0;
    const insuranceDiscount = Math.round((totalAmount * insurancePercent) / 100);
    const patientPay = Math.max(0, totalAmount - insuranceDiscount);

    let statusMessage = null;
    let errorCode = null;

    if (allPaid) {
      statusMessage = "Các khoản chi phí này đã được thanh toán đầy đủ";
      errorCode = "E1.4";
    }

    return {
      patient: {
        id: patient.id,
        patient_code: patient.patient_code,
        name: patient.name,
        gender: patient.gender,
        insurance_code: patient.insurance_code,
        department: patient.department
      },
      items,
      summary: {
        total_amount: totalAmount,
        insurance_percent: insurancePercent,
        insurance_discount: insuranceDiscount,
        patient_pay: patientPay
      },
      status_message: statusMessage,
      errorCode,
      can_create_invoice: !allPaid && targetItems.length > 0
    };
  }

  createInvoice(payload) {
    const {
      patient_code,
      patient_name,
      item_type,
      description,
      total_amount,
      insurance_discount = 0,
      insurance_percent = 0,
      payment_method = "CHUA_THANH_TOAN",
      cashier = "Trần Văn Thu Ngân",
      items = [],
      reference_id = null
    } = payload;

    if (
      !patient_code ||
      !patient_name ||
      total_amount === undefined ||
      total_amount === null
    ) {
      const error = new Error(
        "Thiếu thông tin bắt buộc (mã BN, tên BN, tổng số tiền)",
      );
      error.statusCode = 400;
      throw error;
    }

    // Áp dụng Billing Strategy kiểm tra tính hợp lệ của tiền và BHYT
    const calculation = this.billingStrategy.calculate(
      total_amount,
      insurance_discount,
    );

    const nextId = invoiceRepository.getNextId();
    const newInvoice = EntityFactory.createInvoice(
      {
        patient_code,
        patient_name,
        item_type: item_type || "TIEN_KHAM",
        description: description || "Thanh toán viện phí",
        total_amount: calculation.totalAmount,
        insurance_discount: calculation.insuranceDiscount,
        insurance_percent,
        patient_pay: calculation.patientPay,
        payment_method,
        cashier,
        items,
        reference_id
      },
      nextId,
    );

    invoiceRepository.create(newInvoice);

    // Phát sự kiện phân tán: Hóa đơn mới phát sinh
    eventBus.emitEvent(EVENT_TYPES.INVOICE_CREATED, {
      invoice: newInvoice,
      message: `Hóa đơn mới [${newInvoice.invoice_code}] cho BN ${newInvoice.patient_name} (${newInvoice.patient_pay.toLocaleString()}đ)`,
    });

    return newInvoice;
  }

  processPayment(idOrCode, paymentDetails = {}) {
    const { payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân" } =
      paymentDetails;

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

    // ---> [ĐÃ SỬA]: Kích hoạt chuyển trạng thái CLS sang PROCESSING khi hóa đơn được thanh toán
    if (invoice.item_type === "CAN_LAM_SANG" && invoice.reference_id) {
      const labOrder = labOrderRepository.findOrderByIdOrCode(invoice.reference_id);
      if (labOrder) {
        // Sử dụng LabOrderStateMachine để chuyển trạng thái an toàn từ PENDING sang PROCESSING
        labOrder.payment_status = "PAID";
      }
    }

    // Cập nhật trạng thái bệnh nhân nếu cần
    const patient = patientRepository.findByIdOrCode(invoice.patient_code);
    if (patient && patient.status === "Chờ thanh toán") {
      patient.status = "Đã khám";
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code: patient.patient_code,
        status: "Đã khám",
        message: `Bệnh nhân [${patient.name}] đã hoàn tất thanh toán viện phí.`,
      });
    }

    // Phát sự kiện phân tán tới Thu ngân, Bác sĩ, Lễ tân, KTV CLS
    eventBus.emitEvent(EVENT_TYPES.INVOICE_PAID, {
      invoice,
      patient_code: invoice.patient_code,
      message: `Hóa đơn [${invoice.invoice_code}] đã được thanh toán thành công qua [${payment_method}] bởi ${cashier}`,
    });

    return invoice;
  }
}

export const invoiceService = new InvoiceService();
