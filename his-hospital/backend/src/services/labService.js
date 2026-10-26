import dayjs from "dayjs";
import { labRepository } from "../repositories/labRepository.js";
import { patientRepository } from "../repositories/patientRepository.js";
import { consultationRepository } from "../repositories/consultationRepository.js";
import { invoiceRepository } from "../repositories/invoiceRepository.js";
import { EntityFactory } from "../patterns/factory/entityFactory.js";
import {
  LabOrderStateMachine,
  LAB_STATES,
} from "../patterns/state/labOrderState.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";

class LabService {
  getServices() {
    return labRepository.findServices();
  }

  getOrders(filters = {}) {
    const { status, type, patient_code, order_code } = filters;
    let list = labRepository.findOrders();

    if (status && status !== "ALL") {
      list = list.filter((ord) => ord.status === status);
    }
    if (type && type !== "ALL") {
      list = list.filter((ord) => ord.type === type);
    }
    if (patient_code) {
      list = list.filter((ord) =>
        ord.patient_code
          .toLowerCase()
          .includes(patient_code.trim().toLowerCase()),
      );
    }
    if (order_code) {
      list = list.filter((ord) =>
        ord.order_code.toLowerCase().includes(order_code.trim().toLowerCase()),
      );
    }

    return list;
  }

  getOrderById(idOrCode) {
    const order = labRepository.findOrderByIdOrCode(idOrCode);
    if (!order) {
      const error = new Error("Không tìm thấy chỉ định Cận lâm sàng");
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  createOrder(payload) {
    const {
      consultation_id,
      patient_code,
      patient_name,
      doctor = "BS. Lê Hoàng Nam",
      service_code,
    } = payload;

    if (!service_code) {
      const error = new Error("Mã dịch vụ cận lâm sàng không được để trống");
      error.statusCode = 400;
      throw error;
    }

    const service = labRepository.findServiceByCode(service_code);
    if (!service) {
      const error = new Error(
        "Mã dịch vụ cận lâm sàng không tồn tại trong danh mục",
      );
      error.statusCode = 400;
      throw error;
    }

    const nextId = labRepository.getNextId();
    const newOrder = EntityFactory.createLabOrder(
      { consultation_id, patient_code, patient_name, doctor },
      service,
      nextId,
    );
    labRepository.createOrder(newOrder);

    // Tạo hóa đơn viện phí CLS
    const nextInvId = invoiceRepository.getNextId();
    const invoice = EntityFactory.createInvoice(
      {
        invoice_code: `HD${String(nextInvId).padStart(6, "0")}`,
        patient_code,
        patient_name: patient_name || "Bệnh nhân",
        item_type: "CAN_LAM_SANG",
        description: `Chỉ định CLS: ${service.service_name}`,
        total_amount: service.price,
        insurance_discount: 0,
        patient_pay: service.price,
        payment_method: "CHUA_THANH_TOAN",
        cashier: "Trần Văn Thu Ngân",
        reference_id: newOrder.id,
      },
      nextInvId,
    );

    invoiceRepository.create(invoice);

    // Cập nhật trạng thái bệnh nhân
    const patient = patientRepository.findByIdOrCode(patient_code);
    if (patient) {
      patient.status = "Chờ kết quả CLS";
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code,
        status: "Chờ kết quả CLS",
        message: `Bệnh nhân [${patient.name}] đang chờ kết quả dịch vụ CLS: ${service.service_name}`,
      });
    }

    // Phát sự kiện phân tán tới KTV Cận lâm sàng & Thu ngân
    eventBus.emitEvent(EVENT_TYPES.LAB_ORDER_CREATED, {
      order: newOrder,
      service,
      message: `Chỉ định mới [${newOrder.order_code}] - ${service.service_name} cho BN ${newOrder.patient_name}`,
    });

    eventBus.emitEvent(EVENT_TYPES.INVOICE_CREATED, {
      invoice,
      message: `Hóa đơn CLS [${invoice.invoice_code}] (${invoice.patient_pay.toLocaleString()}đ)`,
    });

    return newOrder;
  }

  startOrder(idOrCode, technician = "KTV. Đặng Quốc Việt") {
    const order = labRepository.findOrderByIdOrCode(idOrCode);
    if (!order) {
      const error = new Error("Không tìm thấy chỉ định Cận lâm sàng");
      error.statusCode = 404;
      throw error;
    }

    // Verify that the associated invoice has been paid
    const invoice = invoiceRepository
      .findAll()
      .find((inv) => inv.reference_id === order.id);
    if ((invoice && invoice.status !== "PAID") || (!invoice && order.payment_status !== "PAID")) {
      const err = new Error(
        "Chưa thanh toán viện phí, không thể tiến hành chỉ định CLS",
      );
      err.statusCode = 400;
      throw err;
    }

    if (order.type === "LAB" && order.status !== LAB_STATES.SAMPLE_COLLECTED) {
      const err = new Error("Cần tiếp nhận và đối chiếu mẫu bệnh phẩm trước khi chạy xét nghiệm");
      err.statusCode = 400;
      throw err;
    }

    LabOrderStateMachine.transition(order, LAB_STATES.PROCESSING);
    order.technician = technician;
    order.analysis_started_at = dayjs().format("DD/MM/YYYY HH:mm");

    eventBus.emitEvent(EVENT_TYPES.LAB_ORDER_PROCESSING, {
      order,
      technician,
      message: `KTV ${technician} đã tiếp nhận thực hiện ca chỉ định [${order.order_code}]`,
    });

    return order;
  }

  collectSample(idOrCode, payload = {}) {
    const order = labRepository.findOrderByIdOrCode(idOrCode);
    if (!order) {
      const error = new Error("Không tìm thấy chỉ định xét nghiệm");
      error.statusCode = 404;
      throw error;
    }
    if (order.type !== "LAB") {
      const error = new Error("Chỉ định chẩn đoán hình ảnh không có bước tiếp nhận mẫu bệnh phẩm");
      error.statusCode = 400;
      throw error;
    }
    if (order.payment_status !== "PAID") {
      const error = new Error("Chưa thanh toán viện phí, không thể tiếp nhận mẫu");
      error.statusCode = 400;
      throw error;
    }
    if (order.status !== LAB_STATES.PENDING && order.status !== LAB_STATES.SAMPLE_REJECTED) {
      const error = new Error("Phiếu không ở trạng thái chờ tiếp nhận mẫu");
      error.statusCode = 400;
      throw error;
    }

    LabOrderStateMachine.transition(order, LAB_STATES.SAMPLE_COLLECTED);
    order.technician = payload.technician || "KTV. Đặng Quốc Việt";
    order.specimen = {
      barcode: payload.barcode || `M${order.order_code.replace("CLS", "")}`,
      type: payload.specimen_type || "Máu toàn phần EDTA",
      collected_at: payload.collected_at || dayjs().format("DD/MM/YYYY HH:mm"),
      received_at: dayjs().format("DD/MM/YYYY HH:mm"),
      condition: payload.condition || "Đạt yêu cầu",
    };
    return order;
  }

  updateResult(idOrCode, payload = {}) {
    const { technician = "KTV. Đặng Quốc Việt", results } = payload;

    const order = labRepository.findOrderByIdOrCode(idOrCode);
    if (!order) {
      const error = new Error("Không tìm thấy chỉ định Cận lâm sàng");
      error.statusCode = 404;
      throw error;
    }

    // Ensure invoice is paid before allowing result entry
    const invoice = invoiceRepository
      .findAll()
      .find((inv) => inv.reference_id === order.id);
    if ((invoice && invoice.status !== "PAID") || (!invoice && order.payment_status !== "PAID")) {
      const err = new Error(
        "Chưa thanh toán viện phí, không thể nhập kết quả CLS",
      );
      err.statusCode = 400;
      throw err;
    }

    if (
      !results ||
      (!results.parameters && !results.conclusion && !results.findings)
    ) {
      const error = new Error(
        "Vui lòng nhập kết quả hoặc kết luận cận lâm sàng",
      );
      error.statusCode = 400;
      throw error;
    }

    if (order.status !== LAB_STATES.PROCESSING) {
      const err = new Error("Phiếu CLS phải được KTV tiếp nhận trước khi nhập kết quả");
      err.statusCode = 400;
      throw err;
    }

    LabOrderStateMachine.transition(
      order,
      order.type === "LAB" ? LAB_STATES.PENDING_APPROVAL : LAB_STATES.COMPLETED,
    );
    order.technician = technician;
    order.results = results;
    order.result_entered_at = dayjs().format("DD/MM/YYYY HH:mm");
    if (order.type === "PACS") order.completed_at = dayjs().format("DD/MM/YYYY HH:mm");

    // Kết quả LAB chỉ là kết quả sơ bộ cho đến khi được duyệt chuyên môn.
    if (order.type === "LAB") return order;

    // Tự động đồng bộ kết quả vào Hồ sơ Bệnh án EMR của Bác sĩ
    const allConsultations = consultationRepository.findAll();
    const consultation = allConsultations.find(
      (c) => c.patient_code === order.patient_code,
    );
    if (consultation) {
      if (!consultation.lab_orders) consultation.lab_orders = [];
      consultation.lab_orders.push({
        order_code: order.order_code,
        service_name: order.service_name,
        status: "COMPLETED",
        result: results?.conclusion || "Đã có kết quả xét nghiệm",
      });
    }

    // Cập nhật trạng thái bệnh nhân về Đang khám để Bác sĩ kết luận
    const patient = patientRepository.findByIdOrCode(order.patient_code);
    if (patient && patient.status === "Chờ kết quả CLS") {
      patient.status = "Đang khám";
      eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
        patient_code: patient.patient_code,
        status: "Đang khám",
        message: `Đã có kết quả CLS của BN [${patient.name}], mời quay lại phòng khám Bác sĩ.`,
      });
    }

    // Phát sự kiện phân tán tới Bác sĩ điều trị và toàn hệ thống
    eventBus.emitEvent(EVENT_TYPES.LAB_ORDER_COMPLETED, {
      order,
      patient_code: order.patient_code,
      results,
      message: `Đã có kết quả xét nghiệm/chẩn đoán hình ảnh cho chỉ định [${order.order_code}] - BN ${order.patient_name}`,
    });

    return order;
  }

  approveResult(idOrCode, payload = {}) {
    const order = labRepository.findOrderByIdOrCode(idOrCode);
    if (!order) {
      const error = new Error("Không tìm thấy chỉ định xét nghiệm");
      error.statusCode = 404;
      throw error;
    }
    if (order.type !== "LAB" || order.status !== LAB_STATES.PENDING_APPROVAL) {
      const error = new Error("Chỉ có kết quả xét nghiệm đang chờ duyệt mới được phát hành");
      error.statusCode = 400;
      throw error;
    }
    LabOrderStateMachine.transition(order, LAB_STATES.COMPLETED);
    order.approved_by = payload.approved_by || "BS. Phụ trách xét nghiệm";
    order.approved_at = dayjs().format("DD/MM/YYYY HH:mm");
    order.completed_at = order.approved_at;

    const consultation = consultationRepository.findAll().find((c) => c.patient_code === order.patient_code);
    if (consultation) {
      if (!consultation.lab_orders) consultation.lab_orders = [];
      consultation.lab_orders.push({ order_code: order.order_code, service_name: order.service_name, status: "COMPLETED", result: order.results?.conclusion || "Đã có kết quả xét nghiệm" });
    }
    const patient = patientRepository.findByIdOrCode(order.patient_code);
    if (patient && patient.status === "Chờ kết quả CLS") patient.status = "Đang khám";
    eventBus.emitEvent(EVENT_TYPES.LAB_ORDER_COMPLETED, { order, patient_code: order.patient_code, results: order.results, message: `Đã phát hành kết quả xét nghiệm [${order.order_code}]` });
    return order;
  }
}

export const labService = new LabService();
