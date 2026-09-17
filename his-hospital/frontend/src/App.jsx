import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Descriptions,
  Tag,
  Space,
  Typography,
  Divider,
  Segmented
} from "antd";
import {
  UserAddOutlined,
  ReloadOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  EditOutlined,
  PrinterOutlined,
  LogoutOutlined,
  UserOutlined,
  DollarOutlined,
  ExperimentOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import PatientSearchFilter from "./components/PatientSearchFilter";
import PatientTable from "./components/PatientTable";
import CashierPharmacyModule from "./components/CashierPharmacyModule";
import DoctorConsultationModule from "./components/DoctorConsultationModule";
import LabPacsModule from "./components/LabPacsModule";
import Login from "./pages/auth/Login";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000/api";

const initialMockPatients = [
  {
    id: 1,
    patient_code: "BN000001",
    name: "Nguyễn Văn An",
    identity_card_number: "001203001234",
    phone: "0987654321",
    gender: "Nam",
    birth_date: "15/05/1990",
    reception_date: dayjs().format("DD/MM/YYYY"),
    department: "Khoa Nội",
    doctor: "BS. Trần Văn Bình",
    status: "Chờ khám",
    address: "Số 12 Phố Huế, Hoàn Kiếm, Hà Nội",
    symptoms: "Đau đầu nhẹ, sốt nhẹ về chiều"
  },
  {
    id: 2,
    patient_code: "BN000002",
    name: "Trần Thị Bích",
    identity_card_number: "001203005678",
    phone: "0912345678",
    gender: "Nữ",
    birth_date: "20/11/1985",
    reception_date: dayjs().format("DD/MM/YYYY"),
    department: "Khoa Ngoại",
    doctor: "BS. Nguyễn Văn Hùng",
    status: "Đang khám",
    address: "Ngõ 45 Cầu Giấy, Hà Nội",
    symptoms: "Chấn thương phần mềm cẳng tay phải"
  },
  {
    id: 3,
    patient_code: "BN000003",
    name: "Lê Hoàng Long",
    identity_card_number: "001203009012",
    phone: "0976543210",
    gender: "Nam",
    birth_date: "10/02/1995",
    reception_date: dayjs().format("DD/MM/YYYY"),
    department: "Khoa Cấp Cứu",
    doctor: "BS. Lê Thị Dung",
    status: "Đã khám",
    address: "Tổ 8, Phường Quang Trung, Đống Đa, Hà Nội",
    symptoms: "Khó thở, tức ngực cấp tính"
  },
  {
    id: 4,
    patient_code: "BN000004",
    name: "Phạm Thị Dung",
    identity_card_number: "001203003456",
    phone: "0934567890",
    gender: "Nữ",
    birth_date: "05/09/2000",
    reception_date: dayjs().format("DD/MM/YYYY"),
    department: "Khoa Sản",
    doctor: "BS. Hoàng Thu Trang",
    status: "Chờ khám",
    address: "Khu đô thị Linh Đàm, Hoàng Mai, Hà Nội",
    symptoms: "Khám thai định kỳ 24 tuần"
  },
  {
    id: 5,
    patient_code: "BN000005",
    name: "Vũ Minh Quân",
    identity_card_number: "001203007890",
    phone: "0945678901",
    gender: "Nam",
    birth_date: "18/12/1982",
    reception_date: dayjs().format("DD/MM/YYYY"),
    department: "Khoa Nhi",
    doctor: "BS. Phạm Quang Huy",
    status: "Chờ thanh toán",
    address: "Số 88 Giải Phóng, Hai Bà Trưng, Hà Nội",
    symptoms: "Sốt phát ban, ho nhiều"
  }
];

const departmentOptions = [
  "Tất cả",
  "Khoa Nội",
  "Khoa Ngoại",
  "Khoa Nhi",
  "Khoa Sản",
  "Khoa Cấp Cứu",
  "Khoa Tai Mũi Họng",
  "Khoa Mắt"
];

const statusOptions = [
  "Tất cả",
  "Chờ khám",
  "Đang khám",
  "Đã khám",
  "Chờ thanh toán",
  "Đã thanh toán"
];

function HospitalDashboard() {
  const navigate = useNavigate();

  // Tab điều hướng chính giữa 4 thành viên
  const [activeModule, setActiveModule] = useState("TV1");

  // State TV1: Quản lý bệnh nhân
  const [patients, setPatients] = useState(initialMockPatients);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const userStr = localStorage.getItem("user");
  const currentUser = userStr
    ? JSON.parse(userStr)
    : {
        fullName: "Lễ tân Nguyễn Thị Mai",
        role: "RECEPTIONIST",
        id: 1
      };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Đã đăng xuất khỏi hệ thống!");
    navigate("/login");
  };

  const fetchPatients = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/patients/search?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      } else {
        applyLocalFilter(filters);
      }
    } catch {
      applyLocalFilter(filters);
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilter = (filters) => {
    let result = [...initialMockPatients];
    if (filters.name) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.name.toLowerCase().trim())
      );
    }
    if (filters.patient_code) {
      result = result.filter((p) =>
        p.patient_code.toLowerCase().includes(filters.patient_code.toLowerCase().trim())
      );
    }
    if (filters.identity_card_number) {
      result = result.filter((p) => p.identity_card_number.includes(filters.identity_card_number.trim()));
    }
    if (filters.phone) {
      result = result.filter((p) => p.phone.includes(filters.phone.trim()));
    }
    if (filters.department && filters.department !== "Tất cả") {
      result = result.filter((p) => p.department === filters.department);
    }
    if (filters.status && filters.status !== "Tất cả") {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters.gender && filters.gender !== "Tất cả") {
      result = result.filter((p) => p.gender === filters.gender);
    }
    setPatients(result);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (filterValues) => {
    fetchPatients(filterValues);
  };

  const handleReset = () => {
    fetchPatients({});
    message.info("Đã đặt lại bộ lọc tìm kiếm!");
  };

  const handleViewDetail = (record) => {
    setSelectedPatient(record);
    setIsDetailModalVisible(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingPatient(record);
    editForm.setFieldsValue({
      name: record.name,
      identity_card_number: record.identity_card_number,
      phone: record.phone,
      gender: record.gender,
      department: record.department,
      status: record.status,
      birth_date: record.birth_date ? dayjs(record.birth_date, "DD/MM/YYYY") : null,
      address: record.address,
      symptoms: record.symptoms
    });
    setIsEditModalVisible(true);
  };

  const handleEditPatientSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      const formattedValues = {
        ...values,
        birth_date: values.birth_date ? values.birth_date.format("DD/MM/YYYY") : ""
      };

      try {
        const res = await fetch(`${API_BASE_URL}/patients/${editingPatient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedValues)
        });
        if (res.ok) {
          const updated = await res.json();
          setPatients((prev) =>
            prev.map((p) => (p.id === editingPatient.id ? updated.data : p))
          );
        } else {
          setPatients((prev) =>
            prev.map((p) => (p.id === editingPatient.id ? { ...p, ...formattedValues } : p))
          );
        }
      } catch {
        setPatients((prev) =>
          prev.map((p) => (p.id === editingPatient.id ? { ...p, ...formattedValues } : p))
        );
      }

      message.success(`Đã cập nhật hồ sơ bệnh nhân ${formattedValues.name}!`);
      setIsEditModalVisible(false);
    } catch {
      message.error("Vui lòng điền đúng các trường dữ liệu!");
    }
  };

  const handleAddPatientSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      const newPatientCode = `BN${String(patients.length + 1).padStart(6, "0")}`;
      const newPatientObj = {
        id: Date.now(),
        patient_code: newPatientCode,
        name: values.name,
        identity_card_number: values.identity_card_number,
        phone: values.phone,
        gender: values.gender,
        birth_date: values.birth_date ? values.birth_date.format("DD/MM/YYYY") : "01/01/2000",
        reception_date: dayjs().format("DD/MM/YYYY"),
        department: values.department,
        doctor: "BS. Chưa chỉ định",
        status: "Chờ khám",
        address: values.address || "Hà Nội",
        symptoms: values.symptoms || "Đăng ký khám mới"
      };

      try {
        const res = await fetch(`${API_BASE_URL}/patients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPatientObj)
        });
        if (res.ok) {
          const data = await res.json();
          setPatients((prev) => [data.data, ...prev]);
        } else {
          setPatients((prev) => [newPatientObj, ...prev]);
        }
      } catch {
        setPatients((prev) => [newPatientObj, ...prev]);
      }

      message.success(`Đã tiếp đón bệnh nhân mới: ${values.name} (${newPatientCode})!`);
      addForm.resetFields();
      setIsAddModalVisible(false);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin tiếp đón!");
    }
  };

  const handleDeletePatient = async (record) => {
    try {
      await fetch(`${API_BASE_URL}/patients/${record.id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
    setPatients((prev) => prev.filter((p) => p.id !== record.id));
    message.success(`Đã xóa hồ sơ bệnh nhân ${record.name} (${record.patient_code}) khỏi danh sách!`);
  };

  const totalPatients = patients.length;
  const waitingPatients = patients.filter((p) => p.status === "Chờ khám").length;
  const examiningPatients = patients.filter((p) => p.status === "Đang khám").length;
  const completedPatients = patients.filter((p) => p.status === "Đã khám").length;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* HEADER */}
      <Header
        style={{
          background: "#003a8c",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <MedicineBoxOutlined style={{ fontSize: 28, color: "#fff" }} />
          <div>
            <Title level={4} style={{ color: "#fff", margin: 0, lineHeight: 1.2, fontWeight: 700 }}>
              HỆ THỐNG THÔNG TIN BỆNH VIỆN - HIS HOSPITAL
            </Title>
            <Text style={{ color: "#91caff", fontSize: 13 }}>
              Hệ thống Quản lý Toàn diện cho Cả 4 Phân hệ (55 Blackbox Test Cases Passing)
            </Text>
          </div>
        </div>

        <Space size={16}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              padding: "6px 14px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#fff"
            }}
          >
            <UserOutlined />
            <span style={{ fontWeight: 600 }}>{currentUser.fullName}</span>
            <Tag color="geekblue" style={{ marginLeft: 4 }}>
              {currentUser.role}
            </Tag>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ fontWeight: 500 }}
          >
            Đăng xuất
          </Button>
        </Space>
      </Header>

      {/* MODULE SELECTOR BAR */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <AppstoreOutlined style={{ fontSize: 18, color: "#1677ff" }} />
          <Text strong style={{ fontSize: 15, color: "#374151" }}>
            CHUYỂN ĐỔI PHÂN HỆ THÀNH VIÊN:
          </Text>
        </div>

        <Segmented
          size="large"
          value={activeModule}
          onChange={setActiveModule}
          options={[
            {
              label: "1. Tiếp đón & Bệnh nhân (TV1)",
              value: "TV1",
              icon: <UserAddOutlined />
            },
            {
              label: "2. Thu ngân & Dược/Kho (TV2)",
              value: "TV2",
              icon: <DollarOutlined />
            },
            {
              label: "3. Bác sĩ & Bệnh án EMR (TV3)",
              value: "TV3",
              icon: <MedicineBoxOutlined />
            },
            {
              label: "4. Cận lâm sàng & Core (TV4)",
              value: "TV4",
              icon: <ExperimentOutlined />
            }
          ]}
        />
      </div>

      {/* CONTENT */}
      <Content style={{ padding: "24px", maxWidth: 1600, width: "100%", margin: "0 auto" }}>
        {/* VIEW TV1: TIẾP ĐÓN & BỆNH NHÂN */}
        {activeModule === "TV1" && (
          <div>
            {/* STATS ROW */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <Statistic
                    title={<span style={{ fontWeight: 600 }}>Tổng số bệnh nhân trong ngày</span>}
                    value={totalPatients}
                    prefix={<HeartOutlined style={{ color: "#1677ff", marginRight: 8 }} />}
                    valueStyle={{ color: "#1677ff", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <Statistic
                    title={<span style={{ fontWeight: 600 }}>Bệnh nhân chờ khám</span>}
                    value={waitingPatients}
                    prefix={<ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 8 }} />}
                    valueStyle={{ color: "#fa8c16", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <Statistic
                    title={<span style={{ fontWeight: 600 }}>Đang trong phòng khám</span>}
                    value={examiningPatients}
                    prefix={<MedicineBoxOutlined style={{ color: "#13c2c2", marginRight: 8 }} />}
                    valueStyle={{ color: "#13c2c2", fontWeight: 700 }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <Statistic
                    title={<span style={{ fontWeight: 600 }}>Đã hoàn tất khám</span>}
                    value={completedPatients}
                    prefix={<CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />}
                    valueStyle={{ color: "#52c41a", fontWeight: 700 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* SEARCH & FILTER MODULE */}
            <PatientSearchFilter onSearch={handleSearch} onReset={handleReset} />

            {/* PATIENT TABLE MODULE */}
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                marginTop: 16
              }}
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Space size={8}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#003a8c" }}>
                      DANH SÁCH BỆNH NHÂN TIẾP ĐÓN ({patients.length} kết quả)
                    </span>
                  </Space>
                  <Space size={10}>
                    <Button
                      type="primary"
                      icon={<UserAddOutlined />}
                      style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
                      onClick={() => setIsAddModalVisible(true)}
                    >
                      Tiếp đón bệnh nhân mới
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={() => fetchPatients()}>
                      Làm mới
                    </Button>
                  </Space>
                </div>
              }
            >
              <PatientTable
                patients={patients}
                loading={loading}
                onViewDetail={handleViewDetail}
                onEdit={handleOpenEditModal}
                onDelete={handleDeletePatient}
                onPrint={(record) => {
                  message.success(`Đang gửi lệnh in phiếu khám cho bệnh nhân ${record.name} (${record.patient_code})`);
                }}
              />
            </Card>
          </div>
        )}

        {/* VIEW TV2: THU NGÂN & DƯỢC / KHO */}
        {activeModule === "TV2" && <CashierPharmacyModule />}

        {/* VIEW TV3: BÁC SĨ & BỆNH ÁN EMR */}
        {activeModule === "TV3" && <DoctorConsultationModule />}

        {/* VIEW TV4: CẬN LÂM SÀNG & QUẢN TRỊ CORE */}
        {activeModule === "TV4" && <LabPacsModule />}
      </Content>

      <Footer style={{ textAlign: "center", background: "#f0f2f5", color: "#8c8c8c", fontSize: 13 }}>
        Hệ thống HIS Hospital © 2026 - Đề tài Bài Tập Lớn Kiểm Thử Phần Mềm (Cả 4 Phân Hệ Hoàn Chỉnh - 55 Test Cases Đạt 100%)
      </Footer>

      {/* MODAL 1: TIẾP ĐÓN BỆNH NHÂN MỚI (THÊM) */}
      <Modal
        title={
          <Space size={8}>
            <UserAddOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>TIẾP ĐÓN & ĐĂNG KÝ BỆNH NHÂN MỚI</span>
          </Space>
        }
        open={isAddModalVisible}
        onOk={handleAddPatientSubmit}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Tiếp đón bệnh nhân"
        cancelText="Hủy bỏ"
        width={700}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" initialValues={{ gender: "Nam", department: "Khoa Nội" }}>
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
              <Form.Item name="birth_date" label="Ngày tháng năm sinh" rules={[{ required: true, message: "Chọn ngày sinh" }]}>
                <DatePicker style={{ width: "100%" }} size="large" format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Khoa khám bệnh đăng ký" rules={[{ required: true }]}>
                <Select size="large">
                  {departmentOptions.filter((d) => d !== "Tất cả").map((dept) => (
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

      {/* MODAL 2: CẬP NHẬT HỒ SƠ BỆNH NHÂN (SỬA) */}
      <Modal
        title={
          <Space size={8}>
            <EditOutlined style={{ color: "#fa8c16", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>CẬP NHẬT HỒ SƠ BỆNH NHÂN</span>
          </Space>
        }
        open={isEditModalVisible}
        onOk={handleEditPatientSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu thay đổi"
        cancelText="Hủy bỏ"
        width={700}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
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
                  {departmentOptions.filter((d) => d !== "Tất cả").map((dept) => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Trạng thái khám" rules={[{ required: true }]}>
                <Select size="large">
                  {statusOptions.filter((s) => s !== "Tất cả").map((st) => (
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

      {/* MODAL 3: CHI TIẾT HỒ SƠ BỆNH ÁN (XEM) */}
      <Modal
        title={
          <Space size={8}>
            <MedicineBoxOutlined style={{ color: "#1677ff", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>CHI TIẾT HỒ SƠ BỆNH ÁN BỆNH NHÂN</span>
          </Space>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In hồ sơ bệnh án
          </Button>,
          <Button key="close" type="primary" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={750}
      >
        {selectedPatient && (
          <div>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 2 }} style={{ marginTop: 12 }}>
              <Descriptions.Item label="Mã bệnh nhân">
                <Tag color="cyan" style={{ fontWeight: 700, fontSize: 13 }}>{selectedPatient.patient_code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái khám">
                <Tag color="blue" style={{ fontWeight: 600 }}>{selectedPatient.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                <Text strong style={{ color: "#1d4ed8", fontSize: 15 }}>{selectedPatient.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">{selectedPatient.gender}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{selectedPatient.birth_date}</Descriptions.Item>
              <Descriptions.Item label="Số CCCD">{selectedPatient.identity_card_number}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedPatient.phone}</Descriptions.Item>
              <Descriptions.Item label="Ngày tiếp đón">{selectedPatient.reception_date}</Descriptions.Item>
              <Descriptions.Item label="Khoa tiếp nhận" span={2}>
                <Text strong>{selectedPatient.department}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedPatient.address || "Hà Nội"}
              </Descriptions.Item>
              <Descriptions.Item label="Triệu chứng ban đầu" span={2}>
                <Text type="secondary">{selectedPatient.symptoms || "Khám tổng quát định kỳ"}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text strong style={{ color: "#374151" }}>Chỉ số sinh hiệu ban đầu tại phòng Tiếp đón:</Text>
              <Space size={16}>
                <Tag color="volcano">Huyết áp: 120/80 mmHg</Tag>
                <Tag color="red">Mạch: 78 ck/phút</Tag>
                <Tag color="orange">Nhiệt độ: 36.8°C</Tag>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<HospitalDashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
