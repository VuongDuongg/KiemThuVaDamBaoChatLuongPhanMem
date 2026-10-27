/**
 * Validator cho Chức năng Cập nhật thông tin bệnh án và chẩn đoán (1.1)
 * Tác giả đặc tả: Ngô Tuấn Anh
 * Tương ứng các ca UT01 -> UT15 trong docs/anh/testcasenta.md
 */

export class ConsultationValidator {
  /**
   * Xác thực thông tin bệnh án và chẩn đoán
   * Dữ liệu mặc định:
   * {
   *   chief_complaint: "Đau đầu âm ỉ kéo dài",
   *   history_and_symptoms: "Tiền sử khỏe mạnh, không dị ứng",
   *   icd10_main_code: "I10",
   *   icd10_sub_codes: ["E11"]
   * }
   * 
   * @param {Object} input - Dữ liệu bệnh án
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo nếu không hợp lệ
   */
  static validateConsultation(input = {}) {
    const defaultData = {
      chief_complaint: "Đau đầu âm ỉ kéo dài",
      history_and_symptoms: "Tiền sử khỏe mạnh, không dị ứng",
      icd10_main_code: "I10",
      icd10_sub_codes: ["E11"]
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra lý do khám (chief_complaint)
    // Bắt buộc nhập, độ dài từ 5 đến 2000 ký tự sau khi cắt khoảng trắng
    if (data.chief_complaint === null || data.chief_complaint === undefined) {
      return "Vui lòng nhập lý do đến khám của bệnh nhân.";
    }
    const complaint = String(data.chief_complaint).trim();
    if (complaint.length < 5 || complaint.length > 2000) {
      return "Vui lòng nhập lý do đến khám của bệnh nhân.";
    }

    // 2. Kiểm tra tiền sử và triệu chứng (history_and_symptoms)
    // Tùy chọn, nếu có chuỗi thì tối đa 4000 ký tự
    if (data.history_and_symptoms !== undefined && data.history_and_symptoms !== null) {
      const historyStr = String(data.history_and_symptoms);
      if (historyStr.length > 4000) {
        return "Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự).";
      }
    }

    // 3. Kiểm tra chẩn đoán chính (icd10_main_code)
    // Bắt buộc nhập, phải thuộc định dạng mã ICD-10 hợp lệ (1 chữ cái + 2 chữ số + tùy chọn dấu chấm phần phụ)
    if (data.icd10_main_code === null || data.icd10_main_code === undefined) {
      return "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.";
    }
    const mainCode = String(data.icd10_main_code).trim();
    if (!mainCode) {
      return "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.";
    }
    const icd10Regex = /^[A-Z]\d{2}(\.\d{1,2})?$/i;
    if (!icd10Regex.test(mainCode)) {
      return "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án.";
    }

    // 4. Kiểm tra danh sách mã chẩn đoán kèm theo (icd10_sub_codes)
    // Tùy chọn. Nếu có thì mỗi mã phải thuộc ICD-10, không trùng mã chính, không tự trùng lặp nhau
    if (data.icd10_sub_codes !== undefined && data.icd10_sub_codes !== null) {
      if (!Array.isArray(data.icd10_sub_codes)) {
        return "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.";
      }

      const seen = new Set();
      for (const sub of data.icd10_sub_codes) {
        const subStr = String(sub || "").trim().toUpperCase();
        if (!subStr || !icd10Regex.test(subStr)) {
          return "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.";
        }
        if (subStr === mainCode.toUpperCase()) {
          return "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.";
        }
        if (seen.has(subStr)) {
          return "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính.";
        }
        seen.add(subStr);
      }
    }

    return null;
  }
}
