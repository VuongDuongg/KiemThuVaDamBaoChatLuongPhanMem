import React from "react";
import { Table, Tag, Typography, Button, Modal, Descriptions, Space } from "antd";
import { EyeOutlined, FileTextOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function ConsultationHistory({ consultations = [], loading = false }) {
  const [selectedRecord, setSelectedRecord] = React.useState(null);

  const columns = [
    {
      title: "Mã Bệnh Án",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id) => <span style={{ fontWeight: 700, color: "#1677ff" }}>EMR{String(id).padStart(4, "0")}</span>,
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
      render: (t) => <span style={{ fontWeight: 600 }}>{t}</span>,
    },
    {
      title: "Chẩn Đoán ICD-10",
      key: "icd",
      render: (_, r) => (
        <span>
          <Tag color="blue">{r.icd10_code}</Tag> {r.icd10_name}
        </span>
      ),
    },
    {
      title: "Bác Sĩ Khám",
      dataIndex: "doctor",
      key: "doctor",
      width: 150,
    },
    {
      title: "Ngày Khám",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setSelectedRecord(record)}
        >
          Xem lại
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={consultations}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8, showTotal: (t) => `Tổng số ${t} hồ sơ bệnh án EMR` }}
        size="middle"
      />

      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: "#1677ff" }} />
            <span style={{ fontWeight: 700 }}>
              CHI TIẾT HỒ SƠ BỆNH ÁN ĐIỆN TỬ (EMR)
            </span>
          </Space>
        }
        open={!!selectedRecord}
        onCancel={() => setSelectedRecord(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelectedRecord(null)}>
            Đóng
          </Button>,
        ]}
        width={750}
      >
        {selectedRecord && (
          <Descriptions bordered size="small" column={2} style={{ marginTop: 12 }}>
            <Descriptions.Item label="Mã BN">
              <Tag color="cyan">{selectedRecord.patient_code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              <Text strong style={{ color: "#1d4ed8" }}>{selectedRecord.patient_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Bác sĩ điều trị">{selectedRecord.doctor}</Descriptions.Item>
            <Descriptions.Item label="Khoa phòng">{selectedRecord.department}</Descriptions.Item>
            <Descriptions.Item label="Mã ICD-10">
              <Tag color="blue">{selectedRecord.icd10_code}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tên chẩn đoán">{selectedRecord.icd10_name}</Descriptions.Item>
            <Descriptions.Item label="Triệu chứng" span={2}>
              {selectedRecord.symptoms}
            </Descriptions.Item>
            <Descriptions.Item label="Chỉ số sinh hiệu" span={2}>
              Huyết áp: {selectedRecord.vitals?.blood_pressure} • Mạch: {selectedRecord.vitals?.pulse} ck/p • Nhiệt độ: {selectedRecord.vitals?.temperature}°C • SpO2: {selectedRecord.vitals?.spo2}%
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú khám" span={2}>
              {selectedRecord.doctor_notes || "Bình thường"}
            </Descriptions.Item>
            <Descriptions.Item label="Hướng điều trị" span={2}>
              {selectedRecord.treatment_plan || "Điều trị ngoại trú"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
