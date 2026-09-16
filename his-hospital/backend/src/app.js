import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import labRoutes from "./routes/labRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root URL: Trang thông tin trạng thái Backend API cho cả 4 thành viên
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>HIS Hospital Backend API - Hệ Thống 4 Phân Hệ</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; margin: 0; padding: 40px; }
        .card { max-width: 850px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        h1 { color: #003a8c; margin-top: 0; display: flex; align-items: center; gap: 10px; }
        .badge { background: #52c41a; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 14px; font-weight: normal; }
        ul { line-height: 1.8; color: #333; }
        a { color: #1677ff; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .module { background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 8px; padding: 16px; margin-top: 14px; }
        .module h3 { margin: 0 0 8px 0; color: #003a8c; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Hệ Thống HIS Hospital Backend API <span class="badge">Sẵn Sàng (Port 5000)</span></h1>
        <p>Hệ thống Backend cung cấp đầy đủ API nghiệp vụ cho cả 4 phân hệ cốt lõi của đề tài Quản lý Bệnh viện Bà Tư:</p>
        
        <div class="module">
          <h3>1. Phân hệ Tiếp đón & Quản lý Bệnh nhân (Thành viên 1)</h3>
          <ul>
            <li><strong>Tìm kiếm & Lọc bệnh nhân:</strong> <a href="/api/patients/search" target="_blank">GET /api/patients/search</a></li>
            <li><strong>CRUD Bệnh nhân:</strong> <code>GET, POST, PUT, DELETE /api/patients</code></li>
          </ul>
        </div>

        <div class="module">
          <h3>2. Phân hệ Thu ngân & Dược / Kho (Thành viên 2)</h3>
          <ul>
            <li><strong>Danh sách hóa đơn viện phí:</strong> <a href="/api/invoices" target="_blank">GET /api/invoices</a></li>
            <li><strong>Thống kê doanh thu:</strong> <a href="/api/invoices/stats" target="_blank">GET /api/invoices/stats</a></li>
            <li><strong>Danh mục thuốc & Kho dược:</strong> <a href="/api/medicines" target="_blank">GET /api/medicines</a></li>
          </ul>
        </div>

        <div class="module">
          <h3>3. Phân hệ Bác sĩ & Bệnh án Điện tử EMR (Thành viên 3)</h3>
          <ul>
            <li><strong>Hồ sơ bệnh án điện tử:</strong> <a href="/api/consultations" target="_blank">GET /api/consultations</a></li>
            <li><strong>Kê đơn thuốc & Khám lâm sàng:</strong> <code>POST /api/consultations, POST /api/consultations/:id/prescribe</code></li>
          </ul>
        </div>

        <div class="module">
          <h3>4. Phân hệ Cận lâm sàng & Quản trị Hệ thống Core (Thành viên 4)</h3>
          <ul>
            <li><strong>Hàng đợi chỉ định CLS:</strong> <a href="/api/lab/orders" target="_blank">GET /api/lab/orders</a></li>
            <li><strong>Danh mục dịch vụ CLS:</strong> <a href="/api/lab/services" target="_blank">GET /api/lab/services</a></li>
            <li><strong>Đăng nhập & Phân quyền RBAC:</strong> <code>POST /api/auth/login</code></li>
          </ul>
        </div>

        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Giao diện ứng dụng Frontend đang hoạt động tại: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>
        </p>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "HIS Hospital Backend is running for all 4 member modules!",
    timestamp: new Date().toISOString()
  });
});

// Auth Routes (TV4 / Core)
app.use("/api/auth", authRoutes);

// Patient Routes (TV1)
app.use("/api/patients", patientRoutes);

// Billing & Medicine Routes (TV2)
app.use("/api/invoices", invoiceRoutes);
app.use("/api/medicines", medicineRoutes);

// Doctor Consultation Routes (TV3)
app.use("/api/consultations", consultationRoutes);

// Paraclinical Lab & PACS Routes (TV4)
app.use("/api/lab", labRoutes);

export default app;
