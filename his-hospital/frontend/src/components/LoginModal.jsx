import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, Space, Divider, message, Tag } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxOutlined, KeyOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;

export default function LoginModal({ visible, onLoginSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Gọi API login của backend
      const res = await axios.post("http://localhost:5000/api/auth/login", values, { timeout: 3000 });
      if (res.data && res.data.success) {
        message.success(`Đăng nhập thành công! Chào mừng ${res.data.user.fullName}`);
        onLoginSuccess(res.data.user);
        form.resetFields();
      }
    } catch (err) {
      // Fallback local mock login nếu backend không phản hồi
      const mockAccounts = {
        letan1: { fullName: "Nguyễn Thị Mai", role: "Lễ tân Tiếp đón (TV1)", roleKey: "RECEPTIONIST" },
        bacsi1: { fullName: "BS. Trần Tuấn Anh", role: "Bác sĩ khám (TV3)", roleKey: "DOCTOR" },
        thungan1: { fullName: "Lê Thu Hà", role: "Thu ngân (TV2)", roleKey: "CASHIER" },
        admin: { fullName: "Quản trị viên Hệ thống", role: "Quản trị viên (Admin)", roleKey: "ADMIN" }
      };

      const user = mockAccounts[values.username?.toLowerCase()];
      if (user && values.password === "123") {
        message.success(`Đăng nhập thành công! Chào mừng ${user.fullName}`);
        onLoginSuccess({ username: values.username, ...user });
        form.resetFields();
      } else {
        message.error("Tên đăng nhập hoặc mật khẩu không chính xác (mật khẩu mặc định: 123)");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (username) => {
    form.setFieldsValue({
      username,
      password: "123"
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
      centered
      destroyOnClose
    >
      <div style={{ textAlign: "center", padding: "16px 8px 8px" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#e6f4ff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12
          }}
        >
          <MedicineBoxOutlined style={{ fontSize: 32, color: "#1677ff" }} />
        </div>
        <Title level={4} style={{ margin: "0 0 4px", color: "#003a8c" }}>
          ĐĂNG NHẬP HỆ THỐNG BỆNH VIỆN BÀ TƯ
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Phân hệ Tiếp đón, Khám bệnh & Quản lý bệnh nhân (HIS)
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleLogin} style={{ marginTop: 20 }}>
        <Form.Item
          name="username"
          label={<Text strong>Tên đăng nhập</Text>}
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            size="large"
            placeholder="letan1, bacsi1, thungan1, admin"
            prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<Text strong>Mật khẩu</Text>}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            size="large"
            placeholder="Nhập mật khẩu (Mặc định: 123)"
            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          style={{ marginTop: 8, height: 44, fontWeight: 600 }}
        >
          Đăng nhập hệ thống
        </Button>

        <Divider style={{ margin: "20px 0 12px" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Hoặc chọn nhanh tài khoản mẫu để thử nghiệm:
          </Text>
        </Divider>

        <Space wrap style={{ width: "100%", justifyContent: "center" }}>
          <Button size="small" onClick={() => fillQuickAccount("letan1")}>
            Lễ tân: <Tag color="blue">letan1</Tag>
          </Button>
          <Button size="small" onClick={() => fillQuickAccount("bacsi1")}>
            Bác sĩ: <Tag color="green">bacsi1</Tag>
          </Button>
          <Button size="small" onClick={() => fillQuickAccount("thungan1")}>
            Thu ngân: <Tag color="orange">thungan1</Tag>
          </Button>
          <Button size="small" onClick={() => fillQuickAccount("admin")}>
            Admin: <Tag color="purple">admin</Tag>
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}
