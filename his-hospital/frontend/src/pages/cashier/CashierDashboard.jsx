import React, { useState, useEffect } from "react";
import { Card, Tabs, message, Button, Space } from "antd";
import { DollarOutlined, MedicineBoxOutlined, FileAddOutlined } from "@ant-design/icons";
import { invoiceService } from "../../services/invoiceService";
import { medicineService } from "../../services/medicineService";
import RevenueStats from "./components/RevenueStats";
import InvoiceList from "./components/InvoiceList";
import PaymentModal from "./components/PaymentModal";
import MedicineInventory from "./components/MedicineInventory";
import CreateInvoiceModal from "./components/CreateInvoiceModal";

export default function CashierDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Filters
  const [invoiceFilters, setInvoiceFilters] = useState({
    keyword: "",
    status: "ALL",
    item_type: "ALL",
  });

  // Modal payment
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Modal lập hóa đơn viện phí UC-THUNGAN-05
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const [invRes, statsRes] = await Promise.all([
        invoiceService.getAll(invoiceFilters),
        invoiceService.getStats(),
      ]);
      if (invRes?.data) setInvoices(invRes.data);
      if (statsRes?.data) setStats(statsRes.data);
    } catch {
      message.error("Lỗi khi tải dữ liệu hóa đơn viện phí");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const loadMedicines = async () => {
    setLoadingMeds(true);
    try {
      const medRes = await medicineService.getAll();
      if (medRes?.data) setMedicines(medRes.data);
    } catch {
      message.error("Lỗi khi tải danh mục kho thuốc");
    } finally {
      setLoadingMeds(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [invoiceFilters]);

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleOpenPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (invoiceId, paymentMethod) => {
    setSubmittingPayment(true);
    try {
      const response = await invoiceService.pay(invoiceId, { payment_method: paymentMethod });
      if (response && response.success) {
        message.success(response.message || "Thanh toán viện phí thành công!");
        setIsPaymentModalOpen(false);
        setSelectedInvoice(null);
        loadInvoices();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xử lý thanh toán");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handlePrintReceipt = (invoice) => {
    message.success(`Đang in biên lai hóa đơn ${invoice.invoice_code} (${invoice.patient_name})`);
  };

  const handleCreateMedicine = async (medData) => {
    await medicineService.create(medData);
    loadMedicines();
  };

  const handleUpdateMedicine = async (id, medData) => {
    await medicineService.update(id, medData);
    loadMedicines();
  };

  const handleDeleteMedicine = async (id) => {
    await medicineService.delete(id);
    message.success("Đã xóa thuốc khỏi kho");
    loadMedicines();
  };

  return (
    <div>
      {/* STATS */}
      <RevenueStats stats={stats} />

      {/* TABS: THU NGÂN & KHO DƯỢC */}
      <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Tabs
          defaultActiveKey="invoices"
          items={[
            {
              key: "invoices",
              label: (
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  <DollarOutlined /> Quản lý Viện phí & Thu ngân ({invoices.length})
                </span>
              ),
              children: (
                <InvoiceList
                  invoices={invoices}
                  loading={loadingInvoices}
                  filters={invoiceFilters}
                  onFilterChange={setInvoiceFilters}
                  onPay={handleOpenPayment}
                  onPrint={handlePrintReceipt}
                  onCreateInvoice={() => setIsCreateModalOpen(true)}
                />
              ),
            },
            {
              key: "pharmacy",
              label: (
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  <MedicineBoxOutlined /> Quản lý Kho Dược & Danh mục thuốc ({medicines.length})
                </span>
              ),
              children: (
                <MedicineInventory
                  medicines={medicines}
                  loading={loadingMeds}
                  onCreate={handleCreateMedicine}
                  onUpdate={handleUpdateMedicine}
                  onDelete={handleDeleteMedicine}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* MODAL LẬP HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-05) */}
      <CreateInvoiceModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={(newInvoice) => {
          setIsCreateModalOpen(false);
          loadInvoices();
          // Chuyển sang giao diện thực hiện thanh toán (Bước 5)
          handleOpenPayment(newInvoice);
        }}
      />

      {/* MODAL THANH TOÁN */}
      <PaymentModal
        open={isPaymentModalOpen}
        invoice={selectedInvoice}
        onCancel={() => {
          setIsPaymentModalOpen(false);
          setSelectedInvoice(null);
        }}
        onConfirm={handleConfirmPayment}
        confirmLoading={submittingPayment}
      />
    </div>
  );
}
