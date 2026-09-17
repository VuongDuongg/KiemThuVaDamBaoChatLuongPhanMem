import React, { useEffect } from "react";
import { Modal, Form, Row, Col, Input, Select, DatePicker, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const departmentOptions = [
  "Khoa Nội Tổng Hợp",
  "Khoa Ngoại Nhi",
  "Khoa Cấp Cứu",
  "Khoa Sản",
  "Khoa Tai Mũi Họng",
  "Khoa Mắt"
];

const statusOptions = [
  "Chờ khám",
  "Đang khám",
  "Chờ kết quả CLS",
  "Chờ thanh toán",
  "Đã khám"
];

export default function EditPatientModal({ open, patient, onCancel, onSubmit, confirmLoading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (patient && open) {
      form.setFieldsValue({
        name: patient.name,
        identity_card_number: patient.identity_card_number,
        phone: patient.phone,
        gender: patient.gender,
        department: patient.department,
        status: patient.status,
        birth_date: patient.birth_date ? dayjs(patient.birth_date, "DD/MM/YYYY") : null,
        address: patient.address,
        symptoms: patient.symptoms,
      });
    }
  }, [patient, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        birth_date: values.birth_date ? values.birth_date.format("DD/MM/YYYY") : ""
      });
    } catch {
      // Form validation error handled by antd
    }
  };

  return (
    <Modal
      title={
        <Space size={8}>
          <EditOutlined style={{ color: "#fa8c16", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>CẬP NHẬT HỒ SƠ BỆNH NHÂN</span>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu thay đổi"
      cancelText="Hủy bỏ"
      confirmLoading={confirmLoading}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="name"
              label="Họ và tên bệnh nhân"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên" },
                { min: 2, max: 50, message: "Họ tên phải từ 2 đến 50 ký tự" },
                {
                  pattern: /^[a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]+$/u,
                  message: "Họ tên chỉ được chứa chữ cái"
                }
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
              <Select size="large">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="identity_card_number"
              label="Số Căn cước công dân (CCCD)"
              rules={[
                { required: true, message: "Vui lòng nhập số CCCD" },
                { pattern: /^\d{12}$/, message: "Số CCCD phải gồm đúng 12 chữ số" }
              ]}
            >
              <Input size="large" maxLength={12} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^0(3|5|7|8|9)\d{8}$/, message: "Số điện thoại 10 số đầu 03, 05, 07, 08, 09" }
              ]}
            >
              <Input size="large" maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="birth_date" label="Ngày sinh" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="department" label="Khoa khám" rules={[{ required: true }]}>
              <Select size="large">
                {departmentOptions.map((dept) => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label="Trạng thái khám" rules={[{ required: true }]}>
              <Select size="large">
                {statusOptions.map((st) => (
                  <Option key={st} value={st}>{st}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Địa chỉ">
          <Input size="large" />
        </Form.Item>

        <Form.Item name="symptoms" label="Lý do khám / Triệu chứng">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
