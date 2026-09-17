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
  message,
  Typography,
  Divider,
  Descriptions,
  Alert
} from "antd";
import {
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PrinterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000/api";

const commonICD10 = [
  { code: "J00", name: "Viêm mũi họng cấp tính [cảm thường]" },
  { code: "J20", name: "Viêm phế quản cấp tính" },
  { code: "I10", name: "Bệnh tăng huyết áp vô căn (nguyên phát)" },
  { code: "K29.7", name: "Viêm dạ dày, không xác định" },
  { code: "E11", name: "Bệnh đái tháo đường không phụ thuộc insulin (Typ 2)" },
  { code: "M54.5", name: "Đau thắt lưng (đau lưng dưới)" },
  { code: "S60.2", name: "Đụng giập các phần khác của cổ tay và bàn tay" },
  { code: "Z34.0", name: "Giám sát thai nghén bình thường (lần đầu)" }
];

export default function DoctorConsultationModule() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isExamModalVisible, setIsExamModalVisible] = useState(false);
  const [isPrescribeModalVisible, setIsPrescribeModalVisible] = useState(false);
  const [isOrderLabModalVisible, setIsOrderLabModalVisible] = useState(false);

  // Danh mục thuốc và CLS phục vụ kê đơn và chỉ định
  const [medicines, setMedicines] = useState([]);
  const [labServices, setLabServices] = useState([]);

  const [examForm] = Form.useForm();
  const [prescribeForm] = Form.useForm();
  const [labForm] = Form.useForm();

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/consultations`);
      if (res.ok) {
        const data = await res.json();
        setConsultations(data.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const medRes = await fetch(`${API_BASE_URL}/medicines`);
      if (medRes.ok) {
        const medData = await medRes.json();
        setMedicines(medData.data || []);
      }
      const labRes = await fetch(`${API_BASE_URL}/lab/services`);
      if (labRes.ok) {
        const labData = await labRes.json();
        setLabServices(labData.data || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchConsultations();
    fetchMetadata();
  }, []);

  // Mở modal khám bệnh
  const handleOpenExamModal = (record) => {
    setSelectedRecord(record);
    examForm.setFieldsValue({
      bp: record.vitals?.blood_pressure || "120/80",
      pulse: record.vitals?.pulse || 75,
      temp: record.vitals?.temperature || 36.8,
      spo2: record.vitals?.spo2 || 98,
      symptoms: record.symptoms || "",
      icd10_code: record.icd10_code || "J00",
      treatment_plan: record.treatment_plan || ""
    });
    setIsExamModalVisible(true);
  };

  // Lưu khám bệnh
  const handleSaveExam = async () => {
    try {
      const values = await examForm.validateFields();
      const icdObj = commonICD10.find((i) => i.code === values.icd10_code) || {
        code: values.icd10_code,
        name: "Chẩn đoán xác định"
      };

      const payload = {
        patient_code: selectedRecord.patient_code,
        patient_name: selectedRecord.patient_name,
        gender: selectedRecord.gender,
        birth_date: selectedRecord.birth_date,
        doctor: "BS. Trần Văn Bình",
        department: "Khoa Nội",
        vitals: {
          blood_pressure: values.bp,
          pulse: values.pulse,
          temperature: values.temp,
          spo2: values.spo2
        },
        symptoms: values.symptoms,
        icd10_code: icdObj.code,
        icd10_name: icdObj.name,
        treatment_plan: values.treatment_plan
      };

      const res = await fetch(`${API_BASE_URL}/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success("Đã cập nhật hồ sơ bệnh án thành công!");
        setIsExamModalVisible(false);
        fetchConsultations();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi lưu bệnh án");
      }
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin nhập liệu!");
    }
  };

  // Kê đơn thuốc
  const handleOpenPrescribeModal = (record) => {
    setSelectedRecord(record);
    prescribeForm.resetFields();
    setIsPrescribeModalVisible(true);
  };

  const handleSavePrescription = async () => {
    try {
      const values = await prescribeForm.validateFields();
      const medObj = medicines.find((m) => m.medicine_code === values.medicine_code);

      const payload = {
        items: [
          {
            medicine_code: values.medicine_code,
            medicine_name: medObj?.medicine_name || "Thuốc",
            quantity: values.quantity,
            dosage: values.dosage
          }
        ]
      };

      const res = await fetch(`${API_BASE_URL}/consultations/${selectedRecord.id}/prescribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success("Đã kê đơn thuốc và tự động gửi hóa đơn sang Thu ngân!");
        setIsPrescribeModalVisible(false);
        fetchConsultations();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi kê đơn");
      }
    } catch {
      message.error("Vui lòng kiểm tra lại đơn thuốc!");
    }
  };

  // Chỉ định Cận lâm sàng
  const handleOpenOrderLabModal = (record) => {
    setSelectedRecord(record);
    labForm.resetFields();
    setIsOrderLabModalVisible(true);
  };

  const handleSaveLabOrder = async () => {
    try {
      const values = await labForm.validateFields();
      const payload = {
        consultation_id: selectedRecord.id,
        patient_code: selectedRecord.patient_code,
        patient_name: selectedRecord.patient_name,
        doctor: selectedRecord.doctor,
        service_code: values.service_code
      };

      const res = await fetch(`${API_BASE_URL}/lab/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        message.success("Đã tạo phiếu chỉ định CLS và gửi sang Thu ngân thu tiền!");
        setIsOrderLabModalVisible(false);
        fetchConsultations();
      } else {
        const err = await res.json();
        message.error(err.message || "Lỗi chỉ định");
      }
    } catch {
      message.error("Vui lòng chọn dịch vụ cận lâm sàng!");
    }
  };

  const columns = [
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      width: 110,
      render: (text) => <Tag color="blue" style={{ fontWeight: 700 }}>{text}</Tag>
    },
    {
      title: "Họ và tên",
      dataIndex: "patient_name",
      key: "patient_name",
      width: 180,
      render: (name) => <span style={{ fontWeight: 600 }}>{name}</span>
    },
    {
      title: "Sinh hiệu ban đầu",
      key: "vitals",
      width: 220,
      render: (_, record) => (
        <Space direction="vertical" orientation="horizontal" size={2}>
          <Tag color="volcano">HA: {record.vitals?.blood_pressure || "120/80"}</Tag>
          <Tag color="red">Mạch: {record.vitals?.pulse || 80} ck/p</Tag>
          <Tag color="orange">Nhiệt: {record.vitals?.temperature || 37}°C</Tag>
        </Space>
      )
    },
    {
      title: "Chẩn đoán (ICD-10)",
      key: "icd10",
      render: (_, record) => (
        <div>
          <Tag color="geekblue" style={{ fontWeight: 700 }}>
            {record.icd10_code}
          </Tag>
          <span style={{ fontWeight: 500 }}>{record.icd10_name}</span>
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (st) => {
        if (st === "COMPLETED") return <Tag color="success" icon={<CheckCircleOutlined />}>Đã kết luận</Tag>;
        if (st === "WAITING_LAB") return <Tag color="purple" icon={<ExperimentOutlined />}>Chờ kết quả CLS</Tag>;
        return <Tag color="processing" icon={<ClockCircleOutlined />}>Đang khám</Tag>;
      }
    },
    {
      title: "Thao tác Bác sĩ",
      key: "action",
      width: 320,
      render: (_, record) => (
        <Space size={6} wrap>
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleOpenExamModal(record)}
          >
            Bệnh án
          </Button>
          <Button
            size="small"
            icon={<ExperimentOutlined />}
            style={{ color: "#722ed1", borderColor: "#722ed1" }}
            onClick={() => handleOpenOrderLabModal(record)}
          >
            Chỉ định CLS
          </Button>
          <Button
            size="small"
            icon={<MedicineBoxOutlined />}
            style={{ color: "#52c41a", borderColor: "#52c41a" }}
            onClick={() => handleOpenPrescribeModal(record)}
          >
            Kê thuốc
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ marginTop: 12 }}>
      <Alert
        message="Phân hệ Bác sĩ khám lâm sàng & Bệnh án điện tử EMR"
        description="Bác sĩ tiếp nhận bệnh nhân, kiểm tra sinh hiệu, ghi nhận chẩn đoán theo mã ICD-10, ra chỉ định xét nghiệm/X-quang và kê đơn thuốc điều trị."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card
        bordered={false}
        style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#003a8c" }}>
              DANH SÁCH BỆNH NHÂN TẠI PHÒNG KHÁM CHUYÊN KHOA
            </span>
            <Button icon={<ReloadOutlined />} onClick={fetchConsultations}>
              Làm mới danh sách
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={consultations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* MODAL 1: BỆNH ÁN & KHÁM BỆNH */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 16, color: "#003a8c" }}>
            HỒ SƠ BỆNH ÁN ĐIỆN TỬ (EMR) - {selectedRecord?.patient_name} ({selectedRecord?.patient_code})
          </span>
        }
        open={isExamModalVisible}
        onOk={handleSaveExam}
        onCancel={() => setIsExamModalVisible(false)}
        okText="Lưu hồ sơ bệnh án"
        cancelText="Hủy bỏ"
        width={720}
      >
        <Form form={examForm} layout="vertical">
          <Divider orientation="left" style={{ margin: "10px 0" }}>1. Đo lường chỉ số sinh hiệu</Divider>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="bp" label="Huyết áp (mmHg)" rules={[{ required: true }]}>
                <Input placeholder="120/80" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="pulse" label="Mạch (ck/phút)" rules={[{ required: true }]}>
                <InputNumber min={30} max={220} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="temp" label="Thân nhiệt (°C)" rules={[{ required: true }]}>
                <InputNumber min={34} max={43} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="spo2" label="Chỉ số SpO2 (%)" rules={[{ required: true }]}>
                <InputNumber min={50} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: "10px 0" }}>2. Lâm sàng & Chẩn đoán</Divider>
          <Form.Item name="symptoms" label="Lý do khám / Triệu chứng lâm sàng" rules={[{ required: true, message: "Nhập triệu chứng" }]}>
            <Input.TextArea rows={2} placeholder="Mô tả triệu chứng bệnh nhân khai báo và bác sĩ ghi nhận" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="icd10_code" label="Mã chẩn đoán ICD-10" rules={[{ required: true }]}>
                <Select showSearch placeholder="Chọn mã bệnh ICD-10">
                  {commonICD10.map((item) => (
                    <Option key={item.code} value={item.code}>
                      <b>{item.code}</b> - {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="treatment_plan" label="Hướng điều trị & Dặn dò của bác sĩ">
            <Input.TextArea rows={2} placeholder="Nghỉ ngơi, ăn uống hợp vệ sinh, tái khám khi có dấu hiệu bất thường..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL 2: KÊ ĐƠN THUỐC */}
      <Modal
        title={
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            KÊ ĐƠN THUỐC ĐIỆN TỬ - {selectedRecord?.patient_name}
          </span>
        }
        open={isPrescribeModalVisible}
        onOk={handleSavePrescription}
        onCancel={() => setIsPrescribeModalVisible(false)}
        okText="Ký đơn thuốc"
        cancelText="Hủy bỏ"
        width={600}
      >
        <Form form={prescribeForm} layout="vertical">
          <Form.Item name="medicine_code" label="Chọn loại thuốc từ kho dược" rules={[{ required: true, message: "Vui lòng chọn thuốc" }]}>
            <Select showSearch placeholder="Tìm theo tên thuốc hoặc hoạt chất">
              {medicines.map((m) => (
                <Option key={m.medicine_code} value={m.medicine_code}>
                  {m.medicine_name} ({m.active_ingredient}) - Tồn kho: {m.stock_quantity} {m.unit}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="quantity" label="Số lượng kê" rules={[{ required: true, message: "Nhập số lượng" }]}>
                <InputNumber min={1} style={{ width: "100%" }} placeholder="10" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="dosage" label="Liều dùng & Cách dùng" rules={[{ required: true, message: "Nhập hướng dẫn" }]}>
                <Input placeholder="Ví dụ: Ngày uống 2 lần, mỗi lần 1 viên sau ăn" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* MODAL 3: CHỈ ĐỊNH CẬN LÂM SÀNG */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 16 }}>CHỈ ĐỊNH CẬN LÂM SÀNG (XÉT NGHIỆM / X-QUANG)</span>}
        open={isOrderLabModalVisible}
        onOk={handleSaveLabOrder}
        onCancel={() => setIsOrderLabModalVisible(false)}
        okText="Gửi chỉ định sang phòng CLS"
        cancelText="Hủy bỏ"
        width={550}
      >
        <Form form={labForm} layout="vertical">
          <Form.Item name="service_code" label="Dịch vụ Cận lâm sàng yêu cầu" rules={[{ required: true, message: "Chọn dịch vụ" }]}>
            <Select placeholder="Chọn dịch vụ xét nghiệm hoặc chẩn đoán hình ảnh">
              {labServices.map((s) => (
                <Option key={s.service_code} value={s.service_code}>
                  [{s.type}] {s.service_name} - {s.price.toLocaleString("vi-VN")} đ
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Alert
            message="Chỉ định sẽ tự động tạo hóa đơn sang Thu ngân (TV2). Sau khi thanh toán, Kỹ thuật viên (TV4) sẽ tiến hành lấy mẫu/chụp và trả kết quả về bệnh án này."
            type="warning"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
}
