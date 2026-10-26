import React, { useState } from "react";
import { Modal, Table, Button, Select, InputNumber, Input, Space, Row, Col, Typography, message, Popconfirm, Tag } from "antd";
import { PlusOutlined, DeleteOutlined, MedicineBoxOutlined, SendOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;

export default function PrescriptionForm({
  open,
  patient,
  medicines = [],
  onCancel,
  onSubmit,
  confirmLoading,
}) {
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [dosage, setDosage] = useState("Ngày uống 2 lần, mỗi lần 1 viên sau ăn");

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const handleAddMedicine = () => {
    if (!selectedMedId) {
      message.warning("Vui lòng chọn một loại thuốc trong kho");
      return;
    }
    const med = medicines.find((m) => m.id === selectedMedId || m.medicine_code === selectedMedId);
    if (!med) return;

    if (prescriptionItems.some((item) => item.medicine_id === med.id)) {
      message.warning("Thuốc này đã có trong đơn thuốc");
      return;
    }

    setPrescriptionItems([
      ...prescriptionItems,
      {
        medicine_id: med.id,
        medicine_code: med.medicine_code,
        medicine_name: med.medicine_name,
        unit: med.unit,
        unit_price: med.unit_price,
        quantity: quantity,
        dosage: dosage,
        total_price: med.unit_price * quantity,
      },
    ]);

    setSelectedMedId(null);
    setQuantity(10);
  };

  const handleRemoveItem = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, idx) => idx !== index));
  };

  const handleConfirm = () => {
    if (prescriptionItems.length === 0) {
      message.warning("Đơn thuốc chưa có loại thuốc nào");
      return;
    }
    onSubmit(prescriptionItems);
  };

  const totalPrescriptionAmount = prescriptionItems.reduce((sum, i) => sum + (i.total_price || 0), 0);

  const columns = [
    {
      title: "Mã Thuốc",
      dataIndex: "medicine_code",
      key: "medicine_code",
      width: 100,
    },
    {
      title: "Tên Thuốc",
      dataIndex: "medicine_name",
      key: "medicine_name",
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (qty, r) => `${qty} ${r.unit}`,
    },
    {
      title: "Liều Lượng & Cách Dùng",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Thành Tiền",
      dataIndex: "total_price",
      key: "total_price",
      width: 120,
      align: "right",
      render: (val) => <span style={{ fontWeight: 600 }}>{formatVND(val)}</span>,
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, __, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(index)}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>
            KÊ ĐƠN THUỐC ĐIỆN TỬ - {patient?.name} ({patient?.patient_code})
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
          style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
          loading={confirmLoading}
          onClick={handleConfirm}
        >
          Hoàn tất & Chuyển Thu ngân ({formatVND(totalPrescriptionAmount)})
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      {/* THÊM THUỐC VÀO ĐƠN */}
      <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={24} md={10}>
            <Text strong>Chọn thuốc trong kho dược:</Text>
            <Select
              style={{ width: "100%", marginTop: 4 }}
              placeholder="Tìm theo tên thuốc..."
              value={selectedMedId}
              onChange={setSelectedMedId}
              showSearch
              optionFilterProp="children"
            >
              {medicines.map((m) => (
                <Option key={m.id} value={m.id} disabled={m.stock_quantity <= 0}>
                  {m.medicine_name} ({m.stock_quantity} {m.unit} tồn - {formatVND(m.unit_price)})
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Text strong>Số lượng:</Text>
            <InputNumber
              style={{ width: "100%", marginTop: 4 }}
              min={1}
              value={quantity}
              onChange={setQuantity}
            />
          </Col>
          <Col xs={24} md={8}>
            <Text strong>Cách dùng / Liều lượng:</Text>
            <Input
              style={{ marginTop: 4 }}
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="VD: Ngày 2 lần, mỗi lần 1 viên..."
            />
          </Col>
          <Col xs={12} md={2}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddMedicine}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </div>

      {/* DANH SÁCH THUỐC ĐÃ KÊ */}
      <Table
        columns={columns}
        dataSource={prescriptionItems}
        rowKey="medicine_id"
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong>Tổng chi phí tiền thuốc:</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1} align="right">
              <Text strong style={{ color: "#d4380d", fontSize: 15 }}>
                {formatVND(totalPrescriptionAmount)}
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        )}
      />
    </Modal>
  );
}
