# TỔNG HỢP KIỂM THỬ ĐƠN VỊ 3 CHỨC NĂNG NGHIỆP VỤ NÒNG CỐT (VŨ ĐỨC VƯƠNG)
## HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)

Tài liệu này tổng hợp toàn bộ 74 test case kiểm thử đơn vị theo chuẩn NUnit (ThS. Nguyễn Thị Phương Dung) cho 3 chức năng nghiệp vụ của tác giả **Vũ Đức Vương**, đã được phân tách thành 3 tệp báo cáo chuyên sâu và 3 tệp mã nguồn kiểm thử tự động tương ứng:

---

## 1. PHÂN CHIA 3 TỆP BÁO CÁO VÀ TEST SUITE TƯƠNG ỨNG

### Chức năng 1: Lập hóa đơn viện phí (`UC-THUNGAN-05`)
- **Tệp báo cáo:** [`docs/vuong/validators/01_Kiem_Thu_LapHoaDonVienPhi.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/validators/01_Kiem_Thu_LapHoaDonVienPhi.md)
- **Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/01_lapHoaDon.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/01_lapHoaDon.test.js)
- **Số lượng ca kiểm thử:** **26 ca** (14 ca Hộp đen TC_F5 + 12 ca Hộp trắng CFG/DFG).

### Chức năng 2: Thanh toán hóa đơn viện phí (`UC-THUNGAN-06`)
- **Tệp báo cáo:** [`docs/vuong/validators/02_Kiem_Thu_ThanhToanHoaDonVienPhi.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/validators/02_Kiem_Thu_ThanhToanHoaDonVienPhi.md)
- **Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/02_thanhToanHoaDon.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/02_thanhToanHoaDon.test.js)
- **Số lượng ca kiểm thử:** **21 ca** (9 ca Hộp đen TC_F6 + 12 ca Hộp trắng CFG/DFG).

### Chức năng 3: Quản lý danh mục thuốc và tồn kho dược (`UC-DUOC-09`)
- **Tệp báo cáo:** [`docs/vuong/validators/03_Kiem_Thu_QuanLyDanhMucThuocVaTonKho.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/validators/03_Kiem_Thu_QuanLyDanhMucThuocVaTonKho.md)
- **Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/03_quanLyThuoc.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/03_quanLyThuoc.test.js)
- **Số lượng ca kiểm thử:** **27 ca** (7 ca Hộp đen TC_F9 + 9 ca CFG/DFG thêm thuốc + 11 ca Cập nhật & Xóa).

---

## 2. LỆNH CHẠY KIỂM THỬ TỰ ĐỘNG

```powershell
# Chạy toàn bộ 74 ca qua script PowerShell của Vương:
.\backend\test\vuong\validators\04_Lenh_Chay.ps1

# Chạy qua npm script:
npm run test:vuong

# Chạy toàn bộ test suite dự án (bao gồm cả của Vương và Khánh):
npm test
```
