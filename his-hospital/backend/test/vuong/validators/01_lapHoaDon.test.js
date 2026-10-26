/**
 * BỘ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG (UNIT TESTING - NUNIT STYLE)
 * CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-05)
 * Tác giả: Vũ Đức Vương
 * Tài liệu tham chiếu: "Kiểm thử đơn vị - sd NUnit.pdf" (ThS. Nguyễn Thị Phương Dung)
 * 
 * PHẠM VI TEST CASE:
 * - Hộp đen & Biên: TC_F5_01 -> TC_F5_14
 * - Hộp trắng CFG: C1 (Statement), C2 (Branch), C3 (Multiple Condition)
 * - Hộp trắng DFG: All c-use / All p-use / Def-Use
 */

import { test, describe, beforeEach, afterEach } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";

// Services & Patterns
import { invoiceService } from "../../../src/services/invoiceService.js";
import { validateInvoiceCreationInput } from "../../../src/validators/invoiceValidator.js";

// Repositories & EventBus (Mock in-memory cô lập chuẩn Unit Test)
import { invoiceRepository } from "../../../src/repositories/invoiceRepository.js";
import { patientRepository } from "../../../src/repositories/patientRepository.js";
import { eventBus } from "../../../src/events/eventBus.js";

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
