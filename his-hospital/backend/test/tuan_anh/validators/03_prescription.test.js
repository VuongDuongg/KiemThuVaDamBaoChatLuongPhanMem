/**
 * Test suite cho 03. Kê đơn thuốc (UT28 -> UT45)
 * Tác giả: Ngô Tuấn Anh
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { PrescriptionValidator } from "./03_prescription.validator.js";

describe("[TestFixture] 03_KeDonThuoc_PrescriptionValidator", () => {
  // UT28: TC_F14_01 — Thuốc tồn kho bằng 0
  test("[Test] UT28: TC_F14_01 - Thuốc tồn kho bằng 0 (available_stock = 0)", () => {
    const input = { available_stock: 0 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.",
      actual
    );
  });

  // UT29: TC_F14_02 — Số lượng cấp bằng 0
  test("[Test] UT29: TC_F14_02 - Số lượng cấp bằng 0 (quantity = 0)", () => {
    const input = { quantity: 0 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.",
      actual
    );
  });

  // UT30: Số lượng cấp là số âm
  test("[Test] UT30: Số lượng cấp là số âm (quantity = -2)", () => {
    const input = { quantity: -2 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.",
      actual
    );
  });

  // UT31: TC_F14_03 — Số lượng cấp vượt tồn kho
  test("[Test] UT31: TC_F14_03 - Số lượng cấp vượt tồn kho (available_stock = 50, quantity = 51)", () => {
    const input = { available_stock: 50, quantity: 51 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.",
      actual
    );
  });

  // UT32: TC_F14_04 — Hướng dẫn 251 ký tự
  test("[Test] UT32: TC_F14_04 - Hướng dẫn liều dùng 251 ký tự ('a' x 251)", () => {
    const input = { usage_instruction: "a".repeat(251) };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc.",
      actual
    );
  });

  // UT33: TC_F14_05 — Chống chỉ định tuyệt đối
  test("[Test] UT33: TC_F14_05 - Chống chỉ định tuyệt đối (interaction_level = 'SEVERE', interaction_override_confirm = true)", () => {
    const input = {
      interaction_level: "SEVERE",
      interaction_override_confirm: true
    };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối.",
      actual
    );
  });

  // UT34: TC_F14_06 — Tương tác nhẹ, không xác nhận
  test("[Test] UT34: TC_F14_06 - Tương tác nhẹ không xác nhận (interaction_level = 'MILD', interaction_override_confirm = false)", () => {
    const input = {
      interaction_level: "MILD",
      interaction_override_confirm: false
    };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Vui lòng xác nhận ghi đè cảnh báo tương tác thuốc mức độ nhẹ để tiếp tục kê đơn.",
      actual
    );
  });

  // UT35: TC_F14_07 — Tương tác nhẹ, đồng ý kê
  test("[Test] UT35: TC_F14_07 - Tương tác nhẹ có xác nhận ghi đè (interaction_level = 'MILD', interaction_override_confirm = true)", () => {
    const input = {
      interaction_level: "MILD",
      interaction_override_confirm: true
    };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.IsNull(actual);
  });

  // UT36: TC_F14_08 — Các biên trên hợp lệ
  test("[Test] UT36: TC_F14_08 - Các biên trên hợp lệ (available_stock = 100, quantity = 100, usage_instruction = 'a' x 250)", () => {
    const input = {
      available_stock: 100,
      quantity: 100,
      usage_instruction: "a".repeat(250)
    };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.IsNull(actual);
  });

  // UT37: Mã thuốc không tồn tại hoặc rỗng
  test("[Test] UT37: Mã thuốc không tồn tại hoặc rỗng (drug_id = '', null, 'MED_KHONG_CO')", () => {
    const expected = "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.";

    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ drug_id: "" }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ drug_id: null }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ drug_id: "MED_KHONG_CO" }));
  });

  // UT38: Tồn kho âm hoặc NaN
  test("[Test] UT38: Tồn kho âm hoặc NaN (available_stock = -5, NaN)", () => {
    const expected = "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.";

    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ available_stock: -5 }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ available_stock: NaN }));
  });

  // UT39: Số lượng cấp là số thập phân
  test("[Test] UT39: Số lượng cấp là số thập phân (quantity = 2.5)", () => {
    const input = { quantity: 2.5 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.",
      actual
    );
  });

  // UT40: Số lượng cấp lẫn chữ
  test("[Test] UT40: Số lượng cấp lẫn chữ (quantity = '10A')", () => {
    const input = { quantity: "10A" };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.AreEqual(
      "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.",
      actual
    );
  });

  // UT41: Số lượng cấp không hợp lệ
  test("[Test] UT41: Số lượng cấp không hợp lệ (null, undefined, NaN, Infinity, true)", () => {
    const expected = "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.";

    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ quantity: null }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ quantity: undefined }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ quantity: NaN }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ quantity: Infinity }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ quantity: true }));
  });

  // UT42: Biên dưới số lượng cấp
  test("[Test] UT42: Biên dưới số lượng cấp (quantity = 1)", () => {
    const input = { quantity: 1 };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.IsNull(actual);
  });

  // UT43: Hướng dẫn liều dùng để trống hoặc khoảng trắng
  test("[Test] UT43: Hướng dẫn liều dùng để trống hoặc khoảng trắng (usage_instruction = '', '     ')", () => {
    const expected = "Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc.";

    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ usage_instruction: "" }));
    Assert.AreEqual(expected, PrescriptionValidator.validatePrescription({ usage_instruction: "     " }));
  });

  // UT44: Hướng dẫn liều dùng 1 ký tự
  test("[Test] UT44: Hướng dẫn liều dùng 1 ký tự (usage_instruction = 'a')", () => {
    const input = { usage_instruction: "a" };
    const actual = PrescriptionValidator.validatePrescription(input);
    Assert.IsNull(actual);
  });

  // UT45: Dữ liệu mặc định hợp lệ
  test("[Test] UT45: Dữ liệu mặc định hợp lệ", () => {
    const actual = PrescriptionValidator.validatePrescription({});
    Assert.IsNull(actual);
  });
});
