// Mock Data danh sách bệnh nhân phục vụ CRUD và Kiểm thử
export let mockPatients = [
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
    name: "An", // Tên tại biên dưới (2 ký tự)
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
  },
  {
    id: "P008",
    patient_code: "BN000008",
    name: "Nguyễn Thị Phương Thảo Lê Hoàng Mai Lan Đỗ Cúc Hoa",
    gender: "Nữ",
    birth_date: "10/10/1985",
    phone: "0967890123",
    identity_card_number: "001203001241",
    department: "Khoa Tai Mũi Họng",
    reception_date: "16/09/2026",
    status: "Chờ khám",
    address: "TP. Thái Bình",
    symptoms: "Viêm họng hạt, khàn tiếng"
  }
];

export function setMockPatients(newList) {
  mockPatients = newList;
}
