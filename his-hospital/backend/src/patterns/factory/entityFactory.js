import dayjs from "dayjs";

/**
 * Factory Pattern: Khởi tạo các thực thể nghiệp vụ chuẩn hóa (Patient, Invoice, LabOrder, Consultation)
 */

export class EntityFactory {
  static createPatient(raw, nextId) {
    const formattedDate = dayjs().format("DD/MM/YYYY");
    return {
      id: nextId,
      patient_code: raw.patient_code || `BN2026${String(nextId).padStart(4, "0")}`,
      name: raw.name.trim(),
      gender: raw.gender || "Nam",
      birth_date: raw.birth_date || "01/01/2000",
      phone: raw.phone.trim(),
      identity_card_number: raw.identity_card_number.trim(),
      insurance_code: raw.insurance_code ? raw.insurance_code.trim() : null,
      department: raw.department || "Khoa Nội Tổng Hợp",
      doctor: raw.doctor || "BS. Chưa chỉ định",
      reception_date: raw.reception_date || formattedDate,
      status: raw.status || "Chờ khám",
      address: raw.address || "Hà Nội",
      symptoms: raw.symptoms || "Đăng ký khám mới",
      created_at: new Date().toISOString()
    };
  }

  static createInvoice(data, nextId) {
    const isPaid = data.payment_method && data.payment_method !== "CHUA_THANH_TOAN";
    return {
      id: nextId,
      invoice_code: data.invoice_code || `HD${String(nextId).padStart(6, "0")}`,
      patient_code: data.patient_code,
      patient_name: data.patient_name,
      item_type: data.item_type || "TIEN_KHAM",
      description: data.description || "Thanh toán viện phí",
      total_amount: data.total_amount,
      insurance_discount: data.insurance_discount || 0,
      patient_pay: data.patient_pay,
      payment_method: data.payment_method || "CHUA_THANH_TOAN",
      status: isPaid ? "PAID" : "UNPAID",
      created_at: dayjs().format("DD/MM/YYYY HH:mm"),
      paid_at: isPaid ? dayjs().format("DD/MM/YYYY HH:mm") : null,
      cashier: data.cashier || "Trần Văn Thu Ngân"
    };
  }

  static createLabOrder(data, service, nextId) {
    const orderCode = `CLS${String(nextId).padStart(6, "0")}`;
    return {
      id: nextId,
      order_code: orderCode,
      consultation_id: data.consultation_id || nextId,
      patient_code: data.patient_code,
      patient_name: data.patient_name || "Bệnh nhân",
      doctor: data.doctor || "BS. Lê Hoàng Nam",
      technician: null,
      service_code: service.service_code,
      service_name: service.service_name,
      type: service.type,
      price: service.price,
      status: "PENDING",
      payment_status: "PAID",
      results: null,
      created_at: dayjs().format("DD/MM/YYYY HH:mm"),
      completed_at: null
    };
  }

  static createConsultation(data, nextId) {
    return {
      id: nextId,
      encounter_id: nextId,
      patient_code: data.patient_code,
      patient_name: data.patient_name || "Bệnh nhân",
      gender: data.gender || "Nam",
      birth_date: data.birth_date || "01/01/1990",
      doctor: data.doctor || "BS. Lê Hoàng Nam",
      department: data.department || "Khoa Nội",
      vitals: data.vitals || { blood_pressure: "120/80", pulse: 80, temperature: 37, spo2: 98 },
      symptoms: data.symptoms,
      icd10_code: data.icd10_code,
      icd10_name: data.icd10_name || "Bệnh lý chung",
      doctor_notes: data.doctor_notes || "",
      treatment_plan: data.treatment_plan || "Điều trị ngoại trú",
      status: "COMPLETED",
      prescriptions: data.prescriptions || [],
      lab_orders: data.lab_orders || [],
      created_at: dayjs().format("DD/MM/YYYY HH:mm")
    };
  }
}
