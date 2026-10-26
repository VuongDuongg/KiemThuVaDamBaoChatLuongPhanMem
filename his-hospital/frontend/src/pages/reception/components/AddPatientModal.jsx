import React from "react";
import { Modal, Form, Row, Col, Input, Select, DatePicker, Space } from "antd";
import { UserAddOutlined } from "@ant-design/icons";

const { Option } = Select;

const departmentOptions = [
  "Khoa Nội Tổng Hợp",
  "Khoa Ngoại Nhi",
  "Khoa Cấp Cứu",
  "Khoa Sản",
  "Khoa Tai Mũi Họng",
  "Khoa Mắt"
];

export default function AddPatientModal({ open, onCancel, onSubmit, confirmLoading }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        birth_date: values.birth_date ? values.birth_date.format("DD/MM/YYYY") : "01/01/2000"
      });
      form.resetFields();
    } catch {
      // Form validation error handled by antd
    }
  };

  return (
    <Modal
      title={
        <Space size={8}>
          <UserAddOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>TIẾP ĐÓN & ĐĂNG KÝ BỆNH NHÂN MỚI</span>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Tiếp đón bệnh nhân"
      cancelText="Hủy bỏ"
      confirmLoading={confirmLoading}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ gender: "Nam", department: "Khoa Nội Tổng Hợp" }}>
        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              name="name"
              label="Họ và tên bệnh nhân"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên bệnh nhân" },
                { min: 2, max: 50, message: "Họ tên phải từ 2 đến 50 ký tự" },
                {
                  pattern: /^[a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]+$/u,
                  message: "Họ tên chỉ được chứa chữ cái tiếng Việt hoặc tiếng Anh"
                }
              ]}
            >
              <Input placeholder="Ví dụ: Nguyễn Văn An" size="large" />
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
              label="Số Căn cước công dân (12 số)"
              rules={[
                { required: true, message: "Vui lòng nhập số CCCD" },
                { pattern: /^\d{12}$/, message: "Số CCCD phải gồm đúng 12 chữ số" }
              ]}
            >
              <Input placeholder="Ví dụ: 001203001234" size="large" maxLength={12} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại di động"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^0(3|5|7|8|9)\d{8}$/, message: "Số điện thoại 10 số đầu 03, 05, 07, 08, 09" }
              ]}
            >
              <Input placeholder="Ví dụ: 0987654321" size="large" maxLength={10} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="birth_date"
              label="Ngày tháng năm sinh"
              rules={[{ required: true, message: "Chọn ngày sinh" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="department" label="Khoa khám bệnh đăng ký" rules={[{ required: true }]}>
              <Select size="large">
                {departmentOptions.map((dept) => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="address" label="Địa chỉ thường trú">
          <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" size="large" />
        </Form.Item>

        <Form.Item name="symptoms" label="Lý do đến khám / Triệu chứng ban đầu">
          <Input.TextArea rows={2} placeholder="Mô tả triệu chứng bệnh nhân khai báo" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
