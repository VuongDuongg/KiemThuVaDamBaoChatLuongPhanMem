import { labService } from "../services/labService.js";

// GET /api/lab/services - Danh mục dịch vụ Cận lâm sàng
export const getLabServices = (req, res) => {
  try {
    const data = labService.getServices();
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/lab/orders - Danh sách hàng đợi chỉ định CLS
export const getLabOrders = (req, res) => {
  try {
    const data = labService.getOrders(req.query);
    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// GET /api/lab/orders/:id - Chi tiết chỉ định CLS
export const getLabOrderById = (req, res) => {
  try {
    const data = labService.getOrderById(req.params.id);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/lab/orders - Bác sĩ tạo chỉ định Cận lâm sàng mới
export const createLabOrder = (req, res) => {
  try {
    const newOrder = labService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: `Đã tạo phiếu chỉ định ${newOrder.order_code} cho bệnh nhân`,
      data: newOrder
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// POST /api/lab/orders/:id/start - Bắt đầu thực hiện ca CLS
export const startLabOrder = (req, res) => {
  try {
    const order = labService.startOrder(req.params.id, req.body.technician);
    res.json({
      success: true,
      message: `Đã tiếp nhận thực hiện chỉ định ${order.order_code}`,
      data: order
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({ success: false, message: error.message });
  }
};

// POST /api/lab/orders/:id/collect-sample - Xác nhận mẫu bệnh phẩm tại quầy xét nghiệm
export const collectLabSample = (req, res) => {
  try {
    const order = labService.collectSample(req.params.id, req.body);
    res.json({ success: true, message: `Đã tiếp nhận mẫu cho phiếu ${order.order_code}`, data: order });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// POST & PUT /api/lab/orders/:id/results - Nhập kết quả CLS
export const updateLabResult = (req, res) => {
  try {
    const order = labService.updateResult(req.params.id, req.body);
    res.json({
      success: true,
      message: `Đã hoàn tất nhập kết quả cho phiếu ${order.order_code}`,
      data: order
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

// POST /api/lab/orders/:id/approve - Duyệt chuyên môn và phát hành kết quả xét nghiệm
export const approveLabResult = (req, res) => {
  try {
    const order = labService.approveResult(req.params.id, req.body);
    res.json({ success: true, message: `Đã phát hành kết quả phiếu ${order.order_code}`, data: order });
  } catch (error) {
    res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};
