import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import patientRoutes from "./routes/patientRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root URL: Trang thông tin trạng thái Backend API
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>HIS Hospital Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0f2f5; margin: 0; padding: 40px; }
        .card { max-width: 750px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        h1 { color: #003a8c; margin-top: 0; display: flex; align-items: center; gap: 10px; }
        .badge { background: #52c41a; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 14px; font-weight: normal; }
        ul { line-height: 1.8; color: #333; }
        a { color: #1677ff; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .box { background: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin-top: 16px; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Bệnh Viện Bà Tư - Backend API <span class="badge">Đang chạy (Port 5000)</span></h1>
        <p>Hệ thống Backend cung cấp các REST API cho phân hệ Bệnh viện và bộ xác thực kiểm thử hộp đen.</p>
        
        <div class="box">
          <h3>Các Endpoint đang sẵn sàng:</h3>
          <ul>
            <li><strong>Kiểm tra trạng thái:</strong> <a href="/api/health" target="_blank">GET /api/health</a></li>
            <li><strong>Tìm kiếm & Lọc bệnh nhân:</strong> <a href="/api/patients/search" target="_blank">GET /api/patients/search</a></li>
            <li><strong>Thử nghiệm tìm theo tên:</strong> <a href="/api/patients/search?name=An" target="_blank">GET /api/patients/search?name=An</a></li>
            <li><strong>Thử nghiệm tìm theo CCCD:</strong> <a href="/api/patients/search?identity_card_number=001203001234" target="_blank">GET /api/patients/search?identity_card_number=001203001234</a></li>
          </ul>
        </div>

        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Giao diện kiểm thử Frontend đang chạy tại: <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>
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
    message: "HIS Hospital Backend is running!",
    timestamp: new Date().toISOString()
  });
});

// Auth Routes (Login / Logout / Profile)
app.use("/api/auth", authRoutes);

// Patient Search & Filter Routes
app.use("/api/patients", patientRoutes);

export default app;
