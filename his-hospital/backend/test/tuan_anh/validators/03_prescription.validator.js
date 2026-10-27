/**
 * Validator cho Chức năng Kê đơn thuốc (1.3)
 * Tác giả đặc tả: Ngô Tuấn Anh
 * Tương ứng các ca UT28 -> UT45 trong docs/anh/testcasenta.md
 */

export class PrescriptionValidator {
  static VALID_DRUGS = new Set([
    "MED001",
    "MED002",
    "MED003",
    "PARA500",
    "AMOX500",
    "IBU400"
  ]);

  /**
   * Xác thực thông tin kê đơn thuốc
   * Dữ liệu mặc định:
   * {
   *   drug_id: "MED001",
   *   available_stock: 50,
   *   quantity: 10,
   *   usage_instruction: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn",
   *   interaction_level: "NONE",
   *   interaction_override_confirm: false
   * }
   * 
   * @param {Object} input - Dữ liệu dòng thuốc kê đơn
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validatePrescription(input = {}) {
    const defaultData = {
      drug_id: "MED001",
      available_stock: 50,
      quantity: 10,
      usage_instruction: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn",
      interaction_level: "NONE",
      interaction_override_confirm: false
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra mã thuốc (drug_id) và số lượng tồn kho (available_stock)
    if (!data.drug_id || typeof data.drug_id !== "string") {
      return "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.";
    }

    const trimmedDrugId = data.drug_id.trim();
    if (!trimmedDrugId || !PrescriptionValidator.VALID_DRUGS.has(trimmedDrugId)) {
      return "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.";
    }

    if (
      typeof data.available_stock !== "number" ||
      Number.isNaN(data.available_stock) ||
      !Number.isFinite(data.available_stock) ||
      data.available_stock <= 0
    ) {
      return "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương.";
    }

    // 2. Kiểm tra số lượng cấp (quantity)
    // Phải là số nguyên dương, hữu hạn, và không vượt quá tồn kho
    if (
      typeof data.quantity !== "number" ||
      Number.isNaN(data.quantity) ||
      !Number.isFinite(data.quantity) ||
      !Number.isInteger(data.quantity) ||
      data.quantity <= 0 ||
      data.quantity > data.available_stock
    ) {
      return "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho.";
    }

    // 3. Kiểm tra hướng dẫn sử dụng (usage_instruction)
    // Bắt buộc nhập, độ dài từ 1 đến 250 ký tự sau khi cắt khoảng trắng
    if (
      typeof data.usage_instruction !== "string" ||
      data.usage_instruction.trim().length === 0 ||
      data.usage_instruction.trim().length > 250
    ) {
      return "Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc.";
    }

    // 4. Kiểm tra cảnh báo tương tác thuốc (interaction_level & interaction_override_confirm)
    if (data.interaction_level === "SEVERE") {
      return "Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối.";
    }

    if (data.interaction_level === "MILD") {
      if (!data.interaction_override_confirm) {
        return "Vui lòng xác nhận ghi đè cảnh báo tương tác thuốc mức độ nhẹ để tiếp tục kê đơn.";
      }
    }

    return null;
  }
}
