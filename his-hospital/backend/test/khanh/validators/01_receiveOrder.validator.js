/**
 * Validator cho Chức năng Tiếp nhận chỉ định cận lâm sàng (3.10)
 * Kiểm tra tính hợp lệ dữ liệu đầu vào của hàm ReceiveOrderValidator.validateReceiveOrder
 * Tương ứng các ca UT01 -> UT10 trong docs/Tong_Hop_45_Test_Case_Validate.md
 */

export class ReceiveOrderValidator {
  /**
   * Xác thực thông tin tiếp nhận chỉ định CLS
   * Dữ liệu mặc định nếu không truyền hoặc không ghi đè:
   * {
   *   order_search_key: "CLS_123",
   *   selected_order_id: 1,
   *   payment_status: "PAID",
   *   order_dept: "LAB",
   *   technician_dept: "LAB"
   * }
   * 
   * @param {Object} input - Dữ liệu tiếp nhận chỉ định
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo nếu không hợp lệ
   */
  static validateReceiveOrder(input = {}) {
    const defaultData = {
      order_search_key: "CLS_123",
      selected_order_id: 1,
      payment_status: "PAID",
      order_dept: "LAB",
      technician_dept: "LAB"
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra mã tra cứu (order_search_key)
    // Tối đa 30 ký tự, không chứa ký tự đặc biệt. Cho phép rỗng (""), khoảng trắng ở 2 đầu được trim khi kiểm tra độ dài/hợp lệ
    if (data.order_search_key !== undefined && data.order_search_key !== null) {
      const searchKeyStr = String(data.order_search_key).trim();
      if (searchKeyStr.length > 30 || (searchKeyStr.length > 0 && !/^[a-zA-Z0-9_\s]+$/.test(searchKeyStr))) {
        return "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt).";
      }
    }

    // 2. Kiểm tra chọn phiếu chỉ định trên danh sách hàng chờ (selected_order_id)
    if (data.selected_order_id === null || data.selected_order_id === undefined) {
      return "Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ.";
    }

    // 3. Kiểm tra trạng thái thanh toán viện phí (payment_status)
    if (data.payment_status !== "PAID") {
      return "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước.";
    }

    // 4. Kiểm tra phòng chuyên môn (order_dept và technician_dept)
    if (!data.order_dept || !data.technician_dept || data.order_dept !== data.technician_dept) {
      return "Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.";
    }

    return null;
  }
}
