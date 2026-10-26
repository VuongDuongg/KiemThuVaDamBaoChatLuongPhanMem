import React, { useState, useEffect } from 'react';
import { Card, Tabs, message } from 'antd';
import { ExperimentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { labService } from '../../services/labService';
import LabOrderQueue from './components/LabOrderQueue';
import LabResultEntryModal from './components/LabResultEntryModal';
import PacsViewerModal from './components/PacsViewerModal';
import LabServiceCatalog from './components/LabServiceCatalog';

export default function LabDashboard() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    keyword: '',
    status: 'ALL',
    type: 'ALL',
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
      message.error('Lỗi khi tải danh sách chỉ định Cận lâm sàng');
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
      message.error('Lỗi khi tải danh mục dịch vụ CLS');
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

  const handleStartOrder = async (order) => {
    try {
      const response = await labService.startOrder(order.id || order.order_code, {
        technician: 'KTV. Đặng Quốc Việt',
      });
      if (response?.success) {
        message.success(response.message || 'Đã tiếp nhận phiếu CLS');
        loadOrders();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tiếp nhận phiếu CLS');
    }
  };

  const handleCollectSample = async (order) => {
    try {
      const response = await labService.collectSample(order.id || order.order_code, {
        technician: 'KTV. Đặng Quốc Việt',
        specimen_type: 'Máu toàn phần EDTA',
        condition: 'Đạt yêu cầu',
      });
      if (response?.success) {
        message.success('Đã đối chiếu người bệnh, dán mã vạch và tiếp nhận mẫu.');
        loadOrders();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tiếp nhận mẫu bệnh phẩm');
    }
  };

  const handleSubmitResult = async (orderId, resultsData) => {
    setSubmittingResult(true);
    try {
      const response = await labService.updateResult(orderId, {
        technician: 'KTV. Đặng Quốc Việt',
        results: resultsData,
      });
      if (response && response.success) {
        message.success(response.message || 'Đã lưu kết quả sơ bộ và chuyển chờ duyệt chuyên môn.');
        setIsResultModalOpen(false);
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi nhập kết quả');
    } finally {
      setSubmittingResult(false);
    }
  };

  const handleApproveResult = async (order) => {
    try {
      const response = await labService.approveResult(order.id || order.order_code, {
        approved_by: 'BS. Phụ trách xét nghiệm',
      });
      if (response?.success) {
        message.success('Đã duyệt và phát hành kết quả xét nghiệm về hồ sơ bệnh án.');
        loadOrders();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể phát hành kết quả');
    }
  };

  return (
    <div>
      <Card bordered={false} style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Tabs
          defaultActiveKey="orders"
          items={[
            {
              key: 'orders',
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
                  onCollectSample={handleCollectSample}
                  onStartOrder={handleStartOrder}
                  onEnterResult={handleOpenResultEntry}
                  onApproveResult={handleApproveResult}
                  onViewPacs={handleOpenPacs}
                />
              ),
            },
            {
              key: 'catalog',
              label: (
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  <UnorderedListOutlined /> Danh Mục Dịch Vụ Cận Lâm Sàng ({services.length})
                </span>
              ),
              children: <LabServiceCatalog services={services} loading={loadingServices} />,
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
