import React from "react";
import { Table, Tag, Space, Button, Input, Select, Card, Row, Col } from "antd";
import { DollarOutlined, SearchOutlined, CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function InvoiceList({
  invoices = [],
  loading = false,
  filters,
  onFilterChange,
  onPay,
  onPrint,
}) {
  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const getItemTypeTag = (type) => {
    switch (type) {
      case "TIEN_KHAM":
        return <Tag color="blue">Khám bệnh</Tag>;
      case "TIEN_THUOC":
        return <Tag color="green">Tiền thuốc</Tag>;
      case "CAN_LAM_SANG":
        return <Tag color="purple">Cận lâm sàng</Tag>;
      default:
        return <Tag>{type}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã Hóa Đơn",
      dataIndex: "invoice_code",
      key: "invoice_code",
      width: 140,
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
      title: "Loại Viện Phí",
      dataIndex: "item_type",
      key: "item_type",
      width: 130,
      render: (type) => getItemTypeTag(type),
    },
    {
      title: "Nội Dung Thu",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Số Tiền Thu",
      dataIndex: "patient_pay",
      key: "patient_pay",
      width: 140,
      align: "right",
      render: (val) => (
        <span style={{ fontWeight: 700, color: "#d4380d" }}>{formatVND(val)}</span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) =>
        status === "PAID" ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã thanh toán
          </Tag>
        ) : (
          <Tag color="error">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Thời Gian",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 170,
      align: "center",
      render: (_, record) => (
        <Space size={8}>
          {record.status === "UNPAID" ? (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => onPay(record)}
            >
              Thu tiền
            </Button>
          ) : (
            <Button
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => onPrint(record)}
            >
              In biên lai
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* FILTER BAR */}
      <Card bordered={false} style={{ marginBottom: 16, background: "#fafafa" }} size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="Tìm theo mã HĐ / Mã BN..."
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
              <Option value="UNPAID">Chưa thanh toán</Option>
              <Option value="PAID">Đã thanh toán</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={5}>
            <Select
              style={{ width: "100%" }}
              value={filters.item_type}
              onChange={(val) => onFilterChange({ ...filters, item_type: val })}
            >
              <Option value="ALL">Tất cả loại phí</Option>
              <Option value="TIEN_KHAM">Khám bệnh</Option>
              <Option value="CAN_LAM_SANG">Cận lâm sàng</Option>
              <Option value="TIEN_THUOC">Tiền thuốc</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={invoices}
        rowKey={(r) => r.id || r.invoice_code}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} hóa đơn`,
        }}
        size="middle"
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
