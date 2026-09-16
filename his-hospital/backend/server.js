import dotenv from "dotenv";
import app from "./src/app.js";
import pool from "./src/config/db.js";
import { initDatabase } from "./src/config/initDb.js";
import { seedDatabase } from "./src/config/seed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

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
    console.log("ℹ️ Backend se su dung Mock In-Memory Data cho cac chuc nang va kiem thu.");
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
