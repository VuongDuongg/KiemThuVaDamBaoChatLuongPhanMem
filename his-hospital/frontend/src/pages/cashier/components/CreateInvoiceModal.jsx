import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Card,
  Typography,
  Alert,
  Divider,
  message,
  Statistic,
  Badge,
} from "antd";
import {
  SearchOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FileAddOutlined,
  UserOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { invoiceService } from "../../../services/invoiceService";

const { Text, Title } = Typography;

export default function CreateInvoiceModal({
  open,
  onCancel,
  onSuccess,
}) {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [errors, setErrors] = useState({});
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [chargeData, setChargeData] = useState(null);

  // Format tiền tệ VND
  const formatVND = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      val || 0
    );

  // Validate format theo Bảng 3.1.2
  const validateFormat = (idVal, nameVal) => {
    const newErrors = {};
    const hasId = idVal && idVal.trim().length > 0;
    const hasName = nameVal && nameVal.trim().length > 0;

    // E1.2 - Mã bệnh nhân
    if (hasId) {
      const trimmedId = idVal.trim();
      if (trimmedId.length > 20 || !/^[a-zA-Z0-9]+$/.test(trimmedId)) {
        newErrors.patient_id =
          "Mã bệnh nhân không được vượt quá 20 ký tự hoặc chứa ký tự đặc biệt.";
      }
    }

    // E1.2 - Họ tên bệnh nhân
    if (hasName) {
      const trimmedName = nameVal.trim();
      const nameRegex =
        /^[a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]+$/u;
      if (trimmedName.length > 50 || !nameRegex.test(trimmedName)) {
        newErrors.patient_name =
          "Họ tên bệnh nhân không hợp lệ (tối đa 50 ký tự, không chứa số/ký tự đặc biệt).";
      }
    }

    return newErrors;
  };

  const handlePatientIdChange = (e) => {
    const val = e.target.value;
    setPatientId(val);
    const errs = validateFormat(val, patientName);
    setErrors(errs);
  };

  const handlePatientNameChange = (e) => {
    const val = e.target.value;
    setPatientName(val);
    const errs = validateFormat(patientId, val);
    setErrors(errs);
  };

  const handleSearch = async () => {
    const hasId = patientId && patientId.trim().length > 0;
    const hasName = patientName && patientName.trim().length > 0;

    // Ngoại lệ [E1.1]: Để trống trường tìm kiếm
    if (!hasId && !hasName) {
      setErrors({
        search: "Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm",
      });
      return;
    }

    // Ngoại lệ [E1.2]: Lỗi định dạng
    const fmtErrors = validateFormat(patientId, patientName);
    if (Object.keys(fmtErrors).length > 0) {
      setErrors(fmtErrors);
      return;
    }

    setErrors({});
    setLoadingSearch(true);
    setChargeData(null);

    try {
      const res = await invoiceService.getPendingCharges({
        patient_id: hasId ? patientId.trim() : undefined,
        patient_name: hasName ? patientName.trim() : undefined,
      });

      if (res && res.success) {
        setChargeData(res.data);
      }
    } catch (err) {
      const backendErr = err.response?.data;
      if (backendErr?.errorCode === "E1.3") {
        // [E1.3]: Không tìm thấy bệnh nhân
        message.error("Không tìm thấy thông tin bệnh nhân trên hệ thống");
        setErrors({
          notFound: "Không tìm thấy thông tin bệnh nhân trên hệ thống",
        });
      } else if (backendErr?.errorCode === "E1.1" || backendErr?.errorCode === "E1.2") {
        setErrors(backendErr.errors || { search: backendErr.message });
      } else {
        message.error(backendErr?.message || "Lỗi khi tìm kiếm bệnh nhân");
      }
    } finally {
      setLoadingSearch(false);
    }
  };

  // Bước 4 & 5: Nhấn nút "Tạo hóa đơn"
  const handleCreateInvoice = async () => {
    if (!chargeData || !chargeData.patient) return;
    const { patient, summary, items } = chargeData;

    setSubmitting(true);
    try {
      const payload = {
        patient_code: patient.patient_code,
        patient_name: patient.name,
        item_type: items.some((i) => i.item_type === "CAN_LAM_SANG")
          ? "CAN_LAM_SANG"
          : "TIEN_KHAM",
        description: `Thu viện phí tổng hợp cho BN ${patient.name} (${items.length} khoản mục)`,
        total_amount: summary.total_amount,
        insurance_discount: summary.insurance_discount,
        insurance_percent: summary.insurance_percent,
        cashier: "Trần Văn Thu Ngân",
        items: items,
      };

      const res = await invoiceService.create(payload);
      if (res && res.success) {
        message.success({
          content: (
            <span>
              Tạo thành công hóa đơn <b>{res.data.invoice_code}</b>! Trạng thái:{" "}
              <Tag color="warning">Chờ thanh toán</Tag>
            </span>
          ),
          duration: 3,
        });

        // Đóng modal lập hóa đơn và chuyển sang giao diện thanh toán (Bước 5)
        onSuccess(res.data);
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi tạo hóa đơn viện phí");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPatientId("");
    setPatientName("");
    setErrors({});
    setChargeData(null);
    onCancel();
  };

  // Cấu hình Data Grid (Bảng chi tiết chi phí)
  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 60,
      align: "center",
      render: (_, __, idx) => idx + 1,
    },
    {
      title: "Tên dịch vụ & Khoản mục",
      dataIndex: "item_name",
      key: "item_name",
      render: (text, r) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          {r.invoice_code && (
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
              Mã HĐ trước: {r.invoice_code}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Phân loại",
      dataIndex: "item_type",
      key: "item_type",
      width: 140,
      render: (type) => {
        if (type === "TIEN_KHAM") return <Tag color="blue">Khám chuyên khoa</Tag>;
        if (type === "CAN_LAM_SANG") return <Tag color="purple">Cận lâm sàng</Tag>;
        if (type === "TIEN_THUOC") return <Tag color="green">Tiền thuốc</Tag>;
        return <Tag>{type}</Tag>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      key: "unit_price",
      width: 130,
      align: "right",
      render: (val) => formatVND(val),
    },
    {
      title: "Thành tiền",
      dataIndex: "total_price",
      key: "total_price",
      width: 140,
      align: "right",
      render: (val) => (
        <span style={{ fontWeight: 700, color: "#1677ff" }}>{formatVND(val)}</span>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 130,
      align: "center",
      render: (_, r) =>
        r.is_paid ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã thanh toán
          </Tag>
        ) : (
          <Tag color="error">Chưa thu</Tag>
        ),
    },
  ];

  // Disable search button if format errors exist (E1.2)
  const isSearchDisabled =
    !!errors.patient_id || !!errors.patient_name || loadingSearch;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={900}
      title={
        <Space size={10}>
          <FileAddOutlined style={{ color: "#1677ff", fontSize: 22 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              LẬP HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-05)
            </div>
            <div style={{ fontSize: 13, color: "#8c8c8c", fontWeight: 400 }}>
              Thu ngân tra cứu bệnh nhân, kiểm tra chi phí chỉ định và tạo hóa đơn
            </div>
          </div>
        </Space>
      }
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Đóng
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<DollarOutlined />}
          loading={submitting}
          disabled={!chargeData || !chargeData.can_create_invoice}
          onClick={handleCreateInvoice}
          style={{
            background:
              chargeData?.can_create_invoice ? "#52c41a" : undefined,
            borderColor:
              chargeData?.can_create_invoice ? "#52c41a" : undefined,
            fontWeight: 600,
          }}
        >
          Tạo hóa đơn
        </Button>,
      ]}
    >
      <Divider style={{ margin: "12px 0 16px 0" }} />

      {/* 3.1.2 BẢNG ĐẶC TẢ CÁC TRƯỜNG DỮ LIỆU ĐẦU VÀO */}
      <Card
        size="small"
        bordered
        style={{
          background: "#fafafa",
          marginBottom: 16,
          borderRadius: 8,
          borderColor: errors.search ? "#ff4d4f" : "#d9d9d9",
        }}
      >
        <Row gutter={[16, 12]} align="middle">
          {/* Field 1: patient_id */}
          <Col xs={24} sm={10}>
            <div>
              <Text strong style={{ fontSize: 13 }}>
                1. Mã bệnh nhân [Search Box / Barcode Scanner]:
              </Text>
              <Input
                placeholder="Nhập mã BN (VD: BN000001)..."
                prefix={<BarcodeOutlined style={{ color: "#1677ff" }} />}
                value={patientId}
                onChange={handlePatientIdChange}
                onPressEnter={handleSearch}
                status={errors.patient_id || errors.search ? "error" : ""}
                style={{
                  marginTop: 4,
                  borderColor:
                    errors.patient_id || errors.search ? "#ff4d4f" : undefined,
                }}
                allowClear
              />
              {errors.patient_id && (
                <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                  {errors.patient_id}
                </div>
              )}
            </div>
          </Col>

          {/* Field 2: patient_name */}
          <Col xs={24} sm={10}>
            <div>
              <Text strong style={{ fontSize: 13 }}>
                2. Họ tên bệnh nhân [Search Box]:
              </Text>
              <Input
                placeholder="Nhập họ tên (VD: Nguyễn Văn An)..."
                prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                value={patientName}
                onChange={handlePatientNameChange}
                onPressEnter={handleSearch}
                status={errors.patient_name || errors.search ? "error" : ""}
                style={{
                  marginTop: 4,
                  borderColor:
                    errors.patient_name || errors.search ? "#ff4d4f" : undefined,
                }}
                allowClear
              />
              {errors.patient_name && (
                <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                  {errors.patient_name}
                </div>
              )}
            </div>
          </Col>

          {/* Search Button */}
          <Col xs={24} sm={4} style={{ display: "flex", alignItems: "flex-end" }}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loadingSearch}
              disabled={isSearchDisabled}
              style={{ width: "100%", marginTop: 22 }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>

        {/* E1.1 Inline error */}
        {errors.search && (
          <div
            style={{
              color: "#ff4d4f",
              fontSize: 12,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            ⚠️ {errors.search}
          </div>
        )}

        {/* E1.3 Inline error */}
        {errors.notFound && (
          <div
            style={{
              color: "#ff4d4f",
              fontSize: 12,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            ⚠️ {errors.notFound}
          </div>
        )}
      </Card>

      {/* THÔNG TIN BỆNH NHÂN ĐƯỢC TÌM THẤY */}
      {chargeData && chargeData.patient && (
        <Card
          size="small"
          style={{
            marginBottom: 16,
            background: "#e6f4ff",
            borderColor: "#91caff",
            borderRadius: 8,
          }}
        >
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Text type="secondary">Mã BN:</Text>{" "}
              <Tag color="blue" style={{ fontWeight: 700, fontSize: 13 }}>
                {chargeData.patient.patient_code}
              </Tag>
            </Col>
            <Col span={8}>
              <Text type="secondary">Họ tên:</Text>{" "}
              <Text strong style={{ fontSize: 14, color: "#0958d9" }}>
                {chargeData.patient.name}
              </Text>
            </Col>
            <Col span={5}>
              <Text type="secondary">Khoa:</Text>{" "}
              <Text strong>{chargeData.patient.department || "Chung"}</Text>
            </Col>
            <Col span={5}>
              <Text type="secondary">BHYT:</Text>{" "}
              {chargeData.patient.insurance_code ? (
                <Tag color="green" icon={<SafetyCertificateOutlined />}>
                  Có BHYT
                </Tag>
              ) : (
                <Tag color="default">Không BHYT</Tag>
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* NGOẠI LỆ E1.4 HOẶC E1.5 NOTIFICATIONS */}
      {chargeData && chargeData.status_message && (
        <Alert
          message={
            chargeData.errorCode === "E1.4"
              ? "Các khoản chi phí này đã được thanh toán đầy đủ"
              : "Bệnh nhân chưa có chỉ định dịch vụ hoặc yêu cầu khám nào cần thanh toán"
          }
          description={
            chargeData.errorCode === "E1.4"
              ? "Tất cả các dịch vụ chỉ định hoặc công khám của bệnh nhân này đã có biên lai thu tiền trước đó. Nút 'Tạo hóa đơn' đã được làm mờ để tránh thu trùng lặp."
              : "Bệnh nhân chưa phát sinh dịch vụ khám bệnh hoặc cận lâm sàng nào cần thu viện phí."
          }
          type={chargeData.errorCode === "E1.4" ? "info" : "warning"}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 3.1.3 OUTPUT 1: DATA GRID (BẢNG CHI TIẾT CHI PHÍ) */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text strong style={{ fontSize: 14 }}>
            📋 Bảng chi tiết chi phí cần thanh toán:
          </Text>
          {chargeData && (
            <Badge
              count={`${chargeData.items?.length || 0} mục`}
              style={{ backgroundColor: "#1677ff" }}
            />
          )}
        </div>

        <Table
          columns={columns}
          dataSource={chargeData ? chargeData.items : []}
          rowKey="item_id"
          pagination={false}
          size="small"
          bordered
          locale={{
            emptyText: (
              <div style={{ padding: "20px 0", color: "#8c8c8c" }}>
                Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tải bảng chi phí
              </div>
            ),
          }}
        />
      </div>

      {/* 3.1.3 OUTPUT 2: SUMMARY BLOCK (KHỐI TỔNG HỢP TIỀN) */}
      {chargeData && chargeData.summary && (
        <Card
          bordered
          style={{
            background: "#f6ffed",
            borderColor: "#b7eb8f",
            borderRadius: 8,
          }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Statistic
                title={
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    [Tổng số tiền]
                  </span>
                }
                value={chargeData.summary.total_amount}
                formatter={(val) => formatVND(val)}
                valueStyle={{ color: "#262626", fontWeight: 700 }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title={
                  <span style={{ fontSize: 13, color: "#595959" }}>
                    [Bảo hiểm y tế chi trả]
                  </span>
                }
                value={chargeData.summary.insurance_percent}
                prefix={<SafetyCertificateOutlined style={{ color: "#52c41a" }} />}
                suffix={`% (-${formatVND(chargeData.summary.insurance_discount)})`}
                valueStyle={{ color: "#389e0d", fontWeight: 700 }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title={
                  <span style={{ fontSize: 13, color: "#cf1322", fontWeight: 600 }}>
                    [Người bệnh thực tế phải đóng]
                  </span>
                }
                value={chargeData.summary.patient_pay}
                formatter={(val) => formatVND(val)}
                valueStyle={{ color: "#cf1322", fontWeight: 800, fontSize: 22 }}
              />
            </Col>
          </Row>
        </Card>
      )}
    </Modal>
  );
}
