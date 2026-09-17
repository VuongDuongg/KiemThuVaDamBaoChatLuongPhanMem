import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import ReceptionDashboard from "./pages/reception/ReceptionDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import LabDashboard from "./pages/lab/LabDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { authService } from "./services/authService";

// Component chuyển hướng mặc định theo vai trò sau khi vào / hoặc /dashboard
function DefaultRedirect() {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  const defaultRoute = authService.getDefaultRouteForRole(currentUser.role);
  return <Navigate to={defaultRoute} replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route đăng nhập công khai */}
        <Route path="/login" element={<Login />} />

        {/* Phân hệ 1: Lễ tân - Chỉ RECEPTIONIST (và ADMIN) được vào */}
        <Route
          path="/reception"
          element={
            <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
              <MainLayout>
                <ReceptionDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Phân hệ 2: Thu ngân & Dược - Chỉ CASHIER (và ADMIN) được vào */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={["CASHIER"]}>
              <MainLayout>
                <CashierDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Phân hệ 3: Bác sĩ & EMR - Chỉ DOCTOR (và ADMIN) được vào */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <MainLayout>
                <DoctorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Phân hệ 4: Kỹ thuật viên Cận lâm sàng & PACS - Chỉ LAB_TECH (và ADMIN) được vào */}
        <Route
          path="/lab"
          element={
            <ProtectedRoute allowedRoles={["LAB_TECH"]}>
              <MainLayout>
                <LabDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Mặc định chuyển hướng theo vai trò của người dùng */}
        <Route path="/dashboard" element={<DefaultRedirect />} />
        <Route path="/" element={<DefaultRedirect />} />

        {/* Route 404 fallback */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </Router>
  );
}
