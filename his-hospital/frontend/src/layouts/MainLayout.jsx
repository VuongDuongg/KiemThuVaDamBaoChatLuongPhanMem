import React from "react";
import { Layout, Typography, Space, Button, Tag, Segmented } from "antd";
import {
  MedicineBoxOutlined,
  LogoutOutlined,
  UserOutlined,
  UserAddOutlined,
  DollarOutlined,
  ExperimentOutlined,
  AppstoreOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const allModules = [
  {
    key: "reception",
    role: "RECEPTIONIST",
    label: "1. Tiếp đón & Bệnh nhân (TV1)",
    value: "reception",
    icon: <UserAddOutlined />,
  },
  {
    key: "cashier",
    role: "CASHIER",
    label: "2. Thu ngân & Dược/Kho (TV2)",
    value: "cashier",
    icon: <DollarOutlined />,
  },
  {
    key: "doctor",
    role: "DOCTOR",
    label: "3. Bác sĩ & Bệnh án EMR (TV3)",
    value: "doctor",
    icon: <MedicineBoxOutlined />,
  },
  {
    key: "lab",
    role: "LAB_TECH",
    label: "4. Cận lâm sàng & PACS (TV4)",
    value: "lab",
    icon: <ExperimentOutlined />,
  },
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser() || {
    fullName: "Chưa đăng nhập",
    role: "GUEST",
    username: "",
  };

  const userRole = (currentUser.role || "").toUpperCase();
  const isAdmin = userRole === "ADMIN";

  // Lọc danh sách tab mà vai trò hiện tại được phép xem
  const availableOptions = isAdmin
    ? allModules
    : allModules.filter((m) => m.role === userRole);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith("/cashier")) return "cashier";
    if (path.startsWith("/doctor")) return "doctor";
    if (path.startsWith("/lab")) return "lab";
    return "reception";
  };

  const handleTabChange = (key) => {
    navigate(`/${key}`);
  };

  const currentRoleTitle = {
    RECEPTIONIST: "Phân hệ Tiếp đón & Quản lý bệnh nhân",
    CASHIER: "Phân hệ Thu ngân Viện phí & Kho Dược",
    DOCTOR: "Phân hệ Bác sĩ khám lâm sàng & Bệnh án EMR",
    LAB_TECH: "Phân hệ Kỹ thuật viên Cận lâm sàng & PACS",
    ADMIN: "Quản trị viên Hệ thống Toàn quyền (Toàn bộ phân hệ)",
  }[userRole] || "Hệ thống Bệnh viện";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* TOP HEADER */}
      <Header
        style={{
          background: "#003a8c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          flexWrap: "wrap",
          height: 64,
          lineHeight: "64px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
          onClick={() => navigate(authService.getDefaultRouteForRole(userRole))}
        >
          <MedicineBoxOutlined style={{ fontSize: 28, color: "#fff" }} />
          <div>
            <Title level={4} style={{ color: "#fff", margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
              HỆ THỐNG THÔNG TIN BỆNH VIỆN - HIS HOSPITAL
            </Title>
            <Text style={{ color: "#91caff", fontSize: 12 }}>
              Phân Quyền Vai Trò Nghiệp Vụ Chặt Chẽ (RBAC)
            </Text>
          </div>
        </div>

        <Space size={16}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              padding: "4px 12px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#fff",
            }}
          >
            <UserOutlined />
            <span style={{ fontWeight: 600 }}>{currentUser.fullName}</span>
            <Tag color={isAdmin ? "gold" : "geekblue"} style={{ marginLeft: 4 }}>
              {currentUser.role}
            </Tag>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ fontWeight: 500 }}
          >
            Đăng xuất
          </Button>
        </Space>
      </Header>

      {/* ROLE / MODULE BAR */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          padding: "10px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AppstoreOutlined style={{ fontSize: 18, color: "#1677ff" }} />
          <Text strong style={{ fontSize: 14, color: "#374151" }}>
            {isAdmin ? "CHUYỂN ĐỔI PHÂN HỆ (QUẢN TRỊ):" : "PHÂN HỆ LÀM VIỆC ĐƯỢC CẤP QUYỀN:"}
          </Text>
          {!isAdmin && (
            <Tag color="cyan" style={{ fontSize: 13, padding: "2px 8px" }}>
              <LockOutlined style={{ marginRight: 4 }} />
              {currentRoleTitle}
            </Tag>
          )}
        </div>

        {isAdmin ? (
          <Segmented
            size="middle"
            value={getActiveTab()}
            onChange={handleTabChange}
            options={availableOptions}
          />
        ) : (
          <Space>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tài khoản đang đăng nhập với vai trò: <b>{currentUser.role}</b>
            </Text>
          </Space>
        )}
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <Content style={{ padding: "20px 24px", maxWidth: 1600, width: "100%", margin: "0 auto" }}>
        {children}
      </Content>

      <Footer style={{ textAlign: "center", background: "#f0f2f5", color: "#8c8c8c", fontSize: 13, padding: "16px 24px" }}>
        Hệ thống HIS Hospital © 2026 - Kiểm Thử & Đảm Bảo Chất Lượng Phần Mềm (Phân Quyền Vai Trò & Bảo Vệ Route 100%)
      </Footer>
    </Layout>
  );
}
