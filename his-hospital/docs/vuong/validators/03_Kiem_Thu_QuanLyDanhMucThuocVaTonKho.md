# BÁO CÁO KIỂM THỬ ĐƠN VỊ — CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO DƯỢC
**Hệ thống:** Quản lý bệnh viện thông minh (HIS-Hospital)  
**Use Case:** `UC-DUOC-09` — Quản lý danh mục thuốc và tồn kho  
**Tác giả thực hiện:** Vũ Đức Vương  
**Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/03_quanLyThuoc.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/03_quanLyThuoc.test.js)  
**Tài liệu tham chiếu:** `docs/vuong/Kiểm thử đơn vị - sd NUnit.pdf` (ThS. Nguyễn Thị Phương Dung) & `docs/vuong/DanhSachCacTestCase.docx.md`

---

## 1. MÔ TẢ ĐƠN VỊ KIỂM THỬ & QUY TẮC NGHIỆP VỤ

### 1.1 Đơn vị kiểm thử (Units Under Test)
- Lớp dịch vụ kho dược: `MedicineService` trong [`backend/src/services/medicineService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/medicineService.js).
- Phương thức thêm mới thuốc & khởi tạo tồn kho: `medicineService.createMedicine(payload)`.
- Phương thức cập nhật thông tin & tồn kho: `medicineService.updateMedicine(idOrCode, updateData)`.
- Phương thức xóa thuốc khỏi danh mục: `medicineService.deleteMedicine(idOrCode)`.

### 1.2 Quy tắc nghiệp vụ kiểm thử
1. **Thêm mới thuốc (`createMedicine`):**
   - Tên thuốc (`medicine_name`) bắt buộc, không được để trống hoặc chỉ có khoảng trắng.
   - Đơn giá (`unit_price`) bắt buộc, phải là số hợp lệ và $> 0$.
   - Số lượng tồn kho ban đầu (`stock_quantity`) không được là số âm ($\ge 0$).
   - Số lô (`batch_number`): Tối đa 50 ký tự, không được để trống.
   - Hạn sử dụng (`expiry_date`): Không được là ngày trong quá khứ ($< \text{hiện tại}$). Nếu còn $\le 30$ ngày phải kích hoạt cờ cảnh báo cận hạn.
   - Tự động sinh mã thuốc chuẩn hóa `MED` + 3 chữ số (ví dụ: `MED011`).
2. **Cập nhật thuốc (`updateMedicine`):**
   - Thuốc cần cập nhật phải tồn tại trong CSDL. Nếu không tìm thấy $\rightarrow$ Báo lỗi HTTP 404.
   - Cho phép cập nhật linh hoạt theo ID số hoặc mã thuốc (`MEDxxx`).
3. **Xóa thuốc (`deleteMedicine`):**
   - Xóa an toàn khỏi kho lưu trữ. Nếu mã không tồn tại $\rightarrow$ Báo lỗi HTTP 404. Sau khi xóa thành công, tìm lại trả về `null`.

---

## 2. MA TRẬN TEST CASE KIỂM THỬ ĐƠN VỊ (27 TEST CASES)

### 2.1 Kiểm thử Hộp đen & Biên hàm (TC_F9_02 $\rightarrow$ TC_F9_08)

| STT | Mã Ca | Mô tả kịch bản kiểm thử | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **TC_F9_02** | Thêm thuốc với đơn giá = 0 | `unit_price = 0` | Báo lỗi 400: đơn giá phải $> 0$ | `Assert.Throws` | **ĐẠT** |
| 2 | **TC_F9_03** | Biên Min: Số lô để trống (0 ký tự) | `batch_number = ""` | Báo lỗi bắt buộc nhập số lô | `Assert.Throws` | **ĐẠT** |
| 3 | **TC_F9_04** | Biên Max+: Số lô 51 ký tự | `batch_number = "A".repeat(51)` | Báo lỗi không vượt quá 50 ký tự | `Assert.Throws` | **ĐẠT** |
| 4 | **TC_F9_05** | Biên: Hạn sử dụng = Ngày hôm qua | `expiry = today - 1` | Báo lỗi hạn sử dụng không hợp lệ | `Assert.Throws` | **ĐẠT** |
| 5 | **TC_F9_06** | Bảng quyết định Q3: Lỗi hệ thống CSDL khi lưu | Kho gặp sự cố khi lưu | Kho không thay đổi, báo lỗi hệ thống | `Assert.Throws` | **ĐẠT** |
| 6 | **TC_F9_07** | Biên: Hạn sử dụng = Ngày hiện tại | `expiry = today` | Cảnh báo sắp hết hạn (Badge vàng) | `Assert.IsTrue` | **ĐẠT** |
| 7 | **TC_F9_08** | Biên: Hạn sử dụng = Ngày hiện tại + 29 ngày | `expiry = today + 29 days` | Cảnh báo sắp hết hạn (Badge vàng) | `Assert.IsTrue` | **ĐẠT** |

---

### 2.2 Kiểm thử Hộp trắng Dòng điều khiển (CFG) & Dòng dữ liệu (DFG) cho thao tác Thêm thuốc

| STT | Mã Ca | Loại kiểm thử | Kịch bản chi tiết | Kết quả kỳ vọng | Phương thức Assert | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 8 | **TC_MED_C1_01** | CFG C1 / C2 / C3 | Tên thuốc chỉ chứa khoảng trắng `"   "` | Ném lỗi 400 bắt buộc tên thuốc | `Assert.Throws` | **ĐẠT** |
| 9 | **TC_MED_C1_03** | CFG C1 / C2 / C3 | Tồn kho âm `stock_quantity = -5` | Ném lỗi 400 tồn kho không được âm | `Assert.Throws` | **ĐẠT** |
| 10 | **TC_MED_C1_04** | CFG C1 / C2 / DFG | Thêm thuốc đầy đủ các trường | Cắt tỉa khoảng trắng, sinh mã `MED011` | `Assert.AreEqual` | **ĐẠT** |
| 11 | **TC_MED_C1_05** | CFG C1 / C2 / DFG | Fallback giá trị mặc định | `unit = "Viên"`, `category = "Khác"` | `Assert.AreEqual` | **ĐẠT** |
| 12 | **TC_MED_C2_03** | CFG C2 (Branch) | Đơn giá âm `unit_price = -100` | Ném lỗi 400 đơn giá phải $> 0$ | `Assert.Throws` | **ĐẠT** |
| 13 | **TC_MED_C3_03** | CFG C3 (MCDC) | Thiếu đơn giá (`undefined`) | Ném lỗi 400 đơn giá phải $> 0$ | `Assert.Throws` | **ĐẠT** |
| 14 | **TC_MED_C3_04** | CFG C3 (MCDC) | Đơn giá không phải số (`"ABC"`) | Ném lỗi 400 đơn giá phải $> 0$ | `Assert.Throws` | **ĐẠT** |
| 15 | **TC_MED_C3_06** | CFG C3 (MCDC) | Tồn kho không phải số (`"VO_HAN"`) | Ném lỗi 400 số lượng không hợp lệ | `Assert.Throws` | **ĐẠT** |
| 16 | **TC_MED_CUSE_03** | DFG (All c-use) | Fallback tồn kho mặc định khi không truyền | `stock_quantity = 0` | `Assert.AreEqual` | **ĐẠT** |

---

### 2.3 Kiểm thử Đơn vị cho thao tác Cập nhật & Xóa thuốc (Update & Delete)

| STT | Mã Ca | Loại kiểm thử | Kịch bản chi tiết | Kết quả kỳ vọng | Phương thức Assert | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 17 | **TC_UP_01** | Cập nhật thuốc | Mã thuốc không tồn tại (ID `9999`) | Ném lỗi HTTP 404 | `Assert.Throws` | **ĐẠT** |
| 18 | **TC_UP_02** | Cập nhật thuốc | Cập nhật tồn kho 350, giá 2200 | Cập nhật thành công, phát event | `Assert.AreEqual` | **ĐẠT** |
| 19 | **TC_UP_03** | Cập nhật thuốc | Cập nhật theo mã `MED002`, cắt khoảng trắng | Tên thuốc mới được chuẩn hóa | `Assert.AreEqual` | **ĐẠT** |
| 20 | **TC_UP_C3_01** | CFG C3 | Tìm thấy thuốc theo ID số (`id = 1`) | Cập nhật trường `unit = "Hộp"` | `Assert.AreEqual` | **ĐẠT** |
| 21 | **TC_UP_DF_02** | DFG (c-use) | Cập nhật đồng thời tên, hoạt chất, đơn giá | Cả 3 trường được lưu chính xác | `Assert.AreEqual` | **ĐẠT** |
| 22 | **TC_DEL_01** | Xóa thuốc | Xóa mã không tồn tại (`id = 9999`) | Ném lỗi HTTP 404 | `Assert.Throws` | **ĐẠT** |
| 23 | **TC_DEL_02** | Xóa thuốc | Xóa thành công thuốc tồn tại (`id = 1`) | Thuốc xóa khác null, tìm lại trả về null | `Assert.IsNull` | **ĐẠT** |

---

## 3. LỆNH CHẠY KIỂM THỬ
```powershell
# Chạy trực tiếp qua script PowerShell của Vương:
.\backend\test\vuong\validators\04_Lenh_Chay.ps1 -Phan 03

# Hoặc qua lệnh Node.js test runner:
node --test backend/test/vuong/validators/03_quanLyThuoc.test.js
```
