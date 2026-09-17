import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

export default function RevenueStats({ stats }) {
  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Tổng doanh thu đã thu</span>}
            value={formatVND(stats?.total_revenue)}
            prefix={<DollarOutlined style={{ color: "#52c41a", marginRight: 8 }} />}
            valueStyle={{ color: "#52c41a", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Viện phí chưa thu</span>}
            value={formatVND(stats?.pending_revenue)}
            prefix={<ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 8 }} />}
            valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Số hóa đơn đã thanh toán</span>}
            value={stats?.paid_count || 0}
            suffix={`/ ${stats?.total_invoices || 0}`}
            prefix={<CheckCircleOutlined style={{ color: "#1677ff", marginRight: 8 }} />}
            valueStyle={{ color: "#1677ff", fontWeight: 700 }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <Statistic
            title={<span style={{ fontWeight: 600 }}>Bảo hiểm y tế chi trả</span>}
            value={formatVND(stats?.total_insurance_covered)}
            prefix={<SafetyCertificateOutlined style={{ color: "#722ed1", marginRight: 8 }} />}
            valueStyle={{ color: "#722ed1", fontWeight: 700 }}
          />
        </Card>
      </Col>
    </Row>
  );
}
