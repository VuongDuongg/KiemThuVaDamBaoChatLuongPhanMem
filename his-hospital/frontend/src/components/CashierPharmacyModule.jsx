import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Radio,
  Statistic,
  message,
  Tabs,
  Typography,
  Divider,
  QRCode,
  Alert
} from "antd";
import {
  DollarOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PrinterOutlined,
  PlusOutlined,
  ReloadOutlined,
  QrcodeOutlined,
  CreditCardOutlined,
  WalletOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000/api";

export default function CashierPharmacyModule() {
  const [activeTab, setActiveTab] = useState("billing");

  // State cho Hóa đơn (Billing)
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchCode, setSearchCode] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("VIETQR");
  const [stats, setStats] = useState({ totalRevenue: 0, paidCount: 0, unpaidCount: 0 });

  // State cho Thuốc (Medicines)
  const [medicines, setMedicines] = useState([]);
  const [medicineLoading, setMedicineLoading] = useState(false);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [isAddMedModalVisible, setIsAddMedModalVisible] = useState(false);
  const [addMedForm] = Form.useForm();

  // 1. FETCH HÓA ĐƠN
  const fetchInvoices = async () => {
    setInvoiceLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invoices?status=${filterStatus}&invoice_code=${searchCode}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.data || []);
      }
      const statsRes = await fetch(`${API_BASE_URL}/invoices/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data || {});
      }
    } catch {
      // ignore
    } finally {
      setInvoiceLoading(false);
    }
  };

  // 2. FETCH THUỐC
  const fetchMedicines = async () => {
    setMedicineLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/medicines?search=${medicineSearch}`);
      if (res.ok) {
        const data = await res.json();
        setMedicines(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setMedicineLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  useEffect(() => {
    fetchMedicines();
  }, [medicineSearch]);

  // Xử lý thanh toán hóa đơn
  const handleOpenPayModal = (record) => {
    setSelectedInvoice(record);
    setPaymentMethod("VIETQR");
    setIsPayModalVisible(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${selectedInvoice.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: paymentMethod })
      });
      if (res.ok) {
        message.success(`Đã thu thành công ${selectedInvoice.patient_pay.toLocaleString("vi-VN")} VNĐ!`);
        setIsPayModalVisible(false);
        fetchInvoices();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi thanh toán");
      }
    } catch {
      message.error("Không thể kết nối đến máy chủ");
    }
  };

  // Xử lý thêm thuốc mới
  const handleAddMedicineSubmit = async () => {
    try {
      const values = await addMedForm.validateFields();
      const res = await fetch(`${API_BASE_URL}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        message.success("Thêm thuốc vào kho thành công!");
        addMedForm.resetFields();
        setIsAddMedModalVisible(false);
        fetchMedicines();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi thêm thuốc");
      }
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin nhập liệu!");
    }
  };

  const invoiceColumns = [
    {
      title: "Mã HĐ",
      dataIndex: "invoice_code",
      key: "invoice_code",
      width: 110,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>
    },
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      width: 110,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: "Họ và tên bệnh nhân",
      dataIndex: "patient_name",
      key: "patient_name",
      width: 180,
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: "Khoản thu",
      dataIndex: "description",
      key: "description",
      render: (desc, record) => {
        let tagColor = "default";
        if (record.item_type === "TIEN_KHAM") tagColor = "geekblue";
        if (record.item_type === "CAN_LAM_SANG") tagColor = "purple";
        if (record.item_type === "TIEN_THUOC") tagColor = "magenta";
        return (
          <Space direction="vertical" size={2}>
            <span>{desc}</span>
            <Tag color={tagColor} style={{ fontSize: 11 }}>
              {record.item_type === "TIEN_KHAM" ? "Tiền khám bệnh" : record.item_type === "CAN_LAM_SANG" ? "Cận lâm sàng" : "Tiền thuốc"}
            </Tag>
          </Space>
        );
      }
    },
    {
      title: "Tổng viện phí",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 130,
      render: (val) => `${val?.toLocaleString("vi-VN")} đ`
    },
    {
      title: "BHYT giảm",
      dataIndex: "insurance_discount",
      key: "insurance_discount",
      width: 120,
      render: (val) => (
        <span style={{ color: "#52c41a" }}>{val ? `-${val.toLocaleString("vi-VN")} đ` : "0 đ"}</span>
      )
    },
    {
      title: "Bệnh nhân trả",
      dataIndex: "patient_pay",
      key: "patient_pay",
      width: 140,
      render: (val) => (
        <span style={{ fontWeight: 700, color: "#fa541c", fontSize: 14 }}>
          {val?.toLocaleString("vi-VN")} đ
        </span>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) =>
        status === "PAID" ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã thanh toán
          </Tag>
        ) : (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            Chờ thanh toán
          </Tag>
        )
    },
    {
      title: "Phương thức",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 130,
      render: (method) => {
        if (method === "VIETQR") return <Tag color="cyan">VietQR</Tag>;
        if (method === "TIEN_MAT") return <Tag color="gold">Tiền mặt</Tag>;
        if (method === "THE_NGAN_HANG") return <Tag color="blue">Thẻ POS</Tag>;
        return <span style={{ color: "#8c8c8c" }}>Chưa thu</span>;
      }
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size={8}>
          {record.status === "UNPAID" ? (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
              onClick={() => handleOpenPayModal(record)}
            >
              Thu tiền
            </Button>
          ) : (
            <Button
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => message.success(`Đang in biên lai cho hóa đơn ${record.invoice_code}`)}
            >
              In biên lai
            </Button>
          )}
        </Space>
      )
    }
  ];

  const medicineColumns = [
    {
      title: "Mã thuốc",
      dataIndex: "medicine_code",
      key: "medicine_code",
      width: 110,
      render: (text) => <span style={{ fontWeight: 700, color: "#1677ff" }}>{text}</span>
    },
    {
      title: "Tên biệt dược",
      dataIndex: "medicine_name",
      key: "medicine_name",
      width: 200,
      render: (name) => <span style={{ fontWeight: 600 }}>{name}</span>
    },
    {
      title: "Hoạt chất chính",
      dataIndex: "active_ingredient",
      key: "active_ingredient",
      width: 180
    },
    {
      title: "Phân loại nhóm",
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: 90
    },
    {
      title: "Đơn giá xuất",
      dataIndex: "unit_price",
      key: "unit_price",
      width: 130,
      render: (val) => `${val?.toLocaleString("vi-VN")} đ`
    },
    {
      title: "Tồn kho",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
      width: 120,
      render: (qty) => (
        <Tag color={qty < 50 ? "error" : "success"} style={{ fontWeight: 600, fontSize: 13 }}>
          {qty} {qty < 50 ? "(Sắp hết)" : ""}
        </Tag>
      )
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 130
    }
  ];

  return (
    <div style={{ marginTop: 12 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <Statistic
              title={<span style={{ fontWeight: 600 }}>Tổng doanh thu thực thu</span>}
              value={stats.totalRevenue || 0}
              suffix="VNĐ"
              prefix={<DollarOutlined style={{ color: "#52c41a", marginRight: 8 }} />}
              valueStyle={{ color: "#52c41a", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <Statistic
              title={<span style={{ fontWeight: 600 }}>Hóa đơn đã thu tiền</span>}
              value={stats.paidCount || 0}
              suffix="phiếu"
              prefix={<CheckCircleOutlined style={{ color: "#1677ff", marginRight: 8 }} />}
              valueStyle={{ color: "#1677ff", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <Statistic
              title={<span style={{ fontWeight: 600 }}>Hóa đơn chờ thanh toán</span>}
              value={stats.unpaidCount || 0}
              suffix="phiếu"
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 8 }} />}
              valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "billing",
              label: (
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  <DollarOutlined /> QUẢN LÝ THU PHÍ & HÓA ĐƠN VIỆN PHÍ
                </span>
              ),
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                      flexWrap: "wrap",
                      gap: 12
                    }}
                  >
                    <Space size={12}>
                      <Input
                        placeholder="Tìm theo Mã HĐ..."
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        onPressEnter={fetchInvoices}
                        style={{ width: 200 }}
                      />
                      <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 170 }}
                      >
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="UNPAID">Chờ thanh toán</Option>
                        <Option value="PAID">Đã thanh toán</Option>
                      </Select>
                      <Button icon={<ReloadOutlined />} onClick={fetchInvoices}>
                        Làm mới
                      </Button>
                    </Space>

                    <Alert
                      type="info"
                      showIcon
                      message="Bệnh nhân đóng tiền xong sẽ tự động mở khóa quyền vào phòng khám hoặc phòng cận lâm sàng."
                      style={{ padding: "4px 12px" }}
                    />
                  </div>

                  <Table
                    columns={invoiceColumns}
                    dataSource={invoices}
                    rowKey="id"
                    loading={invoiceLoading}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              )
            },
            {
              key: "pharmacy",
              label: (
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  <MedicineBoxOutlined /> KHO DƯỢC & DANH MỤC THUỐC
                </span>
              ),
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16
                    }}
                  >
                    <Space size={12}>
                      <Input
                        placeholder="Tìm tên thuốc, mã thuốc, hoạt chất..."
                        value={medicineSearch}
                        onChange={(e) => setMedicineSearch(e.target.value)}
                        style={{ width: 280 }}
                      />
                      <Button icon={<ReloadOutlined />} onClick={fetchMedicines}>
                        Làm mới kho
                      </Button>
                    </Space>

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
                      onClick={() => setIsAddMedModalVisible(true)}
                    >
                      Thêm thuốc mới vào kho
                    </Button>
                  </div>

                  <Table
                    columns={medicineColumns}
                    dataSource={medicines}
                    rowKey="id"
                    loading={medicineLoading}
                    pagination={{ pageSize: 8 }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* MODAL THU TIỀN HÓA ĐƠN */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 16, color: "#003a8c" }}>
            XÁC NHẬN THU VIỆN PHÍ - HÓA ĐƠN {selectedInvoice?.invoice_code}
          </span>
        }
        open={isPayModalVisible}
        onOk={handleConfirmPayment}
        onCancel={() => setIsPayModalVisible(false)}
        okText="Xác nhận đã thu đủ tiền"
        cancelText="Hủy bỏ"
        width={550}
      >
        {selectedInvoice && (
          <div>
            <div style={{ background: "#f6f8fa", padding: 16, borderRadius: 8, marginTop: 10 }}>
              <p><b>Bệnh nhân:</b> {selectedInvoice.patient_name} ({selectedInvoice.patient_code})</p>
              <p><b>Nội dung thu:</b> {selectedInvoice.description}</p>
              <Divider style={{ margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                <span>Tổng chi phí:</span>
                <b>{selectedInvoice.total_amount?.toLocaleString("vi-VN")} đ</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#52c41a" }}>
                <span>Bảo hiểm y tế hỗ trợ:</span>
                <b>-{selectedInvoice.insurance_discount?.toLocaleString("vi-VN")} đ</b>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#fa541c" }}>
                <span>Số tiền bệnh nhân phải nộp:</span>
                <b>{selectedInvoice.patient_pay?.toLocaleString("vi-VN")} đ</b>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Text strong>Hình thức thanh toán:</Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Radio.Button value="VIETQR"><QrcodeOutlined /> Quét mã VietQR</Radio.Button>
                  <Radio.Button value="TIEN_MAT"><WalletOutlined /> Tiền mặt</Radio.Button>
                  <Radio.Button value="THE_NGAN_HANG"><CreditCardOutlined /> Thẻ ngân hàng POS</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            {paymentMethod === "VIETQR" && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <QRCode
                  value={`2026-HIS-HOSPITAL-PAYMENT-${selectedInvoice.invoice_code}-${selectedInvoice.patient_pay}`}
                  size={160}
                  style={{ margin: "0 auto" }}
                />
                <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                  Quét mã QR bằng ứng dụng Ngân hàng để thanh toán nhanh
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* MODAL THÊM THUỐC MỚI */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 16 }}>THÊM THUỐC MỚI VÀO KHO DƯỢC</span>}
        open={isAddMedModalVisible}
        onOk={handleAddMedicineSubmit}
        onCancel={() => setIsAddMedModalVisible(false)}
        okText="Lưu vào kho"
        cancelText="Hủy bỏ"
        width={550}
      >
        <Form form={addMedForm} layout="vertical" initialValues={{ unit: "Viên", category: "Kháng sinh" }}>
          <Form.Item name="medicine_name" label="Tên thuốc / Biệt dược" rules={[{ required: true, message: "Nhập tên thuốc" }]}>
            <Input placeholder="Ví dụ: Augmentin 1g" />
          </Form.Item>
          <Form.Item name="active_ingredient" label="Hoạt chất chính">
            <Input placeholder="Ví dụ: Amoxicillin + Acid clavulanic" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Nhóm thuốc">
                <Select>
                  <Option value="Kháng sinh">Kháng sinh</Option>
                  <Option value="Giảm đau - Hạ sốt">Giảm đau - Hạ sốt</Option>
                  <Option value="Dạ dày - Tiêu hóa">Dạ dày - Tiêu hóa</Option>
                  <Option value="Tim mạch - Huyết áp">Tim mạch - Huyết áp</Option>
                  <Option value="Vitamin & Khoáng chất">Vitamin & Khoáng chất</Option>
                  <Option value="Thuốc khác">Thuốc khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="Đơn vị tính">
                <Select>
                  <Option value="Viên">Viên</Option>
                  <Option value="Vỉ">Vỉ</Option>
                  <Option value="Hộp">Hộp</Option>
                  <Option value="Chai">Chai</Option>
                  <Option value="Gói">Gói</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="unit_price" label="Đơn giá xuất (VNĐ)" rules={[{ required: true, message: "Nhập đơn giá" }]}>
                <InputNumber min={100} style={{ width: "100%" }} placeholder="15000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stock_quantity" label="Số lượng nhập kho ban đầu" rules={[{ required: true, message: "Nhập số lượng" }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="500" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
