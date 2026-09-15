import express from "express";
import { login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tuyến đường đăng nhập (Không cần bảo vệ)
router.post("/login", login);

// API Test: Ai có token mới gọi được
router.get("/me", verifyToken, (req, res) => {
  res.json({ message: "Đây là thông tin mật của bạn", user: req.user });
});

export default router;
