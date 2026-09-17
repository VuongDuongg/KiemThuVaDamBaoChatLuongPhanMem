import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { message } from "antd";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // 1. Nếu chưa đăng nhập -> Chuyển hướng về /login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra vai trò của người dùng
  const hasPermission = authService.isRoleAllowed(currentUser.role, allowedRoles);

  if (!hasPermission) {
    // Thông báo không có quyền truy cập
    message.warning(
      `Tài khoản (${currentUser.role}) không có quyền truy cập vào phân hệ này!`
    );

    // Chuyển hướng về trang mặc định của vai trò đó
    const userDefaultRoute = authService.getDefaultRouteForRole(currentUser.role);
    return <Navigate to={userDefaultRoute} replace />;
  }

  return children;
}
