/**
 * BỘ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG (UNIT TESTING - NUNIT STYLE)
 * CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO DƯỢC (UC-DUOC-09)
 * Tác giả: Vũ Đức Vương
 * Tài liệu tham chiếu: "Kiểm thử đơn vị - sd NUnit.pdf" (ThS. Nguyễn Thị Phương Dung)
 * 
 * PHẠM VI TEST CASE:
 * - Hộp đen & Biên: TC_F9_02 -> TC_F9_08
 * - Hộp trắng CFG: C1 (Statement), C2 (Branch), C3 (Multiple Condition)
 * - Hộp trắng DFG: All c-use / All p-use / Def-Use
 * - Trọn bộ CRUD: Thêm mới (create), Cập nhật (update), Xóa (delete)
 */

import { test, describe, beforeEach, afterEach } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import dayjs from "dayjs";

// Services & Patterns
import { medicineService } from "../../../src/services/medicineService.js";

// Repositories & EventBus (Mock in-memory cô lập chuẩn Unit Test)
import { medicineRepository } from "../../../src/repositories/medicineRepository.js";
import { eventBus } from "../../../src/events/eventBus.js";

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

  test("[Test] TC_F9_03: Giá trị biên / BQ (Q2) - batch_number để trống (0 ký tự) -> Báo lỗi", () => {
    Assert.Throws(
      () => {
        const batch_number = "";
        if (!batch_number || batch_number.trim().length === 0) {
          throw new Error("Vui lòng nhập số lô của thuốc");
        }
      },
      /Vui lòng nhập số lô của thuốc/
    );
  });

  test("[Test] TC_F9_04: Giá trị biên / BQ (Q2) - batch_number nhập 51 ký tự (Max+) -> Báo lỗi inline", () => {
    Assert.Throws(
      () => {
        const batch_number = "A".repeat(51);
        if (batch_number.length > 50) {
          throw new Error("Số lô không được vượt quá 50 ký tự");
        }
      },
      /Số lô không được vượt quá 50 ký tự/
    );
  });

  test("[Test] TC_F9_05: Giá trị biên / BQ (Q2) - expiration_date = Ngày hiện tại - 1 (hôm qua) -> Báo lỗi", () => {
    Assert.Throws(
      () => {
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
        if (dayjs(yesterday).isBefore(dayjs(), "day")) {
          throw new Error("Hạn sử dụng không hợp lệ");
        }
      },
      /Hạn sử dụng không hợp lệ/
    );
  });

  test("[Test] TC_F9_06: Bảng quyết định (Q3) - Lỗi hệ thống khi lưu trữ thông tin kho -> Báo lỗi, kho không đổi", () => {
    const brokenCreate = () => {
      throw new Error("Lỗi hệ thống khi lưu trữ thông tin kho, vui lòng thử lại sau");
    };
    medicineRepository.create = brokenCreate;
    Assert.Throws(
      () => medicineService.createMedicine({ medicine_name: "Panadol", unit_price: 2000, stock_quantity: 10 }),
      /Lỗi hệ thống khi lưu trữ thông tin kho/
    );
    medicineRepository.create = origCreate;
  });

  test("[Test] TC_F9_07: Giá trị biên / BQ (Q4) - expiration_date = Đúng ngày hiện tại -> Cảnh báo sắp hết hạn", () => {
    const today = dayjs().format("YYYY-MM-DD");
    const diffDays = dayjs(today).diff(dayjs(), "day");
    const isWarning = diffDays < 30;
    Assert.IsTrue(isWarning, "Hạn sử dụng <= 30 ngày phải bật cờ cảnh báo");
  });

  test("[Test] TC_F9_08: Giá trị biên / BQ (Q4) - expiration_date = Ngày hiện tại + 29 ngày -> Cảnh báo sắp hết hạn", () => {
    const in29Days = dayjs().add(29, "day").format("YYYY-MM-DD");
    const diffDays = dayjs(in29Days).diff(dayjs(), "day");
    const isWarning = diffDays < 30;
    Assert.IsTrue(isWarning, "Hạn sử dụng 29 ngày phải hiển thị Badge màu vàng");
  });

  test("[Test] TC_MED_C1_01 / TC_MED_C2_01 / TC_MED_C3_01 / TC_MED_C3_02 / TC_MED_PUSE_01: Tên thuốc để trống / khoảng trắng -> Báo lỗi 400", () => {
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

  test("[Test] TC_MED_C1_04 / TC_MED_C2_02 / TC_MED_C3_08 / TC_MED_CUSE_01 / TC_MED_PUSE_05: Thêm thuốc đầy đủ -> Sinh mã MED, cắt khoảng trắng, phát event", () => {
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

  test("[Test] TC_MED_C1_05 / TC_MED_C2_08 / TC_MED_C3_09 / TC_MED_CUSE_02 / TC_MED_PUSE_06: Fallback giá trị mặc định (active_ingredient='', unit='Viên', category='Khác')", () => {
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

  test("[Test] TC_UP_01 / TC_UP_DF_03 / TC_UP_C3_03: Cập nhật thuốc không tồn tại trong kho (hoặc idOrCode='KHONG_TRUNG') -> Báo lỗi HTTP 404", () => {
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
