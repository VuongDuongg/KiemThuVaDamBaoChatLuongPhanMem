/**
 * Validator cho Chức năng Nhập kết quả xét nghiệm định lượng (3.11)
 * Kiểm tra tính hợp lệ dữ liệu đầu vào của hàm LabResultValidator.validateLabResult
 * Tương ứng các ca UT11 -> UT28 trong docs/Tong_Hop_45_Test_Case_Validate.md
 */

export class LabResultValidator {
  /**
   * Xác thực dữ liệu kết quả xét nghiệm định lượng
   * Dữ liệu mặc định:
   * {
   *   order: { id: 1, type: "LAB" },
   *   test_value: "5.2",
   *   general_notes: ""
   * }
   * 
   * Theo đặc tả: chỉ số định lượng phải là số thực dương (> 0). Giá trị 0, âm, chữ, null, undefined,... bị từ chối.
   * 
   * @param {Object} input - Dữ liệu nhập kết quả
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validateLabResult(input = {}) {
    const defaultData = {
      order: { id: 1, type: "LAB" },
      test_value: "5.2",
      general_notes: ""
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra phiếu chỉ định xét nghiệm (order)
    // Phải tồn tại, có id và type === "LAB"
    if (
      !data.order ||
      typeof data.order !== "object" ||
      !data.order.id ||
      data.order.type !== "LAB"
    ) {
      return "Mã phiếu chỉ định xét nghiệm không hợp lệ.";
    }

    // 2. Kiểm tra giá trị chỉ số xét nghiệm (test_value)
    // Giá trị phải là số thực dương (> 0).
    // Từ chối: "", lẫn chữ "12.5A", âm (-5.2), null, undefined, khoảng trắng " ", 0, Infinity, NaN, boolean, array [5], hex "0x10"
    // Hợp lệ: 0.01, 1, " 5.2 ", ".5", 10
    const val = data.test_value;

    if (val === null || val === undefined || typeof val === "boolean" || Array.isArray(val)) {
      return "Giá trị chỉ số phải là chữ số hợp lệ.";
    }

    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      // Từ chối hệ hex (ví dụ "0x10")
      if (/^0x/i.test(trimmed)) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      // Kiểm tra định dạng số thực dương thập phân: tùy chọn bắt đầu bằng . hoặc số, ví dụ "0.01", "1", "5.2", ".5"
      if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      const num = Number(trimmed);
      if (isNaN(num) || !isFinite(num) || num <= 0) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
    } else if (typeof val === "number") {
      if (isNaN(val) || !isFinite(val) || val <= 0) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
    } else {
      return "Giá trị chỉ số phải là chữ số hợp lệ.";
    }

    // 3. Kiểm tra nhận xét tổng quát (general_notes)
    // general_notes không được vượt quá 500 ký tự (rỗng hoặc đúng 500 ký tự hợp lệ)
    if (data.general_notes !== undefined && data.general_notes !== null) {
      const notes = String(data.general_notes);
      if (notes.length > 500) {
        return "Nhận xét tổng quát không được vượt quá 500 ký tự.";
      }
    }

    return null;
  }
}
