/**
 * Validator cho Chức năng Hình ảnh và kết luận PACS (3.12)
 * Kiểm tra tính hợp lệ dữ liệu đầu vào của hàm PacsValidator.validatePacs
 * Tương ứng các ca UT29 -> UT45 trong docs/Tong_Hop_45_Test_Case_Validate.md
 */

export class PacsValidator {
  /**
   * Xác thực thông tin PACS
   * Quy ước MB = 1024 * 1024 byte
   * Dữ liệu mặc định:
   * {
   *   image_files: [{ name: "phoi.jpg", size: 1024 * 1024 }],
   *   image_description: "a".repeat(10),
   *   diagnostic_conclusion: "a".repeat(5)
   * }
   * 
   * @param {Object} input - Dữ liệu tải ảnh & chẩn đoán PACS
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo nếu không hợp lệ
   */
  static validatePacs(input = {}) {
    const MB = 1024 * 1024;
    const defaultData = {
      image_files: [{ name: "phoi.jpg", size: MB }],
      image_description: "a".repeat(10),
      diagnostic_conclusion: "a".repeat(5)
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra danh sách tệp hình ảnh (image_files)
    // Phải là mảng không rỗng.
    // Mỗi tệp phải có định dạng hợp lệ (.jpg, .jpeg, .png, .dcm - không phân biệt hoa thường)
    // Dung lượng: 0 < size <= 25MB (25 * 1024 * 1024), size phải là số hữu hạn (không NaN, không Infinity)
    if (!Array.isArray(data.image_files) || data.image_files.length === 0) {
      return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".dcm"];
    for (const file of data.image_files) {
      if (!file || typeof file !== "object") {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }

      const fileName = String(file.name || "").toLowerCase();
      const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExt) {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }

      const size = file.size;
      if (
        typeof size !== "number" ||
        isNaN(size) ||
        !isFinite(size) ||
        size <= 0 ||
        size > 25 * MB
      ) {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }
    }

    // 2. Kiểm tra mô tả hình ảnh (image_description)
    // Sau khi cắt khoảng trắng: tối thiểu 10 ký tự, tối đa 2000 ký tự
    const desc = data.image_description !== undefined && data.image_description !== null
      ? String(data.image_description).trim()
      : "";
    if (desc.length < 10 || desc.length > 2000) {
      return "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).";
    }

    // 3. Kiểm tra kết luận chẩn đoán (diagnostic_conclusion)
    // Sau khi cắt khoảng trắng: tối thiểu 5 ký tự, tối đa 1000 ký tự
    const concl = data.diagnostic_conclusion !== undefined && data.diagnostic_conclusion !== null
      ? String(data.diagnostic_conclusion).trim()
      : "";
    if (concl.length < 5 || concl.length > 1000) {
      return "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).";
    }

    return null;
  }
}
