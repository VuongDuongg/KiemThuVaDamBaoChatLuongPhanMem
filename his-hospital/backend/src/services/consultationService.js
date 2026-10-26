import dayjs from "dayjs";
import { consultationRepository } from "../repositories/consultationRepository.js";
import { patientRepository } from "../repositories/patientRepository.js";
import { medicineRepository } from "../repositories/medicineRepository.js";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { EntityFactory } from "../patterns/factory/entityFactory.js";
import { EncounterStateMachine, PATIENT_STATES } from "../patterns/state/encounterState.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";

class ConsultationService {
  getConsultations(filters = {}) {
    const { patient_code, status } = filters;
    let list = consultationRepository.findAll();

    if (patient_code) {
      list = list.filter((c) =>
        c.patient_code.toLowerCase().includes(patient_code.trim().toLowerCase())
      );
    }
    if (status) {
      list = list.filter((c) => c.status === status);
    }

    return list;
  }

  getConsultationById(idOrCode) {
    const consultation = consultationRepository.findByIdOrCode(idOrCode);
    if (!consultation) {
      const error = new Error("Không tìm thấy hồ sơ bệnh án");
      error.statusCode = 404;
      throw error;
    }
    return consultation;
  }

  createConsultation(payload) {
    const {
      patient_code,
      patient_name,
      doctor = "BS. Lê Hoàng Nam",
      vitals,
      symptoms,
      icd10_code
    } = payload;

    if (!patient_code || !symptoms || !icd10_code) {
      const error = new Error("Vui lòng nhập đầy đủ thông tin bệnh nhân, triệu chứng và mã chẩn đoán ICD-10");
      error.statusCode = 400;
      throw error;
    }

    // Ràng buộc sinh hiệu thực tế (Vitals Validation)
    if (vitals) {
      if (vitals.blood_pressure && !/^\d{2,3}\/\d{2,3}$/.test(vitals.blood_pressure.trim())) {
        const error = new Error("Huyết áp phải có định dạng chuẩn (VD: 120/80)");
        error.statusCode = 400;
        throw error;
      }
      if (vitals.pulse !== undefined && (vitals.pulse < 30 || vitals.pulse > 200)) {
        const error = new Error("Mạch đập phải từ 30 đến 200 lần/phút");
        error.statusCode = 400;
        throw error;
      }
      if (vitals.temperature !== undefined && (vitals.temperature < 34.0 || vitals.temperature > 43.0)) {
        const error = new Error("Thân nhiệt không hợp lệ (phải từ 34.0°C đến 43.0°C)");
        error.statusCode = 400;
        throw error;
      }
      if (vitals.spo2 !== undefined && (vitals.spo2 < 50 || vitals.spo2 > 100)) {
        const error = new Error("SpO2 phải từ 50% đến 100%");
        error.statusCode = 400;
        throw error;
      }
    }

    const nextId = consultationRepository.getNextId();
    const newConsultation = EntityFactory.createConsultation(payload, nextId);
    consultationRepository.create(newConsultation);

    // Cập nhật trạng thái bệnh nhân
    const patient = patientRepository.findByIdOrCode(patient_code);
    if (patient) {
      patient.status = "Đã khám";
      patient.doctor = doctor;
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code,
        status: "Đã khám",
        message: `Bác sĩ ${doctor} đã hoàn tất khám lâm sàng cho bệnh nhân [${patient.name}].`
      });
    }

    eventBus.emitEvent(EVENT_TYPES.CONSULTATION_CREATED, {
      consultation: newConsultation,
      message: `Hồ sơ bệnh án mới cho BN [${newConsultation.patient_name}] (${newConsultation.icd10_code} - ${newConsultation.icd10_name})`
    });

    return newConsultation;
  }

  addPrescription(idOrCode, items) {
    const consultation = consultationRepository.findByIdOrCode(idOrCode);
    if (!consultation) {
      const error = new Error("Không tìm thấy hồ sơ bệnh án");
      error.statusCode = 404;
      throw error;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const error = new Error("Đơn thuốc phải có ít nhất một loại thuốc");
      error.statusCode = 400;
      throw error;
    }

    let totalCost = 0;
    const allMeds = medicineRepository.findAll();

    // 1. Kiểm tra toàn bộ tồn kho trước khi trừ (Atomic check)
    for (const item of items) {
      const qty = Number(item.quantity);
      if (!qty || qty <= 0) {
        const error = new Error("Số lượng thuốc phải là số nguyên dương");
        error.statusCode = 400;
        throw error;
      }

      const med = allMeds.find(
        (m) => m.id === item.medicine_id || m.medicine_code === item.medicine_code
      );

      if (med && med.stock_quantity < qty) {
        const error = new Error(`Số lượng thuốc trong kho không đủ cho ${med.medicine_name} (còn ${med.stock_quantity})`);
        error.statusCode = 400;
        throw error;
      }

      const unitPrice = med ? med.unit_price : 2000;
      item.unit_price = unitPrice;
      totalCost += unitPrice * qty;
    }

    // 2. Trừ kho thuốc
    for (const item of items) {
      const med = allMeds.find(
        (m) => m.id === item.medicine_id || m.medicine_code === item.medicine_code
      );
      if (med) {
        med.stock_quantity -= Number(item.quantity);
        eventBus.emitEvent(EVENT_TYPES.MEDICINE_STOCK_UPDATED, {
          medicine: med,
          message: `Thuốc ${med.medicine_name} vừa được xuất kê đơn (Còn lại: ${med.stock_quantity})`
        });
      }
    }

    consultation.prescriptions = items;
    consultation.status = "COMPLETED";

    // 3. Tự động sinh hóa đơn tiền thuốc
    const nextInvId = invoiceRepository.getNextId();
    const medInvoice = EntityFactory.createInvoice({
      invoice_code: `HDT${String(nextInvId).padStart(6, "0")}`,
      patient_code: consultation.patient_code,
      patient_name: consultation.patient_name,
      item_type: "TIEN_THUOC",
      description: `Đơn thuốc điều trị BS. ${consultation.doctor}`,
      total_amount: totalCost,
      insurance_discount: 0,
      patient_pay: totalCost,
      payment_method: "CHUA_THANH_TOAN",
      cashier: "Trần Văn Thu Ngân"
    }, nextInvId);

    invoiceRepository.create(medInvoice);

    // 4. Chuyển trạng thái bệnh nhân sang "Chờ thanh toán"
    const patient = patientRepository.findByIdOrCode(consultation.patient_code);
    if (patient) {
      patient.status = "Chờ thanh toán";
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code: patient.patient_code,
        status: "Chờ thanh toán",
        message: `Đơn thuốc đã kê xong, bệnh nhân [${patient.name}] chuyển sang Chờ thanh toán viện phí.`
      });
    }

    eventBus.emitEvent(EVENT_TYPES.PRESCRIPTION_ISSUED, {
      consultation,
      invoice: medInvoice,
      message: `Bác sĩ ${consultation.doctor} đã kê đơn thuốc (${items.length} loại) cho BN ${consultation.patient_name}`
    });

    eventBus.emitEvent(EVENT_TYPES.INVOICE_CREATED, {
      invoice: medInvoice,
      message: `Hóa đơn tiền thuốc [${medInvoice.invoice_code}] (${medInvoice.patient_pay.toLocaleString()}đ) chuyển sang Thu ngân`
    });

    return consultation;
  }
}

export const consultationService = new ConsultationService();
