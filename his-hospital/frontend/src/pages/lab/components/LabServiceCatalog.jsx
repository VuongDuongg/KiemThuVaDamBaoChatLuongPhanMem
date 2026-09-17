import React from "react";
import { Table, Tag, Card, Typography } from "antd";

const { Text } = Typography;

export default function LabServiceCatalog({ services = [], loading = false }) {
  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const columns = [
    {
      title: "Mã Dịch Vụ",
      dataIndex: "service_code",
      key: "service_code",
      width: 180,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Tên Dịch Vụ Cận Lâm Sàng",
      dataIndex: "service_name",
      key: "service_name",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Phân Loại Kỹ Thuật",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: (type) => (
        <Tag color={type === "PACS" ? "magenta" : "purple"}>
          {type === "PACS" ? "Chẩn đoán hình ảnh (PACS)" : "Xét nghiệm (LAB)"}
        </Tag>
      ),
    },
    {
      title: "Đơn Giá Quy Định",
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "right",
      render: (price) => (
        <span style={{ fontWeight: 700, color: "#d4380d" }}>{formatVND(price)}</span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={services}
      rowKey="id"
      loading={loading}
      pagination={false}
      size="middle"
    />
  );
}
