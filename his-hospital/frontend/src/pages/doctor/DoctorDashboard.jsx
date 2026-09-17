import React, { useState, useEffect } from "react";
import { Row, Col, Card, Tabs, message } from "antd";
import { MedicineBoxOutlined, HistoryOutlined } from "@ant-design/icons";
import { patientService } from "../../services/patientService";
import { consultationService } from "../../services/consultationService";
import { medicineService } from "../../services/medicineService";
import { labService } from "../../services/labService";
import ExaminationQueue from "./components/ExaminationQueue";
import ClinicalExamination from "./components/ClinicalExamination";
import PrescriptionForm from "./components/PrescriptionForm";
import LabOrderModal from "./components/LabOrderModal";
import ConsultationHistory from "./components/ConsultationHistory";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [labServices, setLabServices] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [submittingExam, setSubmittingExam] = useState(false);
  const [submittingPrescribe, setSubmittingPrescribe] = useState(false);
  const [submittingLab, setSubmittingLab] = useState(false);

  // Modals
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [isLabOrderOpen, setIsLabOrderOpen] = useState(false);

  const loadData = async () => {
    setLoadingPatients(true);
    setLoadingConsultations(true);
    try {
      const [ptsRes, conRes, medRes, labRes] = await Promise.all([
        patientService.getAll(),
        consultationService.getAll(),
        medicineService.getAll(),
        labService.getServices(),
      ]);

      if (ptsRes?.data) setPatients(ptsRes.data);
      if (conRes?.data) setConsultations(conRes.data);
      if (medRes?.data) setMedicines(medRes.data);
      if (labRes?.data) setLabServices(labRes.data);

      // Auto select first waiting patient if none selected
      if (!selectedPatient && ptsRes?.data?.length > 0) {
        setSelectedPatient(ptsRes.data[0]);
      }
    } catch {
      message.error("Lỗi khi tải dữ liệu phân hệ Bác sĩ");
    } finally {
      setLoadingPatients(false);
      setLoadingConsultations(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveExamination = async (examData) => {
    setSubmittingExam(true);
    try {
      const response = await consultationService.create(examData);
      if (response && response.success) {
        message.success("Đã lưu kết quả khám bệnh vào Bệnh án EMR!");
        loadData();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi lưu kết quả khám");
    } finally {
      setSubmittingExam(false);
    }
  };

  const handlePrescribeSubmit = async (prescriptionItems) => {
    if (!selectedPatient) return;
    setSubmittingPrescribe(true);
    try {
      const response = await consultationService.prescribe(selectedPatient.patient_code, {
        items: prescriptionItems,
      });
      if (response && response.success) {
        message.success(response.message || "Kê đơn thuốc thành công!");
        setIsPrescribeOpen(false);
        loadData();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi kê đơn thuốc");
    } finally {
      setSubmittingPrescribe(false);
    }
  };

  const handleLabOrderSubmit = async (labData) => {
    setSubmittingLab(true);
    try {
      const response = await labService.createOrder(labData);
      if (response && response.success) {
        message.success(response.message || "Đã tạo phiếu chỉ định Cận lâm sàng!");
        setIsLabOrderOpen(false);
        loadData();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi tạo chỉ định CLS");
    } finally {
      setSubmittingLab(false);
    }
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="exam"
        items={[
          {
            key: "exam",
            label: (
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                <MedicineBoxOutlined /> Phòng Khám Lâm Sàng & EMR
              </span>
            ),
            children: (
              <Row gutter={[16, 16]}>
                {/* CỘT TRÁI: HÀNG ĐỢI BỆNH NHÂN */}
                <Col xs={24} lg={8}>
                  <Card
                    bordered={false}
                    title={
                      <span style={{ fontWeight: 700, color: "#003a8c" }}>
                        HÀNG ĐỢI BỆNH NHÂN ({patients.length})
                      </span>
                    }
                    style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                  >
                    <ExaminationQueue
                      patients={patients}
                      loading={loadingPatients}
                      selectedPatient={selectedPatient}
                      onSelectPatient={setSelectedPatient}
                    />
                  </Card>
                </Col>

                {/* CỘT PHẢI: FORM KHÁM BỆNH & CHỈ ĐỊNH */}
                <Col xs={24} lg={16}>
                  <ClinicalExamination
                    patient={selectedPatient}
                    onSubmit={handleSaveExamination}
                    onOpenLabModal={() => setIsLabOrderOpen(true)}
                    onOpenPrescribe={() => setIsPrescribeOpen(true)}
                    submitting={submittingExam}
                  />
                </Col>
              </Row>
            ),
          },
          {
            key: "history",
            label: (
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                <HistoryOutlined /> Lịch Sử Bệnh Án Điện Tử ({consultations.length})
              </span>
            ),
            children: (
              <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <ConsultationHistory
                  consultations={consultations}
                  loading={loadingConsultations}
                />
              </Card>
            ),
          },
        ]}
      />

      {/* MODAL KÊ ĐƠN THUỐC */}
      <PrescriptionForm
        open={isPrescribeOpen}
        patient={selectedPatient}
        medicines={medicines}
        onCancel={() => setIsPrescribeOpen(false)}
        onSubmit={handlePrescribeSubmit}
        confirmLoading={submittingPrescribe}
      />

      {/* MODAL CHỈ ĐỊNH CẬN LÂM SÀNG */}
      <LabOrderModal
        open={isLabOrderOpen}
        patient={selectedPatient}
        labServices={labServices}
        onCancel={() => setIsLabOrderOpen(false)}
        onSubmit={handleLabOrderSubmit}
        confirmLoading={submittingLab}
      />
    </div>
  );
}
