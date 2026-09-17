import dayjs from "dayjs";

export const initialMedicines = [
  { id: 1, medicine_code: "MED001", medicine_name: "Paracetamol 500mg", active_ingredient: "Paracetamol", unit: "Viên", unit_price: 1500, stock_quantity: 1000, category: "Giảm đau - Hạ sốt", expiry_date: "2027-12-31" },
  { id: 2, medicine_code: "MED002", medicine_name: "Amoxicillin 500mg", active_ingredient: "Amoxicillin trihydrat", unit: "Viên", unit_price: 3500, stock_quantity: 500, category: "Kháng sinh", expiry_date: "2026-10-15" },
  { id: 3, medicine_code: "MED003", medicine_name: "Ibuprofen 400mg", active_ingredient: "Ibuprofen", unit: "Viên", unit_price: 2500, stock_quantity: 800, category: "Kháng viêm giảm đau", expiry_date: "2027-08-30" },
  { id: 4, medicine_code: "MED004", medicine_name: "Vitamin C 1000mg", active_ingredient: "Acid Ascorbic", unit: "Viên sủi", unit_price: 4000, stock_quantity: 600, category: "Vitamin & Khoáng chất", expiry_date: "2027-12-31" },
  { id: 5, medicine_code: "MED005", medicine_name: "Siro Ho Astex", active_ingredient: "Cao cồn bọ mắm, eucalyptol", unit: "Chai", unit_price: 45000, stock_quantity: 200, category: "Hô hấp", expiry_date: "2026-11-20" },
  { id: 6, medicine_code: "MED006", medicine_name: "Omez 20mg", active_ingredient: "Omeprazol", unit: "Viên", unit_price: 5000, stock_quantity: 400, category: "Dạ dày - Tiêu hóa", expiry_date: "2027-05-20" }
];

export const initialDepartments = [
  { id: 1, dept_name: "Khoa Nội", dept_type: "CLINIC", max_patients_per_day: 100 },
  { id: 2, dept_name: "Khoa Ngoại", dept_type: "CLINIC", max_patients_per_day: 80 },
  { id: 3, dept_name: "Khoa Nhi", dept_type: "CLINIC", max_patients_per_day: 80 },
  { id: 4, dept_name: "Khoa Cấp Cứu", dept_type: "CLINIC", max_patients_per_day: 120 },
  { id: 5, dept_name: "Phòng Xét Nghiệm Huyết Học", dept_type: "LAB", max_patients_per_day: 200 },
  { id: 6, dept_name: "Phòng X-Quang / Siêu Âm", dept_type: "LAB", max_patients_per_day: 150 },
  { id: 7, dept_name: "Nhà Thuốc Bệnh Viện", dept_type: "PHARMACY", max_patients_per_day: 300 }
];

export const initialLabServices = [
  { id: 1, service_code: "CLS_XN_MAU", service_name: "Tổng phân tích tế bào máu ngoại vi (18 thông số)", type: "LAB", price: 120000 },
  { id: 2, service_code: "CLS_XN_SINHHOA", service_name: "Định lượng Glucose & Ure máu", type: "LAB", price: 80000 },
  { id: 3, service_code: "CLS_XQUANG_PHOI", service_name: "Chụp X-quang tim phổi thẳng", type: "PACS", price: 180000 },
  { id: 4, service_code: "CLS_XQUANG_XUONG", service_name: "Chụp X-quang xương khớp tư thế thẳng nghiêng", type: "PACS", price: 200000 },
  { id: 5, service_code: "CLS_SIEUAM_BUNG", service_name: "Siêu âm ổ bụng tổng quát", type: "PACS", price: 220000 },
  { id: 6, service_code: "CLS_DIENTIM", service_name: "Điện tâm đồ (ECG 12 chuyển đạo)", type: "LAB", price: 90000 }
];

export const generateSeedData = () => {
  const patients = [
    {
      id: "P001",
      patient_code: "BN000001",
      name: "Nguyễn Văn An",
      gender: "Nam",
      birth_date: "15/05/1990",
      phone: "0987654321",
      identity_card_number: "001203001234",
      department: "Khoa Nội",
      reception_date: "16/09/2026",
      status: "Chờ khám",
      address: "Số 12 Chùa Bộc, Đống Đa, Hà Nội",
      symptoms: "Ho khan kéo dài, sốt nhẹ về chiều"
    },
    {
      id: "P002",
      patient_code: "BN000002",
      name: "An",
      gender: "Nữ",
      birth_date: "20/11/1995",
      phone: "0912345678",
      identity_card_number: "001203001235",
      department: "Khoa Ngoại",
      reception_date: "16/09/2026",
      status: "Đang khám",
      address: "Lê Hồng Phong, Ngô Quyền, Hải Phòng",
      symptoms: "Đau âm ỉ vùng hạ sườn phải"
    },
    {
      id: "P003",
      patient_code: "BN000003",
      name: "Trần Thị Bích Ngọc",
      gender: "Nữ",
      birth_date: "08/03/1988",
      phone: "0903456789",
      identity_card_number: "001203001236",
      department: "Khoa Nhi",
      reception_date: "15/09/2026",
      status: "Chờ kết quả CLS",
      address: "Hải Châu, Đà Nẵng",
      symptoms: "Đưa trẻ đi khám sốt phát ban"
    },
    {
      id: "P004",
      patient_code: "BN000004",
      name: "Lê Hoàng Nam",
      gender: "Nam",
      birth_date: "02/09/2001",
      phone: "0868123456",
      identity_card_number: "001203001237",
      department: "Khoa Nội",
      reception_date: "15/09/2026",
      status: "Đã khám xong",
      address: "Ninh Kiều, Cần Thơ",
      symptoms: "Kiểm tra sức khỏe định kỳ"
    },
    {
      id: "P005",
      patient_code: "BN000005",
      name: "Phạm Minh Tuấn",
      gender: "Nam",
      birth_date: "12/12/1975",
      phone: "0356789012",
      identity_card_number: "001203001238",
      department: "Khoa Mắt",
      reception_date: "16/09/2026",
      status: "Chờ khám",
      address: "TP. Bắc Ninh",
      symptoms: "Mắt nhìn mờ, chảy nước mắt sống"
    },
    {
      id: "P006",
      patient_code: "BN000006",
      name: "Hoàng Thu Thảo",
      gender: "Nữ",
      birth_date: "25/08/1993",
      phone: "0778901234",
      identity_card_number: "001203001239",
      department: "Khoa Răng Hàm Mặt",
      reception_date: "14/09/2026",
      status: "Đã hủy",
      address: "Bãi Cháy, Quảng Ninh",
      symptoms: "Đau răng khôn hàm dưới"
    },
    {
      id: "P007",
      patient_code: "BN000007",
      name: "Nguyễn Công Thành",
      gender: "Nam",
      birth_date: "01/01/1960",
      phone: "0945678901",
      identity_card_number: "001203001240",
      department: "Khoa Nội",
      reception_date: "16/09/2026",
      status: "Chờ khám",
      address: "Hai Bà Trưng, Hà Nội",
      symptoms: "Tăng huyết áp, chóng mặt"
    }
  ];

  // Thêm các bệnh nhân tiếp theo đến 30 bệnh nhân chuẩn
  const extraNames = [
    "Đặng Thu Trang", "Bùi Quốc Huy", "Hoàng Văn Nam", "Ngô Thị Mai", "Đỗ Hữu Thắng",
    "Dương Thị Lan", "Trịnh Văn Phúc", "Lý Thanh Hà", "Võ Văn Kiên", "Hồ Thị Nga",
    "Phan Đức Trọng", "Mai Thị Yến", "Cao Văn Dũng", "Tạ Thị Hạnh", "Lương Đình Bảo",
    "Trương Mỹ Linh", "Đinh Khắc Cường", "Chu Thị Phượng", "Nghiêm Văn Tuấn", "Tô Thị Bích",
    "Đoàn Thế Anh", "Phùng Thị Tuyết", "Lâm Quốc Cường"
  ];

  for (let i = 8; i <= 30; i++) {
    const name = extraNames[i - 8] || `Bệnh nhân ${i}`;
    patients.push({
      id: `P${String(i).padStart(3, "0")}`,
      patient_code: `BN${String(i).padStart(6, "0")}`,
      name: name,
      gender: i % 2 === 0 ? "Nữ" : "Nam",
      birth_date: `${String((i % 28) + 1).padStart(2, "0")}/${String((i % 12) + 1).padStart(2, "0")}/${1970 + i}`,
      phone: `09${String(10000000 + i * 293847).slice(0, 8)}`,
      identity_card_number: `001203${String(100000 + i * 372).slice(0, 6)}`,
      department: i % 3 === 0 ? "Khoa Nội" : i % 3 === 1 ? "Khoa Ngoại" : "Khoa Nhi",
      reception_date: "16/09/2026",
      status: i % 4 === 0 ? "Chờ khám" : i % 4 === 1 ? "Đang khám" : i % 4 === 2 ? "Chờ kết quả CLS" : "Đã khám",
      address: `Số ${i * 5} Đường Giải Phóng, Hà Nội`,
      symptoms: "Khám sức khỏe tổng quát và điều trị định kỳ"
    });
  }

  const consultations = [
    {
      id: 1,
      encounter_id: 1,
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      gender: "Nam",
      birth_date: "15/05/1990",
      doctor: "BS. Trần Văn Bình",
      department: "Khoa Nội",
      vitals: { blood_pressure: "120/80", pulse: 78, temperature: 36.8, spo2: 98 },
      symptoms: "Đau đầu từng cơn vùng trán, sốt nhẹ về chiều, mệt mỏi 2 ngày nay.",
      icd10_code: "J00",
      icd10_name: "Viêm mũi họng cấp tính [cảm thường]",
      treatment_plan: "Nghỉ ngơi, bù nước điện giải, uống thuốc hạ sốt giảm đau khi sốt trên 38.5 độ.",
      status: "COMPLETED",
      prescriptions: [
        { medicine_code: "MED001", medicine_name: "Paracetamol 500mg", quantity: 10, dosage: "Uống 1 viên khi sốt" }
      ],
      lab_orders: [],
      created_at: dayjs().format("DD/MM/YYYY HH:mm")
    },
    {
      id: 2,
      encounter_id: 2,
      patient_code: "BN000002",
      patient_name: "An",
      gender: "Nữ",
      birth_date: "20/11/1995",
      doctor: "BS. Nguyễn Văn Hùng",
      department: "Khoa Ngoại",
      vitals: { blood_pressure: "115/75", pulse: 82, temperature: 37.0, spo2: 99 },
      symptoms: "Ngã chống tay phải, đau chói và sưng nề nhẹ vùng cổ tay phải.",
      icd10_code: "S60.2",
      icd10_name: "Đụng giập các phần khác của cổ tay và bàn tay",
      treatment_plan: "Chỉ định chụp X-quang khớp cổ tay để loại trừ gãy xương, cố định tạm thời.",
      status: "WAITING_LAB",
      prescriptions: [],
      lab_orders: [
        { order_code: "CLS000001", service_name: "Chụp X-quang xương khớp tư thế thẳng nghiêng", status: "COMPLETED", result: "Không thấy tổn thương gãy xương" }
      ],
      created_at: dayjs().subtract(1, "hour").format("DD/MM/YYYY HH:mm")
    }
  ];

  for (let i = 3; i <= 30; i++) {
    consultations.push({
      id: i,
      encounter_id: i,
      patient_code: `BN${String(i).padStart(6, "0")}`,
      patient_name: patients[i - 1]?.name || `Bệnh nhân ${i}`,
      gender: patients[i - 1]?.gender || "Nam",
      birth_date: patients[i - 1]?.birth_date || "01/01/1990",
      doctor: "BS. Lê Hoàng Nam",
      department: patients[i - 1]?.department || "Khoa Nội",
      vitals: { blood_pressure: "120/80", pulse: 75, temperature: 37.0, spo2: 98 },
      symptoms: patients[i - 1]?.symptoms || "Khám sức khỏe tổng quát",
      icd10_code: "J02.9",
      icd10_name: "Viêm họng cấp, không đặc hiệu",
      treatment_plan: "Điều trị ngoại trú, uống thuốc đủ liều",
      status: "COMPLETED",
      prescriptions: [
        { medicine_code: "MED001", medicine_name: "Paracetamol 500mg", quantity: 10, dosage: "Ngày 2 lần, mỗi lần 1 viên" }
      ],
      lab_orders: [],
      created_at: dayjs().subtract(i % 5, "day").format("DD/MM/YYYY HH:mm")
    });
  }

  const invoices = [
    {
      id: 1,
      invoice_code: "HD000001",
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      item_type: "TIEN_KHAM",
      description: "Khám chuyên khoa Nội tổng quát",
      total_amount: 150000,
      insurance_discount: 30000,
      patient_pay: 120000,
      payment_method: "TIEN_MAT",
      status: "PAID",
      created_at: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm"),
      paid_at: dayjs().subtract(110, "minute").format("DD/MM/YYYY HH:mm"),
      cashier: "Trần Văn Thu Ngân"
    },
    {
      id: 2,
      invoice_code: "HD000002",
      patient_code: "BN000002",
      patient_name: "An",
      item_type: "CAN_LAM_SANG",
      description: "Chụp X-quang khớp cổ tay thẳng nghiêng",
      total_amount: 250000,
      insurance_discount: 50000,
      patient_pay: 200000,
      payment_method: "VIETQR",
      status: "PAID",
      created_at: dayjs().subtract(1, "hour").format("DD/MM/YYYY HH:mm"),
      paid_at: dayjs().subtract(50, "minute").format("DD/MM/YYYY HH:mm"),
      cashier: "Trần Văn Thu Ngân"
    },
    {
      id: 3,
      invoice_code: "HD000003",
      patient_code: "BN000003",
      patient_name: "Trần Thị Bích Ngọc",
      item_type: "TIEN_THUOC",
      description: "Đơn thuốc điều trị viêm phổi cấp",
      total_amount: 420000,
      insurance_discount: 84000,
      patient_pay: 336000,
      payment_method: "CHUA_THANH_TOAN",
      status: "UNPAID",
      created_at: dayjs().subtract(30, "minute").format("DD/MM/YYYY HH:mm"),
      paid_at: null,
      cashier: "Trần Văn Thu Ngân"
    },
    {
      id: 4,
      invoice_code: "HD000004",
      patient_code: "BN000004",
      patient_name: "Lê Hoàng Nam",
      item_type: "TIEN_KHAM",
      description: "Khám Nội tổng quát định kỳ",
      total_amount: 200000,
      insurance_discount: 0,
      patient_pay: 200000,
      payment_method: "CHUA_THANH_TOAN",
      status: "UNPAID",
      created_at: dayjs().subtract(15, "minute").format("DD/MM/YYYY HH:mm"),
      paid_at: null,
      cashier: "Trần Văn Thu Ngân"
    }
  ];

  for (let i = 5; i <= 30; i++) {
    invoices.push({
      id: i,
      invoice_code: `HD${String(i).padStart(6, "0")}`,
      patient_code: `BN${String(i).padStart(6, "0")}`,
      patient_name: patients[i - 1]?.name || `Bệnh nhân ${i}`,
      item_type: i % 2 === 0 ? "TIEN_KHAM" : "TIEN_THUOC",
      description: `Thanh toán viện phí ${i % 2 === 0 ? "công khám" : "đơn thuốc"}`,
      total_amount: 150000 + (i % 5) * 50000,
      insurance_discount: i % 3 === 0 ? 30000 : 0,
      patient_pay: (150000 + (i % 5) * 50000) - (i % 3 === 0 ? 30000 : 0),
      payment_method: i % 2 === 0 ? "VIETQR" : "TIEN_MAT",
      status: i % 4 === 0 ? "UNPAID" : "PAID",
      created_at: dayjs().subtract(i % 5, "day").format("DD/MM/YYYY HH:mm"),
      paid_at: i % 4 === 0 ? null : dayjs().subtract(i % 5, "day").format("DD/MM/YYYY HH:mm"),
      cashier: "Trần Văn Thu Ngân"
    });
  }

  const labOrders = [
    {
      id: 1,
      order_code: "CLS000001",
      consultation_id: 2,
      patient_code: "BN000002",
      patient_name: "An",
      doctor: "BS. Nguyễn Văn Hùng",
      technician: "KTV. Đặng Quốc Việt",
      service_code: "CLS_XQUANG_XUONG",
      service_name: "Chụp X-quang xương khớp tư thế thẳng nghiêng",
      type: "PACS",
      price: 200000,
      status: "COMPLETED",
      payment_status: "PAID",
      results: {
        image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=60",
        findings: "Cấu trúc xương cổ tay liên tục, không thấy đường gãy.",
        conclusion: "Hình ảnh X-quang khớp cổ tay phải trong giới hạn bình thường."
      },
      created_at: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm"),
      completed_at: dayjs().subtract(100, "minute").format("DD/MM/YYYY HH:mm")
    },
    {
      id: 2,
      order_code: "CLS000002",
      consultation_id: 1,
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      doctor: "BS. Trần Văn Bình",
      technician: null,
      service_code: "CLS_XN_MAU",
      service_name: "Tổng phân tích tế bào máu ngoại vi (18 thông số)",
      type: "LAB",
      price: 120000,
      status: "PROCESSING",
      payment_status: "PAID",
      results: {
        parameters: [
          { param: "Bạch cầu (WBC)", value: 11.8, unit: "G/L", normal_range: "4.0 - 10.0", alert: "HIGH" },
          { param: "Hồng cầu (RBC)", value: 4.6, unit: "T/L", normal_range: "3.8 - 5.5", alert: "NORMAL" },
          { param: "Huyết sắc tố (Hb)", value: 142, unit: "g/L", normal_range: "120 - 160", alert: "NORMAL" }
        ],
        conclusion: "Bạch cầu tăng nhẹ, gợi ý tình trạng viêm cấp tính."
      },
      created_at: dayjs().subtract(30, "minute").format("DD/MM/YYYY HH:mm"),
      completed_at: null
    },
    {
      id: 3,
      order_code: "CLS000003",
      consultation_id: 3,
      patient_code: "BN000003",
      patient_name: "Trần Thị Bích Ngọc",
      doctor: "BS. Trần Văn Bình",
      technician: null,
      service_code: "CLS_SIEUAM_BUNG",
      service_name: "Siêu âm ổ bụng tổng quát",
      type: "PACS",
      price: 220000,
      status: "PENDING",
      payment_status: "PAID",
      results: null,
      created_at: dayjs().subtract(15, "minute").format("DD/MM/YYYY HH:mm"),
      completed_at: null
    }
  ];

  for (let i = 4; i <= 30; i++) {
    labOrders.push({
      id: i,
      order_code: `CLS${String(i).padStart(6, "0")}`,
      consultation_id: i,
      patient_code: `BN${String(i).padStart(6, "0")}`,
      patient_name: patients[i - 1]?.name || `Bệnh nhân ${i}`,
      doctor: "BS. Lê Hoàng Nam",
      technician: "KTV. Đặng Quốc Việt",
      service_code: i % 2 === 0 ? "CLS_XQUANG_PHOI" : "CLS_XN_MAU",
      service_name: i % 2 === 0 ? "Chụp X-quang tim phổi thẳng" : "Tổng phân tích tế bào máu ngoại vi (18 thông số)",
      type: i % 2 === 0 ? "PACS" : "LAB",
      price: i % 2 === 0 ? 180000 : 120000,
      status: i % 3 === 0 ? "PENDING" : i % 3 === 1 ? "PROCESSING" : "COMPLETED",
      payment_status: "PAID",
      results: {
        conclusion: "Chỉ số cận lâm sàng trong giới hạn sinh lý bình thường."
      },
      created_at: dayjs().subtract(i % 5, "day").format("DD/MM/YYYY HH:mm"),
      completed_at: i % 3 === 2 ? dayjs().subtract(i % 5, "day").format("DD/MM/YYYY HH:mm") : null
    });
  }

  return {
    patients,
    invoices,
    consultations,
    labOrders,
    medicines: initialMedicines,
    departments: initialDepartments,
    labServices: initialLabServices
  };
};

export const globalData = generateSeedData();
