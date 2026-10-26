import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Select,
  Modal,
  Form,
  Input,
  InputNumber,
  Tabs,
  Typography,
  Divider,
  Alert,
  message,
  Image
} from "antd";
import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";

const { Option } = Select;

const API_BASE_URL = "http://localhost:5000/api";

export default function LabPacsModule() {
  const [activeTab, setActiveTab] = useState("lab_queue");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);

  const [resultForm] = Form.useForm();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lab/orders?type=${filterType}&status=${filterStatus}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterType, filterStatus]);

  // Tiếp nhận bắt đầu lấy mẫu hoặc chụp
  const handleStartOrder = async (record) => {
    try {
      const res = await fetch(`${API_BASE_URL}/lab/orders/${record.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technician: "KTV. Đặng Quốc Việt" })
      });
      if (res.ok) {
        message.success(`Đã tiếp nhận thực hiện ca chỉ định ${record.order_code}!`);
        fetchOrders();
      }
    } catch {
      message.error("Lỗi khi tiếp nhận");
    }
  };

  // Mở modal nhập kết quả
  const handleOpenResultModal = (record) => {
    setSelectedOrder(record);
    if (record.type === "LAB") {
      resultForm.setFieldsValue({
        wbc: record.results?.parameters?.find((p) => p.param.includes("WBC"))?.value || 7.5,
        rbc: record.results?.parameters?.find((p) => p.param.includes("RBC"))?.value || 4.5,
        hb: record.results?.parameters?.find((p) => p.param.includes("Hb"))?.value || 140,
        plt: record.results?.parameters?.find((p) => p.param.includes("PLT"))?.value || 250,
        conclusion: record.results?.conclusion || "Các chỉ số huyết học trong giới hạn bình thường."
      });
    } else {
      resultForm.setFieldsValue({
        findings: record.results?.findings || "Cấu trúc giải phẫu rõ ràng, không thấy tổn thương bất thường.",
        conclusion: record.results?.conclusion || "Hình ảnh bình thường, chưa thấy bệnh lý rõ rệt."
      });
    }
    setIsResultModalVisible(true);
  };

  // Lưu kết quả và trả về EMR
  const handleSaveResult = async () => {
    try {
      const values = await resultForm.validateFields();
      let payload = {};

      if (selectedOrder.type === "LAB") {
        const wbcVal = Number(values.wbc);
        const wbcAlert = wbcVal > 10.0 ? "HIGH" : wbcVal < 4.0 ? "LOW" : "NORMAL";

        payload = {
          results: {
            parameters: [
              { param: "Bạch cầu (WBC)", value: wbcVal, unit: "G/L", normal_range: "4.0 - 10.0", alert: wbcAlert },
              { param: "Hồng cầu (RBC)", value: Number(values.rbc), unit: "T/L", normal_range: "3.8 - 5.5", alert: "NORMAL" },
              { param: "Huyết sắc tố (Hb)", value: Number(values.hb), unit: "g/L", normal_range: "120 - 160", alert: "NORMAL" },
              { param: "Tiểu cầu (PLT)", value: Number(values.plt), unit: "G/L", normal_range: "150 - 400", alert: "NORMAL" }
            ],
            conclusion: values.conclusion
          }
        };
      } else {
        payload = {
          results: {
            image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60",
            findings: values.findings,
            conclusion: values.conclusion
          }
        };
      }

      const res = await fetch(`${API_BASE_URL}/lab/orders/${selectedOrder.id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success(`Đã trả kết quả ${selectedOrder.order_code} về Bệnh án điện tử của Bác sĩ!`);
        setIsResultModalVisible(false);
        fetchOrders();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi lưu kết quả");
      }
    } catch {
      message.error("Vui lòng nhập đầy đủ kết quả!");
    }
  };

  const columns = [
    {
      title: "Mã chỉ định",
      dataIndex: "order_code",
      key: "order_code",
      width: 120,
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
      title: "Dịch vụ chỉ định",
      dataIndex: "service_name",
      key: "service_name",
      render: (name, record) => (
        <Space size={6}>
          <Tag color={record.type === "LAB" ? "cyan" : "geekblue"}>{record.type}</Tag>
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      )
    },
    {
      title: "Bác sĩ yêu cầu",
      dataIndex: "doctor",
      key: "doctor",
      width: 160
    },
    {
      title: "Trạng thái thực hiện",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (st) => {
        if (st === "COMPLETED") return <Tag color="success" icon={<CheckCircleOutlined />}>Đã có kết quả</Tag>;
        if (st === "PROCESSING") return <Tag color="processing" icon={<SyncOutlined spin />}>Đang phân tích</Tag>;
        return <Tag color="warning" icon={<ClockCircleOutlined />}>Chờ tiếp nhận</Tag>;
      }
    },
    {
      title: "Thao tác Kỹ thuật viên",
      key: "action",
      width: 240,
      render: (_, record) => (
        <Space size={8}>
          {record.status === "PENDING" && (
            <Button
              type="primary"
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleStartOrder(record)}
            >
              Tiếp nhận & Làm
            </Button>
          )}
          {record.status === "PROCESSING" && (
            <Button
              type="primary"
              size="small"
              icon={<ExperimentOutlined />}
              style={{ background: "#722ed1", borderColor: "#722ed1" }}
              onClick={() => handleOpenResultModal(record)}
            >
              Nhập kết quả
            </Button>
          )}
          {record.status === "COMPLETED" && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenResultModal(record)}
            >
              Xem kết quả
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ marginTop: 12 }}>
      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "lab_queue",
              label: (
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  <ExperimentOutlined /> HÀNG ĐỢI & KẾT QUẢ CẬN LÂM SÀNG (LAB / PACS)
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
                      <Select value={filterType} onChange={setFilterType} style={{ width: 170 }}>
                        <Option value="ALL">Tất cả loại hình</Option>
                        <Option value="LAB">Xét nghiệm (Lab)</Option>
                        <Option value="PACS">Chẩn đoán hình ảnh (PACS)</Option>
                      </Select>
                      <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 170 }}>
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="PENDING">Chờ tiếp nhận</Option>
                        <Option value="PROCESSING">Đang thực hiện</Option>
                        <Option value="COMPLETED">Đã hoàn tất</Option>
                      </Select>
                      <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
                        Làm mới
                      </Button>
                    </Space>

                    <Alert
                      type="success"
                      showIcon
                      message="Kết quả sau khi KTV duyệt sẽ được trả tự động tức thì về màn hình Bệnh án điện tử của Bác sĩ."
                      style={{ padding: "4px 12px" }}
                    />
                  </div>

                  <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 6 }}
                    scroll={{ x: 1200 }}
                  />
                </div>
              )
            },
            {
              key: "system_admin",
              label: (
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  <SafetyCertificateOutlined /> QUẢN TRỊ HỆ THỐNG & PHÂN QUYỀN CORE (RBAC)
                </span>
              ),
              children: (
                <div>
                  <Alert
                    message="Phân quyền truy cập theo vai trò người dùng (Role-Based Access Control)"
                    description="Hệ thống HIS áp dụng bảo mật JWT Token kèm kiểm soát quyền trên từng Router API. Mỗi người dùng khi đăng nhập chỉ có quyền truy cập đúng phân hệ nghiệp vụ của mình."
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                      <Card title="1. Lễ tân (TV1)" extra={<Tag color="blue">RECEPTIONIST</Tag>}>
                        <p><b>Quyền hạn:</b> Đăng ký bệnh nhân mới, tra cứu hồ sơ, phân luồng hàng chờ phòng khám ban đầu.</p>
                        <p><b>Tài khoản test:</b> <code>letan1 / 123456</code></p>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card title="2. Thu ngân (TV2)" extra={<Tag color="green">CASHIER</Tag>}>
                        <p><b>Quyền hạn:</b> Thu viện phí, in biên lai VietQR, quản lý danh mục thuốc và kho dược phẩm.</p>
                        <p><b>Tài khoản test:</b> <code>thungan1 / 123456</code></p>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card title="3. Bác sĩ (TV3)" extra={<Tag color="purple">DOCTOR</Tag>}>
                        <p><b>Quyền hạn:</b> Khám lâm sàng, ghi nhận sinh hiệu, chẩn đoán ICD-10, ra chỉ định CLS và kê đơn.</p>
                        <p><b>Tài khoản test:</b> <code>bacsi1 / 123456</code></p>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card title="4. KTV & Admin (TV4)" extra={<Tag color="red">LAB_TECH / ADMIN</Tag>}>
                        <p><b>Quyền hạn:</b> Tiếp nhận mẫu, nhập chỉ số xét nghiệm, kết luận X-quang và quản trị hệ thống Core.</p>
                        <p><b>Tài khoản test:</b> <code>admin / 123456</code></p>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* MODAL NHẬP KẾT QUẢ CẬN LÂM SÀNG */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 16, color: "#003a8c" }}>
            KẾT QUẢ CẬN LÂM SÀNG - {selectedOrder?.order_code} ({selectedOrder?.service_name})
          </span>
        }
        open={isResultModalVisible}
        onOk={handleSaveResult}
        onCancel={() => setIsResultModalVisible(false)}
        okText="Ký duyệt & Trả kết quả về Bệnh án"
        cancelText="Hủy bỏ"
        width={650}
      >
        <Form form={resultForm} layout="vertical">
          <div style={{ background: "#f6f8fa", padding: 12, borderRadius: 6, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>
              <b>Bệnh nhân:</b> {selectedOrder?.patient_name} ({selectedOrder?.patient_code}) | <b>Bác sĩ chỉ định:</b> {selectedOrder?.doctor}
            </p>
          </div>

          {selectedOrder?.type === "LAB" ? (
            <div>
              <Divider orientation="left" style={{ margin: "8px 0" }}>Nhập các chỉ số huyết học</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="wbc" label="Bạch cầu WBC (Chuẩn: 4.0 - 10.0 G/L)" rules={[{ required: true }]}>
                    <InputNumber step={0.1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="rbc" label="Hồng cầu RBC (Chuẩn: 3.8 - 5.5 T/L)" rules={[{ required: true }]}>
                    <InputNumber step={0.1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hb" label="Huyết sắc tố Hb (Chuẩn: 120 - 160 g/L)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="plt" label="Tiểu cầu PLT (Chuẩn: 150 - 400 G/L)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="conclusion" label="Nhận xét & Kết luận của Kỹ thuật viên" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </div>
          ) : (
            <div>
              <Divider orientation="left" style={{ margin: "8px 0" }}>Hình ảnh & Kết luận Chẩn đoán hình ảnh</Divider>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <Image
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60"
                  alt="Ảnh chụp y tế"
                  width={220}
                  style={{ borderRadius: 8, border: "1px solid #ddd" }}
                />
                <p style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Ảnh DICOM / X-quang độ phân giải cao</p>
              </div>
              <Form.Item name="findings" label="Mô tả hình ảnh tổn thương" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="conclusion" label="Kết luận chẩn đoán hình ảnh" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
