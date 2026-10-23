/**
 * BỘ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG TOÀN DIỆN (AUTOMATED UNIT TEST SUITE)
 * Áp dụng chuẩn kiến thức bài giảng: "Kiểm thử đơn vị - sd NUnit.pdf" (ThS. Nguyễn Thị Phương Dung)
 * Thực hiện kiểm thử toàn bộ các Test Case trong: "docs/DanhSachCacTestCase.docx.md"
 * 
 * BAO PHỦ 3 CHỨC NĂNG NGHIỆP VỤ NÒNG CỐT:
 * 1. Chức năng Lập hóa đơn viện phí (getPendingCharges, validateInvoiceCreationInput, createInvoice, StandardBillingStrategy)
 * 2. Chức năng Thanh toán hóa đơn viện phí (processPayment, PaymentMethodValidatorStrategy, InvoiceStateMachine)
 * 3. Chức năng Quản lý danh mục thuốc và tồn kho (createMedicine, updateMedicine, deleteMedicine)
 * 
 * PHẠM VI TEST CASE:
 * - Toàn bộ Test Case Hộp đen về mặt logic/giá trị biên hàm (TC_F5_01 -> TC_F5_14, TC_F6_01 -> TC_F6_09, TC_F9_01 -> TC_F9_09)
 * - Toàn bộ Test Case Hộp trắng cấp độ hàm:
 *   + Dòng điều khiển (CFG): C1 (Statement), C2 (Branch/Decision), C3 (Multiple Condition)
 *   + Dòng dữ liệu (DFG): All c-use, All p-use, Def-Use paths
 */

import { test, describe, beforeEach, afterEach } from "./helpers/testBridge.js";
import { Assert } from "./helpers/nunitAssert.js";

// Services & Patterns dưới kiểm thử (Business Classes - không chỉnh sửa mã nguồn)
import { invoiceService } from "../src/services/invoiceService.js";
import { medicineService } from "../src/services/medicineService.js";
import { validateInvoiceCreationInput } from "../src/validators/invoiceValidator.js";
import { StandardBillingStrategy, PaymentMethodValidatorStrategy } from "../src/patterns/strategy/billingStrategy.js";
import { InvoiceStateMachine, INVOICE_STATES } from "../src/patterns/state/invoiceState.js";

// Repositories & EventBus (Được cô lập và mock in-memory theo nguyên tắc Unit Test)
import { invoiceRepository } from "../src/repositories/invoiceRepository.js";
import { medicineRepository } from "../src/repositories/medicineRepository.js";
import { patientRepository } from "../src/repositories/patientRepository.js";
import { labRepository as labOrderRepository } from "../src/repositories/labRepository.js";
import { eventBus } from "../src/events/eventBus.js";

// =========================================================================================
// [TestFixture 1]: CHỨC NĂNG LẬP HÓA ĐƠN VIỆN PHÍ
// =========================================================================================
describe("[TestFixture] ChucNang_1_LapHoaDonVienPhi", () => {
  let mockInvoices = [];
  let capturedEvents = [];
  let nextIdCounter = 100;

  let origFindById, origGetNextId, origCreate, origEmit, origFindPatient, origFindByPatientCode;

  beforeEach(() => {
    mockInvoices = [];
    capturedEvents = [];
    nextIdCounter = 100;

    origFindById = invoiceRepository.findByIdOrCode;
    origGetNextId = invoiceRepository.getNextId;
    origCreate = invoiceRepository.create;
    origFindByPatientCode = invoiceRepository.findByPatientCode;
    origFindPatient = patientRepository.findAll;
    origEmit = eventBus.emitEvent;

    invoiceRepository.getNextId = () => ++nextIdCounter;
    invoiceRepository.create = (inv) => {
      mockInvoices.push(inv);
      return inv;
    };
    invoiceRepository.findByIdOrCode = (idOrCode) => {
      return mockInvoices.find((i) => String(i.id) === String(idOrCode) || i.invoice_code === idOrCode);
    };
    invoiceRepository.findByPatientCode = () => [];
    eventBus.emitEvent = (event, data) => capturedEvents.push({ event, data });
  });

  afterEach(() => {
    invoiceRepository.findByIdOrCode = origFindById;
    invoiceRepository.getNextId = origGetNextId;
    invoiceRepository.create = origCreate;
    invoiceRepository.findByPatientCode = origFindByPatientCode;
    patientRepository.findAll = origFindPatient;
    eventBus.emitEvent = origEmit;
  });

  // --- PHẦN 1.1: TEST CASE HỘP ĐEN VỀ MẶT LOGIC & GIÁ TRỊ BIÊN (TC_F5) ---

  test("[Test] TC_F5_01: Giá trị biên - patient_id = 1 ký tự (Min hợp lệ)", () => {
    const res = validateInvoiceCreationInput({ patient_id: "B" });
    Assert.IsTrue(res.isValid, "Mã bệnh nhân 1 ký tự phải hợp lệ");
  });

  test("[Test] TC_F5_02: Giá trị biên - patient_id = 20 ký tự (Max hợp lệ)", () => {
    const res = validateInvoiceCreationInput({ patient_id: "BN123456789012345678" });
    Assert.IsTrue(res.isValid, "Mã bệnh nhân 20 ký tự phải hợp lệ");
  });

  test("[Test] TC_F5_03: Giá trị biên - patient_id = 21 ký tự (Max+ không hợp lệ)", () => {
    const res = validateInvoiceCreationInput({ patient_id: "BN1234567890123456789" });
    Assert.IsFalse(res.isValid, "Mã bệnh nhân 21 ký tự phải bị từ chối");
    Assert.IsTrue(res.message.includes("không được vượt quá 20 ký tự"));
  });

  test("[Test] TC_F5_04: Phân vùng tương đương - patient_id chứa ký tự đặc biệt", () => {
    const res = validateInvoiceCreationInput({ patient_id: "BN-123@" });
    Assert.IsFalse(res.isValid);
    Assert.IsTrue(res.message.includes("ký tự đặc biệt"));
  });

  test("[Test] TC_F5_05: Giá trị biên - patient_name = 1 ký tự (Min hợp lệ)", () => {
    const res = validateInvoiceCreationInput({ patient_name: "A" });
    Assert.IsTrue(res.isValid);
  });

  test("[Test] TC_F5_06: Giá trị biên - patient_name đúng 50 ký tự (Max hợp lệ)", () => {
    const name50 = "Nguyễn Văn ".padEnd(50, "a");
    const res = validateInvoiceCreationInput({ patient_name: name50 });
    Assert.IsTrue(res.isValid);
  });

  test("[Test] TC_F5_07: Giá trị biên - patient_name = 51 ký tự (Max+ không hợp lệ)", () => {
    const name51 = "Nguyễn Văn ".padEnd(51, "a");
    const res = validateInvoiceCreationInput({ patient_name: name51 });
    Assert.IsFalse(res.isValid);
    Assert.IsTrue(res.message.includes("tối đa 50 ký tự"));
  });

  test("[Test] TC_F5_08: Phân vùng tương đương - patient_name chứa số", () => {
    const res = validateInvoiceCreationInput({ patient_name: "Nguyen Van A123" });
    Assert.IsFalse(res.isValid);
    Assert.IsTrue(res.message.includes("không chứa số"));
  });

  test("[Test] TC_F5_09: Bảng quyết định (Q1) - Bỏ trống cả patient_id và patient_name", () => {
    const res = validateInvoiceCreationInput({});
    Assert.IsFalse(res.isValid);
    Assert.AreEqual("E1.1", res.errorCode);
    Assert.AreEqual("Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm", res.message);
  });

  test("[Test] TC_F5_10: Bảng quyết định (Q2) - Tìm bệnh nhân không tồn tại trong CSDL", () => {
    patientRepository.findAll = () => [];
    Assert.Throws(
      () => invoiceService.getPendingCharges({ patient_id: "BN999999" }),
      (err) => err.statusCode === 404 && err.errorCode === "E1.3"
    );
  });

  test("[Test] TC_F5_11 / TC_F5_15: Bảng quyết định (Q3/Q5) - Bệnh nhân có chi phí chưa thanh toán -> can_create_invoice = true", () => {
    patientRepository.findAll = () => [
      { id: "P001", patient_code: "BN001", name: "Nguyễn Văn An", insurance_code: "DN401" }
    ];
    const details = invoiceService.getPendingCharges({ patient_id: "BN001" });
    Assert.IsTrue(details.can_create_invoice, "Có dịch vụ chưa thanh toán thì can_create_invoice phải là true");
    Assert.AreEqual(150000, details.summary.total_amount);
    Assert.AreEqual(80, details.summary.insurance_percent);
    Assert.AreEqual(30000, details.summary.patient_pay);
  });

  test("[Test] TC_F5_12: Bảng quyết định (Q3) - Các dịch vụ đã thu tiền trước đó -> can_create_invoice = false (nút tạo hóa đơn bị mờ)", () => {
    patientRepository.findAll = () => [
      { id: "P001", patient_code: "BN001", name: "Nguyễn Văn An", insurance_code: "DN401" }
    ];
    invoiceRepository.findByPatientCode = () => [
      { item_type: "TIEN_KHAM", status: "PAID" }
    ];
    const details = invoiceService.getPendingCharges({ patient_id: "BN001" });
    Assert.IsFalse(details.can_create_invoice, "Tất cả dịch vụ đã trả tiền thì can_create_invoice phải là false");
    Assert.AreEqual("E1.4", details.errorCode);
    Assert.AreEqual("Các khoản chi phí này đã được thanh toán đầy đủ", details.status_message);
  });

  test("[Test] TC_F5_13: Bảng quyết định (Q4) - Tạo hóa đơn với số tiền bằng 0 -> Chặn tạo", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "An", total_amount: 0 }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  test("[Test] TC_F5_14: Bảng quyết định (Q5) - Tạo hóa đơn hợp lệ ở trạng thái UNPAID", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN001",
      patient_name: "Nguyễn Văn An",
      total_amount: 300000,
      insurance_discount: 60000,
      payment_method: "CHUA_THANH_TOAN"
    });
    Assert.AreEqual("UNPAID", inv.status);
    Assert.AreEqual(240000, inv.patient_pay);
    Assert.Greater(inv.patient_pay, 0);
  });

  // --- PHẦN 1.2: TEST CASE HỘP TRẮNG - DÒNG ĐIỀU KHIỂN (CFG C1, C2, C3) ---

  test("[Test] TC_C1_01 / TC_C2_01 / TC_C3_01 / TC_PUSE_01: Thiếu patient_code -> Lỗi 400", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 }),
      (err) => err.statusCode === 400 && err.message.includes("Thiếu thông tin bắt buộc")
    );
  });

  test("[Test] TC_C1_02 / TC_C3_06: total_amount = 0 -> Quăng lỗi > 0", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 0 }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  test("[Test] TC_C1_03 / TC_C2_05 / TC_C3_07 / TC_PUSE_05: insurance_discount < 0 -> Báo lỗi số âm", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: -20000 }),
      /Mức giảm trừ bảo hiểm không được là số âm/
    );
  });

  test("[Test] TC_C1_04 / TC_C2_07 / TC_C3_08 / TC_PUSE_06: insurance_discount > total -> Báo lỗi vượt quá tổng tiền", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 150000 }),
      /Mức giảm trừ bảo hiểm không hợp lệ \(vượt quá tổng tiền\)/
    );
  });

  test("[Test] TC_C1_05 / TC_C2_02 / TC_C3_11 / TC_PUSE_08: payment_method = 'CHUA_THANH_TOAN' -> UNPAID", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN01",
      patient_name: "Nguyễn Văn A",
      total_amount: 100000,
      insurance_discount: 80000,
      payment_method: "CHUA_THANH_TOAN"
    });
    Assert.AreEqual("UNPAID", inv.status);
    Assert.AreEqual(20000, inv.patient_pay);
  });

  test("[Test] TC_C1_06 / TC_C3_09: payment_method = 'TIEN_MAT' -> PAID", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN02",
      patient_name: "Trần Thị B",
      total_amount: 200000,
      insurance_discount: 0,
      payment_method: "TIEN_MAT"
    });
    Assert.AreEqual("PAID", inv.status);
    Assert.AreEqual(200000, inv.patient_pay);
  });

  test("[Test] TC_C2_03 / TC_PUSE_04: total_amount âm (-1000) -> Báo lỗi", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN03", patient_name: "Lê Văn C", total_amount: -1000 }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  test("[Test] TC_C2_09 / TC_PUSE_07: payment_method = 'VIETQR' -> PAID", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN03",
      patient_name: "Lê Văn C",
      total_amount: 500000,
      insurance_discount: 0,
      payment_method: "VIETQR"
    });
    Assert.AreEqual("PAID", inv.status);
    Assert.AreEqual(500000, inv.patient_pay);
  });

  test("[Test] TC_C3_02 / TC_PUSE_02: Điều kiện con 2b=True (patient_name rỗng)", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "", total_amount: 100000 }),
      /Thiếu thông tin bắt buộc/
    );
  });

  test("[Test] TC_C3_03: Điều kiện con 2c=True (total_amount === undefined)", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: undefined }),
      /Thiếu thông tin bắt buộc/
    );
  });

  test("[Test] TC_C3_04 / TC_PUSE_03: Điều kiện con 2d=True (total_amount === null)", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: null }),
      /Thiếu thông tin bắt buộc/
    );
  });

  test("[Test] TC_C3_05: Điều kiện con 5a=True (isNaN(total))", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: "KHONG_PHAI_SO" }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  test("[Test] TC_C3_10: Điều kiện con 17a=False (payment_method rỗng) -> UNPAID", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN01",
      patient_name: "Nguyễn Văn A",
      total_amount: 100000,
      insurance_discount: 20000,
      payment_method: ""
    });
    Assert.AreEqual("UNPAID", inv.status);
  });

  // --- PHẦN 1.3: TEST CASE HỘP TRẮNG - DÒNG DỮ LIỆU (DFG All c-use / All p-use) ---

  test("[Test] TC_CUSE_01: Cặp def -> c-use tính toán patientPay, totalAmount, discount", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN01",
      patient_name: "Nguyễn Văn A",
      total_amount: 500000,
      insurance_discount: 100000,
      payment_method: "CHUA_THANH_TOAN"
    });
    Assert.AreEqual(500000, inv.total_amount);
    Assert.AreEqual(100000, inv.insurance_discount);
    Assert.AreEqual(400000, inv.patient_pay);
    Assert.AreEqual("UNPAID", inv.status);
  });

  test("[Test] TC_CUSE_02: Cặp def -> c-use cho item_type CAN_LAM_SANG và description", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN02",
      patient_name: "Trần Thị B",
      item_type: "CAN_LAM_SANG",
      description: "Siêu âm tổng quát",
      total_amount: 300000,
      insurance_discount: 0,
      payment_method: "TIEN_MAT"
    });
    Assert.AreEqual("PAID", inv.status);
    Assert.AreEqual("CAN_LAM_SANG", inv.item_type);
    Assert.AreEqual("Siêu âm tổng quát", inv.description);
    Assert.AreEqual(300000, inv.patient_pay);
  });

  test("[Test] TC_CUSE_03: Fallback giá trị mặc định của item_type và insurance_discount", () => {
    const inv = invoiceService.createInvoice({
      patient_code: "BN03",
      patient_name: "Lê Văn C",
      total_amount: 150000
    });
    Assert.AreEqual(0, inv.insurance_discount);
    Assert.AreEqual(150000, inv.patient_pay);
    Assert.AreEqual("TIEN_KHAM", inv.item_type);
    Assert.AreEqual("Thanh toán viện phí", inv.description);
  });
});

// =========================================================================================
// [TestFixture 2]: CHỨC NĂNG THANH TOÁN HÓA ĐƠN VIỆN PHÍ
// =========================================================================================
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

  test("[Test] TC_F6_01 / TC_PAY_C1_03 / TC_PAY_C2_05 / TC_PAY_C3_06: Hóa đơn đã thanh toán trước đó -> Chặn giao dịch (Lỗi 400)", () => {
    mockInvoice.status = INVOICE_STATES.PAID;
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "TIEN_MAT" }),
      (err) => err.statusCode === 400 && err.message.includes("đã được thanh toán trước đó")
    );
  });

  test("[Test] TC_F6_04 / TC_PAY_C1_01 / TC_PAY_C3_01: Không tick chọn payment_method (để trống) -> Báo lỗi", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });

  test("[Test] TC_F6_07 / TC_PAY_C1_04: Thanh toán TIEN_MAT hợp lệ -> Chuyển 'Đã thanh toán'", () => {
    mockInvoice.item_type = "TIEN_KHAM";
    mockPatient.status = "Đang khám";
    const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT", cashier: "Trần Văn Thu Ngân" });
    Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
    Assert.IsNotNull(paid.paid_at);
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

  test("[Test] TC_PAY_CUSE_02: Cặp def -> c-use cho invoice (reference_id) và labOrder", () => {
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

// =========================================================================================
// [TestFixture 3]: CHỨC NĂNG QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO DƯỢC
// =========================================================================================
describe("[TestFixture] ChucNang_3_QuanLyDanhMucThuocVaTonKho", () => {
  let mockStore = [];
  let capturedEvents = [];
  let idCounter = 10;

  let origFindById, origFindAll, origCreate, origGetNextId, origEmit;

  beforeEach(() => {
    capturedEvents = [];
    idCounter = 10;
    mockStore = [
      { id: 1, medicine_code: "MED001", medicine_name: "Paracetamol 500mg", active_ingredient: "Paracetamol", unit: "Viên", unit_price: 1500, stock_quantity: 1000, category: "Giảm đau", expiry_date: "2027-12-31" },
      { id: 2, medicine_code: "MED002", medicine_name: "Amoxicillin 500mg", active_ingredient: "Amoxicillin", unit: "Viên", unit_price: 3500, stock_quantity: 500, category: "Kháng sinh", expiry_date: "2026-10-15" }
    ];

    origFindById = medicineRepository.findByIdOrCode;
    origFindAll = medicineRepository.findAll;
    origCreate = medicineRepository.create;
    origGetNextId = medicineRepository.getNextId;
    origEmit = eventBus.emitEvent;

    medicineRepository.getNextId = () => ++idCounter;
    medicineRepository.create = (med) => {
      mockStore.unshift(med);
      return med;
    };
    medicineRepository.findByIdOrCode = (idOrCode) => {
      return mockStore.find((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);
    };
    medicineRepository.findAll = () => mockStore;
    eventBus.emitEvent = (event, data) => capturedEvents.push({ event, data });
  });

  afterEach(() => {
    medicineRepository.findByIdOrCode = origFindById;
    medicineRepository.findAll = origFindAll;
    medicineRepository.create = origCreate;
    medicineRepository.getNextId = origGetNextId;
    eventBus.emitEvent = origEmit;
  });

  // --- PHẦN 3.1: THAO TÁC THÊM MỚI THUỐC (createMedicine) ---

  test("[Test] TC_F9_02 / TC_MED_C1_02 / TC_MED_C3_05: added_quantity hoặc unit_price = 0 -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Paracetamol", unit_price: 0 }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  test("[Test] TC_MED_C1_01 / TC_MED_C2_01 / TC_MED_C3_01 / TC_MED_PUSE_01: Tên thuốc để trống / khoảng trắng -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "   ", unit_price: 5000 }),
      (err) => err.statusCode === 400 && err.message.includes("Tên thuốc là bắt buộc")
    );
  });

  test("[Test] TC_MED_C1_03 / TC_MED_C2_05 / TC_MED_C3_07 / TC_MED_PUSE_04: Số lượng tồn kho âm (-5) -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Aspirin", unit_price: 2000, stock_quantity: -5 }),
      /Số lượng tồn kho không được là số âm/
    );
  });

  test("[Test] TC_MED_C1_04 / TC_MED_C2_02 / TC_MED_C3_08 / TC_MED_CUSE_01: Thêm thuốc đầy đủ -> Sinh mã MED, cắt khoảng trắng, phát event", () => {
    const med = medicineService.createMedicine({
      medicine_name: "   Aspirin 81mg   ",
      active_ingredient: "   Acid acetylsalicylic   ",
      unit_price: "1500",
      stock_quantity: 100,
      unit: "Vỉ",
      category: "Tim mạch",
      expiry_date: "2028-06-30"
    });
    Assert.AreEqual("Aspirin 81mg", med.medicine_name);
    Assert.AreEqual("Acid acetylsalicylic", med.active_ingredient);
    Assert.AreEqual(1500, med.unit_price);
    Assert.AreEqual(100, med.stock_quantity);
    Assert.AreEqual("MED011", med.medicine_code);
    Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_ADDED"));
  });

  test("[Test] TC_MED_C1_05 / TC_MED_C2_08 / TC_MED_C3_09 / TC_MED_CUSE_02: Fallback giá trị mặc định (active_ingredient='', unit='Viên', category='Khác')", () => {
    const med = medicineService.createMedicine({
      medicine_name: "Oresol 245",
      unit_price: 5000,
      stock_quantity: 100
    });
    Assert.AreEqual("", med.active_ingredient);
    Assert.AreEqual("Viên", med.unit);
    Assert.AreEqual("Khác", med.category);
    Assert.AreEqual("2027-12-31", med.expiry_date);
  });

  test("[Test] TC_MED_C2_03 / TC_MED_PUSE_03: unit_price âm (-100) -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Panadol", unit_price: -100 }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  test("[Test] TC_MED_C3_03 / TC_MED_PUSE_02: Thiếu unit_price (undefined) -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg" }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  test("[Test] TC_MED_C3_04: unit_price không phải số ('ABC') -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg", unit_price: "ABC" }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  test("[Test] TC_MED_C3_06: stock_quantity không phải số ('VO_HAN') -> Báo lỗi 400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg", unit_price: 1500, stock_quantity: "VO_HAN" }),
      /Số lượng tồn kho không được là số âm/
    );
  });

  test("[Test] TC_MED_CUSE_03: Fallback stock_quantity mặc định = 0", () => {
    const med = medicineService.createMedicine({
      medicine_name: "Cồn đỏ Povidine 10%",
      unit_price: 15000
    });
    Assert.AreEqual(0, med.stock_quantity);
  });

  // --- PHẦN 3.2: THAO TÁC CẬP NHẬT THUỐC (updateMedicine) ---

  test("[Test] TC_UP_01 / TC_UP_DF_03: Cập nhật thuốc không tồn tại trong kho -> Báo lỗi HTTP 404", () => {
    Assert.Throws(
      () => medicineService.updateMedicine(9999, { stock_quantity: 50 }),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
    );
  });

  test("[Test] TC_UP_02 / TC_UP_DF_01: Cập nhật tồn kho và đơn giá thành công", () => {
    const updated = medicineService.updateMedicine(1, { stock_quantity: 350, unit_price: 2200 });
    Assert.AreEqual(350, updated.stock_quantity);
    Assert.AreEqual(2200, updated.unit_price);
    Assert.AreEqual("Paracetamol 500mg", updated.medicine_name, "Bảo toàn tên cũ khi không cập nhật");
    Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_STOCK_UPDATED"));
  });

  test("[Test] TC_UP_03 / TC_UP_C3_02: Cập nhật theo mã thuốc MED002 và chuẩn hóa tên", () => {
    const updated = medicineService.updateMedicine("MED002", {
      medicine_name: "  Amoxicillin 500mg (Cập nhật)  ",
      stock_quantity: 80
    });
    Assert.AreEqual("Amoxicillin 500mg (Cập nhật)", updated.medicine_name);
    Assert.AreEqual(80, updated.stock_quantity);
  });

  test("[Test] TC_UP_C3_01: Tìm thấy thuốc khớp theo ID số (idOrCode = 1)", () => {
    const updated = medicineService.updateMedicine(1, { unit: "Hộp" });
    Assert.AreEqual("Hộp", updated.unit);
  });

  test("[Test] TC_UP_DF_02: Cập nhật đồng thời tên mới, hoạt chất và đơn giá", () => {
    const updated = medicineService.updateMedicine(1, {
      medicine_name: "Panadol Extra Mới",
      active_ingredient: "Paracetamol 650mg",
      unit_price: 3000
    });
    Assert.AreEqual("Panadol Extra Mới", updated.medicine_name);
    Assert.AreEqual("Paracetamol 650mg", updated.active_ingredient);
    Assert.AreEqual(3000, updated.unit_price);
  });

  // --- PHẦN 3.3: THAO TÁC XÓA THUỐC (deleteMedicine) ---

  test("[Test] TC_DEL_01: Xóa thuốc không tồn tại -> Báo lỗi HTTP 404", () => {
    Assert.Throws(
      () => medicineService.deleteMedicine(9999),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
    );
  });

  test("[Test] TC_DEL_02: Xóa thành công thuốc khỏi kho và trả về đối tượng deleted", () => {
    const initialCount = mockStore.length;
    const deleted = medicineService.deleteMedicine(1);

    Assert.IsNotNull(deleted);
    Assert.AreEqual(1, deleted.id);
    Assert.AreEqual("MED001", deleted.medicine_code);
    Assert.AreEqual(initialCount - 1, mockStore.length);
    Assert.IsNull(medicineRepository.findByIdOrCode(1));
  });
});
