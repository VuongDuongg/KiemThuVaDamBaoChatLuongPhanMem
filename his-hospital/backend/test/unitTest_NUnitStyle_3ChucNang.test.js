/**
 * BỘ KIỂM THỬ ĐƠN VỊ (UNIT TEST SUITE) DÀNH CHO 3 CHỨC NĂNG CỐT LÕI
 * Áp dụng chuẩn kiến thức và phương pháp luận từ tài liệu: "2 Kiểm thử đơn vị - sd NUnit.pdf"
 * Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, ĐH Thủy Lợi
 * 
 * PHẠM VI KIỂM THỬ 3 CHỨC NĂNG:
 * 1. Lập hóa đơn viện phí (createInvoice & StandardBillingStrategy.calculate)
 * 2. Thanh toán hóa đơn (processPayment, PaymentMethodValidatorStrategy.validate, InvoiceStateMachine.transition)
 * 3. Quản lý danh mục thuốc và tồn kho (createMedicine, updateMedicine, deleteMedicine)
 * 
 * NGUYÊN TẮC ÁP DỤNG TỪ BÀI GIẢNG:
 * - Slide 3: Tên hàm rõ ràng (Test_A_Do_B), mỗi test độc lập, chạy nhanh, không phụ thuộc I/O/DB.
 * - Slide 20 - 22: Cấu trúc TestFixture và Test.
 * - Slide 23 - 26: Sử dụng triệt để các phương thức của lớp Assert (AreEqual, Less, Greater,
 *   LessOrEqual, GreaterOrEqual, IsNull, IsNotNull, IsTrue, IsFalse, Throws).
 */

import { test, describe, beforeEach, afterEach } from "node:test";
import { Assert } from "./helpers/nunitAssert.js";

// Services & Patterns cần kiểm thử (Business Classes)
import { invoiceService } from "../src/services/invoiceService.js";
import { medicineService } from "../src/services/medicineService.js";
import { StandardBillingStrategy, PaymentMethodValidatorStrategy } from "../src/patterns/strategy/billingStrategy.js";
import { InvoiceStateMachine, INVOICE_STATES } from "../src/patterns/state/invoiceState.js";

// Repositories & Events (Được cô lập và mock in-memory để đảm bảo nguyên tắc Unit Test)
import { invoiceRepository } from "../src/repositories/invoiceRepository.js";
import { medicineRepository } from "../src/repositories/medicineRepository.js";
import { patientRepository } from "../src/repositories/patientRepository.js";
import { labRepository as labOrderRepository } from "../src/repositories/labRepository.js";
import { eventBus } from "../src/events/eventBus.js";

// =========================================================================================
// [TestFixture 1]: CHỨC NĂNG LẬP HÓA ĐƠN VIỆN PHÍ (createInvoice & StandardBillingStrategy)
// =========================================================================================
describe("[TestFixture] ChucNang_LapHoaDonVienPhi", () => {
  let mockInvoices = [];
  let capturedEvents = [];
  let nextIdCounter = 100;

  let origFindById, origGetNextId, origCreate, origEmit;

  // [SetUp] theo Slide 3 & Slide 20: Đảm bảo mỗi ca kiểm thử hoàn toàn độc lập
  beforeEach(() => {
    mockInvoices = [];
    capturedEvents = [];
    nextIdCounter = 100;

    origFindById = invoiceRepository.findByIdOrCode;
    origGetNextId = invoiceRepository.getNextId;
    origCreate = invoiceRepository.create;
    origEmit = eventBus.emitEvent;

    invoiceRepository.getNextId = () => ++nextIdCounter;
    invoiceRepository.create = (inv) => {
      mockInvoices.push(inv);
      return inv;
    };
    invoiceRepository.findByIdOrCode = (idOrCode) => {
      return mockInvoices.find((i) => String(i.id) === String(idOrCode) || i.invoice_code === idOrCode);
    };
    eventBus.emitEvent = (event, data) => {
      capturedEvents.push({ event, data });
    };
  });

  // [TearDown]
  afterEach(() => {
    invoiceRepository.findByIdOrCode = origFindById;
    invoiceRepository.getNextId = origGetNextId;
    invoiceRepository.create = origCreate;
    eventBus.emitEvent = origEmit;
  });

  // Test 1: Bỏ trống mã bệnh nhân -> Báo lỗi ArgumentException (400)
  test("[Test] Test_CreateInvoice_ThieuMaBenhNhan_NemNgoaiLe400", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 }),
      (err) => err.statusCode === 400 && err.message.includes("Thiếu thông tin bắt buộc"),
      "Kỳ vọng ném ngoại lệ 400 khi thiếu mã bệnh nhân"
    );
  });

  // Test 2: Bỏ trống tên bệnh nhân -> Báo lỗi ArgumentException (400)
  test("[Test] Test_CreateInvoice_ThieuTenBenhNhan_NemNgoaiLe400", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "", total_amount: 100000 }),
      (err) => err.statusCode === 400 && err.message.includes("Thiếu thông tin bắt buộc"),
      "Kỳ vọng ném ngoại lệ 400 khi thiếu tên bệnh nhân"
    );
  });

  // Test 3: Tổng tiền là null/undefined -> Báo lỗi
  test("[Test] Test_CreateInvoice_TongTienNull_NemNgoaiLe400", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: null }),
      (err) => err.statusCode === 400 && err.message.includes("Thiếu thông tin bắt buộc")
    );
  });

  // Test 4: Tổng tiền không hợp lệ (NaN) -> Báo lỗi nghiệp vụ
  test("[Test] Test_CreateInvoice_TongTienKhongPhaiSo_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: "KHONG_PHAI_SO" }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  // Test 5: Tổng tiền bằng 0 -> Báo lỗi nghiệp vụ
  test("[Test] Test_CreateInvoice_TongTienBangKhong_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: 0 }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  // Test 6: Tổng tiền là số âm -> Báo lỗi nghiệp vụ
  test("[Test] Test_CreateInvoice_TongTienAm_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: -50000 }),
      /Tổng tiền hóa đơn phải lớn hơn 0/
    );
  });

  // Test 7: Mức giảm trừ bảo hiểm là số âm -> Báo lỗi nghiệp vụ
  test("[Test] Test_CreateInvoice_GiamTruBHYTAm_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: -10000 }),
      /Mức giảm trừ bảo hiểm không được là số âm/
    );
  });

  // Test 8: Mức giảm trừ bảo hiểm vượt quá tổng tiền -> Báo lỗi nghiệp vụ
  test("[Test] Test_CreateInvoice_GiamTruBHYTVuotQuaTongTien_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.createInvoice({ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: 250000 }),
      /Mức giảm trừ bảo hiểm không hợp lệ \(vượt quá tổng tiền\)/
    );
  });

  // Test 9: Lập hóa đơn chưa thanh toán -> Trạng thái UNPAID
  test("[Test] Test_CreateInvoice_ChuaThanhToan_TrangThaiUNPAID_ThanhCong", () => {
    const invoice = invoiceService.createInvoice({
      patient_code: "BN001",
      patient_name: "Nguyễn Văn An",
      total_amount: 300000,
      insurance_discount: 60000,
      payment_method: "CHUA_THANH_TOAN"
    });

    Assert.IsNotNull(invoice, "Hóa đơn sinh ra không được null");
    Assert.AreEqual("UNPAID", invoice.status, "Trạng thái hóa đơn phải là UNPAID");
    Assert.AreEqual(240000, invoice.patient_pay, "Số tiền bệnh nhân nộp phải bằng 300000 - 60000 = 240000");
    Assert.Less(invoice.patient_pay, invoice.total_amount, "Tiền bệnh nhân nộp phải nhỏ hơn tổng số tiền");
    Assert.Greater(invoice.patient_pay, 0, "Tiền bệnh nhân nộp phải lớn hơn 0");
    Assert.AreEqual(1, capturedEvents.length, "Phải phát 1 sự kiện INVOICE_CREATED");
  });

  // Test 10: Lập hóa đơn thanh toán ngay bằng tiền mặt -> Trạng thái PAID
  test("[Test] Test_CreateInvoice_ThanhToanNgay_TrangThaiPAID_ThanhCong", () => {
    const invoice = invoiceService.createInvoice({
      patient_code: "BN002",
      patient_name: "Trần Thị Bình",
      total_amount: 150000,
      insurance_discount: 0,
      payment_method: "TIEN_MAT"
    });

    Assert.AreEqual("PAID", invoice.status, "Trạng thái hóa đơn phải là PAID khi chọn TIEN_MAT");
    Assert.AreEqual(150000, invoice.patient_pay, "Số tiền nộp phải bằng đúng tổng tiền");
    Assert.AreEqual("TIEN_MAT", invoice.payment_method);
  });

  // Test 11: Tính toán BHYT chi trả 100% (patient_pay = 0)
  test("[Test] Test_StandardBillingStrategy_ChiTraToanBo_PatientPayBangKhong", () => {
    const strategy = new StandardBillingStrategy();
    const result = strategy.calculate(500000, 500000);

    Assert.AreEqual(500000, result.totalAmount);
    Assert.AreEqual(500000, result.insuranceDiscount);
    Assert.AreEqual(0, result.patientPay, "BHYT chi trả toàn bộ thì bệnh nhân trả 0đ");
    Assert.LessOrEqual(result.patientPay, result.totalAmount);
    Assert.GreaterOrEqual(result.patientPay, 0);
  });

  // Test 12: Không truyền BHYT -> Mặc định bằng 0 và gán đầy đủ giá trị mặc định
  test("[Test] Test_CreateInvoice_GiaTriMacDinh_ThanhCong", () => {
    const invoice = invoiceService.createInvoice({
      patient_code: "BN003",
      patient_name: "Lê Văn Cường",
      total_amount: 250000
    });

    Assert.AreEqual(0, invoice.insurance_discount, "Mặc định BHYT giảm trừ bằng 0");
    Assert.AreEqual(250000, invoice.patient_pay);
    Assert.AreEqual("TIEN_KHAM", invoice.item_type, "Mặc định loại dịch vụ là TIEN_KHAM");
    Assert.AreEqual("Trần Văn Thu Ngân", invoice.cashier, "Mặc định thu ngân viên");
    Assert.IsTrue(invoice.invoice_code.startsWith("HD"), "Mã hóa đơn phải có tiền tố HD");
  });
});

// =========================================================================================
// [TestFixture 2]: CHỨC NĂNG THANH TOÁN HÓA ĐƠN VIỆN PHÍ (processPayment & State Machine)
// =========================================================================================
describe("[TestFixture] ChucNang_ThanhToanHoaDonVienPhi", () => {
  let mockInvoice = null;
  let mockPatient = null;
  let mockLabOrder = null;
  let capturedEvents = [];

  let origFindInvoice, origFindPatient, origFindLabOrder, origEmit;

  // [SetUp]: Chuẩn bị thực thể hóa đơn UNPAID và các đối tượng liên quan
  beforeEach(() => {
    capturedEvents = [];

    mockInvoice = {
      id: 1,
      invoice_code: "HD0001",
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

    invoiceRepository.findByIdOrCode = (id) => (String(id) === "1" || id === "HD0001" ? mockInvoice : null);
    patientRepository.findByIdOrCode = (code) => (code === "BN000001" ? mockPatient : null);
    labOrderRepository.findOrderByIdOrCode = (id) => (id === "CLS000001" ? mockLabOrder : null);
    eventBus.emitEvent = (event, data) => capturedEvents.push({ event, data });
  });

  // [TearDown]
  afterEach(() => {
    invoiceRepository.findByIdOrCode = origFindInvoice;
    patientRepository.findByIdOrCode = origFindPatient;
    labOrderRepository.findOrderByIdOrCode = origFindLabOrder;
    eventBus.emitEvent = origEmit;
  });

  // Test 1: Phương thức thanh toán rỗng hoặc null -> Báo lỗi ngoại lệ
  test("[Test] Test_ProcessPayment_PhuongThucThanhToanRong_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });

  // Test 2: Phương thức thanh toán không nằm trong danh mục hỗ trợ -> Báo lỗi
  test("[Test] Test_ProcessPayment_PhuongThucKhongHoTro_NemNgoaiLe", () => {
    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "TIEN_AO_BITCOIN" }),
      /Phương thức thanh toán không hợp lệ/
    );
  });

  // Test 3: Hóa đơn không tồn tại trên hệ thống -> Báo lỗi 404
  test("[Test] Test_ProcessPayment_HoaDonKhongTonTai_NemNgoaiLe404", () => {
    Assert.Throws(
      () => invoiceService.processPayment(99999, { payment_method: "TIEN_MAT" }),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy hóa đơn")
    );
  });

  // Test 4: Hóa đơn đã thanh toán trước đó cố tình thanh toán lại -> Báo lỗi 400
  test("[Test] Test_ProcessPayment_HoaDonDaThanhToanTruocDo_NemNgoaiLe400", () => {
    mockInvoice.status = INVOICE_STATES.PAID;

    Assert.Throws(
      () => invoiceService.processPayment(1, { payment_method: "TIEN_MAT" }),
      (err) => err.statusCode === 400 && err.message.includes("Hóa đơn này đã được thanh toán trước đó")
    );
  });

  // Test 5: Thanh toán hợp lệ bằng tiền mặt -> Chuyển trạng thái PAID và cập nhật thông tin
  test("[Test] Test_ProcessPayment_ThanhToanTienMat_TrangThaiChuyenSangPAID_ThanhCong", () => {
    const paid = invoiceService.processPayment(1, {
      payment_method: "TIEN_MAT",
      cashier: "Lê Thị Thu Ngân"
    });

    Assert.AreEqual(INVOICE_STATES.PAID, paid.status, "Trạng thái hóa đơn phải chuyển sang PAID");
    Assert.AreEqual("TIEN_MAT", paid.payment_method);
    Assert.AreEqual("Lê Thị Thu Ngân", paid.cashier);
    Assert.IsNotNull(paid.paid_at, "Thời gian thanh toán paid_at phải được ghi nhận");
  });

  // Test 6: Thanh toán hợp lệ qua VietQR và kiểm tra phát sự kiện INVOICE_PAID
  test("[Test] Test_ProcessPayment_ThanhToanVietQR_PhatSuKienThanhToan", () => {
    const paid = invoiceService.processPayment("HD0001", {
      payment_method: "VIETQR",
      cashier: "Trần Văn Thu Ngân"
    });

    Assert.AreEqual("PAID", paid.status);
    Assert.AreEqual("VIETQR", paid.payment_method);
    Assert.IsTrue(capturedEvents.some((e) => e.event === "INVOICE_PAID"), "Phải phát tán sự kiện INVOICE_PAID");
  });

  // Test 7: Đồng bộ trạng thái phiếu chỉ định cận lâm sàng sang PAID
  test("[Test] Test_ProcessPayment_HoaDonCanLamSang_DongBoTrangThaiLabOrderSangPAID", () => {
    invoiceService.processPayment(1, { payment_method: "CHUYEN_KHOAN" });

    Assert.AreEqual("PAID", mockLabOrder.payment_status, "Phiếu cận lâm sàng phải được đồng bộ sang PAID");
  });

  // Test 8: Đồng bộ trạng thái bệnh nhân từ 'Chờ thanh toán' sang 'Đã khám'
  test("[Test] Test_ProcessPayment_BenhNhanDangChoThanhToan_DongBoSangDaKham", () => {
    invoiceService.processPayment(1, { payment_method: "THE" });

    Assert.AreEqual("Đã khám", mockPatient.status, "Trạng thái bệnh nhân phải được chuyển thành 'Đã khám'");
    Assert.IsTrue(capturedEvents.some((e) => e.event === "PATIENT_STATUS_CHANGED"), "Phải phát sự kiện chuyển trạng thái bệnh nhân");
  });

  // Test 9: Kiểm tra State Machine canTransition (UNPAID -> PAID là hợp lệ)
  test("[Test] Test_InvoiceStateMachine_CanTransition_UNPAID_Sang_PAID_TraVeTrue", () => {
    const check = InvoiceStateMachine.canTransition(INVOICE_STATES.UNPAID, INVOICE_STATES.PAID);
    Assert.IsTrue(check.isValid, "Chuyển từ UNPAID sang PAID phải hợp lệ");
  });

  // Test 10: Kiểm tra State Machine canTransition (PAID -> CANCELLED bị cấm)
  test("[Test] Test_InvoiceStateMachine_CanTransition_PAID_Sang_CANCELLED_TraVeFalse", () => {
    const check = InvoiceStateMachine.canTransition(INVOICE_STATES.PAID, INVOICE_STATES.CANCELLED);
    Assert.IsFalse(check.isValid, "Chuyển từ PAID sang CANCELLED phải bị cấm");
    Assert.IsNotNull(check.reason, "Phải có lý do từ chối chuyển trạng thái");
  });

  // Test 11: Kiểm tra Validator phương thức thanh toán
  test("[Test] Test_PaymentMethodValidatorStrategy_CacPhuongThucHopLe", () => {
    ["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"].forEach((method) => {
      Assert.IsTrue(PaymentMethodValidatorStrategy.validate(method), `Phương thức ${method} phải hợp lệ`);
    });
  });
});

// =========================================================================================
// [TestFixture 3]: CHỨC NĂNG QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO (MedicineService)
// =========================================================================================
describe("[TestFixture] ChucNang_QuanLyDanhMucThuocVaTonKho", () => {
  let mockStore = [];
  let capturedEvents = [];
  let idCounter = 10;

  let origFindById, origFindAll, origCreate, origGetNextId, origEmit;

  // [SetUp]: Khởi tạo kho thuốc mẫu in-memory trước mỗi test
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

  // [TearDown]
  afterEach(() => {
    medicineRepository.findByIdOrCode = origFindById;
    medicineRepository.findAll = origFindAll;
    medicineRepository.create = origCreate;
    medicineRepository.getNextId = origGetNextId;
    eventBus.emitEvent = origEmit;
  });

  // --- THAO TÁC 1: THÊM MỚI THUỐC (createMedicine) ---

  // Test 1: Tên thuốc để trống -> Báo lỗi 400
  test("[Test] Test_CreateMedicine_TenThuocRong_NemNgoaiLe400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "   ", unit_price: 5000 }),
      (err) => err.statusCode === 400 && err.message.includes("Tên thuốc là bắt buộc")
    );
  });

  // Test 2: Đơn giá thuốc không truyền (undefined) -> Báo lỗi 400
  test("[Test] Test_CreateMedicine_DonGiaUndefined_NemNgoaiLe400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Ibuprofen 400mg" }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  // Test 3: Đơn giá thuốc bằng 0 -> Báo lỗi 400
  test("[Test] Test_CreateMedicine_DonGiaBangKhong_NemNgoaiLe400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Ibuprofen 400mg", unit_price: 0 }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  // Test 4: Đơn giá thuốc là số âm -> Báo lỗi 400
  test("[Test] Test_CreateMedicine_DonGiaAm_NemNgoaiLe400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Ibuprofen 400mg", unit_price: -2500 }),
      /Đơn giá thuốc phải lớn hơn 0/
    );
  });

  // Test 5: Số lượng tồn kho khởi tạo là số âm -> Báo lỗi 400
  test("[Test] Test_CreateMedicine_SoLuongTonKhoAm_NemNgoaiLe400", () => {
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Ibuprofen 400mg", unit_price: 2500, stock_quantity: -10 }),
      /Số lượng tồn kho không được là số âm/
    );
  });

  // Test 6: Thêm thuốc hợp lệ -> Sinh mã MED chuẩn và phát sự kiện MEDICINE_ADDED
  test("[Test] Test_CreateMedicine_DuLieuHopLe_ThemThanhCong_SinhMaMEDChuan", () => {
    const med = medicineService.createMedicine({
      medicine_name: "  Klacid 500mg  ",
      active_ingredient: "  Clarithromycin  ",
      unit_price: 25000,
      stock_quantity: 200,
      unit: "Hộp",
      category: "Kháng sinh"
    });

    Assert.IsNotNull(med, "Thuốc tạo mới không được null");
    Assert.AreEqual("Klacid 500mg", med.medicine_name, "Tên thuốc phải được cắt khoảng trắng thừa");
    Assert.AreEqual("Clarithromycin", med.active_ingredient);
    Assert.AreEqual(25000, med.unit_price);
    Assert.AreEqual(200, med.stock_quantity);
    Assert.Greater(med.stock_quantity, 0, "Tồn kho khởi tạo phải lớn hơn 0");
    Assert.IsTrue(med.medicine_code.startsWith("MED"), "Mã thuốc phải có tiền tố MED");
    Assert.AreEqual("MED011", med.medicine_code);
    Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_ADDED"));
  });

  // Test 7: Thêm thuốc với các giá trị mặc định (Viên, Khác, 2027-12-31)
  test("[Test] Test_CreateMedicine_GiaTriMacDinh_DonViVien_DanhMucKhac", () => {
    const med = medicineService.createMedicine({
      medicine_name: "Vitamin B6",
      unit_price: 1000
    });

    Assert.AreEqual("Viên", med.unit, "Mặc định đơn vị tính là Viên");
    Assert.AreEqual("Khác", med.category, "Mặc định danh mục là Khác");
    Assert.AreEqual(0, med.stock_quantity, "Mặc định số lượng tồn kho bằng 0");
    Assert.AreEqual("2027-12-31", med.expiry_date, "Mặc định hạn sử dụng 2027-12-31");
  });

  // --- THAO TÁC 2: CẬP NHẬT THUỐC (updateMedicine) ---

  // Test 8: Cập nhật thuốc không tồn tại -> Báo lỗi 404
  test("[Test] Test_UpdateMedicine_MaThuocKhongTonTai_NemNgoaiLe404", () => {
    Assert.Throws(
      () => medicineService.updateMedicine(99999, { stock_quantity: 100 }),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
    );
  });

  // Test 9: Cập nhật số lượng tồn kho và đơn giá thành công
  test("[Test] Test_UpdateMedicine_CapNhatTonKhoVaDonGia_ThanhCong", () => {
    const updated = medicineService.updateMedicine(1, {
      stock_quantity: 1200,
      unit_price: 1800
    });

    Assert.AreEqual(1200, updated.stock_quantity, "Số lượng tồn kho phải được cập nhật thành 1200");
    Assert.AreEqual(1800, updated.unit_price, "Đơn giá phải được cập nhật thành 1800");
    Assert.AreEqual("Paracetamol 500mg", updated.medicine_name, "Tên thuốc cũ phải được giữ nguyên");
    Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_STOCK_UPDATED"));
  });

  // Test 10: Cập nhật theo mã thuốc medicine_code và chuẩn hóa tên
  test("[Test] Test_UpdateMedicine_CapNhatTheoMa_CatKhoangTrangThanhCong", () => {
    const updated = medicineService.updateMedicine("MED002", {
      medicine_name: "  Amoxicillin 500mg (Hộp 10 vỉ)  ",
      category: "Kháng sinh liều cao"
    });

    Assert.AreEqual("Amoxicillin 500mg (Hộp 10 vỉ)", updated.medicine_name);
    Assert.AreEqual("Kháng sinh liều cao", updated.category);
  });

  // --- THAO TÁC 3: XÓA THUỐC (deleteMedicine) ---

  // Test 11: Xóa thuốc không tồn tại -> Báo lỗi 404
  test("[Test] Test_DeleteMedicine_MaThuocKhongTonTai_NemNgoaiLe404", () => {
    Assert.Throws(
      () => medicineService.deleteMedicine(99999),
      (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
    );
  });

  // Test 12: Xóa thuốc thành công khỏi danh mục kho
  test("[Test] Test_DeleteMedicine_ThuocTonTai_XoaKhoiDanhSachThanhCong", () => {
    const initialCount = mockStore.length;
    const deleted = medicineService.deleteMedicine(1);

    Assert.IsNotNull(deleted, "Thuốc xóa phải trả về đối tượng đã xóa");
    Assert.AreEqual("MED001", deleted.medicine_code);
    Assert.AreEqual(initialCount - 1, mockStore.length, "Số lượng thuốc trong kho phải giảm đi 1");

    // Kiểm tra tìm lại thuốc vừa xóa phải trả về null hoặc undefined
    const searchAgain = medicineRepository.findByIdOrCode(1);
    Assert.IsNull(searchAgain, "Thuốc đã xóa khi tìm lại phải là null hoặc undefined");
  });
});
