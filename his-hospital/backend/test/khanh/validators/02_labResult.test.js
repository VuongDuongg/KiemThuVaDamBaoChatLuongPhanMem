/**
 * Test suite cho 02. Nhập kết quả xét nghiệm định lượng (UT11 -> UT28)
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { LabResultValidator } from "./02_labResult.validator.js";

describe("[TestFixture] 02_KetQuaXetNghiem_LabResultValidator", () => {
  // UT11: TC_F17_01 — Phiếu không tồn tại hoặc sai nhóm (order = undefined; {}; {id: 1, type: "PACS"})
  test("[Test] UT11: TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm", () => {
    const cases = [
      { order: undefined },
      { order: {} },
      { order: { id: 1, type: "PACS" } }
    ];

    for (const c of cases) {
      const actual = LabResultValidator.validateLabResult(c);
      Assert.AreEqual(
        "Mã phiếu chỉ định xét nghiệm không hợp lệ.",
        actual,
        `Thất bại với order = ${JSON.stringify(c.order)}`
      );
    }
  });

  // UT12: TC_F17_02 — Bỏ trống
  test("[Test] UT12: TC_F17_02 - Bỏ trống (test_value = '')", () => {
    const input = { test_value: "" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT13: TC_F17_03 — Lẫn chữ
  test("[Test] UT13: TC_F17_03 - Lẫn chữ (test_value = '12.5A')", () => {
    const input = { test_value: "12.5A" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT14: TC_F17_04 — Số âm
  test("[Test] UT14: TC_F17_04 - Số âm (test_value = -5.2)", () => {
    const input = { test_value: -5.2 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT15: Giá trị null
  test("[Test] UT15: Giá trị null (test_value = null)", () => {
    const input = { test_value: null };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT16: Giá trị undefined
  test("[Test] UT16: Giá trị undefined (test_value = undefined)", () => {
    const input = { test_value: undefined };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT17: Chỉ có khoảng trắng
  test("[Test] UT17: Chỉ có khoảng trắng (test_value = '   ')", () => {
    const input = { test_value: "   " };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT18: Biên 0
  test("[Test] UT18: Biên 0 (test_value = 0)", () => {
    const input = { test_value: 0 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT19: Vô cực
  test("[Test] UT19: Vô cực (test_value = Infinity)", () => {
    const input = { test_value: Infinity };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT20: Không phải số
  test("[Test] UT20: Không phải số (test_value = NaN)", () => {
    const input = { test_value: NaN };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT21: Kiểu boolean
  test("[Test] UT21: Kiểu boolean (test_value = true)", () => {
    const input = { test_value: true };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT22: Kiểu mảng
  test("[Test] UT22: Kiểu mảng (test_value = [5])", () => {
    const input = { test_value: [5] };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT23: Chuỗi hệ 16
  test("[Test] UT23: Chuỗi hệ 16 (test_value = '0x10')", () => {
    const input = { test_value: "0x10" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT24: TC_F17_05 — Nhận xét vượt giới hạn
  test("[Test] UT24: TC_F17_05 - Nhận xét vượt giới hạn (general_notes = 'a' x 501)", () => {
    const input = { general_notes: "a".repeat(501) };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Nhận xét tổng quát không được vượt quá 500 ký tự.", actual);
  });

  // UT25: TC_F17_06 — Nhận xét rỗng
  test("[Test] UT25: TC_F17_06 - Nhận xét rỗng (general_notes = '')", () => {
    const input = { general_notes: "" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });

  // UT26: TC_F17_07 — Nhận xét đúng giới hạn
  test("[Test] UT26: TC_F17_07 - Nhận xét đúng giới hạn (general_notes = 'a' x 500)", () => {
    const input = { general_notes: "a".repeat(500) };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });

  // UT27: Các dạng số dương hợp lệ
  test("[Test] UT27: Các dạng số dương hợp lệ (0.01; 1; ' 5.2 '; '.5')", () => {
    const validValues = [0.01, 1, " 5.2 ", ".5"];
    for (const val of validValues) {
      const actual = LabResultValidator.validateLabResult({ test_value: val });
      Assert.IsNull(actual, `Kỳ vọng null cho giá trị hợp lệ: ${val}`);
    }
  });

  // UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào
  test("[Test] UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào (test_value = 10)", () => {
    const input = { test_value: 10 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });
});
