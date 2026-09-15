import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Tìm user và join với bảng roles để lấy quyền
    const userQuery = await pool.query(
      `
      SELECT u.*, r.role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.username = $1
    `,
      [username],
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại!" });
    }

    const user = userQuery.rows[0];

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác!" });
    }

    // 3. Tạo Token chứa thông tin cơ bản (Không chứa password)
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role_name,
      departmentId: user.department_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 4. Trả về Frontend
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        role: user.role_name,
      },
    });
  } catch (error) {
    console.error("Lỗi Login:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};
