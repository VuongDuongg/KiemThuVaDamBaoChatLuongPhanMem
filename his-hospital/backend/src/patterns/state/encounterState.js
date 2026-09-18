/**
 * State Pattern: Quản lý vòng đời lượt khám bệnh nhân (Encounter / Patient Life Cycle)
 * Các trạng thái chuẩn bệnh viện:
 * - CHO_KHAM (Chờ khám)
 * - DANG_KHAM (Đang khám)
 * - CHO_KET_QUA_CLS (Chờ kết quả CLS)
 * - CHO_THANH_TOAN (Chờ thanh toán)
 * - CHO_CAP_THUOC (Chờ cấp thuốc)
 * - DA_KHAM (Đã khám / Hoàn tất)
 * - HUY_KHAM (Hủy khám)
 */

export const PATIENT_STATES = {
  CHO_KHAM: "Chờ khám",
  DANG_KHAM: "Đang khám",
  CHO_KET_QUA_CLS: "Chờ kết quả CLS",
  CHO_THANH_TOAN: "Chờ thanh toán",
  CHO_CAP_THUOC: "Chờ cấp thuốc",
  DA_KHAM: "Đã khám",
  HUY_KHAM: "Hủy khám"
};

// Bản đồ các bước chuyển trạng thái hợp lệ
const VALID_TRANSITIONS = {
  [PATIENT_STATES.CHO_KHAM]: [
    PATIENT_STATES.DANG_KHAM,
    PATIENT_STATES.HUY_KHAM
  ],
  [PATIENT_STATES.DANG_KHAM]: [
    PATIENT_STATES.CHO_KET_QUA_CLS,
    PATIENT_STATES.CHO_THANH_TOAN,
    PATIENT_STATES.CHO_CAP_THUOC,
    PATIENT_STATES.DA_KHAM
  ],
  [PATIENT_STATES.CHO_KET_QUA_CLS]: [
    PATIENT_STATES.DANG_KHAM, // Khi có kết quả CLS, chuyển về Đang khám để BS chẩn đoán tiếp
    PATIENT_STATES.CHO_THANH_TOAN,
    PATIENT_STATES.DA_KHAM
  ],
  [PATIENT_STATES.CHO_THANH_TOAN]: [
    PATIENT_STATES.CHO_CAP_THUOC,
    PATIENT_STATES.CHO_KET_QUA_CLS,
    PATIENT_STATES.DA_KHAM,
    PATIENT_STATES.DANG_KHAM
  ],
  [PATIENT_STATES.CHO_CAP_THUOC]: [
    PATIENT_STATES.DA_KHAM
  ],
  [PATIENT_STATES.DA_KHAM]: [
    // Có thể tái khám nếu cần
    PATIENT_STATES.CHO_KHAM
  ],
  [PATIENT_STATES.HUY_KHAM]: []
};

export class EncounterStateMachine {
  /**
   * Kiểm tra xem việc chuyển trạng thái có hợp lệ không
   * @param {string} currentState 
   * @param {string} nextState 
   * @returns {{ isValid: boolean, reason?: string }}
   */
  static canTransition(currentState, nextState) {
    if (!currentState || !nextState) {
      return { isValid: false, reason: "Trạng thái không được để trống" };
    }

    if (currentState === nextState) {
      return { isValid: true };
    }

    const allowed = VALID_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        isValid: false,
        reason: `Không thể chuyển từ trạng thái [${currentState}] sang [${nextState}]`
      };
    }

    return { isValid: true };
  }

  /**
   * Chuyển trạng thái an toàn
   * @param {object} patient 
   * @param {string} nextState 
   * @returns {object}
   */
  static transition(patient, nextState) {
    const check = this.canTransition(patient.status, nextState);
    if (!check.isValid) {
      throw new Error(check.reason);
    }
    patient.status = nextState;
    patient.updated_at = new Date().toISOString();
    return patient;
  }
}
