/**
 * Validator cho Chức năng Chỉ định dịch vụ cận lâm sàng (1.2)
 * Tác giả đặc tả: Ngô Tuấn Anh
 * Tương ứng các ca UT16 -> UT27 trong docs/anh/testcasenta.md
 */

export class LabOrderValidator {
  static VALID_CLS_SERVICES = new Set([
    "XQ01",
    "SA01",
    "XN01",
    "CLS_XN_MAU",
    "CLS_XN_SINHHOA",
    "CLS_XQUANG_PHOI",
    "CLS_XQUANG_XUONG",
    "CLS_SIEUAM_BUNG",
    "CLS_DIENTIM"
  ]);

  /**
   * Xác thực thông tin chỉ định dịch vụ cận lâm sàng
   * Dữ liệu mặc định:
   * {
   *   cls_service_ids: ["XQ01"],
   *   cls_clinical_instruction: "Chụp X-quang tim phổi thẳng"
   * }
   * 
   * @param {Object} input - Dữ liệu chỉ định CLS
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo nếu không hợp lệ
   */
  static validateLabOrder(input = {}) {
    const defaultData = {
      cls_service_ids: ["XQ01"],
      cls_clinical_instruction: "Chụp X-quang tim phổi thẳng"
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra danh sách dịch vụ cận lâm sàng (cls_service_ids)
    // Phải là một mảng không rỗng, từng mã phải tồn tại trong danh mục dịch vụ CLS
    if (!Array.isArray(data.cls_service_ids) || data.cls_service_ids.length === 0) {
      return "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.";
    }

    for (const serviceId of data.cls_service_ids) {
      if (typeof serviceId !== "string") {
        return "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.";
      }
      const trimmed = serviceId.trim();
      if (!trimmed || !LabOrderValidator.VALID_CLS_SERVICES.has(trimmed)) {
        return "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng.";
      }
    }

    // 2. Kiểm tra ghi chú dặn dò (cls_clinical_instruction)
    // Tùy chọn. Nếu có giá trị thì phải là chuỗi và độ dài tối đa 500 ký tự sau khi cắt khoảng trắng
    if (data.cls_clinical_instruction !== undefined && data.cls_clinical_instruction !== null) {
      if (typeof data.cls_clinical_instruction !== "string") {
        return "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự).";
      }
      const instructionStr = data.cls_clinical_instruction.trim();
      if (instructionStr.length > 500) {
        return "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự).";
      }
    }

    return null;
  }
}
