import React from "react";
import { Table, Tag, Space, Button, Input, Select, Card, Row, Col } from "antd";
import {
  ExperimentOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function LabOrderQueue({
  orders = [],
  loading = false,
  filters,
  onFilterChange,
  onEnterResult,
  onViewPacs,
}) {
  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="warning">Chờ tiếp nhận</Tag>;
      case "PROCESSING":
        return <Tag color="processing">Đang thực hiện</Tag>;
      case "COMPLETED":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã có kết quả
          </Tag>
        );
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã Chỉ Định",
      dataIndex: "order_code",
      key: "order_code",
      width: 130,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      width: 120,
    },
    {
      title: "Tên Bệnh Nhân",
      dataIndex: "patient_name",
      key: "patient_name",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Dịch Vụ Chỉ Định",
      dataIndex: "service_name",
      key: "service_name",
      ellipsis: true,
      render: (text, r) => (
        <span>
          <Tag color={r.type === "PACS" ? "magenta" : "purple"}>{r.type}</Tag>
          {text}
        </span>
      ),
    },
    {
      title: "Bác Sĩ Chỉ Định",
      dataIndex: "doctor",
      key: "doctor",
      width: 150,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st) => getStatusTag(st),
    },
    {
      title: "KTV Thực Hiện",
      dataIndex: "technician",
      key: "technician",
      width: 150,
      render: (tech) => tech || <span style={{ color: "#9ca3af" }}>Chưa chỉ định</span>,
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          {record.type === "PACS" ? (
            <Button
              size="small"
              icon={<EyeOutlined />}
              style={{ color: "#722ed1", borderColor: "#722ed1" }}
              onClick={() => onViewPacs(record)}
            >
              Xem PACS
            </Button>
          ) : (
            <Button
              size="small"
              type={record.status === "COMPLETED" ? "default" : "primary"}
              icon={<EditOutlined />}
              onClick={() => onEnterResult(record)}
            >
              {record.status === "COMPLETED" ? "Xem kết quả" : "Nhập KQ"}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card bordered={false} style={{ marginBottom: 16, background: "#fafafa" }} size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Tìm theo mã phiếu / mã BN..."
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              style={{ width: "100%" }}
              value={filters.status}
              onChange={(val) => onFilterChange({ ...filters, status: val })}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ tiếp nhận</Option>
              <Option value="PROCESSING">Đang thực hiện</Option>
              <Option value="COMPLETED">Đã có kết quả</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              style={{ width: "100%" }}
              value={filters.type}
              onChange={(val) => onFilterChange({ ...filters, type: val })}
            >
              <Option value="ALL">Tất cả kỹ thuật</Option>
              <Option value="LAB">Xét nghiệm (LAB)</Option>
              <Option value="PACS">Chẩn đoán hình ảnh (PACS)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(r) => r.id || r.order_code}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (t) => `Tổng số ${t} chỉ định CLS` }}
        size="middle"
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
