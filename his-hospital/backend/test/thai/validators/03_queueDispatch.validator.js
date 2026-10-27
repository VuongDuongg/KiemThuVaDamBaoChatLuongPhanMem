/**
 * Validator cho Chức năng Điều phối và gọi số khám (1.3)
 * Tác giả đặc tả: Nguyễn Hồng Thái
 * Tương ứng các ca UT29 -> UT45 trong docs/thai/testcasenta_md.md
 */

export class QueueDispatchValidator {
  static VALID_ACTIONS = new Set(["CALL_NEXT", "RECALL", "SKIP", "TRANSFER"]);

  /**
   * Xác thực thông tin điều phối và gọi số khám
   * Dữ liệu mặc định:
   * {
   *   clinic_id: 5,
   *   current_ticket_number: 10,
   *   action: "CALL_NEXT",
   *   target_room_id: 102
   * }
   * 
   * @param {Object} input - Dữ liệu yêu cầu điều phối hàng đợi
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validateQueueDispatch(input = {}) {
    const defaultData = {
      clinic_id: 5,
      current_ticket_number: 10,
      action: "CALL_NEXT",
      target_room_id: 102
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra Thông tin phòng khám điều phối (clinic_id)
    if (data.clinic_id === null || data.clinic_id === undefined) {
      return "Thông tin phòng khám điều phối không hợp lệ.";
    }

    const clinicNum = typeof data.clinic_id === "number" ? data.clinic_id : Number(data.clinic_id);
    if (!Number.isInteger(clinicNum) || clinicNum <= 0) {
      return "Thông tin phòng khám điều phối không hợp lệ.";
    }

    // 2. Kiểm tra Số thứ tự gọi khám (current_ticket_number)
    if (data.current_ticket_number === null || data.current_ticket_number === undefined) {
      return "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.";
    }

    const ticketNum = typeof data.current_ticket_number === "number" ? data.current_ticket_number : Number(data.current_ticket_number);
    if (!Number.isFinite(ticketNum) || !Number.isInteger(ticketNum) || ticketNum <= 0) {
      return "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.";
    }

    // 3. Kiểm tra Hành động điều phối (action)
    if (
      !data.action ||
      typeof data.action !== "string" ||
      !QueueDispatchValidator.VALID_ACTIONS.has(data.action)
    ) {
      return "Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER).";
    }

    // 4. Kiểm tra Phòng khám đích khi thực hiện chuyển tiếp bệnh nhân (action === "TRANSFER")
    if (data.action === "TRANSFER") {
      if (data.target_room_id === null || data.target_room_id === undefined) {
        return "Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân.";
      }

      const targetNum = typeof data.target_room_id === "number" ? data.target_room_id : Number(data.target_room_id);
      if (!Number.isInteger(targetNum) || targetNum <= 0) {
        return "Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân.";
      }

      if (targetNum === clinicNum) {
        return "Phòng khám đích phải khác với phòng khám hiện tại.";
      }
    }

    return null;
  }
}
