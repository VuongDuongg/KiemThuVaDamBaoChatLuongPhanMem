import React, { useState } from "react";
import { Table, Tag, Space, Button, Input, Modal, Form, Row, Col, InputNumber, Select, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined, WarningOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function MedicineInventory({
  medicines = [],
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [form] = Form.useForm();

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchKw =
      !keyword ||
      m.medicine_name.toLowerCase().includes(keyword.toLowerCase()) ||
      m.medicine_code.toLowerCase().includes(keyword.toLowerCase());
    const matchCat = categoryFilter === "ALL" || m.category === categoryFilter;
    return matchKw && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingMedicine(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingMedicine(record);
    form.setFieldsValue({
      medicine_name: record.medicine_name,
      active_ingredient: record.active_ingredient,
      unit: record.unit,
      unit_price: record.unit_price,
      stock_quantity: record.stock_quantity,
      category: record.category,
      expiry_date: record.expiry_date,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingMedicine) {
        await onUpdate(editingMedicine.id || editingMedicine.medicine_code, values);
        message.success("Cập nhật thông tin thuốc thành công!");
      } else {
        await onCreate(values);
        message.success("Thêm thuốc mới vào kho thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Validation error
    }
  };

  const columns = [
    {
      title: "Mã Thuốc",
      dataIndex: "medicine_code",
      key: "medicine_code",
      width: 120,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>,
    },
    {
      title: "Tên Biệt Dược / Hoạt Chất",
      dataIndex: "medicine_name",
      key: "medicine_name",
      render: (text, record) => (
        <div>
          <span style={{ fontWeight: 600, color: "#1f2937" }}>{text}</span>
          {record.active_ingredient && (
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Hoạt chất: {record.active_ingredient}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Nhóm Thuốc",
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat) => <Tag color="blue">{cat || "Khác"}</Tag>,
    },
    {
      title: "Đơn Vị",
      dataIndex: "unit",
      key: "unit",
      width: 90,
      align: "center",
    },
    {
      title: "Đơn Giá",
      dataIndex: "unit_price",
      key: "unit_price",
      width: 130,
      align: "right",
      render: (price) => <span style={{ fontWeight: 600 }}>{formatVND(price)}</span>,
    },
    {
      title: "Tồn Kho",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: 120,
      align: "center",
      render: (qty) =>
        qty <= 100 ? (
          <Tag color="error" icon={<WarningOutlined />}>
            {qty} (Sắp hết)
          </Tag>
        ) : (
          <Tag color="success">{qty}</Tag>
        ),
    },
    {
      title: "Hạn Sử Dụng",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 130,
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size={6}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#fa8c16" }} />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Xóa thuốc"
            description={`Bạn có chắc muốn xóa thuốc ${record.medicine_name}?`}
            onConfirm={() => onDelete(record.id || record.medicine_code)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* ACTION & FILTER BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <Space size={12}>
          <Input
            placeholder="Tìm tên thuốc, hoạt chất, mã thuốc..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 200 }}
          >
            <Option value="ALL">Tất cả nhóm thuốc</Option>
            <Option value="Giảm đau - Hạ sốt">Giảm đau - Hạ sốt</Option>
            <Option value="Kháng sinh">Kháng sinh</Option>
            <Option value="Kháng viêm giảm đau">Kháng viêm giảm đau</Option>
            <Option value="Vitamin & Khoáng chất">Vitamin & Khoáng chất</Option>
            <Option value="Dạ dày - Tiêu hóa">Dạ dày - Tiêu hóa</Option>
            <Option value="Hô hấp">Hô hấp</Option>
          </Select>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
          onClick={handleOpenAdd}
        >
          Nhập thuốc mới vào kho
        </Button>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredMedicines}
        rowKey={(r) => r.id || r.medicine_code}
        loading={loading}
        pagination={{ pageSize: 10, showTotal: (t) => `Tổng số ${t} loại thuốc trong kho` }}
        size="middle"
        scroll={{ x: 900 }}
      />

      {/* ADD / EDIT MODAL */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: "#1677ff" }} />
            <span style={{ fontWeight: 700 }}>
              {editingMedicine ? "CẬP NHẬT THÔNG TIN THUỐC" : "NHẬP THUỐC MỚI VÀO KHO"}
            </span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thông tin"
        cancelText="Hủy bỏ"
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="medicine_name"
            label="Tên thuốc / Biệt dược"
            rules={[{ required: true, message: "Nhập tên thuốc" }]}
          >
            <Input placeholder="Ví dụ: Paracetamol 500mg" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="active_ingredient" label="Hoạt chất chính">
                <Input placeholder="Ví dụ: Paracetamol" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="unit" label="Đơn vị tính" initialValue="Viên">
                <Select>
                  <Option value="Viên">Viên</Option>
                  <Option value="Viên sủi">Viên sủi</Option>
                  <Option value="Vỉ">Vỉ</Option>
                  <Option value="Hộp">Hộp</Option>
                  <Option value="Chai">Chai</Option>
                  <Option value="Ống">Ống</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit_price"
                label="Đơn giá bán (VNĐ)"
                rules={[{ required: true, message: "Nhập đơn giá" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={500} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock_quantity"
                label="Số lượng nhập kho"
                rules={[{ required: true, message: "Nhập số lượng tồn kho" }]}
                initialValue={100}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Nhóm thuốc" initialValue="Giảm đau - Hạ sốt">
                <Select>
                  <Option value="Giảm đau - Hạ sốt">Giảm đau - Hạ sốt</Option>
                  <Option value="Kháng sinh">Kháng sinh</Option>
                  <Option value="Kháng viêm giảm đau">Kháng viêm giảm đau</Option>
                  <Option value="Vitamin & Khoáng chất">Vitamin & Khoáng chất</Option>
                  <Option value="Dạ dày - Tiêu hóa">Dạ dày - Tiêu hóa</Option>
                  <Option value="Hô hấp">Hô hấp</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="expiry_date" label="Hạn sử dụng" initialValue="2027-12-31">
                <Input placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
