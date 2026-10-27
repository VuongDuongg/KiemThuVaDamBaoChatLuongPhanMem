/**
 * Test suite cho 02. Đăng ký khám và cấp số thứ tự (UT11 -> UT28)
 * Tác giả: Nguyễn Hồng Thái
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { ClinicAppointmentValidator } from "./02_clinicAppointment.validator.js";

describe("[TestFixture] 02_DangKyKhamVaCapSoThuTu_ClinicAppointmentValidator", () => {
  // UT11: TC_F02_01 — Bệnh nhân không tồn tại
  test("[Test] UT11: TC_F02_01 - Bệnh nhân không tồn tại (patient_id = null)", () => {
    const input = { patient_id: null };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống.",
      actual
    );
  });

  // UT12: TC_F02_02 — Chưa chọn phòng khám
  test("[Test] UT12: TC_F02_02 - Chưa chọn phòng khám (clinic_id = undefined)", () => {
    const input = { clinic_id: undefined };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng chọn phòng khám chuyên khoa.",
      actual
    );
  });

  // UT13: TC_F02_03 — BHYT đúng chuẩn
  test("[Test] UT13: TC_F02_03 - BHYT đúng chuẩn (insurance_type = 'BHYT', insurance_code = 'DN4010123456789')", () => {
    const input = {
      insurance_type: "BHYT",
      insurance_code: "DN4010123456789"
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.IsNull(actual);
  });

  // UT14: TC_F02_04 — Mã BHYT sai độ dài
  test("[Test] UT14: TC_F02_04 - Mã BHYT sai độ dài (insurance_type = 'BHYT', insurance_code = 'DN123')", () => {
    const input = {
      insurance_type: "BHYT",
      insurance_code: "DN123"
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số).",
      actual
    );
  });

  // UT15: Thiếu mã BHYT khi chọn BHYT
  test("[Test] UT15: Thiếu mã BHYT khi chọn BHYT (insurance_type = 'BHYT', insurance_code = '')", () => {
    const input = {
      insurance_type: "BHYT",
      insurance_code: ""
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng nhập mã thẻ BHYT khi đăng ký đối tượng Bảo hiểm y tế.",
      actual
    );
  });

  // UT16: Mã BHYT có ký tự đặc biệt
  test("[Test] UT16: Mã BHYT có ký tự đặc biệt (insurance_type = 'BHYT', insurance_code = 'DN401012345678@')", () => {
    const input = {
      insurance_type: "BHYT",
      insurance_code: "DN401012345678@"
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số).",
      actual
    );
  });

  // UT17: Lý do khám quá ngắn
  test("[Test] UT17: Lý do khám quá ngắn (reason = 'Kham')", () => {
    const input = { reason: "Kham" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự).",
      actual
    );
  });

  // UT18: Lý do khám rỗng
  test("[Test] UT18: Lý do khám rỗng (reason = '')", () => {
    const input = { reason: "" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự).",
      actual
    );
  });

  // UT19: Lý do khám vượt 500 ký tự
  test("[Test] UT19: Lý do khám vượt 500 ký tự (reason = 'a' x 501)", () => {
    const input = { reason: "a".repeat(501) };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự).",
      actual
    );
  });

  // UT20: Lý do khám đúng 500 ký tự
  test("[Test] UT20: Lý do khám đúng 500 ký tự (reason = 'a' x 500)", () => {
    const input = { reason: "a".repeat(500) };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.IsNull(actual);
  });

  // UT21: Lý do khám chỉ chứa khoảng trắng
  test("[Test] UT21: Lý do khám chỉ chứa khoảng trắng (reason = '     ')", () => {
    const input = { reason: "     " };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự).",
      actual
    );
  });

  // UT22: Loại bảo hiểm không hợp lệ
  test("[Test] UT22: Loại bảo hiểm không hợp lệ (insurance_type = 'INVALID')", () => {
    const input = { insurance_type: "INVALID" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Loại đối tượng KCB không hợp lệ (chỉ chấp nhận NONE, BHYT, SERVICE).",
      actual
    );
  });

  // UT23: ID phòng khám âm
  test("[Test] UT23: ID phòng khám âm (clinic_id = -1)", () => {
    const input = { clinic_id: -1 };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng chọn phòng khám chuyên khoa.",
      actual
    );
  });

  // UT24: ID bệnh nhân là chuỗi chữ
  test("[Test] UT24: ID bệnh nhân là chuỗi chữ (patient_id = 'ABC')", () => {
    const input = { patient_id: "ABC" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống.",
      actual
    );
  });

  // UT25: TC_F02_05 — Nhận xét/Lý do khám biên 5 ký tự
  test("[Test] UT25: TC_F02_05 - Nhận xét/Lý do khám biên 5 ký tự (reason = '12345')", () => {
    const input = { reason: "12345" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.IsNull(actual);
  });

  // UT26: BHYT có khoảng trắng thừa
  test("[Test] UT26: BHYT có khoảng trắng thừa (insurance_type = 'BHYT', insurance_code = ' DN4010123456789 ')", () => {
    const input = {
      insurance_type: "BHYT",
      insurance_code: " DN4010123456789 "
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.IsNull(actual);
  });

  // UT27: Đăng ký dịch vụ không thẻ BHYT
  test("[Test] UT27: Đăng ký dịch vụ không thẻ BHYT (insurance_type = 'SERVICE', insurance_code = '')", () => {
    const input = {
      insurance_type: "SERVICE",
      insurance_code: ""
    };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.IsNull(actual);
  });

  // UT28: ID phòng khám không phải số
  test("[Test] UT28: ID phòng khám không phải số (clinic_id = 'NO_ID')", () => {
    const input = { clinic_id: "NO_ID" };
    const actual = ClinicAppointmentValidator.validateCreateAppointment(input);
    Assert.AreEqual(
      "Vui lòng chọn phòng khám chuyên khoa.",
      actual
    );
  });
});
