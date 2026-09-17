import React, { useState } from "react";
import { Modal, Select, Space, Typography, Card, Tag, Button } from "antd";
import { ExperimentOutlined, SendOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

export default function LabOrderModal({
  open,
  patient,
  labServices = [],
  onCancel,
  onSubmit,
  confirmLoading,
}) {
  const [selectedServiceCode, setSelectedServiceCode] = useState(null);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const handleConfirm = () => {
    if (!selectedServiceCode) return;
    onSubmit({
      patient_code: patient.patient_code,
      patient_name: patient.name,
      service_code: selectedServiceCode,
      doctor: "BS. Lê Hoàng Nam",
    });
  };

  const currentService = labServices.find((s) => s.service_code === selectedServiceCode);

  return (
    <Modal
      title={
        <Space>
          <ExperimentOutlined style={{ color: "#722ed1", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            CHỈ ĐỊNH DỊCH VỤ CẬN LÂM SÀNG & PACS
          </span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SendOutlined />}
          style={{ background: "#722ed1", borderColor: "#722ed1", fontWeight: 600 }}
          disabled={!selectedServiceCode}
          loading={confirmLoading}
          onClick={handleConfirm}
        >
          Gửi chỉ định sang phòng CLS
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <div style={{ marginTop: 12 }}>
        <Text strong>Bệnh nhân chỉ định: </Text>
        <span style={{ color: "#1677ff", fontWeight: 600 }}>
          {patient?.name} ({patient?.patient_code})
        </span>
      </div>

      <div style={{ marginTop: 16 }}>
        <Text strong>Chọn dịch vụ xét nghiệm / Chẩn đoán hình ảnh:</Text>
        <Select
          style={{ width: "100%", marginTop: 8 }}
          placeholder="Chọn dịch vụ Cận lâm sàng..."
          size="large"
          value={selectedServiceCode}
          onChange={setSelectedServiceCode}
        >
          {labServices.map((s) => (
            <Option key={s.service_code} value={s.service_code}>
              [{s.type}] {s.service_name} - {formatVND(s.price)}
            </Option>
          ))}
        </Select>
      </div>

      {currentService && (
        <Card size="small" style={{ marginTop: 16, background: "#f9f0ff", borderColor: "#d3adf7" }}>
          <Space orientation="vertical" style={{ width: "100%" }}>
            <div>
              <Text orientation="vertical" type="secondary">Phân loại kỹ thuật: </Text>
              <Tag color={currentService.type === "PACS" ? "magenta" : "purple"}>
                {currentService.type === "PACS" ? "Chẩn đoán hình ảnh (PACS)" : "Xét nghiệm (LAB)"}
              </Tag>
            </div>
            <div>
              <Text type="secondary">Mã dịch vụ: </Text>
              <Text strong>{currentService.service_code}</Text>
            </div>
            <div>
              <Text type="secondary">Giá viện phí quy định: </Text>
              <Text strong style={{ color: "#d4380d", fontSize: 16 }}>
                {formatVND(currentService.price)}
              </Text>
            </div>
          </Space>
        </Card>
      )}
    </Modal>
  );
}
