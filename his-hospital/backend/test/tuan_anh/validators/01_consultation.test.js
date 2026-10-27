/**
 * Test suite cho 01. Cập nhật thông tin bệnh án và chẩn đoán (UT01 -> UT15)
 * Tác giả: Ngô Tuấn Anh
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { ConsultationValidator } from "./01_consultation.validator.js";

describe("[TestFixture] 01_CapNhatBenhAnVaChanDoan_ConsultationValidator", () => {
  // UT01: TC_F12_01 — Lý do khám 4 ký tự
  test("[Test] UT01: TC_F12_01 - Lý do khám 4 ký tự ('a' x 4)", () => {
    const input = { chief_complaint: "a".repeat(4) };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do đến khám của bệnh nhân.",
      actual
    );
  });

  // UT02: TC_F12_02 — Lý do khám 2001 ký tự
  test("[Test] UT02: TC_F12_02 - Lý do khám 2001 ký tự ('a' x 2001)", () => {
    const input = { chief_complaint: "a".repeat(2001) };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do đến khám của bệnh nhân.",
      actual
    );
  });

  // UT03: TC_F12_03 — Triệu chứng 4001 ký tự
  test("[Test] UT03: TC_F12_03 - Triệu chứng 4001 ký tự ('a' x 4001)", () => {
    const input = { history_and_symptoms: "a".repeat(4001) };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự).",
      actual
    );
  });

  // UT04: TC_F12_04 — Bỏ trống mã chính
  test("[Test] UT04: TC_F12_04 - Bỏ trống mã chính (icd10_main_code = '')", () => {
    const input = { icd10_main_code: "" };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.",
      actual
    );
  });

  // UT05: TC_F12_05 — Mã phụ trùng mã chính
  test("[Test] UT05: TC_F12_05 - Mã phụ trùng mã chính (icd10_main_code = 'I10', icd10_sub_codes = ['I10'])", () => {
    const input = { icd10_main_code: "I10", icd10_sub_codes: ["I10"] };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.",
      actual
    );
  });

  // UT06: TC_F12_06 — Biên dưới hợp lệ
  test("[Test] UT06: TC_F12_06 - Biên dưới hợp lệ (chief_complaint = 'a' x 5; history_and_symptoms = ''; icd10_sub_codes = [])", () => {
    const input = {
      chief_complaint: "a".repeat(5),
      history_and_symptoms: "",
      icd10_sub_codes: []
    };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.IsNull(actual);
  });

  // UT07: TC_F12_07 — Biên trên hợp lệ
  test("[Test] UT07: TC_F12_07 - Biên trên hợp lệ (chief_complaint = 'a' x 2000; history_and_symptoms = 'a' x 4000; icd10_sub_codes = ['E11', 'J00'])", () => {
    const input = {
      chief_complaint: "a".repeat(2000),
      history_and_symptoms: "a".repeat(4000),
      icd10_sub_codes: ["E11", "J00"]
    };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.IsNull(actual);
  });

  // UT08: Lý do khám chỉ có khoảng trắng
  test("[Test] UT08: Lý do khám chỉ có khoảng trắng (chief_complaint = '     ')", () => {
    const input = { chief_complaint: "     " };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do đến khám của bệnh nhân.",
      actual
    );
  });

  // UT09: Lý do khám null hoặc undefined
  test("[Test] UT09: Lý do khám null hoặc undefined", () => {
    const cases = [{ chief_complaint: null }, { chief_complaint: undefined }];
    for (const c of cases) {
      const actual = ConsultationValidator.validateConsultation(c);
      Assert.AreEqual(
        "Vui lòng nhập lý do đến khám của bệnh nhân.",
        actual,
        `Thất bại với chief_complaint = ${c.chief_complaint}`
      );
    }
  });

  // UT10: Không truyền tiền sử & triệu chứng
  test("[Test] UT10: Không truyền tiền sử & triệu chứng (history_and_symptoms = undefined)", () => {
    const input = { history_and_symptoms: undefined };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.IsNull(actual);
  });

  // UT11: Mã chẩn đoán chính không thuộc ICD-10
  test("[Test] UT11: Mã chẩn đoán chính không thuộc ICD-10 (icd10_main_code = 'MA_AO_99')", () => {
    const input = { icd10_main_code: "MA_AO_99" };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.",
      actual
    );
  });

  // UT12: Mã chẩn đoán chính chỉ có khoảng trắng
  test("[Test] UT12: Mã chẩn đoán chính chỉ có khoảng trắng (icd10_main_code = '   ')", () => {
    const input = { icd10_main_code: "   " };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.",
      actual
    );
  });

  // UT13: Mã kèm theo không thuộc ICD-10
  test("[Test] UT13: Mã kèm theo không thuộc ICD-10 (icd10_sub_codes = ['E11', 'MA_SAI'])", () => {
    const input = { icd10_sub_codes: ["E11", "MA_SAI"] };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.",
      actual
    );
  });

  // UT14: Mã kèm theo tự trùng lặp nhau
  test("[Test] UT14: Mã kèm theo tự trùng lặp nhau (icd10_sub_codes = ['E11', 'E11'])", () => {
    const input = { icd10_sub_codes: ["E11", "E11"] };
    const actual = ConsultationValidator.validateConsultation(input);
    Assert.AreEqual(
      "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.",
      actual
    );
  });

  // UT15: Dữ liệu mặc định hợp lệ
  test("[Test] UT15: Dữ liệu mặc định hợp lệ", () => {
    const actual = ConsultationValidator.validateConsultation({});
    Assert.IsNull(actual);
  });
});
