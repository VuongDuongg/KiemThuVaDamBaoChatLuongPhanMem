# BÁO CÁO KIỂM THỬ ĐƠN VỊ — CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ
**Hệ thống:** Quản lý bệnh viện thông minh (HIS-Hospital)  
**Use Case:** `UC-THUNGAN-05` — Lập hóa đơn viện phí  
**Tác giả thực hiện:** Vũ Đức Vương  
**Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/01_lapHoaDon.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/01_lapHoaDon.test.js)  
**Tài liệu tham chiếu:** `docs/vuong/Kiểm thử đơn vị - sd NUnit.pdf` (ThS. Nguyễn Thị Phương Dung) & `docs/vuong/DanhSachCacTestCase.docx.md`

---

## 1. MÔ TẢ ĐƠN VỊ KIỂM THỬ & QUY TẮC NGHIỆP VỤ

### 1.1 Đơn vị kiểm thử (Units Under Test)
- Hàm xác thực đầu vào tìm kiếm: `validateInvoiceCreationInput(params)` trong [`backend/src/validators/invoiceValidator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/validators/invoiceValidator.js).
- Phương thức tra cứu chi phí chưa thanh toán: `invoiceService.getPendingCharges(params)`.
- Phương thức tạo hóa đơn viện phí: `invoiceService.createInvoice(payload)`.
- Chiến lược tính toán viện phí: `StandardBillingStrategy.calculate(totalAmount, insuranceDiscount)`.

### 1.2 Quy tắc nghiệp vụ kiểm thử
1. **Tìm kiếm bệnh nhân:** Bắt buộc nhập ít nhất `patient_id` hoặc `patient_name`. `patient_id` tối đa 20 ký tự (chỉ chữ và số). `patient_name` tối đa 50 ký tự (chữ cái và khoảng trắng).
2. **Kiểm tra trạng thái thanh toán:** Nếu tất cả dịch vụ của bệnh nhân đã được thanh toán $\rightarrow$ Khóa nút tạo hóa đơn (`can_create_invoice = false`), báo mã lỗi `E1.4`.
3. **Quy tắc tạo hóa đơn:**
   - Bắt buộc đủ `patient_code`, `patient_name`, `total_amount`.
   - Tổng tiền $total\_amount > 0$. Nếu $\le 0$ hoặc `NaN` $\rightarrow$ Ném ngoại lệ.
   - Mức giảm trừ bảo hiểm: $0 \le insurance\_discount \le total\_amount$.
   - Số tiền bệnh nhân trả: $patient\_pay = \max(0, total\_amount - insurance\_discount)$.
   - Phương thức thanh toán `"CHUA_THANH_TOAN"` sinh hóa đơn ở trạng thái `"UNPAID"`. Phương thức `"TIEN_MAT"` hoặc `"VIETQR"` sinh trạng thái `"PAID"`.

---

## 2. MA TRẬN TEST CASE KIỂM THỬ ĐƠN VỊ (26 TEST CASES)

### 2.1 Kiểm thử Hộp đen & Biên hàm (TC_F5_01 $\rightarrow$ TC_F5_14)

| STT | Mã Ca | Mô tả kịch bản kiểm thử | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **TC_F5_01** | Giá trị biên Min: `patient_id` = 1 ký tự | `{ patient_id: "B" }` | `isValid = true` | `Assert.IsTrue` | **ĐẠT** |
| 2 | **TC_F5_02** | Giá trị biên Max: `patient_id` = 20 ký tự | `{ patient_id: "BN123456789012345678" }` | `isValid = true` | `Assert.IsTrue` | **ĐẠT** |
| 3 | **TC_F5_03** | Giá trị biên Max+: `patient_id` = 21 ký tự | `{ patient_id: "BN1234567890123456789" }` | `isValid = false`, lỗi độ dài | `Assert.IsFalse` | **ĐẠT** |
| 4 | **TC_F5_04** | Ký tự đặc biệt: `patient_id` chứa `@` | `{ patient_id: "BN-123@" }` | `isValid = false`, lỗi ký tự đặc biệt | `Assert.IsFalse` | **ĐẠT** |
| 5 | **TC_F5_05** | Giá trị biên Min: `patient_name` = 1 ký tự | `{ patient_name: "A" }` | `isValid = true` | `Assert.IsTrue` | **ĐẠT** |
| 6 | **TC_F5_06** | Giá trị biên Max: `patient_name` = 50 ký tự | `name` đúng 50 ký tự | `isValid = true` | `Assert.IsTrue` | **ĐẠT** |
| 7 | **TC_F5_07** | Giá trị biên Max+: `patient_name` = 51 ký tự | `name` đúng 51 ký tự | `isValid = false`, lỗi vượt quá 50 ký tự | `Assert.IsFalse` | **ĐẠT** |
| 8 | **TC_F5_08** | Phân vùng tương đương: `patient_name` chứa số | `{ patient_name: "Nguyen Van A123" }` | `isValid = false`, lỗi chứa số | `Assert.IsFalse` | **ĐẠT** |
| 9 | **TC_F5_09** | Bảng quyết định Q1: Bỏ trống cả 2 trường tìm kiếm | `{}` | `isValid = false`, mã lỗi `E1.1` | `Assert.AreEqual` | **ĐẠT** |
| 10 | **TC_F5_10** | Bảng quyết định Q2: Tìm bệnh nhân không tồn tại | `patient_id = "BN999999"` | Ngoại lệ 404, mã lỗi `E1.3` | `Assert.Throws` | **ĐẠT** |
| 11 | **TC_F5_11** | Bảng quyết định Q3/Q5: Có chi phí chưa thanh toán | Bệnh nhân `BN001` có dịch vụ chưa thu | `can_create_invoice = true`, `patient_pay = 30000` | `Assert.IsTrue` | **ĐẠT** |
| 12 | **TC_F5_12** | Bảng quyết định Q3: Tất cả dịch vụ đã thanh toán | Bệnh nhân `BN001` có hóa đơn `PAID` | `can_create_invoice = false`, mã lỗi `E1.4` | `Assert.IsFalse` | **ĐẠT** |
| 13 | **TC_F5_13** | Bảng quyết định Q4: Tạo hóa đơn số tiền = 0 | `{ total_amount: 0 }` | Chặn tạo, báo tổng tiền $> 0$ | `Assert.Throws` | **ĐẠT** |
| 14 | **TC_F5_14** | Bảng quyết định Q5: Tạo hóa đơn hợp lệ chưa thanh toán | `total = 300000, discount = 60000` | `status = "UNPAID"`, `patient_pay = 240000` | `Assert.AreEqual` | **ĐẠT** |

---

### 2.2 Kiểm thử Hộp trắng Dòng điều khiển (CFG C1, C2, C3) & Dòng dữ liệu (DFG)

| STT | Mã Ca | Loại kiểm thử | Kịch bản chi tiết | Kết quả kỳ vọng | Phương thức Assert | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 15 | **TC_C1_01** | CFG C1 / C2 / C3 | `patient_code` rỗng `""` | Ném lỗi HTTP 400 | `Assert.Throws` | **ĐẠT** |
| 16 | **TC_C1_02** | CFG C1 / C3 | `total_amount = 0` | Ngoại lệ $> 0$ | `Assert.Throws` | **ĐẠT** |
| 17 | **TC_C1_03** | CFG C1 / C2 / C3 | `insurance_discount = -20000` ($< 0$) | Báo lỗi mức giảm trừ không được âm | `Assert.Throws` | **ĐẠT** |
| 18 | **TC_C1_04** | CFG C1 / C2 / C3 | `insurance_discount > total_amount` | Báo lỗi vượt quá tổng tiền | `Assert.Throws` | **ĐẠT** |
| 19 | **TC_C1_05** | CFG C1 / C2 / C3 | `payment_method = 'CHUA_THANH_TOAN'` | Hóa đơn trạng thái `UNPAID` | `Assert.AreEqual` | **ĐẠT** |
| 20 | **TC_C1_06** | CFG C1 / C3 | `payment_method = 'TIEN_MAT'` | Hóa đơn trạng thái `PAID` | `Assert.AreEqual` | **ĐẠT** |
| 21 | **TC_C2_03** | CFG C2 (Branch) | `total_amount = -1000` | Báo lỗi tổng tiền $> 0$ | `Assert.Throws` | **ĐẠT** |
| 22 | **TC_C2_09** | CFG C2 (Branch) | `payment_method = 'VIETQR'` | Hóa đơn trạng thái `PAID` | `Assert.AreEqual` | **ĐẠT** |
| 23 | **TC_C3_02** | CFG C3 (MCDC) | `patient_name` rỗng `""` (Điều kiện 2b=True) | Ném lỗi HTTP 400 | `Assert.Throws` | **ĐẠT** |
| 24 | **TC_C3_03** | CFG C3 (MCDC) | `total_amount === undefined` (Điều kiện 2c=True) | Ném lỗi HTTP 400 | `Assert.Throws` | **ĐẠT** |
| 25 | **TC_C3_04** | CFG C3 (MCDC) | `total_amount === null` (Điều kiện 2d=True) | Ném lỗi HTTP 400 | `Assert.Throws` | **ĐẠT** |
| 26 | **TC_C3_05** | CFG C3 (MCDC) | `total_amount = "KHONG_PHAI_SO"` (Điều kiện 5a=True) | Báo lỗi tổng tiền $> 0$ | `Assert.Throws` | **ĐẠT** |

---

## 3. LỆNH CHẠY KIỂM THỬ
```powershell
# Chạy trực tiếp qua script PowerShell của Vương:
.\backend\test\vuong\validators\04_Lenh_Chay.ps1 -Phan 01

# Hoặc qua lệnh Node.js test runner:
node --test backend/test/vuong/validators/01_lapHoaDon.test.js
```
