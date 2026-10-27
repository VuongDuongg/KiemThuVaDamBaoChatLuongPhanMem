/**
 * Validator cho Chức năng Đăng ký khám và cấp số thứ tự (1.2)
 * Tác giả đặc tả: Nguyễn Hồng Thái
 * Tương ứng các ca UT11 -> UT28 trong docs/thai/testcasenta_md.md
 */

export class ClinicAppointmentValidator {
  static VALID_INSURANCE_TYPES = new Set(["NONE", "BHYT", "SERVICE"]);

  /**
   * Xác thực thông tin đăng ký khám và cấp số thứ tự
   * Dữ liệu mặc định:
   * {
   *   patient_id: 101,
   *   clinic_id: 5,
   *   insurance_type: "NONE",
   *   insurance_code: "",
   *   reason: "Kham suc khoe dinh ky"
   * }
   * 
   * @param {Object} input - Dữ liệu đăng ký khám
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validateCreateAppointment(input = {}) {
    const defaultData = {
      patient_id: 101,
      clinic_id: 5,
      insurance_type: "NONE",
      insurance_code: "",
      reason: "Kham suc khoe dinh ky"
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra Mã bệnh nhân (patient_id)
    if (data.patient_id === null || data.patient_id === undefined) {
      return "Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống.";
    }

    const patientNum = typeof data.patient_id === "number" ? data.patient_id : Number(data.patient_id);
    if (!Number.isInteger(patientNum) || patientNum <= 0) {
      return "Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống.";
    }

    // 2. Kiểm tra Phòng khám chuyên khoa (clinic_id)
    if (data.clinic_id === null || data.clinic_id === undefined) {
      return "Vui lòng chọn phòng khám chuyên khoa.";
    }

    const clinicNum = typeof data.clinic_id === "number" ? data.clinic_id : Number(data.clinic_id);
    if (!Number.isInteger(clinicNum) || clinicNum <= 0) {
      return "Vui lòng chọn phòng khám chuyên khoa.";
    }

    // 3. Kiểm tra Loại đối tượng KCB (insurance_type)
    if (!data.insurance_type || !ClinicAppointmentValidator.VALID_INSURANCE_TYPES.has(data.insurance_type)) {
      return "Loại đối tượng KCB không hợp lệ (chỉ chấp nhận NONE, BHYT, SERVICE).";
    }

    // 4. Kiểm tra Mã thẻ BHYT (insurance_code) khi chọn đối tượng BHYT
    if (data.insurance_type === "BHYT") {
      if (
        data.insurance_code === undefined ||
        data.insurance_code === null ||
        typeof data.insurance_code !== "string" ||
        data.insurance_code.trim().length === 0
      ) {
        return "Vui lòng nhập mã thẻ BHYT khi đăng ký đối tượng Bảo hiểm y tế.";
      }

      const trimmedCode = data.insurance_code.trim();
      const bhytRegex = /^[a-zA-Z0-9]{15}$/;
      if (!bhytRegex.test(trimmedCode)) {
        return "Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số).";
      }
    }

    // 5. Kiểm tra Lý do khám bệnh (reason)
    // Tối thiểu 5 ký tự, tối đa 500 ký tự sau khi cắt khoảng trắng
    if (
      !data.reason ||
      typeof data.reason !== "string" ||
      data.reason.trim().length < 5 ||
      data.reason.trim().length > 500
    ) {
      return "Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự).";
    }

    return null;
  }
}
