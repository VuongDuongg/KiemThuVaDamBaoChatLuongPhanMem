/**
 * Test suite cho 02. Chỉ định dịch vụ cận lâm sàng (UT16 -> UT27)
 * Tác giả: Ngô Tuấn Anh
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { LabOrderValidator } from "./02_labOrder.validator.js";

describe("[TestFixture] 02_ChiDinhDichVuCanLamSang_LabOrderValidator", () => {
  // UT16: TC_F13_01 — Không chọn dịch vụ
  test("[Test] UT16: TC_F13_01 - Không chọn dịch vụ (cls_service_ids = [])", () => {
    const input = { cls_service_ids: [] };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actual
    );
  });

  // UT17: TC_F13_02 — Ghi chú 501 ký tự
  test("[Test] UT17: TC_F13_02 - Ghi chú 501 ký tự (cls_clinical_instruction = 'a' x 501)", () => {
    const input = { cls_clinical_instruction: "a".repeat(501) };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự).",
      actual
    );
  });

  // UT18: TC_F13_03 — 1 dịch vụ, ghi chú 0 ký tự
  test("[Test] UT18: TC_F13_03 - 1 dịch vụ, ghi chú 0 ký tự (cls_service_ids = ['XQ01'], cls_clinical_instruction = '')", () => {
    const input = {
      cls_service_ids: ["XQ01"],
      cls_clinical_instruction: ""
    };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.IsNull(actual);
  });

  // UT19: TC_F13_04 — Nhiều dịch vụ, ghi chú 500 ký tự
  test("[Test] UT19: TC_F13_04 - Nhiều dịch vụ, ghi chú 500 ký tự (cls_service_ids = ['XQ01', 'SA01', 'XN01'], cls_clinical_instruction = 'a' x 500)", () => {
    const input = {
      cls_service_ids: ["XQ01", "SA01", "XN01"],
      cls_clinical_instruction: "a".repeat(500)
    };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.IsNull(actual);
  });

  // UT20: Danh sách dịch vụ null hoặc undefined
  test("[Test] UT20: Danh sách dịch vụ null hoặc undefined", () => {
    const actualNull = LabOrderValidator.validateLabOrder({ cls_service_ids: null });
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actualNull
    );

    const actualUndefined = LabOrderValidator.validateLabOrder({ cls_service_ids: undefined });
    // Nếu cls_service_ids là undefined thì trong defaultData cls_service_ids là ["XQ01"]
    // nhưng nếu input ghi rõ cls_service_ids: undefined hoặc không truyền thì cần kiểm tra:
    // Chú ý: nếu input là { cls_service_ids: undefined }, defaultData.cls_service_ids là ["XQ01"] nếu dùng { ...default, ...input }
    // Nhưng data.cls_service_ids = undefined nếu input ghi đè!
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actualUndefined
    );
  });

  // UT21: Danh sách dịch vụ không phải mảng
  test("[Test] UT21: Danh sách dịch vụ không phải mảng (cls_service_ids = 'XQ01')", () => {
    const input = { cls_service_ids: "XQ01" };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actual
    );
  });

  // UT22: Mã dịch vụ chỉ có khoảng trắng
  test("[Test] UT22: Mã dịch vụ chỉ có khoảng trắng (cls_service_ids = ['   '])", () => {
    const input = { cls_service_ids: ["   "] };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actual
    );
  });

  // UT23: Mã dịch vụ không tồn tại trong danh mục
  test("[Test] UT23: Mã dịch vụ không tồn tại trong danh mục (cls_service_ids = ['CLS_KHONG_TON_TAI'])", () => {
    const input = { cls_service_ids: ["CLS_KHONG_TON_TAI"] };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actual
    );
  });

  // UT24: Danh sách có dịch vụ thứ hai không tồn tại
  test("[Test] UT24: Danh sách có dịch vụ thứ hai không tồn tại (cls_service_ids = ['XQ01', 'DV_AO'])", () => {
    const input = { cls_service_ids: ["XQ01", "DV_AO"] };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.",
      actual
    );
  });

  // UT25: Ghi chú dặn dò để undefined
  test("[Test] UT25: Ghi chú dặn dò để undefined (cls_clinical_instruction = undefined)", () => {
    const input = { cls_clinical_instruction: undefined };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.IsNull(actual);
  });

  // UT26: Ghi chú dặn dò có khoảng trắng hai đầu
  test("[Test] UT26: Ghi chú dặn dò có khoảng trắng hai đầu (cls_clinical_instruction = '  Chụp tư thế đứng  ')", () => {
    const input = { cls_clinical_instruction: "  Chụp tư thế đứng  " };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.IsNull(actual);
  });

  // UT27: Ghi chú dặn dò sai kiểu dữ liệu
  test("[Test] UT27: Ghi chú dặn dò sai kiểu dữ liệu (cls_clinical_instruction = 12345)", () => {
    const input = { cls_clinical_instruction: 12345 };
    const actual = LabOrderValidator.validateLabOrder(input);
    Assert.AreEqual(
      "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự).",
      actual
    );
  });
});
