import React from "react";
import { Card, Form, Row, Col, Input, Select, DatePicker, Button, Space, Typography } from "antd";
import { SearchOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const departmentOptions = [
  "Tất cả",
  "Khoa Nội Tổng Hợp",
  "Khoa Ngoại Nhi",
  "Khoa Cấp Cứu",
  "Khoa Sản",
  "Khoa Tai Mũi Họng",
  "Khoa Mắt"
];

const statusOptions = [
  "Tất cả",
  "Chờ khám",
  "Đang khám",
  "Chờ kết quả CLS",
  "Chờ thanh toán",
  "Đã khám"
];

export default function PatientSearchFilter({ onSearch, onReset }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const formattedValues = {
      ...values,
      from_date: values.from_date ? values.from_date.format("DD/MM/YYYY") : undefined,
      to_date: values.to_date ? values.to_date.format("DD/MM/YYYY") : undefined,
    };
    onSearch(formattedValues);
  };

  const handleResetForm = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        background: "#ffffff",
      }}
      title={
        <Space size={8}>
          <FilterOutlined style={{ color: "#1677ff" }} />
          <Text strong style={{ fontSize: 15, color: "#1f2937" }}>
            BỘ LỌC TÌM KIẾM BỆNH NHÂN
          </Text>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          department: "Tất cả",
          status: "Tất cả",
          gender: "Tất cả",
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="name" label="Họ và tên bệnh nhân">
              <Input placeholder="Nhập họ tên cần tìm..." allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="patient_code" label="Mã bệnh nhân (Mã BN)">
              <Input placeholder="Ví dụ: BN20260001..." allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="identity_card_number" label="Số CCCD (12 chữ số)">
              <Input placeholder="Nhập 12 số CCCD..." allowClear maxLength={12} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="phone" label="Số điện thoại di động">
              <Input placeholder="Nhập số điện thoại..." allowClear maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="department" label="Khoa tiếp nhận">
              <Select>
                {departmentOptions.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="status" label="Trạng thái khám">
              <Select>
                {statusOptions.map((st) => (
                  <Option key={st} value={st}>
                    {st}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="gender" label="Giới tính">
              <Select>
                <Option value="Tất cả">Tất cả</Option>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label="Thời gian tiếp nhận">
              <Space.Compact style={{ width: "100%" }}>
                <Form.Item name="from_date" noStyle>
                  <DatePicker placeholder="Từ ngày" format="DD/MM/YYYY" style={{ width: "50%" }} />
                </Form.Item>
                <Form.Item name="to_date" noStyle>
                  <DatePicker placeholder="Đến ngày" format="DD/MM/YYYY" style={{ width: "50%" }} />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: 8 }}>
          <Space size={10}>
            <Button icon={<ReloadOutlined />} onClick={handleResetForm}>
              Đặt lại bộ lọc
            </Button>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
}
