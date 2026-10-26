import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Form,
  Typography,
  Space,
  Radio
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  BarcodeOutlined,
  FilterOutlined,
  PlusOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

export const departmentOptions = [
  "Tất cả",
  "Khoa Nội",
  "Khoa Ngoại",
  "Khoa Nhi",
  "Khoa Mắt",
  "Khoa Răng Hàm Mặt",
  "Khoa Tai Mũi Họng"
];

export const statusOptions = [
  "Tất cả",
  "Chờ khám",
  "Đang khám",
  "Chờ kết quả CLS",
  "Đã khám xong",
  "Đã hủy"
];

export const genderOptions = ["Tất cả", "Nam", "Nữ", "Khác"];

export default function PatientSearchFilter({
  onSearch,
  onReset,
  serverErrors = {},
  loading = false,
  onAddNewPatient,
  onPrintList
}) {
  const [form] = Form.useForm();
  const [clientErrors, setClientErrors] = useState({});

  const validateForm = (values) => {
    const errors = {};

    // 1. Validate Họ và tên
    if (values.name && values.name.trim() !== "") {
      const name = values.name.trim();
      if (/\d/.test(name)) {
        errors.name = "Họ tên không được chứa chữ số";
      } else if (
        /[^a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/u.test(
          name
        )
      ) {
        errors.name = "Họ tên không được chứa ký tự đặc biệt";
      } else if (name.length < 2) {
        errors.name = "Họ tên phải có độ dài từ 2 đến 50 ký tự";
      } else if (name.length > 50) {
        errors.name = "Họ tên không được vượt quá 50 ký tự";
      }
    } else if (values.name && values.name.length > 0 && values.name.trim().length === 0) {
      errors.name = "Từ khóa tìm kiếm không hợp lệ";
    }

    // 2. Validate CCCD
    if (values.identity_card_number && values.identity_card_number.trim() !== "") {
      const cccd = values.identity_card_number.trim();
      if (/\D/.test(cccd)) {
        errors.identity_card_number = "Số CCCD chỉ được nhập ký tự số";
      } else if (cccd.length !== 12) {
        errors.identity_card_number = "Số CCCD phải gồm đúng 12 chữ số";
      }
    }

    // 3. Validate Số điện thoại
    if (values.phone && values.phone.trim() !== "") {
      const phone = values.phone.trim();
      if (/\D/.test(phone)) {
        errors.phone = "Số điện thoại chỉ được chứa ký tự số";
      } else if (!phone.startsWith("0")) {
        errors.phone = "Số điện thoại phải bắt đầu bằng chữ số 0";
      } else if (phone.length !== 10) {
        errors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
      } else {
        const validPrefixes = ["03", "05", "07", "08", "09"];
        if (!validPrefixes.includes(phone.substring(0, 2))) {
          errors.phone = "Đầu số điện thoại không hợp lệ (hỗ trợ: 03, 05, 07, 08, 09)";
        }
      }
    }

    // 4. Validate Mã bệnh nhân
    if (values.patient_code && values.patient_code.trim() !== "") {
      const code = values.patient_code.trim().toUpperCase();
      if (!/^BN\d{6}$/.test(code)) {
        errors.patient_code = "Mã bệnh nhân phải có định dạng BNxxxxxx (VD: BN000123)";
      }
    }

    // 5. Validate Khoảng ngày
    const now = dayjs().endOf("day");
    if (values.from_date && values.from_date.isAfter(now)) {
      errors.from_date = "Thời gian tìm kiếm không được vượt quá ngày hiện tại";
    }
    if (values.to_date && values.to_date.isAfter(now)) {
      errors.to_date = "Thời gian tìm kiếm không được vượt quá ngày hiện tại";
    }
    if (values.from_date && values.to_date && values.from_date.isAfter(values.to_date)) {
      errors.date_range = "Từ ngày không được lớn hơn Đến ngày";
    }

    return errors;
  };

  const handleSubmit = () => {
    const rawValues = form.getFieldsValue();
    const errors = validateForm(rawValues);
    setClientErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const params = {
      name: rawValues.name?.trim() || "",
      identity_card_number: rawValues.identity_card_number?.trim() || "",
      phone: rawValues.phone?.trim() || "",
      patient_code: rawValues.patient_code?.trim() || "",
      from_date: rawValues.from_date ? rawValues.from_date.format("DD/MM/YYYY") : "",
      to_date: rawValues.to_date ? rawValues.to_date.format("DD/MM/YYYY") : "",
      department: rawValues.department || "Tất cả",
      status: rawValues.status || "Tất cả",
      gender: rawValues.gender || "Tất cả"
    };

    onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
    setClientErrors({});
    onReset();
  };

  const mergedErrors = { ...clientErrors, ...serverErrors };

  return (
    <Card
      className="patient-search-card"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size={8}>
            <FilterOutlined style={{ color: "#1677ff", fontSize: 20 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1f2937" }}>
              BỘ LỌC TÌM KIẾM HỒ SƠ BỆNH NHÂN
            </span>
          </Space>
          <Space>
            {onAddNewPatient && (
              <Button
                type="primary"
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
                icon={<PlusOutlined />}
                onClick={onAddNewPatient}
              >
                Tiếp đón bệnh nhân mới
              </Button>
            )}
            {onPrintList && (
              <Button icon={<PrinterOutlined />} onClick={onPrintList}>
                In danh sách
              </Button>
            )}
          </Space>
        </div>
      }
      bordered={false}
      style={{
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
        borderRadius: 10,
        marginBottom: 20
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ department: "Tất cả", status: "Tất cả", gender: "Tất cả" }}
        onFinish={handleSubmit}
      >
        <Row gutter={[20, 14]}>
          {/* Hàng 1: Tiêu chí định danh chính */}
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item
              name="name"
              label={<Text strong style={{ fontSize: 14 }}>Họ và tên bệnh nhân</Text>}
              validateStatus={mergedErrors.name ? "error" : ""}
              help={mergedErrors.name}
            >
              <Input
                size="large"
                placeholder="Nhập họ và tên (Ví dụ: Nguyễn Văn An, 2-50 ký tự)"
                prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                maxLength={50}
                allowClear
                onChange={() => setClientErrors((prev) => ({ ...prev, name: undefined }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item
              name="identity_card_number"
              label={<Text strong style={{ fontSize: 14 }}>Số Căn cước công dân (CCCD)</Text>}
              validateStatus={mergedErrors.identity_card_number ? "error" : ""}
              help={mergedErrors.identity_card_number}
            >
              <Input
                size="large"
                placeholder="Nhập đủ 12 chữ số CCCD"
                prefix={<IdcardOutlined style={{ color: "#9ca3af" }} />}
                maxLength={12}
                allowClear
                onChange={() =>
                  setClientErrors((prev) => ({ ...prev, identity_card_number: undefined }))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item
              name="phone"
              label={<Text strong style={{ fontSize: 14 }}>Số điện thoại liên hệ</Text>}
              validateStatus={mergedErrors.phone ? "error" : ""}
              help={mergedErrors.phone}
            >
              <Input
                size="large"
                placeholder="10 số (03, 05, 07, 08, 09)"
                prefix={<PhoneOutlined style={{ color: "#9ca3af" }} />}
                maxLength={10}
                allowClear
                onChange={() => setClientErrors((prev) => ({ ...prev, phone: undefined }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item
              name="patient_code"
              label={<Text strong style={{ fontSize: 14 }}>Mã bệnh nhân (Mã BN)</Text>}
              validateStatus={mergedErrors.patient_code ? "error" : ""}
              help={mergedErrors.patient_code}
            >
              <Input
                size="large"
                placeholder="BNxxxxxx (VD: BN000001)"
                prefix={<BarcodeOutlined style={{ color: "#9ca3af" }} />}
                maxLength={8}
                allowClear
                onChange={() =>
                  setClientErrors((prev) => ({ ...prev, patient_code: undefined }))
                }
              />
            </Form.Item>
          </Col>

          {/* Hàng 2: Bộ lọc chuyên khoa, thời gian, trạng thái */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="department"
              label={<Text strong style={{ fontSize: 14 }}>Chuyên khoa khám</Text>}
            >
              <Select size="large" placeholder="Chọn chuyên khoa">
                {departmentOptions.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="status"
              label={<Text strong style={{ fontSize: 14 }}>Trạng thái tiếp nhận</Text>}
            >
              <Select size="large" placeholder="Chọn trạng thái">
                {statusOptions.map((st) => (
                  <Option key={st} value={st}>
                    {st}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item
              name="gender"
              label={<Text strong style={{ fontSize: 14 }}>Giới tính</Text>}
            >
              <Select size="large" placeholder="Giới tính">
                {genderOptions.map((g) => (
                  <Option key={g} value={g}>
                    {g}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item
              name="from_date"
              label={<Text strong style={{ fontSize: 14 }}>Tiếp đón Từ ngày</Text>}
              validateStatus={mergedErrors.from_date || mergedErrors.date_range ? "error" : ""}
              help={mergedErrors.from_date || mergedErrors.date_range}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                onChange={() =>
                  setClientErrors((prev) => ({ ...prev, from_date: undefined, date_range: undefined }))
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item
              name="to_date"
              label={<Text strong style={{ fontSize: 14 }}>Tiếp đón Đến ngày</Text>}
              validateStatus={mergedErrors.to_date || mergedErrors.date_range ? "error" : ""}
              help={mergedErrors.to_date}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                onChange={() =>
                  setClientErrors((prev) => ({ ...prev, to_date: undefined, date_range: undefined }))
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Thanh công cụ và hành động */}
        <Row justify="space-between" align="middle" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
          <Space>
            <Text type="secondary" style={{ fontSize: 13 }}>
              * Mẹo: Để trống toàn bộ và bấm "Tìm kiếm" để nạp danh sách bệnh nhân tiếp đón hôm nay.
            </Text>
          </Space>
          <Space size="middle">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              size="large"
              style={{ minWidth: 130 }}
            >
              Đặt lại bộ lọc
            </Button>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSubmit}
              loading={loading}
              size="large"
              style={{ minWidth: 150, fontWeight: 600 }}
            >
              Tìm kiếm (Search)
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );
}
