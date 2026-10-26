import React from "react";
import { Modal, Descriptions, Tag, Typography, Divider, Space, Button } from "antd";
import { MedicineBoxOutlined, PrinterOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function PatientDetailModal({ open, patient, onCancel }) {
  if (!patient) return null;

  return (
    <Modal
      title={
        <Space size={8}>
          <MedicineBoxOutlined style={{ color: "#1677ff", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>CHI TIẾT HỒ SƠ BỆNH ÁN BỆNH NHÂN</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
          In hồ sơ bệnh án
        </Button>,
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={750}
    >
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 2 }} style={{ marginTop: 12 }}>
        <Descriptions.Item label="Mã bệnh nhân">
          <Tag color="cyan" style={{ fontWeight: 700, fontSize: 13 }}>{patient.patient_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái khám">
          <Tag color="blue" style={{ fontWeight: 600 }}>{patient.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Họ và tên">
          <Text strong style={{ color: "#1d4ed8", fontSize: 15 }}>{patient.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính">{patient.gender}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{patient.birth_date}</Descriptions.Item>
        <Descriptions.Item label="Số CCCD">{patient.identity_card_number}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{patient.phone}</Descriptions.Item>
        <Descriptions.Item label="Ngày tiếp đón">{patient.reception_date}</Descriptions.Item>
        <Descriptions.Item label="Khoa tiếp nhận" span={2}>
          <Text strong>{patient.department}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {patient.address || "Hà Nội"}
        </Descriptions.Item>
        <Descriptions.Item label="Triệu chứng ban đầu" span={2}>
          <Text type="secondary">{patient.symptoms || "Khám tổng quát định kỳ"}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "16px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text strong style={{ color: "#374151" }}>Chỉ số sinh hiệu ban đầu tại phòng Tiếp đón:</Text>
        <Space size={16}>
          <Tag color="volcano">Huyết áp: 120/80 mmHg</Tag>
          <Tag color="red">Mạch: 78 ck/phút</Tag>
          <Tag color="orange">Nhiệt độ: 36.8°C</Tag>
        </Space>
      </div>
    </Modal>
  );
}
