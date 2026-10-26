import { EventEmitter } from "events";

/**
 * Event Types dùng chung cho toàn bộ hệ thống HIS
 * Áp dụng Observer / Event-Driven Pattern
 */
export const EVENT_TYPES = {
  // 1. Phân hệ Tiếp đón & Bệnh nhân (TV1)
  PATIENT_CREATED: "PATIENT_CREATED",
  PATIENT_UPDATED: "PATIENT_UPDATED",
  PATIENT_DELETED: "PATIENT_DELETED",
  PATIENT_STATUS_CHANGED: "PATIENT_STATUS_CHANGED",

  // 2. Phân hệ Thu ngân & Kho Dược (TV2)
  INVOICE_CREATED: "INVOICE_CREATED",
  INVOICE_PAID: "INVOICE_PAID",
  MEDICINE_STOCK_UPDATED: "MEDICINE_STOCK_UPDATED",
  MEDICINE_ADDED: "MEDICINE_ADDED",

  // 3. Phân hệ Bác sĩ & Bệnh án EMR (TV3)
  CONSULTATION_CREATED: "CONSULTATION_CREATED",
  CONSULTATION_UPDATED: "CONSULTATION_UPDATED",
  PRESCRIPTION_ISSUED: "PRESCRIPTION_ISSUED",

  // 4. Phân hệ Cận lâm sàng & PACS (TV4)
  LAB_ORDER_CREATED: "LAB_ORDER_CREATED",
  LAB_ORDER_PROCESSING: "LAB_ORDER_PROCESSING",
  LAB_ORDER_COMPLETED: "LAB_ORDER_COMPLETED",
  LAB_ORDER_CANCELLED: "LAB_ORDER_CANCELLED",

  // Toàn hệ thống
  SYSTEM_NOTIFICATION: "SYSTEM_NOTIFICATION"
};

class EventBusSingleton extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Cho phép nhiều module đăng ký lắng nghe
  }

  /**
   * Phát sự kiện trong hệ thống nội bộ
   * @param {string} eventType 
   * @param {object} payload 
   */
  emitEvent(eventType, payload) {
    const timestamp = new Date().toISOString();
    const enrichedPayload = {
      ...payload,
      _eventType: eventType,
      _timestamp: timestamp
    };
    this.emit(eventType, enrichedPayload);
    this.emit("*", enrichedPayload); // Global listener
  }
}

// Singleton instance
export const eventBus = new EventBusSingleton();
