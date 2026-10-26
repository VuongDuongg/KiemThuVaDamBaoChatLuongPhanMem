import React from "react";
import {
  Table,
  Tag,
  Empty,
  Button,
  Card,
  Typography,
  Space,
  Tooltip,
  Radio,
  Popconfirm
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const { Text } = Typography;

const statusColorMap = {
  "Chờ khám": "gold",
  "Đang khám": "blue",
  "Chờ kết quả CLS": "purple",
  "Đã khám xong": "green",
  "Đã hủy": "red"
};

export default function PatientTable({
  data = [],
  loading = false,
  onReset,
  onViewDetail,
  onEditPatient,
  onDeletePatient,
  activeStatusTab = "Tất cả",
  onStatusTabChange
}) {
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 75,
      align: "center",
      render: (_, __, index) => <span style={{ fontWeight: 600 }}>{index + 1}</span>
    },
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      width: 125,
      align: "center",
      render: (code) => (
        <Tag color="cyan" style={{ fontWeight: 700, fontSize: 13, padding: "3px 10px", borderRadius: 4 }}>
          {code}
        </Tag>
      )
    },
    {
      title: "Họ và tên bệnh nhân",
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name) => (
        <Space size={8}>
          <UserOutlined style={{ color: "#1677ff", fontSize: 15 }} />
          <Text strong style={{ color: "#2563eb", fontSize: 14 }}>
            {name}
          </Text>
        </Space>
      )
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 110,
      align: "center",
      render: (gender) => {
        let color = "default";
        if (gender === "Nam") color = "geekblue";
        if (gender === "Nữ") color = "magenta";
        return (
          <Tag color={color} style={{ fontWeight: 600, padding: "2px 10px", fontSize: 12 }}>
            {gender}
          </Tag>
        );
      }
    },
    {
      title: "Ngày sinh",
      dataIndex: "birth_date",
      key: "birth_date",
      width: 130,
      align: "center",
      render: (date) => <span style={{ fontSize: 13 }}>{date}</span>
    },
    {
      title: "Số CCCD",
      dataIndex: "identity_card_number",
      key: "identity_card_number",
      width: 165,
      align: "center",
      render: (cccd) => (
        <Space size={6}>
          <IdcardOutlined style={{ color: "#9ca3af" }} />
          <span style={{ fontFamily: "Consolas, monospace", fontSize: 13.5, letterSpacing: "0.5px" }}>{cccd}</span>
        </Space>
      )
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "center",
      render: (phone) => (
        <Space size={6}>
          <PhoneOutlined style={{ color: "#10b981" }} />
          <span style={{ fontFamily: "Consolas, monospace", fontSize: 13.5, letterSpacing: "0.5px" }}>{phone}</span>
        </Space>
      )
    },
    {
      title: "Khoa tiếp nhận",
      dataIndex: "department",
      key: "department",
      width: 180,
      render: (dept) => <span style={{ fontWeight: 600, color: "#374151" }}>{dept}</span>
    },
    {
      title: "Ngày tiếp đón",
      dataIndex: "reception_date",
      key: "reception_date",
      width: 140,
      align: "center",
      render: (date) => (
        <Space size={6}>
          <CalendarOutlined style={{ color: "#9ca3af" }} />
          <span>{date}</span>
        </Space>
      )
    },
    {
      title: "Trạng thái khám",
      dataIndex: "status",
      key: "status",
      width: 175,
      align: "center",
      render: (status) => (
        <Tag
          className="status-badge"
          color={statusColorMap[status] || "default"}
          style={{
            display: "inline-block",
            fontSize: 13,
            fontWeight: 600,
            padding: "4px 14px",
            borderRadius: 20,
            whiteSpace: "nowrap",
            minWidth: 100,
            textAlign: "center"
          }}
        >
          {status}
        </Tag>
      )
    },
    {
      title: "Thao tác",
      key: "action",
      width: 160,
      align: "center",
      render: (_, record) => (
        <Space size={6}>
          <Tooltip title="Xem chi tiết bệnh án">
            <Button
              type="text"
              size="middle"
              icon={<EyeOutlined style={{ color: "#1677ff", fontSize: 17 }} />}
              onClick={() => onViewDetail && onViewDetail(record)}
            />
          </Tooltip>

          <Tooltip title="Sửa thông tin bệnh nhân">
            <Button
              type="text"
              size="middle"
              icon={<EditOutlined style={{ color: "#fa8c16", fontSize: 17 }} />}
              onClick={() => onEditPatient && onEditPatient(record)}
            />
          </Tooltip>

          <Tooltip title="In phiếu tiếp đón">
            <Button
              type="text"
              size="middle"
              icon={<FileTextOutlined style={{ color: "#52c41a", fontSize: 17 }} />}
              onClick={() => alert(`In phiếu tiếp đón cho: ${record.name} (${record.patient_code})`)}
            />
          </Tooltip>

          <Tooltip title="Xóa hồ sơ">
            <Popconfirm
              title="Xác nhận xóa bệnh nhân"
              description={`Bạn có chắc chắn muốn xóa hồ sơ ${record.name} (${record.patient_code})?`}
              onConfirm={() => onDeletePatient && onDeletePatient(record)}
              okText="Đồng ý xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                size="middle"
                danger
                icon={<DeleteOutlined style={{ fontSize: 17 }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card
      className="patient-table-card"
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Space size={12}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              DANH SÁCH BỆNH NHÂN TIẾP NHẬN
            </span>
            <Tag color="blue" style={{ fontSize: 13, padding: "3px 12px", borderRadius: 12, fontWeight: 600 }}>
              Tổng số: {data.length} ca bệnh
            </Tag>
          </Space>

          {/* Tab nhanh lọc theo trạng thái */}
          {onStatusTabChange && (
            <Radio.Group
              value={activeStatusTab}
              onChange={(e) => onStatusTabChange(e.target.value)}
              buttonStyle="solid"
              size="middle"
            >
              <Radio.Button value="Tất cả">Tất cả ({data.length})</Radio.Button>
              <Radio.Button value="Chờ khám">Chờ khám</Radio.Button>
              <Radio.Button value="Đang khám">Đang khám</Radio.Button>
              <Radio.Button value="Chờ kết quả CLS">Chờ kết quả CLS</Radio.Button>
              <Radio.Button value="Đã khám xong">Đã khám xong</Radio.Button>
            </Radio.Group>
          )}
        </div>
      }
      bordered={false}
      style={{
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        borderRadius: 10
      }}
    >
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1600 }}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          pageSizeOptions: ["6", "10", "20"],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]}-${range[1]} trên tổng số ${total} bệnh nhân`
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ margin: "16px 0" }}>
                  <Text style={{ fontSize: 15, color: "#6b7280" }}>
                    Không tìm thấy bệnh nhân nào phù hợp với điều kiện tìm kiếm
                  </Text>
                </div>
              }
            >
              {onReset && (
                <Button type="primary" icon={<ReloadOutlined />} onClick={onReset}>
                  Đặt lại bộ lọc
                </Button>
              )}
            </Empty>
          )
        }}
      />
    </Card>
  );
}
