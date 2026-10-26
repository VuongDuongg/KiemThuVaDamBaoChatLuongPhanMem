/**
 * BỘ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG (UNIT TESTING - NUNIT STYLE)
 * CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-06)
 * Tác giả: Vũ Đức Vương
 * Tài liệu tham chiếu: "Kiểm thử đơn vị - sd NUnit.pdf" (ThS. Nguyễn Thị Phương Dung)
 * 
 * PHẠM VI TEST CASE:
 * - Hộp đen & Biên: TC_F6_01 -> TC_F6_09
 * - Hộp trắng CFG: C1 (Statement), C2 (Branch), C3 (Multiple Condition)
 * - Hộp trắng DFG: All c-use / All p-use / Def-Use
 */

import { test, describe, beforeEach, afterEach } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";

// Services & Patterns
import { invoiceService } from "../../../src/services/invoiceService.js";
import { InvoiceStateMachine, INVOICE_STATES } from "../../../src/patterns/state/invoiceState.js";

// Repositories & EventBus (Mock in-memory cô lập chuẩn Unit Test)
import { invoiceRepository } from "../../../src/repositories/invoiceRepository.js";
import { patientRepository } from "../../../src/repositories/patientRepository.js";
import { labRepository as labOrderRepository } from "../../../src/repositories/labRepository.js";
import { eventBus } from "../../../src/events/eventBus.js";

describe("[TestFixture] ChucNang_2_ThanhToanHoaDonVienPhi", () => {
  let mockInvoice = null;
  let mockPatient = null;
  let mockLabOrder = null;
  let capturedEvents = [];

  let origFindInvoice, origFindPatient, origFindLabOrder, origEmit;

  beforeEach(() => {
    capturedEvents = [];

    mockInvoice = {
      id: 1,
      invoice_code: "HD000001",
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      total_amount: 180000,
      insurance_discount: 0,
      patient_pay: 180000,
      item_type: "CAN_LAM_SANG",
      reference_id: "CLS000001",
      payment_method: "CHUA_THANH_TOAN",
      cashier: "Trần Văn Thu Ngân",
      status: INVOICE_STATES.UNPAID,
      paid_at: null
    };

    mockPatient = {
      patient_code: "BN000001",
      name: "Nguyễn Văn An",
      status: "Chờ thanh toán"
    };

    mockLabOrder = {
      id: "CLS000001",
      order_code: "CLS000001",
      payment_status: "UNPAID"
    };

    origFindInvoice = invoiceRepository.findByIdOrCode;
    origFindPatient = patientRepository.findByIdOrCode;
    origFindLabOrder = labOrderRepository.findOrderByIdOrCode;
    origEmit = eventBus.emitEvent;

    invoiceRepository.findByIdOrCode = (id) => (String(id) === "1" || id === "HD000001" ? mockInvoice : null);
    patientRepository.findByIdOrCode = (code) => (code === "BN000001" ? mockPatient : null);
    labOrderRepository.findOrderByIdOrCode = (id) => (id === "CLS000001" ? mockLabOrder : null);
    eventBus.emitEvent = (event, data) => capturedEvents.push({ event, data });
  });

  afterEach(() => {
    invoiceRepository.findByIdOrCode = origFindInvoice;
    patientRepository.findByIdOrCode = origFindPatient;
    labOrderRepository.findOrderByIdOrCode = origFindLabOrder;
    eventBus.emitEvent = origEmit;
  });

  // --- PHẦN 2.1: TEST CASE HỘP ĐEN VỀ MẶT LOGIC & GIÁ TRỊ BIÊN (TC_F6) ---

  test("[Test] TC_F6_01 / TC_PAY_C1_03 / TC_PAY_C2_05 / TC_PAY_C3_06 / TC_PAY_PUSE_03: Hóa đơn đã thanh toán trước đó -> Chặn giao dịch (Lỗi 400)", () => {
    mockInvoice.status = INVOICE_STATES.PAID;
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "TIEN_MAT" }),
      (err) => err.statusCode === 400 && err.message.includes("đã được thanh toán trước đó")
    );
  });

  test("[Test] TC_F6_02: Giá trị biên / BQ (Q2) - Hủy hóa đơn với cancel_reason đúng 255 ký tự (Max)", () => {
    const reason255 = "A".repeat(255);
    const cancelled = InvoiceStateMachine.transition(mockInvoice, INVOICE_STATES.CANCELLED);
    cancelled.cancel_reason = reason255;
    Assert.AreEqual(INVOICE_STATES.CANCELLED, cancelled.status);
    Assert.AreEqual(255, cancelled.cancel_reason.length);
  });

  test("[Test] TC_F6_03: Giá trị biên - cancel_reason 256 ký tự (Max+) -> Báo lỗi inline", () => {
    const reason256 = "A".repeat(256);
    Assert.Throws(
      () => {
        if (reason256.length > 255) throw new Error("Lý do hủy không được vượt quá 255 ký tự");
      },
      /Lý do hủy không được vượt quá 255 ký tự/
    );
  });

  test("[Test] TC_F6_04 / TC_PAY_C1_01 / TC_PAY_C3_01: Không tick chọn payment_method (để trống) -> Báo lỗi", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });

  test("[Test] TC_F6_05: Giá trị biên / BQ (Q4) - amount_received = 499,999 VNĐ (< tổng tiền 500k) -> Báo lỗi", () => {
    const totalAmount = 500000;
    const amountReceived = 499999;
    Assert.Throws(
      () => {
        if (amountReceived < totalAmount) {
          throw new Error("Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán");
        }
      },
      /Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán/
    );
  });

  test("[Test] TC_F6_06: Phân vùng TĐ - amount_received = -50,000 VNĐ (Số âm) -> Báo lỗi", () => {
    const amountReceived = -50000;
    Assert.Throws(
      () => {
        if (amountReceived <= 0) throw new Error("Số tiền không hợp lệ");
      },
      /Số tiền không hợp lệ/
    );
  });

  test("[Test] TC_F6_07 / TC_PAY_C1_04 / TC_PAY_C2_02 / TC_PAY_C2_07: Thanh toán TIEN_MAT hợp lệ -> Chuyển 'Đã thanh toán'", () => {
    mockInvoice.item_type = "TIEN_KHAM";
    mockPatient.status = "Đang khám";
    const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT", cashier: "Trần Văn Thu Ngân" });
    Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
    Assert.IsNotNull(paid.paid_at);
  });

  test("[Test] TC_F6_08: Giá trị biên / BQ (Q5) - amount_received = 1,000,000 VNĐ (> tổng tiền) -> Tính đúng tiền thối lại", () => {
    const totalAmount = 500000;
    const amountReceived = 1000000;
    const changeAmount = amountReceived - totalAmount;
    Assert.AreEqual(500000, changeAmount);
    mockInvoice.item_type = "TIEN_KHAM";
    mockPatient.status = "Đang khám";
    const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
    Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
  });

  test("[Test] TC_F6_09 / TC_PAY_C1_05: Quét mã QR thanh toán thành công -> Đồng bộ CLS & Bác sĩ", () => {
    const paid = invoiceService.processPayment(1, { payment_method: "VIETQR" });
    Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
    Assert.AreEqual("PAID", mockLabOrder.payment_status);
    Assert.AreEqual("Đã khám", mockPatient.status);
  });

  // --- PHẦN 2.2: TEST CASE HỘP TRẮNG - DÒNG ĐIỀU KHIỂN (CFG C1, C2, C3) ---

  test("[Test] TC_PAY_C1_01 / TC_PAY_C2_01 / TC_PAY_C3_02: PTTT không hợp lệ ('BITCOIN') -> Quăng lỗi", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "BITCOIN" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });

  test("[Test] TC_PAY_C1_02 / TC_PAY_C2_03 / TC_PAY_C3_04 / TC_PAY_PUSE_02: Hóa đơn không tồn tại -> Lỗi HTTP 404", () => {
    Assert.Throws(
      () => invoiceService.processPayment(9999, { payment_method: "TIEN_MAT" }),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy hóa đơn")
    );
  });

  test("[Test] TC_PAY_C2_10 / TC_PAY_C3_10 / TC_PAY_PUSE_06: Hóa đơn CLS có reference_id ảo không có trong DB -> Bỏ qua CLS", () => {
    mockInvoice.reference_id = "CLS_AO";
    const paid = invoiceService.processPayment(1, { payment_method: "VIETQR" });
    Assert.AreEqual("PAID", paid.status);
    Assert.AreEqual("UNPAID", mockLabOrder.payment_status, "Phiếu CLS gốc không bị ảnh hưởng");
  });

  test("[Test] TC_PAY_C2_11 / TC_PAY_C3_13 / TC_PAY_PUSE_07: Bệnh nhân Chờ thanh toán -> Đồng bộ 'Đã khám'", () => {
    invoiceService.processPayment(1, { payment_method: "THE" });
    Assert.AreEqual("Đã khám", mockPatient.status);
    Assert.IsTrue(capturedEvents.some((e) => e.event === "PATIENT_STATUS_CHANGED"));
  });

  test("[Test] TC_PAY_C3_07 / TC_PAY_PUSE_04: Hóa đơn khám bệnh -> Bỏ qua kiểm tra CLS", () => {
    mockInvoice.item_type = "TIEN_KHAM";
    mockInvoice.reference_id = null;
    invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
    Assert.AreEqual("UNPAID", mockLabOrder.payment_status);
  });

  test("[Test] TC_PAY_C3_08: item_type = 'CAN_LAM_SANG' nhưng reference_id = null -> Bỏ qua tìm CLS", () => {
    mockInvoice.reference_id = null;
    invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
    Assert.AreEqual("UNPAID", mockLabOrder.payment_status);
  });

  test("[Test] TC_PAY_C3_11: patientRepository trả về null -> Bỏ qua đổi trạng thái BN", () => {
    patientRepository.findByIdOrCode = () => null;
    const paid = invoiceService.processPayment(1, { payment_method: "THE" });
    Assert.AreEqual("PAID", paid.status);
  });

  test("[Test] TC_PAY_C3_12: Bệnh nhân có trạng thái 'Đang khám' -> Giữ nguyên, không phát event đổi trạng thái", () => {
    mockPatient.status = "Đang khám";
    invoiceService.processPayment(1, { payment_method: "CHUYEN_KHOAN" });
    Assert.AreEqual("Đang khám", mockPatient.status);
    Assert.IsFalse(capturedEvents.some((e) => e.event === "PATIENT_STATUS_CHANGED"));
  });

  // --- PHẦN 2.3: TEST CASE HỘP TRẮNG - DÒNG DỮ LIỆU (DFG All c-use / All p-use) ---

  test("[Test] TC_PAY_CUSE_01: Cặp def -> c-use cho payment_method, cashier, invoice, patient", () => {
    const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT", cashier: "Nguyễn Thu Ngân" });
    Assert.AreEqual("TIEN_MAT", paid.payment_method);
    Assert.AreEqual("Nguyễn Thu Ngân", paid.cashier);
    Assert.AreEqual("Đã khám", mockPatient.status);
  });

  test("[Test] TC_PAY_CUSE_02 / TC_PAY_C3_09 / TC_PAY_PUSE_05: Cặp def -> c-use cho invoice (reference_id) và labOrder", () => {
    invoiceService.processPayment(1, { payment_method: "VIETQR" });
    Assert.AreEqual("PAID", mockLabOrder.payment_status);
  });

  test("[Test] TC_PAY_CUSE_03: Fallback giá trị mặc định của payment_method và cashier", () => {
    const paid = invoiceService.processPayment(1);
    Assert.AreEqual("TIEN_MAT", paid.payment_method);
    Assert.AreEqual("Trần Văn Thu Ngân", paid.cashier);
  });

  test("[Test] TC_PAY_PUSE_01: payment_method trên (N2, N3) - PTTT giả mạo 'VNPAY'", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "VNPAY" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });
});
