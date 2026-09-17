import React, { useState, useEffect } from "react";
import { Card, Space, Button, message } from "antd";
import { UserAddOutlined, ReloadOutlined } from "@ant-design/icons";
import { patientService } from "../../services/patientService";
import PatientStats from "./components/PatientStats";
import PatientSearchFilter from "./components/PatientSearchFilter";
import PatientTable from "./components/PatientTable";
import AddPatientModal from "./components/AddPatientModal";
import EditPatientModal from "./components/EditPatientModal";
import PatientDetailModal from "./components/PatientDetailModal";

export default function ReceptionDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modals state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch patients from Backend
  const loadPatients = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await patientService.search(filters);
      if (response && response.data) {
        setPatients(response.data);
      }
    } catch {
      message.error("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = (filterValues) => {
    loadPatients(filterValues);
  };

  const handleReset = () => {
    loadPatients({});
    message.info("Đã đặt lại bộ lọc tìm kiếm!");
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = async (patientData) => {
    setSubmitting(true);
    try {
      const response = await patientService.create(patientData);
      if (response && response.success) {
        message.success(response.message || "Tiếp đón bệnh nhân thành công!");
        setIsAddModalOpen(false);
        loadPatients();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi đăng ký bệnh nhân mới");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (record) => {
    setEditingPatient(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (patientData) => {
    setSubmitting(true);
    try {
      const response = await patientService.update(editingPatient.id || editingPatient.patient_code, patientData);
      if (response && response.success) {
        message.success(response.message || "Cập nhật hồ sơ bệnh nhân thành công!");
        setIsEditModalOpen(false);
        setEditingPatient(null);
        loadPatients();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật bệnh nhân");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async (record) => {
    try {
      const response = await patientService.delete(record.id || record.patient_code);
      if (response && response.success) {
        message.success(response.message || "Đã xóa bệnh nhân khỏi danh sách");
        loadPatients();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa hồ sơ");
    }
  };

  const handleViewDetail = (record) => {
    setSelectedPatient(record);
    setIsDetailModalOpen(true);
  };

  const handlePrint = (record) => {
    message.success(`Đang gửi lệnh in phiếu khám cho bệnh nhân ${record.name} (${record.patient_code})`);
  };

  return (
    <div>
      {/* STATISTICAL SUMMARY */}
      <PatientStats patients={patients} />

      {/* SEARCH AND FILTER */}
      <div style={{ marginBottom: 16 }}>
        <PatientSearchFilter onSearch={handleSearch} onReset={handleReset} />
      </div>

      {/* PATIENT LIST TABLE CARD */}
      <Card
        bordered={false}
        style={{
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#003a8c" }}>
              DANH SÁCH BỆNH NHÂN TIẾP ĐÓN ({patients.length} kết quả từ Backend Seed)
            </span>
            <Space size={10}>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                style={{ background: "#52c41a", borderColor: "#52c41a", fontWeight: 600 }}
                onClick={handleOpenAddModal}
              >
                Tiếp đón bệnh nhân mới
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => loadPatients()}>
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
          onPrint={handlePrint}
        />
      </Card>

      {/* MODALS */}
      <AddPatientModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        confirmLoading={submitting}
      />

      <EditPatientModal
        open={isEditModalOpen}
        patient={editingPatient}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={handleEditSubmit}
        confirmLoading={submitting}
      />

      <PatientDetailModal
        open={isDetailModalOpen}
        patient={selectedPatient}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedPatient(null);
        }}
      />
    </div>
  );
}
