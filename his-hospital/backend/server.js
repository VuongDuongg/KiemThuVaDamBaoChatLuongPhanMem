import dotenv from "dotenv";
import http from "node:http";
import app from "./src/app.js";
import pool from "./src/config/db.js";
import { initDatabase } from "./src/config/initDb.js";
import { seedDatabase } from "./src/config/seed.js";
import { socketManager } from "./src/sockets/socketManager.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Tạo HTTP Server kết hợp Express App
const server = http.createServer(app);

// Khởi tạo Socket.IO Real-time Event Mesh
socketManager.init(server);

// Khởi tạo PostgreSQL Database nếu có cấu hình
pool
  .connect()
  .then(async (client) => {
    console.log("✅ Ket noi Database PostgreSQL thanh cong!");
    client.release();

    // 1. Khởi tạo cấu trúc 13 bảng
    await initDatabase();

    // 2. Sinh dữ liệu giả cho các bảng
    await seedDatabase();
  })
  .catch((err) => {
    console.warn("⚠️ Khong the ket noi Database PostgreSQL:", err.message);
    console.log("ℹ️ Backend se su dung In-Memory Store & Repository Pattern cho cac chuc nang va kiem thu.");
  });

server.listen(PORT, () => {
  console.log(`🚀 HIS Hospital Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Real-time Gateway active on ws://localhost:${PORT}`);
});
