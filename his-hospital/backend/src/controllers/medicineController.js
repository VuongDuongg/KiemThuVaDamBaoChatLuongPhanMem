import { globalData } from "../data/seedData.js";

// GET /api/medicines - Danh mục thuốc & Kho dược
export const getMedicines = (req, res) => {
  const { keyword, category, low_stock } = req.query;
  let results = [...globalData.medicines];

  if (keyword && keyword.trim()) {
    const kw = keyword.trim().toLowerCase();
    results = results.filter(
      (m) =>
        m.medicine_name.toLowerCase().includes(kw) ||
        m.medicine_code.toLowerCase().includes(kw) ||
        (m.active_ingredient && m.active_ingredient.toLowerCase().includes(kw))
    );
  }

  if (category && category !== "ALL") {
    results = results.filter((m) => m.category === category);
  }

  if (low_stock === "true") {
    results = results.filter((m) => m.stock_quantity <= 100);
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
};

// GET /api/medicines/:id - Chi tiết thuốc
export const getMedicineById = (req, res) => {
  const { id } = req.params;
  const medicine = globalData.medicines.find(
    (m) => String(m.id) === String(id) || m.medicine_code === id
  );

  if (!medicine) {
    return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
  }

  res.json({
    success: true,
    data: medicine
  });
};

// POST /api/medicines - Thêm thuốc mới vào kho
export const createMedicine = (req, res) => {
  const {
    medicine_name,
    active_ingredient,
    unit = "Viên",
    unit_price,
    stock_quantity = 0,
    category = "Khác",
    expiry_date
  } = req.body;

  if (!medicine_name || !medicine_name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Tên thuốc là bắt buộc"
    });
  }

  const numPrice = Number(unit_price);
  if (unit_price === undefined || isNaN(numPrice) || numPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: "Đơn giá thuốc phải lớn hơn 0"
    });
  }

  const numStock = Number(stock_quantity);
  if (isNaN(numStock) || numStock < 0) {
    return res.status(400).json({
      success: false,
      message: "Số lượng tồn kho không được là số âm"
    });
  }

  const nextIndex = globalData.medicines.length + 1;
  const newMedicine = {
    id: nextIndex,
    medicine_code: `MED${String(nextIndex).padStart(3, "0")}`,
    medicine_name: medicine_name.trim(),
    active_ingredient: active_ingredient ? active_ingredient.trim() : "",
    unit,
    unit_price: numPrice,
    stock_quantity: numStock,
    category,
    expiry_date: expiry_date || "2027-12-31"
  };

  globalData.medicines.push(newMedicine);

  res.status(201).json({
    success: true,
    message: "Thêm mới thuốc vào kho thành công",
    data: newMedicine
  });
};

// PUT /api/medicines/:id - Cập nhật thông tin / tồn kho thuốc
export const updateMedicine = (req, res) => {
  const { id } = req.params;
  const medIndex = globalData.medicines.findIndex(
    (m) => String(m.id) === String(id) || m.medicine_code === id
  );

  if (medIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
  }

  const existing = globalData.medicines[medIndex];
  const { medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date } = req.body;

  const updatedMed = {
    ...existing,
    ...(medicine_name && { medicine_name: medicine_name.trim() }),
    ...(active_ingredient !== undefined && { active_ingredient: active_ingredient.trim() }),
    ...(unit && { unit }),
    ...(unit_price !== undefined && { unit_price: Number(unit_price) }),
    ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
    ...(category && { category }),
    ...(expiry_date && { expiry_date })
  };

  globalData.medicines[medIndex] = updatedMed;

  res.json({
    success: true,
    message: "Cập nhật thuốc thành công",
    data: updatedMed
  });
};

// DELETE /api/medicines/:id - Xóa thuốc khỏi kho
export const deleteMedicine = (req, res) => {
  const { id } = req.params;
  const medIndex = globalData.medicines.findIndex(
    (m) => String(m.id) === String(id) || m.medicine_code === id
  );

  if (medIndex === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
  }

  const deleted = globalData.medicines.splice(medIndex, 1)[0];
  res.json({
    success: true,
    message: `Đã xóa thuốc ${deleted.medicine_name} khỏi kho`,
    data: deleted
  });
};
