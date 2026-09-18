/**
 * State Pattern: Quản lý vòng đời Chỉ định Cận lâm sàng & PACS
 * - PENDING: Chờ tiếp nhận
 * - PROCESSING: Đang tiến hành xét nghiệm / chụp chiếu
 * - COMPLETED: Đã hoàn tất và trả kết quả
 * - CANCELLED: Đã hủy chỉ định
 */

export const LAB_STATES = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

const VALID_LAB_TRANSITIONS = {
  [LAB_STATES.PENDING]: [LAB_STATES.PROCESSING, LAB_STATES.CANCELLED],
  [LAB_STATES.PROCESSING]: [LAB_STATES.COMPLETED, LAB_STATES.CANCELLED],
  [LAB_STATES.COMPLETED]: [],
  [LAB_STATES.CANCELLED]: []
};

export class LabOrderStateMachine {
  static canTransition(currentState, nextState) {
    if (currentState === nextState) return { isValid: true };
    const allowed = VALID_LAB_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        isValid: false,
        reason: `Không thể chuyển chỉ định CLS từ [${currentState}] sang [${nextState}]`
      };
    }
    return { isValid: true };
  }

  static transition(order, nextState) {
    const check = this.canTransition(order.status, nextState);
    if (!check.isValid) {
      throw new Error(check.reason);
    }
    order.status = nextState;
    return order;
  }
}
