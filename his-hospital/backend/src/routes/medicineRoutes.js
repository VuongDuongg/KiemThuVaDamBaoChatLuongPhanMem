import express from "express";

const router = express.Router();

// Mock in-memory medicines for Pharmacy (TV2)
let mockMedicines = [
  {
    id: 1,
    medicine_code: "MED001",
    medicine_name: "Paracetamol 500mg",
    active_ingredient: "Paracetamol",
    unit: "Viên",
    unit_price: 1500,
    stock_quantity: 450,
    category: "Giảm đau - Hạ sốt",
    expiry_date: "2027-12-31"
  },
  {
    id: 2,
    medicine_code: "MED002",
    medicine_name: "Amoxicillin 500mg",
    active_ingredient: "Amoxicillin trihydrat",
    unit: "Viên",
    unit_price: 3200,
    stock_quantity: 280,
    category: "Kháng sinh",
    expiry_date: "2026-10-15"
  },
  {
    id: 3,
    medicine_code: "MED003",
    medicine_name: "Omeprazol 20mg",
    active_ingredient: "Omeprazol",
    unit: "Viên",
    unit_price: 4500,
    stock_quantity: 190,
    category: "Dạ dày - Tiêu hóa",
    expiry_date: "2027-05-20"
  },
  {
    id: 4,
    medicine_code: "MED004",
    medicine_name: "Amlodipin 5mg",
    active_ingredient: "Amlodipin besylat",
    unit: "Viên",
    unit_price: 2800,
    stock_quantity: 320,
    category: "Tim mạch - Huyết áp",
    expiry_date: "2027-08-30"
  },
  {
    id: 5,
    medicine_code: "MED005",
    medicine_name: "Siro ho Prospan 100ml",
    active_ingredient: "Cao khô lá thường xuân",
    unit: "Chai",
    unit_price: 85000,
    stock_quantity: 45,
    category: "Hô hấp",
    expiry_date: "2026-11-20"
  },
  {
    id: 6,
    medicine_code: "MED006",
    medicine_name: "Vitamin C 500mg",
    active_ingredient: "Acid ascorbic",
    unit: "Viên",
    unit_price: 1000,
    stock_quantity: 600,
    category: "Vitamin & Khoáng chất",
    expiry_date: "2028-01-01"
  }
];

// GET /api/medicines - Tra cứu danh mục thuốc
router.get("/", (req, res) => {
  const { search, category } = req.query;
  let results = [...mockMedicines];

  if (search) {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (m) =>
        m.medicine_name.toLowerCase().includes(q) ||
        m.medicine_code.toLowerCase().includes(q) ||
        m.active_ingredient.toLowerCase().includes(q)
    );
  }

  if (category && category !== "Tất cả") {
    results = results.filter((m) => m.category === category);
  }

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// POST /api/medicines - Thêm thuốc mới vào kho
router.post("/", (req, res) => {
  const { medicine_code, medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date } =
    req.body;

  if (!medicine_name || !unit || unit_price === undefined || stock_quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ tên thuốc, đơn vị tính, đơn giá và số lượng tồn!"
    });
  }

  if (Number(unit_price) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Đơn giá thuốc phải lớn hơn 0!"
    });
  }

  if (Number(stock_quantity) < 0) {
    return res.status(400).json({
      success: false,
      message: "Số lượng tồn kho không được là số âm!"
    });
  }

  const newId = mockMedicines.length > 0 ? Math.max(...mockMedicines.map((m) => m.id)) + 1 : 1;
  const code = medicine_code || `MED${String(newId).padStart(3, "0")}`;

  const exists = mockMedicines.some((m) => m.medicine_code.toLowerCase() === code.toLowerCase());
  if (exists) {
    return res.status(400).json({
      success: false,
      message: `Mã thuốc ${code} đã tồn tại trong danh mục!`
    });
  }

  const newMed = {
    id: newId,
    medicine_code: code,
    medicine_name,
    active_ingredient: active_ingredient || medicine_name,
    unit,
    unit_price: Number(unit_price),
    stock_quantity: Number(stock_quantity),
    category: category || "Thuốc khác",
    expiry_date: expiry_date || "2027-12-31"
  };

  mockMedicines.push(newMed);
  res.status(201).json({
    success: true,
    message: `Đã thêm thuốc ${medicine_name} vào kho dược!`,
    data: newMed
  });
});

// PUT /api/medicines/:id - Cập nhật thuốc
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = mockMedicines.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy thuốc!" });
  }

  const { unit_price, stock_quantity } = req.body;
  if (unit_price !== undefined && Number(unit_price) <= 0) {
    return res.status(400).json({ success: false, message: "Đơn giá thuốc phải lớn hơn 0!" });
  }
  if (stock_quantity !== undefined && Number(stock_quantity) < 0) {
    return res.status(400).json({ success: false, message: "Số lượng tồn kho không được là số âm!" });
  }

  mockMedicines[index] = {
    ...mockMedicines[index],
    ...req.body,
    unit_price: unit_price !== undefined ? Number(unit_price) : mockMedicines[index].unit_price,
    stock_quantity:
      stock_quantity !== undefined ? Number(stock_quantity) : mockMedicines[index].stock_quantity
  };

  res.json({
    success: true,
    message: "Cập nhật thông tin thuốc thành công!",
    data: mockMedicines[index]
  });
});

// DELETE /api/medicines/:id - Xóa thuốc
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = mockMedicines.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Không tìm thấy thuốc!" });
  }

  const removed = mockMedicines.splice(index, 1)[0];
  res.json({
    success: true,
    message: `Đã xóa thuốc ${removed.medicine_name} khỏi kho!`,
    data: removed
  });
});

export default router;
export { mockMedicines };
