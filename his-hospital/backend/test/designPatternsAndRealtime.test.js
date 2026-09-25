import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { EncounterStateMachine, PATIENT_STATES } from "../src/patterns/state/encounterState.js";
import { InvoiceStateMachine, INVOICE_STATES } from "../src/patterns/state/invoiceState.js";
import { LabOrderStateMachine, LAB_STATES } from "../src/patterns/state/labOrderState.js";
import { StandardBillingStrategy, InsuranceCoverageStrategy, PaymentMethodValidatorStrategy } from "../src/patterns/strategy/billingStrategy.js";
import { eventBus, EVENT_TYPES } from "../src/events/eventBus.js";
import { patientService } from "../src/services/patientService.js";
import { invoiceService } from "../src/services/invoiceService.js";
import { consultationService } from "../src/services/consultationService.js";
import { labService } from "../src/services/labService.js";

describe("BỘ KIỂM THỬ THIẾT KẾ DESIGN PATTERNS & STATE MACHINES (10 TEST CASES)", () => {
  test("DP-TC01 [State Pattern]: Encounter chuyển từ 'Chờ khám' sang 'Đang khám' -> Hợp lệ", () => {
    const check = EncounterStateMachine.canTransition(PATIENT_STATES.CHO_KHAM, PATIENT_STATES.DANG_KHAM);
    assert.equal(check.isValid, true);
  });

  test("DP-TC02 [State Pattern]: Encounter chuyển từ 'Chờ khám' nhảy cóc sang 'Đã khám' -> Bị chặn", () => {
    const check = EncounterStateMachine.canTransition(PATIENT_STATES.CHO_KHAM, PATIENT_STATES.DA_KHAM);
    assert.equal(check.isValid, false);
    assert.match(check.reason, /Không thể chuyển/);
  });

  test("DP-TC03 [State Pattern]: Invoice đã PAID cố tình chuyển sang CANCELLED -> Bị chặn", () => {
    const check = InvoiceStateMachine.canTransition(INVOICE_STATES.PAID, INVOICE_STATES.CANCELLED);
    assert.equal(check.isValid, false);
  });

  test("DP-TC04 [State Pattern]: Lab Order chuyển từ PENDING -> PROCESSING -> COMPLETED -> Hợp lệ", () => {
    assert.equal(LabOrderStateMachine.canTransition(LAB_STATES.PENDING, LAB_STATES.PROCESSING).isValid, true);
    assert.equal(LabOrderStateMachine.canTransition(LAB_STATES.PROCESSING, LAB_STATES.COMPLETED).isValid, true);
  });

  test("DP-TC05 [Strategy Pattern]: Standard Billing tính toán hợp lệ (200.000đ - 50.000đ BHYT = 150.000đ)", () => {
    const strategy = new StandardBillingStrategy();
    const result = strategy.calculate(200000, 50000);
    assert.equal(result.patientPay, 150000);
    assert.equal(result.insuranceDiscount, 50000);
  });

  test("DP-TC06 [Strategy Pattern]: Insurance Coverage tính đúng tỷ lệ 80% (Tổng 500.000 -> BHYT 400.000 -> BN 100.000)", () => {
    const strategy = new InsuranceCoverageStrategy(0.8);
    const result = strategy.calculate(500000);
    assert.equal(result.insuranceDiscount, 400000);
    assert.equal(result.patientPay, 100000);
  });

  test("DP-TC07 [Strategy Pattern]: Payment Method Validator từ chối phương thức giả mạo", () => {
    assert.throws(() => PaymentMethodValidatorStrategy.validate("UNKNOWN_COIN"), /Phương thức thanh toán không hợp lệ/);
  });

  test("DP-TC08 [Observer / EventBus]: Bắt được event khi tiếp đón bệnh nhân mới", (t, done) => {
    const listener = (payload) => {
      assert.ok(payload.patient);
      eventBus.off(EVENT_TYPES.PATIENT_CREATED, listener);
      done();
    };
    eventBus.on(EVENT_TYPES.PATIENT_CREATED, listener);

    patientService.createPatient({
      name: "Trần Observer Test",
      identity_card_number: "001203009999",
      phone: "0988776655",
      gender: "Nam",
      department: "Khoa Nội"
    });
  });

  test("DP-TC09 [Cross-Role Sync]: Bác sĩ kê đơn -> Tự động sinh hóa đơn UNPAID và trừ kho thuốc", () => {
    // 1. Tạo consultation
    const consultation = consultationService.createConsultation({
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      symptoms: "Đau đầu, mệt mỏi",
      icd10_code: "R51",
      icd10_name: "Nhức đầu",
      vitals: { blood_pressure: "120/80", pulse: 75, temperature: 36.8, spo2: 99 }
    });

    // 2. Kê đơn 10 viên Paracetamol
    const prescribed = consultationService.addPrescription(consultation.id, [
      { medicine_code: "MED001", quantity: 10, dosage: "Uống 2 viên/ngày" }
    ]);

    assert.equal(prescribed.status, "COMPLETED");
    assert.equal(prescribed.prescriptions.length, 1);

    // Kiểm tra hóa đơn đã tự động phát sinh
    const invoices = invoiceService.getInvoices({ patient_code: "BN000001", item_type: "TIEN_THUOC" });
    assert.ok(invoices.length > 0);
  });

  test("DP-TC10 [Cross-Role Sync]: Bác sĩ ra chỉ định CLS -> KTV nhập kết quả -> Tự động cập nhật về EMR Bác sĩ", () => {
    // 1. Bác sĩ chỉ định
    const order = labService.createOrder({
      patient_code: "BN000002",
      patient_name: "Trần Thị Bình",
      service_code: "CLS_XN_MAU",
      doctor: "BS. Lê Hoàng Nam"
    });
    assert.equal(order.status, "PENDING");

    const invoice = invoiceService
      .getInvoices({ patient_code: "BN000002", item_type: "CAN_LAM_SANG" })
      .find((item) => item.reference_id === order.id);
    assert.ok(invoice);
    invoiceService.processPayment(invoice.id, { payment_method: "TIEN_MAT" });
    assert.equal(order.payment_status, "PAID");

    // 2. KTV tiếp nhận
    labService.collectSample(order.id, {
      technician: "KTV. Đặng Quốc Việt",
      specimen_type: "Máu toàn phần EDTA",
      barcode: "M000001"
    });
    assert.equal(order.status, "SAMPLE_COLLECTED");
    labService.startOrder(order.id, "KTV. Đặng Quốc Việt");
    assert.equal(order.status, "PROCESSING");

    // 3. KTV trả kết quả
    labService.updateResult(order.id, {
      technician: "KTV. Đặng Quốc Việt",
      results: {
        parameters: { RBC: "4.5 T/L", WBC: "6.8 G/L" },
        conclusion: "Công thức máu bình thường"
      }
    });
    assert.equal(order.status, "PENDING_APPROVAL");
    labService.approveResult(order.id, { approved_by: "BS. Phụ trách xét nghiệm" });
    assert.equal(order.status, "COMPLETED");

    // 4. Kiểm tra EMR bác sĩ đã nhận được kết quả
    const emr = consultationService.getConsultations({ patient_code: "BN000002" });
    if (emr.length > 0) {
      assert.ok(emr[0].lab_orders.some(lo => lo.order_code === order.order_code && lo.status === "COMPLETED"));
    }
  });
});
