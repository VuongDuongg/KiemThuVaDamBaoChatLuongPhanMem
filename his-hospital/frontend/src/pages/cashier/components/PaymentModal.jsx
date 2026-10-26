import React, { useState } from "react";
import { Modal, Descriptions, Radio, Tag, Space, Button, Typography, Alert, QRCode } from "antd";
import { DollarOutlined, CheckCircleOutlined, QrcodeOutlined, CreditCardOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function PaymentModal({ open, invoice, onCancel, onConfirm, confirmLoading }) {
  const [paymentMethod, setPaymentMethod] = useState("VIETQR");

  if (!invoice) return null;

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const handlePay = () => {
    onConfirm(invoice.id || invoice.invoice_code, paymentMethod);
  };

  const qrData = `VIETQR|HIS_HOSPITAL|${invoice.invoice_code}|${invoice.patient_pay}|${invoice.patient_name}`;

  return (
    <Modal
      title={
        <Space size={8}>
          <DollarOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>XÁC NHẬN THU PHÍ & IN BIÊN LAI</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Đóng
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
          icon={<CheckCircleOutlined />}
          loading={confirmLoading}
          onClick={handlePay}
        >
          Xác nhận đã thu {formatVND(invoice.patient_pay)}
        </Button>,
      ]}
      width={650}
    >
      <Descriptions bordered size="small" column={2} style={{ marginTop: 12 }}>
        <Descriptions.Item label="Mã hóa đơn">
          <Tag color="geekblue" style={{ fontWeight: 700 }}>{invoice.invoice_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mã bệnh nhân">
          <Tag color="cyan" style={{ fontWeight: 700 }}>{invoice.patient_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Họ tên bệnh nhân" span={2}>
          <Text strong style={{ fontSize: 15, color: "#1d4ed8" }}>{invoice.patient_name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Nội dung thu" span={2}>
          {invoice.description}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng chi phí">
          <Text delete type="secondary">{formatVND(invoice.total_amount)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="BHYT hỗ trợ">
          <Tag color="purple">-{formatVND(invoice.insurance_discount)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Bệnh nhân phải nộp" span={2}>
          <Title level={4} style={{ color: "#d4380d", margin: 0 }}>
            {formatVND(invoice.patient_pay)}
          </Title>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 20 }}>
        <Text strong style={{ fontSize: 14 }}>Chọn phương thức thanh toán:</Text>
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ display: "flex", gap: 16, marginTop: 10 }}
        >
          <Radio.Button value="VIETQR" style={{ height: "auto", padding: "10px 16px" }}>
            <Space>
              <QrcodeOutlined style={{ fontSize: 18, color: "#1677ff" }} />
              <span>Chuyển khoản VietQR</span>
            </Space>
          </Radio.Button>
          <Radio.Button value="TIEN_MAT" style={{ height: "auto", padding: "10px 16px" }}>
            <Space>
              <DollarOutlined style={{ fontSize: 18, color: "#52c41a" }} />
              <span>Tiền mặt tại quầy</span>
            </Space>
          </Radio.Button>
          <Radio.Button value="THE" style={{ height: "auto", padding: "10px 16px" }}>
            <Space>
              <CreditCardOutlined style={{ fontSize: 18, color: "#722ed1" }} />
              <span>Quẹt thẻ POS</span>
            </Space>
          </Radio.Button>
        </Radio.Group>
      </div>

      {paymentMethod === "VIETQR" && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, background: "#f6f8fa", padding: 16, borderRadius: 8 }}>
          <QRCode value={qrData} size={130} />
          <div>
            <Alert
              type="info"
              showIcon
              message="Quét mã VietQR để thanh toán"
              description={`Số tiền: ${formatVND(invoice.patient_pay)} • Nội dung: ${invoice.invoice_code} ${invoice.patient_name}`}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
