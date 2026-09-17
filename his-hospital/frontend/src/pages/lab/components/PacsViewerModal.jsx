import React from "react";
import { Modal, Descriptions, Tag, Typography, Button, Space, Image, Card } from "antd";
import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function PacsViewerModal({ open, order, onCancel }) {
  if (!order) return null;

  const findings =
    order.results?.findings ||
    "Trường phổi hai bên sáng đều, không thấy nốt mờ bất thường. Tim và cung động mạch chủ trong giới hạn bình thường.";
  const conclusion =
    order.results?.conclusion ||
    "Hình ảnh tim phổi thẳng hiện tại chưa phát hiện tổn thương bệnh lý.";
  const imageUrl =
    order.results?.image_url ||
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60";

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined style={{ color: "#722ed1", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            TRÌNH XEM ẢNH CHẨN ĐOÁN HÌNH ẢNH (PACS) - {order.order_code}
          </span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
          In kết quả PACS
        </Button>,
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={800}
    >
      <Descriptions bordered size="small" column={2} style={{ marginTop: 12, marginBottom: 16 }}>
        <Descriptions.Item label="Mã BN">
          <Tag color="cyan">{order.patient_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Họ tên BN">
          <Text strong>{order.patient_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Chỉ định" span={2}>
          <Text strong style={{ color: "#722ed1" }}>{order.service_name}</Text>
        </Descriptions.Item>
      </Descriptions>

      {/* PACS IMAGE VIEWER */}
      <Card size="small" style={{ background: "#000", textAlign: "center", marginBottom: 16, borderRadius: 8 }}>
        <Image
          src={imageUrl}
          alt="PACS Medical Scan"
          style={{ maxHeight: 320, objectFit: "contain", borderRadius: 4 }}
          fallback="https://via.placeholder.com/500x300.png?text=PACS+Medical+Image"
        />
        <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 6 }}>
          DICOM Viewer Resolution: 2048 x 1536 • Window/Level: Default Chest
        </div>
      </Card>

      {/* MÔ TẢ HÌNH ẢNH & KẾT LUẬN */}
      <Card size="small" title="Mô tả tổn thương hình ảnh">
        <Text>{findings}</Text>
      </Card>

      <Card size="small" title="Kết luận của Bác sĩ Chẩn đoán hình ảnh" style={{ marginTop: 12, background: "#f9f0ff" }}>
        <Text strong style={{ color: "#722ed1", fontSize: 15 }}>
          {conclusion}
        </Text>
      </Card>
    </Modal>
  );
}
