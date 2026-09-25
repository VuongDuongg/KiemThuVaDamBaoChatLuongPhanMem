import React from "react";
import { Table, Tag, Space, Button, Input, Select, Card, Row, Col } from "antd";
import {
  ExperimentOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function LabOrderQueue({
  orders = [],
  loading = false,
  filters,
  onFilterChange,
  onCollectSample,
  onStartOrder,
  onEnterResult,
  onApproveResult,
  onViewPacs,
}) {
  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="warning">Chờ tiếp nhận</Tag>;
      case "PROCESSING":
        return <Tag color="processing">Đang thực hiện</Tag>;
      case "SAMPLE_COLLECTED":
        return <Tag color="blue">Đã nhận mẫu</Tag>;
      case "PENDING_APPROVAL":
        return <Tag color="gold">Chờ duyệt kết quả</Tag>;
      case "SAMPLE_REJECTED":
        return <Tag color="error">Mẫu không đạt</Tag>;
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
      title: "Thanh toán",
      dataIndex: "payment_status",
      key: "payment_status",
      width: 120,
      render: (status) => (
        <Tag color={status === "PAID" ? "success" : "warning"}>
          {status === "PAID" ? "Đã thanh toán" : "Chờ thanh toán"}
        </Tag>
      ),
    },
    {
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
      title: "Mẫu bệnh phẩm",
      key: "specimen",
      width: 180,
      render: (_, record) => record.type === "LAB" ? (
        record.specimen ? <span>{record.specimen.type}<br /><small>{record.specimen.barcode}</small></span> : <span style={{ color: "#9ca3af" }}>Chưa tiếp nhận mẫu</span>
      ) : "—",
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space size={6} wrap>
          {record.payment_status !== "PAID" ? (
            <Button size="small" disabled>Chờ thanh toán</Button>
          ) : record.type === "LAB" && (record.status === "PENDING" || record.status === "SAMPLE_REJECTED") ? (
            <Button size="small" type="primary" icon={<InboxOutlined />} onClick={() => onCollectSample(record)}>
              Nhận mẫu
            </Button>
          ) : record.status === "PENDING" ? (
            <Button size="small" type="primary" onClick={() => onStartOrder(record)}>
              Tiếp nhận
            </Button>
          ) : record.type === "LAB" && record.status === "SAMPLE_COLLECTED" ? (
            <Button size="small" type="primary" icon={<PlayCircleOutlined />} onClick={() => onStartOrder(record)}>
              Chạy xét nghiệm
            </Button>
          ) : record.type === "LAB" && record.status === "PENDING_APPROVAL" ? (
            <Button size="small" icon={<SafetyCertificateOutlined />} onClick={() => onApproveResult(record)}>
              Duyệt & phát hành
            </Button>
          ) : record.type === "PACS" ? (
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
              type="primary"
              icon={<EditOutlined />}
              disabled={record.status === "COMPLETED"}
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
              <Option value="SAMPLE_COLLECTED">Đã nhận mẫu</Option>
              <Option value="PROCESSING">Đang thực hiện</Option>
              <Option value="PENDING_APPROVAL">Chờ duyệt kết quả</Option>
              <Option value="SAMPLE_REJECTED">Mẫu không đạt</Option>
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
