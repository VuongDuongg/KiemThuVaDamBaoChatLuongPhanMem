import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import { initDatabase } from "./src/config/initDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Tự động kiểm tra kết nối & tạo bảng khi bật server
pool
  .connect()
  .then(async (client) => {
    console.log("✅ Ket noi Database PostgreSQL thanh cong!");
    client.release();
    // Chạy khởi tạo 13 bảng DB
    await initDatabase();
  })
  .catch((err) => {
    console.error("❌ Ket noi Database that bai:", err.message);
  });

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "HIS Hospital Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
