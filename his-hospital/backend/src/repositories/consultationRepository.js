import { globalData } from "../data/seedData.js";

class ConsultationRepository {
  findAll() {
    return [...globalData.consultations];
  }

  findByIdOrCode(idOrCode) {
    return globalData.consultations.find(
      (c) => String(c.id) === String(idOrCode) || c.patient_code === idOrCode
    );
  }

  findByPatientCode(patientCode) {
    return globalData.consultations.filter(
      (c) => c.patient_code.toLowerCase() === patientCode.toLowerCase()
    );
  }

  create(consultationEntity) {
    globalData.consultations.unshift(consultationEntity);
    return consultationEntity;
  }

  update(idOrCode, updateFields) {
    const index = globalData.consultations.findIndex(
      (c) => String(c.id) === String(idOrCode) || c.patient_code === idOrCode
    );
    if (index === -1) return null;

    globalData.consultations[index] = {
      ...globalData.consultations[index],
      ...updateFields
    };
    return globalData.consultations[index];
  }

  getNextId() {
    return globalData.consultations.length + 1;
  }
}

export const consultationRepository = new ConsultationRepository();
