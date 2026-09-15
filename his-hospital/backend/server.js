import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import { initDatabase } from "./src/config/initDb.js";
import { seedDatabase } from "./src/config/seed.js"; // Import hàm seed
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

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
    console.error("❌ Ket noi Database that bai:", err.message);
  });

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "HIS Hospital Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
