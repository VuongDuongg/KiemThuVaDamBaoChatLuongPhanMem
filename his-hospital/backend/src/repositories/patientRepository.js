import { globalData } from "../data/seedData.js";

/**
 * Repository Pattern: Trừu tượng hóa việc truy xuất và lưu trữ dữ liệu Bệnh nhân
 */
class PatientRepository {
  findAll() {
    return [...globalData.patients];
  }

  findByIdOrCode(idOrCode) {
    return globalData.patients.find(
      (p) => String(p.id) === String(idOrCode) || p.patient_code === idOrCode
    );
  }

  findByIdentityCard(identityCard) {
    return globalData.patients.find(
      (p) => p.identity_card_number === identityCard
    );
  }

  findByPhone(phone) {
    return globalData.patients.find((p) => p.phone === phone);
  }

  create(patientEntity) {
    globalData.patients.unshift(patientEntity);
    return patientEntity;
  }

  update(idOrCode, updateFields) {
    const index = globalData.patients.findIndex(
      (p) => String(p.id) === String(idOrCode) || p.patient_code === idOrCode
    );
    if (index === -1) return null;

    globalData.patients[index] = {
      ...globalData.patients[index],
      ...updateFields
    };
    return globalData.patients[index];
  }

  delete(idOrCode) {
    const index = globalData.patients.findIndex(
      (p) => String(p.id) === String(idOrCode) || p.patient_code === idOrCode
    );
    if (index === -1) return null;
    return globalData.patients.splice(index, 1)[0];
  }

  getNextId() {
    return globalData.patients.length + 1;
  }
}

export const patientRepository = new PatientRepository();
