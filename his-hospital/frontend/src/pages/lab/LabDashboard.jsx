import React, { useState, useEffect } from "react";
import { Card, Tabs, message } from "antd";
import { ExperimentOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { labService } from "../../services/labService";
import LabOrderQueue from "./components/LabOrderQueue";
import LabResultEntryModal from "./components/LabResultEntryModal";
import PacsViewerModal from "./components/PacsViewerModal";
import LabServiceCatalog from "./components/LabServiceCatalog";

export default function LabDashboard() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    keyword: "",
    status: "ALL",
    type: "ALL",
  });

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isPacsModalOpen, setIsPacsModalOpen] = useState(false);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await labService.getOrders(filters);
      if (response?.data) setOrders(response.data);
    } catch {
      message.error("Lỗi khi tải danh sách chỉ định Cận lâm sàng");
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadServices = async () => {
    setLoadingServices(true);
    try {
      const response = await labService.getServices();
      if (response?.data) setServices(response.data);
    } catch {
      message.error("Lỗi khi tải danh mục dịch vụ CLS");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filters]);

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenResultEntry = (order) => {
    setSelectedOrder(order);
    setIsResultModalOpen(true);
  };

  const handleOpenPacs = (order) => {
    setSelectedOrder(order);
    setIsPacsModalOpen(true);
  };

  const handleSubmitResult = async (orderId, resultsData) => {
    setSubmittingResult(true);
    try {
      const response = await labService.updateResult(orderId, {
        technician: "KTV. Đặng Quốc Việt",
        results: resultsData,
      });
      if (response && response.success) {
        message.success(response.message || "Cập nhật kết quả xét nghiệm thành công!");
        setIsResultModalOpen(false);
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi nhập kết quả");
    } finally {
      setSubmittingResult(false);
    }
  };

  return (
    <div>
      <Card bordered={false} style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <Tabs
          defaultActiveKey="orders"
          items={[
            {
              key: "orders",
              label: (
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  <ExperimentOutlined /> Hàng Đợi Chỉ Định Cận Lâm Sàng & PACS ({orders.length})
                </span>
              ),
              children: (
                <LabOrderQueue
                  orders={orders}
                  loading={loadingOrders}
                  filters={filters}
                  onFilterChange={setFilters}
                  onEnterResult={handleOpenResultEntry}
                  onViewPacs={handleOpenPacs}
                />
              ),
            },
            {
              key: "catalog",
              label: (
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  <UnorderedListOutlined /> Danh Mục Dịch Vụ Cận Lâm Sàng ({services.length})
                </span>
              ),
              children: (
                <LabServiceCatalog services={services} loading={loadingServices} />
              ),
            },
          ]}
        />
      </Card>

      {/* MODAL NHẬP KẾT QUẢ LAB */}
      <LabResultEntryModal
        open={isResultModalOpen}
        order={selectedOrder}
        onCancel={() => {
          setIsResultModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmitResult}
        confirmLoading={submittingResult}
      />

      {/* MODAL XEM PACS */}
      <PacsViewerModal
        open={isPacsModalOpen}
        order={selectedOrder}
        onCancel={() => {
          setIsPacsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
