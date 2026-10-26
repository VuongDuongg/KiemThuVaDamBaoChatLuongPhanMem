import { patientRepository } from "../repositories/patientRepository.js";
import { EntityFactory } from "../patterns/factory/entityFactory.js";
import { EncounterStateMachine, PATIENT_STATES } from "../patterns/state/encounterState.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";
import { validatePatientSearchParams, parseAndValidateDate } from "../validators/patientValidator.js";

class PatientService {
  searchPatients(queryParams) {
    const validation = validatePatientSearchParams(queryParams);
    if (!validation.isValid) {
      const error = new Error("Dữ liệu tìm kiếm không hợp lệ");
      error.validationErrors = validation.errors;
      error.statusCode = 400;
      throw error;
    }

    const {
      name,
      identity_card_number,
      phone,
      patient_code,
      from_date,
      to_date,
      department,
      status,
      gender
    } = queryParams;

    const all = patientRepository.findAll();
    const filtered = all.filter((p) => {
      if (name && name.trim()) {
        if (!p.name.toLowerCase().includes(name.trim().toLowerCase())) return false;
      }
      if (identity_card_number && identity_card_number.trim()) {
        if (!p.identity_card_number.includes(identity_card_number.trim())) return false;
      }
      if (phone && phone.trim()) {
        if (!p.phone.includes(phone.trim())) return false;
      }
      if (patient_code && patient_code.trim()) {
        if (!p.patient_code.toUpperCase().includes(patient_code.trim().toUpperCase())) return false;
      }
      if (department && department !== "Tất cả") {
        if (p.department !== department) return false;
      }
      if (status && status !== "Tất cả") {
        if (p.status !== status) return false;
      }
      if (gender && gender !== "Tất cả") {
        if (p.gender !== gender) return false;
      }
      if (from_date && from_date.trim()) {
        const fDate = parseAndValidateDate(from_date);
        const pDate = parseAndValidateDate(p.reception_date);
        if (pDate && fDate && pDate < fDate) return false;
      }
      if (to_date && to_date.trim()) {
        const tDate = parseAndValidateDate(to_date);
        const pDate = parseAndValidateDate(p.reception_date);
        if (pDate && tDate && pDate > tDate) return false;
      }
      return true;
    });

    return filtered;
  }

  getAllPatients() {
    return patientRepository.findAll();
  }

  getPatientById(idOrCode) {
    const patient = patientRepository.findByIdOrCode(idOrCode);
    if (!patient) {
      const error = new Error("Không tìm thấy hồ sơ bệnh nhân");
      error.statusCode = 404;
      throw error;
    }
    return patient;
  }

  createPatient(payload) {
    const { name, identity_card_number, phone } = payload;

    if (!name || name.trim().length < 2) {
      const error = new Error("Họ và tên bắt buộc và tối thiểu 2 ký tự");
      error.statusCode = 400;
      throw error;
    }
    if (!identity_card_number || !/^\d{12}$/.test(identity_card_number.trim())) {
      const error = new Error("Số CCCD phải gồm đúng 12 chữ số");
      error.statusCode = 400;
      throw error;
    }
    if (!phone || !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
      const error = new Error("Số điện thoại phải 10 số đầu mạng VN hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    const nextId = patientRepository.getNextId();
    const newPatient = EntityFactory.createPatient(payload, nextId);
    patientRepository.create(newPatient);

    // Phát sự kiện phân tán tới các vai trò khác (Bác sĩ, Thu ngân, Lễ tân)
    eventBus.emitEvent(EVENT_TYPES.PATIENT_CREATED, {
      patient: newPatient,
      message: `Bệnh nhân mới [${newPatient.name}] (${newPatient.patient_code}) vừa được tiếp đón vào phòng khám.`
    });

    return newPatient;
  }

  updatePatient(idOrCode, updateData) {
    const existing = patientRepository.findByIdOrCode(idOrCode);
    if (!existing) {
      const error = new Error("Không tìm thấy hồ sơ bệnh nhân");
      error.statusCode = 404;
      throw error;
    }

    const { name, identity_card_number, phone, status } = updateData;

    if (name && name.trim().length < 2) {
      const error = new Error("Họ và tên phải có ít nhất 2 ký tự");
      error.statusCode = 400;
      throw error;
    }
    if (identity_card_number && !/^\d{12}$/.test(identity_card_number.trim())) {
      const error = new Error("Số CCCD phải gồm đúng 12 chữ số");
      error.statusCode = 400;
      throw error;
    }
    if (phone && !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
      const error = new Error("Số điện thoại 10 số đầu mạng VN hợp lệ");
      error.statusCode = 400;
      throw error;
    }

    // Kiểm tra State Machine nếu có đổi trạng thái
    if (status && status !== existing.status) {
      const check = EncounterStateMachine.canTransition(existing.status, status);
      if (!check.isValid) {
        // Cho phép chuyển đổi trạng thái linh hoạt nếu do admin / lễ tân cập nhật, nhưng ghi log
        console.warn(`[EncounterState Warning]: ${check.reason}`);
      }
    }

    const updated = patientRepository.update(idOrCode, updateData);

    eventBus.emitEvent(EVENT_TYPES.PATIENT_UPDATED, {
      patient: updated,
      message: `Hồ sơ bệnh nhân [${updated.name}] (${updated.patient_code}) vừa được cập nhật.`
    });

    return updated;
  }

  deletePatient(idOrCode) {
    const existing = patientRepository.findByIdOrCode(idOrCode);
    if (!existing) {
      const error = new Error("Không tìm thấy hồ sơ bệnh nhân");
      error.statusCode = 404;
      throw error;
    }

    const deleted = patientRepository.delete(idOrCode);

    eventBus.emitEvent(EVENT_TYPES.PATIENT_DELETED, {
      patient_code: deleted.patient_code,
      name: deleted.name,
      message: `Đã xóa bệnh nhân ${deleted.name} (${deleted.patient_code}) khỏi hệ thống`
    });

    return deleted;
  }
}

export const patientService = new PatientService();
