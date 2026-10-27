/**
 * Test suite cho 01. Đăng ký hồ sơ bệnh nhân mới (UT01 -> UT10)
 * Tác giả: Nguyễn Hồng Thái
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { PatientRegistrationValidator } from "./01_patientRegistration.validator.js";

describe("[TestFixture] 01_DangKyHoSoBenhNhan_PatientRegistrationValidator", () => {
  // UT01: TC_F01_01 — Họ tên rỗng
  test("[Test] UT01: TC_F01_01 - Họ tên rỗng (full_name = '')", () => {
    const input = { full_name: "" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số).",
      actual
    );
  });

  // UT02: TC_F01_02 — Họ tên chứa số/KĐB
  test("[Test] UT02: TC_F01_02 - Họ tên chứa số/KĐB (full_name = 'Nguyen Van A123@')", () => {
    const input = { full_name: "Nguyen Van A123@" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số).",
      actual
    );
  });

  // UT03: TC_F01_03 — Ngày sinh ở tương lai
  test("[Test] UT03: TC_F01_03 - Ngày sinh ở tương lai (dob = '2030-01-01')", () => {
    const input = { dob: "2030-01-01" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại).",
      actual
    );
  });

  // UT04: TC_F01_04 — SĐT sai định dạng
  test("[Test] UT04: TC_F01_04 - SĐT sai định dạng (phone = '091234')", () => {
    const input = { phone: "091234" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam).",
      actual
    );
  });

  // UT05: TC_F01_05 — CCCD sai độ dài
  test("[Test] UT05: TC_F01_05 - CCCD sai độ dài (cccd = '12345')", () => {
    const input = { cccd: "12345" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Số CCCD/Định danh cá nhân phải đúng 12 chữ số.",
      actual
    );
  });

  // UT06: TC_F01_06 — Hợp lệ (Dữ liệu mặc định)
  test("[Test] UT06: TC_F01_06 - Hợp lệ (Dữ liệu mặc định)", () => {
    const actual = PatientRegistrationValidator.validateCreatePatient({});
    Assert.IsNull(actual);
  });

  // UT07: SĐT chứa ký tự chữ
  test("[Test] UT07: SĐT chứa ký tự chữ (phone = '091234567a')", () => {
    const input = { phone: "091234567a" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam).",
      actual
    );
  });

  // UT08: CCCD chứa ký tự chữ
  test("[Test] UT08: CCCD chứa ký tự chữ (cccd = '00109001234a')", () => {
    const input = { cccd: "00109001234a" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Số CCCD/Định danh cá nhân phải đúng 12 chữ số.",
      actual
    );
  });

  // UT09: Khoảng trắng ở hai đầu họ tên
  test("[Test] UT09: Khoảng trắng ở hai đầu họ tên (full_name = '  Nguyen Van A  ')", () => {
    const input = { full_name: "  Nguyen Van A  " };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.IsNull(actual);
  });

  // UT10: Giới tính không hợp lệ
  test("[Test] UT10: Giới tính không hợp lệ (gender = 'UNKNOWN')", () => {
    const input = { gender: "UNKNOWN" };
    const actual = PatientRegistrationValidator.validateCreatePatient(input);
    Assert.AreEqual(
      "Giới tính không hợp lệ (chỉ chấp nhận MALE, FEMALE, OTHER).",
      actual
    );
  });
});
