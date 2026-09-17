import React, { useEffect } from "react";
import { Form, Row, Col, Input, InputNumber, Select, Card, Button, Space, Typography, Descriptions, Tag, Divider } from "antd";
import { MedicineBoxOutlined, SaveOutlined, ExperimentOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const icd10Common = [
  { code: "J02.9", name: "Viêm họng cấp, không đặc hiệu" },
  { code: "J00", name: "Viêm mũi họng cấp tính [cảm thường]" },
  { code: "K29.7", name: "Viêm dạ dày, không đặc hiệu" },
  { code: "S60.2", name: "Đụng giập các phần khác của cổ tay và bàn tay" },
  { code: "I10", name: "Bệnh tăng huyết áp vô căn (nguyên phát)" },
  { code: "J20.9", name: "Viêm phế quản cấp, không đặc hiệu" },
  { code: "E11.9", name: "Đái tháo đường typ 2 không có biến chứng" },
];

export default function ClinicalExamination({
  patient,
  onSubmit,
  onOpenLabModal,
  onOpenPrescribe,
  submitting,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        symptoms: patient.symptoms || "",
        blood_pressure: "120/80",
        pulse: 78,
        temperature: 36.8,
        spo2: 98,
        icd10_code: "J02.9",
        doctor_notes: "Bệnh nhân tỉnh táo, tiếp xúc tốt, tim phổi bình thường.",
        treatment_plan: "Điều trị nội khoa ngoại trú, uống thuốc theo đơn và tái khám sau 5 ngày.",
      });
    }
  }, [patient, form]);

  const handleIcdChange = (code) => {
    const matched = icd10Common.find((i) => i.code === code);
    if (matched) {
      form.setFieldValue("icd10_name", matched.name);
    }
  };

  const handleFinish = (values) => {
    const selectedIcd = icd10Common.find((i) => i.code === values.icd10_code);
    onSubmit({
      patient_code: patient.patient_code,
      patient_name: patient.name,
      gender: patient.gender,
      birth_date: patient.birth_date,
      doctor: "BS. Lê Hoàng Nam",
      department: patient.department,
      vitals: {
        blood_pressure: values.blood_pressure,
        pulse: values.pulse,
        temperature: values.temperature,
        spo2: values.spo2,
      },
      symptoms: values.symptoms,
      icd10_code: values.icd10_code,
      icd10_name: selectedIcd ? selectedIcd.name : values.icd10_code,
      doctor_notes: values.doctor_notes,
      treatment_plan: values.treatment_plan,
    });
  };

  if (!patient) {
    return (
      <Card bordered={false} style={{ textAlign: "center", padding: "60px 20px" }}>
        <MedicineBoxOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
        <Title level={4} style={{ color: "#6b7280" }}>
          Vui lòng chọn một bệnh nhân từ danh sách hàng đợi bên trái để bắt đầu khám bệnh
        </Title>
      </Card>
    );
  }

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 8 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <Space>
            <MedicineBoxOutlined style={{ color: "#1677ff", fontSize: 18 }} />
            <span style={{ fontWeight: 700 }}>HỒ SƠ KHÁM BỆNH LÂM SÀNG</span>
          </Space>
          <Space>
            <Button
              icon={<ExperimentOutlined />}
              style={{ color: "#722ed1", borderColor: "#722ed1" }}
              onClick={onOpenLabModal}
            >
              Chỉ định Cận lâm sàng (CLS)
            </Button>
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
              onClick={onOpenPrescribe}
            >
              Kê đơn thuốc
            </Button>
          </Space>
        </div>
      }
    >
      {/* THÔNG TIN HÀNH CHÍNH BỆNH NHÂN */}
      <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 4 }} style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Mã BN">
          <Tag color="cyan" style={{ fontWeight: 700 }}>{patient.patient_code}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Họ và tên">
          <Text strong style={{ color: "#1d4ed8" }}>{patient.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Giới tính / Tuổi">
          {patient.gender} • {patient.birth_date}
        </Descriptions.Item>
        <Descriptions.Item label="Khoa khám">
          <Tag color="blue">{patient.department}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* FORM KHÁM BỆNH */}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* SINH HIỆU */}
        <Card size="small" title="Chỉ số sinh hiệu ban đầu" style={{ background: "#fcfcfc", marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <Form.Item name="blood_pressure" label="Huyết áp (mmHg)" rules={[{ required: true }]}>
                <Input placeholder="120/80" />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="pulse" label="Mạch (lần/phút)" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={30} max={200} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="temperature" label="Thân nhiệt (°C)" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} step={0.1} min={34} max={42} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={6}>
              <Form.Item name="spo2" label="SpO2 (%)" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={50} max={100} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* TRIỆU CHỨNG & CHẨN ĐOÁN */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="symptoms"
              label="Triệu chứng lâm sàng & Lý do vào khám"
              rules={[{ required: true, message: "Vui lòng ghi nhận triệu chứng" }]}
            >
              <Input.TextArea rows={2} placeholder="Mô tả diễn biến bệnh, triệu chứng đau, sốt, ho..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="icd10_code"
              label="Mã bệnh ICD-10"
              rules={[{ required: true, message: "Chọn mã ICD-10" }]}
            >
              <Select onChange={handleIcdChange} showSearch optionFilterProp="children">
                {icd10Common.map((i) => (
                  <Option key={i.code} value={i.code}>
                    {i.code} - {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={16}>
            <Form.Item name="doctor_notes" label="Khám xét lâm sàng & Ghi chú của Bác sĩ">
              <Input placeholder="Khám tim mạch, hô hấp, tiêu hóa, thần kinh..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="treatment_plan" label="Hướng điều trị & Lời dặn Bác sĩ">
          <Input.TextArea rows={2} placeholder="Kế hoạch dùng thuốc, dinh dưỡng, tái khám..." />
        </Form.Item>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            size="large"
            loading={submitting}
            style={{ fontWeight: 600 }}
          >
            Lưu kết luận khám bệnh
          </Button>
        </div>
      </Form>
    </Card>
  );
}
