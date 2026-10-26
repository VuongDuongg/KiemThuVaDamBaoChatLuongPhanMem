/**
 * State Pattern: Quản lý vòng đời Hóa đơn Viện phí & Chi trả
 * - UNPAID: Chưa thanh toán
 * - PAID: Đã thanh toán
 * - CANCELLED: Đã hủy
 * - REFUNDED: Đã hoàn tiền
 */

export const INVOICE_STATES = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};

const VALID_INVOICE_TRANSITIONS = {
  [INVOICE_STATES.UNPAID]: [INVOICE_STATES.PAID, INVOICE_STATES.CANCELLED],
  [INVOICE_STATES.PAID]: [INVOICE_STATES.REFUNDED],
  [INVOICE_STATES.CANCELLED]: [],
  [INVOICE_STATES.REFUNDED]: []
};

export class InvoiceStateMachine {
  static canTransition(currentState, nextState) {
    if (currentState === nextState) return { isValid: true };
    const allowed = VALID_INVOICE_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        isValid: false,
        reason: `Không thể chuyển hóa đơn từ trạng thái [${currentState}] sang [${nextState}]`
      };
    }
    return { isValid: true };
  }

  static transition(invoice, nextState) {
    const check = this.canTransition(invoice.status, nextState);
    if (!check.isValid) {
      throw new Error(check.reason);
    }
    invoice.status = nextState;
    return invoice;
  }
}
