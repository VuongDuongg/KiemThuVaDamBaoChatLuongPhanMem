import { Server } from "socket.io";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";

/**
 * Socket Manager - Singleton Pattern
 * Đảm nhiệm việc quản lý kết nối WebSocket phân tán, phân chia Room theo Vai trò (RBAC)
 * và phân phối dữ liệu động theo thời gian thực (Real-time Dynamic Distributed Messaging)
 */
class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // socket.id -> { userId, role, fullName }
  }

  /**
   * Khởi tạo Socket.IO với HTTP Server
   * @param {import("http").Server} httpServer 
   */
  init(httpServer) {
    if (this.io) return this.io;

    this.io = new Server(httpServer, {
      cors: {
        origin: "*", // Cho phép kết nối từ mọi frontend client
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });

    this.setupConnectionHandlers();
    this.setupEventBusBridge();

    console.log("⚡ Socket.IO Server da duoc khoi tao thanh cong cho he thong phan tan HIS!");
    return this.io;
  }

  setupConnectionHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`🔌 Client ket noi: ${socket.id}`);

      // Client xác thực vai trò và tham gia các Room nghiệp vụ tương ứng
      socket.on("join_role", (userData) => {
        const { role, username, fullName } = userData || {};
        const safeRole = (role || "GUEST").toUpperCase();

        this.connectedUsers.set(socket.id, {
          username,
          role: safeRole,
          fullName
        });

        // 1. Tham gia Room riêng của Role
        socket.join(`role:${safeRole}`);

        // 2. Tham gia Room chung của toàn bệnh viện
        socket.join("hospital_broadcast");

        // 3. Quản trị viên (ADMIN) tự động tham gia tất cả các Room để giám sát
        if (safeRole === "ADMIN") {
          socket.join("role:RECEPTIONIST");
          socket.join("role:DOCTOR");
          socket.join("role:LAB_TECH");
          socket.join("role:CASHIER");
        }

        console.log(`👤 User [${fullName || username || "Anonymous"}] (${safeRole}) da tham gia Room: role:${safeRole}`);

        socket.emit("joined_success", {
          status: "CONNECTED",
          role: safeRole,
          socketId: socket.id,
          serverTime: new Date().toISOString()
        });
      });

      // Lắng nghe yêu cầu join room theo dõi 1 bệnh nhân cụ thể
      socket.on("watch_patient", (patientCode) => {
        if (patientCode) {
          socket.join(`patient:${patientCode}`);
          console.log(`👁️ Socket ${socket.id} dang theo doi ho so BN: ${patientCode}`);
        }
      });

      socket.on("unwatch_patient", (patientCode) => {
        if (patientCode) {
          socket.leave(`patient:${patientCode}`);
        }
      });

      socket.on("disconnect", () => {
        this.connectedUsers.delete(socket.id);
        console.log(`🔌 Client ngat ket noi: ${socket.id}`);
      });
    });
  }

  /**
   * Cầu nối giữa EventBus (nội bộ backend) và Socket.IO (phân tán tới clients)
   */
  setupEventBusBridge() {
    // 1. Tiếp đón bệnh nhân: Thông báo cho Lễ tân, Bác sĩ, Thu ngân
    eventBus.on(EVENT_TYPES.PATIENT_CREATED, (payload) => {
      this.broadcastToRoles(["RECEPTIONIST", "DOCTOR", "ADMIN"], "PATIENT_CREATED", payload);
    });

    eventBus.on(EVENT_TYPES.PATIENT_UPDATED, (payload) => {
      this.broadcastToAll("PATIENT_UPDATED", payload);
    });

    eventBus.on(EVENT_TYPES.PATIENT_STATUS_CHANGED, (payload) => {
      this.broadcastToAll("PATIENT_STATUS_CHANGED", payload);
      if (payload.patient_code) {
        this.io.to(`patient:${payload.patient_code}`).emit("PATIENT_STATUS_CHANGED", payload);
      }
    });

    // 2. Thu ngân & Hóa đơn & Kho Dược
    eventBus.on(EVENT_TYPES.INVOICE_CREATED, (payload) => {
      this.broadcastToRoles(["CASHIER", "RECEPTIONIST", "ADMIN"], "INVOICE_CREATED", payload);
    });

    eventBus.on(EVENT_TYPES.INVOICE_PAID, (payload) => {
      // Khi thu tiền: Thông báo tới Thu ngân, Bác sĩ, KTV Cận lâm sàng (để làm dịch vụ), Lễ tân
      this.broadcastToRoles(["CASHIER", "DOCTOR", "LAB_TECH", "RECEPTIONIST", "ADMIN"], "INVOICE_PAID", payload);
      if (payload.patient_code) {
        this.io.to(`patient:${payload.patient_code}`).emit("INVOICE_PAID", payload);
      }
    });

    eventBus.on(EVENT_TYPES.MEDICINE_STOCK_UPDATED, (payload) => {
      this.broadcastToRoles(["CASHIER", "DOCTOR", "ADMIN"], "MEDICINE_STOCK_UPDATED", payload);
    });

    // 3. Bác sĩ & Bệnh án & Kê đơn
    eventBus.on(EVENT_TYPES.CONSULTATION_CREATED, (payload) => {
      this.broadcastToRoles(["DOCTOR", "RECEPTIONIST", "ADMIN"], "CONSULTATION_CREATED", payload);
    });

    eventBus.on(EVENT_TYPES.PRESCRIPTION_ISSUED, (payload) => {
      // Khi kê đơn: Báo cho Thu ngân & Dược sĩ chuẩn bị thuốc
      this.broadcastToRoles(["CASHIER", "DOCTOR", "ADMIN"], "PRESCRIPTION_ISSUED", payload);
    });

    // 4. Cận lâm sàng & PACS
    eventBus.on(EVENT_TYPES.LAB_ORDER_CREATED, (payload) => {
      // Khi bác sĩ chỉ định: Báo ngay cho KTV Cận lâm sàng và Thu ngân
      this.broadcastToRoles(["LAB_TECH", "CASHIER", "ADMIN"], "LAB_ORDER_CREATED", payload);
    });

    eventBus.on(EVENT_TYPES.LAB_ORDER_PROCESSING, (payload) => {
      this.broadcastToRoles(["LAB_TECH", "DOCTOR", "ADMIN"], "LAB_ORDER_PROCESSING", payload);
    });

    eventBus.on(EVENT_TYPES.LAB_ORDER_COMPLETED, (payload) => {
      // Khi có kết quả CLS: Báo ngay cho Bác sĩ điều trị và cập nhật hàng đợi
      this.broadcastToRoles(["DOCTOR", "LAB_TECH", "RECEPTIONIST", "ADMIN"], "LAB_ORDER_COMPLETED", payload);
      if (payload.patient_code) {
        this.io.to(`patient:${payload.patient_code}`).emit("LAB_ORDER_COMPLETED", payload);
      }
    });
  }

  /**
   * Phát sự kiện tới danh sách các Roles cụ thể
   * @param {string[]} roles 
   * @param {string} event 
   * @param {object} data 
   */
  broadcastToRoles(roles, event, data) {
    if (!this.io) return;
    roles.forEach((role) => {
      this.io.to(`role:${role}`).emit(event, data);
    });
  }

  /**
   * Phát sự kiện tới toàn bộ client đang kết nối
   * @param {string} event 
   * @param {object} data 
   */
  broadcastToAll(event, data) {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  getConnectedCount() {
    return this.connectedUsers.size;
  }
}

export const socketManager = new SocketManager();
