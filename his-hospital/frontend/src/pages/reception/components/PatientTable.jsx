import React from "react";
import { Table, Tag, Space, Button, Tooltip, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

export default function PatientTable({
  patients = [],
  loading = false,
  onViewDetail,
  onEdit,
  onDelete,
  onPrint,
}) {
  const getStatusTag = (status) => {
    switch (status) {
      case "Chờ khám":
        return <Tag color="warning">Chờ khám</Tag>;
      case "Đang khám":
        return <Tag color="processing">Đang khám</Tag>;
      case "Chờ kết quả CLS":
        return <Tag color="purple">Chờ CLS</Tag>;
      case "Chờ thanh toán":
        return <Tag color="orange">Chờ thanh toán</Tag>;
      case "Đã khám":
      case "Đã khám xong":
        return <Tag color="success">Đã khám</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      width: 120,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: 600, color: "#1f2937" }}>{text}</span>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {record.gender} • Sinh: {record.birth_date}
          </div>
        </div>
      ),
    },
    {
      title: "Số CCCD",
      dataIndex: "identity_card_number",
      key: "identity_card_number",
      width: 140,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Khoa tiếp nhận",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày tiếp đón",
      dataIndex: "reception_date",
      key: "reception_date",
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size={6}>
          <Tooltip title="Xem chi tiết bệnh án">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#1677ff" }} />}
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Sửa thông tin hồ sơ">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#fa8c16" }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="In phiếu khám bệnh">
            <Button
              type="text"
              icon={<PrinterOutlined style={{ color: "#52c41a" }} />}
              onClick={() => onPrint(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa hồ sơ">
            <Popconfirm
              title="Xóa bệnh nhân"
              description={`Bạn có chắc muốn xóa bệnh nhân ${record.name}?`}
              onConfirm={() => onDelete(record)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={patients}
      rowKey={(record) => record.id || record.patient_code}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        showTotal: (total) => `Tổng số ${total} bệnh nhân`,
      }}
      size="middle"
      scroll={{ x: 1000 }}
    />
  );
}
