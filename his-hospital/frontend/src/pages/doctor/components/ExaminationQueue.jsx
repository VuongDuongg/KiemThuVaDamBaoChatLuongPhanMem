import React from "react";
import { Table, Tag, Space, Button, Typography, Input } from "antd";
import { MedicineBoxOutlined, SearchOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function ExaminationQueue({
  patients = [],
  loading = false,
  selectedPatient,
  onSelectPatient,
}) {
  const [keyword, setKeyword] = React.useState("");

  const filtered = patients.filter((p) => {
    if (!keyword) return true;
    const kw = keyword.toLowerCase();
    return (
      p.name?.toLowerCase().includes(kw) ||
      p.patient_code?.toLowerCase().includes(kw) ||
      p.department?.toLowerCase().includes(kw)
    );
  });

  const getStatusTag = (status) => {
    switch (status) {
      case "Chờ khám":
        return <Tag color="warning">Chờ khám</Tag>;
      case "Đang khám":
        return <Tag color="processing">Đang khám</Tag>;
      case "Chờ kết quả CLS":
        return <Tag color="purple">Chờ CLS</Tag>;
      case "Đã khám":
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
      width: 110,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, r) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <div style={{ fontSize: 11, color: "#6b7280" }}>
            {r.gender} • {r.birth_date}
          </div>
        </div>
      ),
    },
    {
      title: "Khoa phòng",
      dataIndex: "department",
      key: "department",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (st) => getStatusTag(st),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => {
        const isSelected = selectedPatient?.patient_code === record.patient_code;
        return (
          <Button
            type={isSelected ? "primary" : "default"}
            size="small"
            icon={<MedicineBoxOutlined />}
            onClick={() => onSelectPatient(record)}
          >
            {isSelected ? "Đang chọn" : "Khám bệnh"}
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Input
        placeholder="Tìm bệnh nhân trong hàng đợi..."
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: 12 }}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey={(r) => r.id || r.patient_code}
        loading={loading}
        pagination={{ pageSize: 8, showTotal: (t) => `${t} bệnh nhân` }}
        size="small"
      />
    </div>
  );
}
