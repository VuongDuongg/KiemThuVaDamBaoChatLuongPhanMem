import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  HeartOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

export default function PatientStats({ patients = [] }) {
  const totalPatients = patients.length;
  const waitingPatients = patients.filter((p) => p.status === "Chờ khám").length;
  const examiningPatients = patients.filter((p) => p.status === "Đang khám" || p.status === "Chờ kết quả CLS").length;
  const completedPatients = patients.filter((p) => p.status === "Đã khám" || p.status === "Đã khám xong").length;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Tổng số bệnh nhân trong ngày</span>}
            value={totalPatients}
            prefix={<HeartOutlined style={{ color: "#1677ff", marginRight: 8 }} />}
            valueStyle={{ color: "#1677ff", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Bệnh nhân chờ khám</span>}
            value={waitingPatients}
            prefix={<ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 8 }} />}
            valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Đang khám / Chờ CLS</span>}
            value={examiningPatients}
            prefix={<MedicineBoxOutlined style={{ color: "#13c2c2", marginRight: 8 }} />}
            valueStyle={{ color: "#13c2c2", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Đã hoàn tất khám</span>}
            value={completedPatients}
            prefix={<CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />}
            valueStyle={{ color: "#52c41a", fontWeight: 700 }}
          />
        </Card>
      </Col>
    </Row>
  );
}
