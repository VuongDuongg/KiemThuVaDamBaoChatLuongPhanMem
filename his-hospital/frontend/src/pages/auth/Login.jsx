import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Space, Alert, Tag, Divider } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const { Title, Text } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await authService.login(values.username, values.password);
      if (response && response.user) {
        const role = response.user.role?.toUpperCase();
        if (role === "CASHIER") {
          navigate("/cashier");
        } else if (role === "DOCTOR") {
          navigate("/doctor");
        } else if (role === "LAB_TECH") {
          navigate("/lab");
        } else {
          navigate("/reception");
        }
      } else {
        navigate("/reception");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Tên đăng nhập hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (uname) => {
    form.setFieldsValue({ username: uname, password: "123" });
    handleLogin({ username: uname, password: "123" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #001529 0%, #003a8c 50%, #0958d9 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          border: "none",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <MedicineBoxOutlined style={{ fontSize: 44, color: "#1677ff", marginBottom: 8 }} />
          <Title level={3} style={{ margin: "4px 0", color: "#003a8c", fontWeight: 700 }}>
            HỆ THỐNG HIS HOSPITAL
          </Title>
          <Text type="secondary">
            Đăng nhập hệ thống Quản lý Bệnh viện Đa Phân Hệ
          </Text>
        </div>

        {errorMsg && (
          <Alert
            type="error"
            showIcon
            message={errorMsg}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ username: "letan1", password: "123" }}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="VD: letan1, doctor1, thungan1, ktv1, admin"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Mật khẩu (mặc định: 123 hoặc 123456)"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ fontWeight: 600, height: 44 }}
            >
              Đăng nhập vào hệ thống
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "16px 0" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ĐĂNG NHẬP NHANH TỪNG VAI TRÒ
          </Text>
        </Divider>

        <Space wrap size={[8, 8]} style={{ justifyContent: "center", width: "100%" }}>
          <Button size="small" onClick={() => handleQuickLogin("letan1")}>
            <Tag color="blue">1. Lễ tân (letan1)</Tag>
          </Button>
          <Button size="small" onClick={() => handleQuickLogin("thungan1")}>
            <Tag color="green">2. Thu ngân (thungan1)</Tag>
          </Button>
          <Button size="small" onClick={() => handleQuickLogin("doctor1")}>
            <Tag color="cyan">3. Bác sĩ (doctor1)</Tag>
          </Button>
          <Button size="small" onClick={() => handleQuickLogin("ktv1")}>
            <Tag color="purple">4. KTV CLS (ktv1)</Tag>
          </Button>
        </Space>
      </Card>
    </div>
  );
}
