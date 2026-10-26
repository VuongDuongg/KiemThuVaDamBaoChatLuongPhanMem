# BÁO CÁO KIỂM THỬ ĐƠN VỊ — CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ
**Hệ thống:** Quản lý bệnh viện thông minh (HIS-Hospital)  
**Use Case:** `UC-THUNGAN-06` — Thanh toán hóa đơn viện phí  
**Tác giả thực hiện:** Vũ Đức Vương  
**Tệp mã nguồn kiểm thử:** [`backend/test/vuong/validators/02_thanhToanHoaDon.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/02_thanhToanHoaDon.test.js)  
**Tài liệu tham chiếu:** `docs/vuong/Kiểm thử đơn vị - sd NUnit.pdf` (ThS. Nguyễn Thị Phương Dung) & `docs/vuong/DanhSachCacTestCase.docx.md`

---

## 1. MÔ TẢ ĐƠN VỊ KIỂM THỬ & QUY TẮC NGHIỆP VỤ

### 1.1 Đơn vị kiểm thử (Units Under Test)
- Phương thức thực hiện giao dịch: `invoiceService.processPayment(idOrCode, paymentDetails)`.
- Chiến lược kiểm tra tính hợp lệ phương thức thanh toán: `PaymentMethodValidatorStrategy.validate(paymentMethod)` trong [`backend/src/patterns/strategy/billingStrategy.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/strategy/billingStrategy.js).
- Máy trạng thái vòng đời hóa đơn: `InvoiceStateMachine.transition(invoice, nextState)` trong [`backend/src/patterns/state/invoiceState.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/state/invoiceState.js).

### 1.2 Quy tắc nghiệp vụ kiểm thử
1. **Phương thức thanh toán:** Phải thuộc tập giá trị hợp lệ `["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"]`. Phương thức rỗng `""` hoặc không xác định (như `"BITCOIN"`, `"VNPAY"`) $\rightarrow$ Ném ngoại lệ.
2. **Kiểm tra trạng thái hóa đơn:** Hóa đơn phải tồn tại trong CSDL (khác 404) và đang ở trạng thái `UNPAID`. Nếu đã ở trạng thái `PAID` $\rightarrow$ Chặn giao dịch thanh toán lặp, ném lỗi HTTP 400.
3. **Đồng bộ hóa sau thanh toán:**
   - Chuyển trạng thái hóa đơn: `UNPAID` $\rightarrow$ `PAID`, gán nhãn thời gian `paid_at`, định danh thu ngân `cashier`.
   - Nếu hóa đơn là dịch vụ Cận lâm sàng (`CAN_LAM_SANG`): Tự động cập nhật phiếu chỉ định tương ứng sang `payment_status = "PAID"`.
   - Đồng bộ trạng thái bệnh nhân: Bệnh nhân ở trạng thái `Chờ thanh toán` được chuyển tự động sang `Đã khám`.

---

## 2. MA TRẬN TEST CASE KIỂM THỬ ĐƠN VỊ (21 TEST CASES)

### 2.1 Kiểm thử Hộp đen & Biên hàm (TC_F6_01 $\rightarrow$ TC_F6_09)

| STT | Mã Ca | Mô tả kịch bản kiểm thử | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **TC_F6_01** | Hóa đơn đã thanh toán trước đó | Hóa đơn trạng thái `PAID`, thanh toán tiếp | Chặn thanh toán, ném lỗi 400 | `Assert.Throws` | **ĐẠT** |
| 2 | **TC_F6_02** | Giá trị biên Max: `cancel_reason` đúng 255 ký tự | `cancel_reason` 255 ký tự | Hủy hóa đơn hợp lệ, trạng thái `CANCELLED` | `Assert.AreEqual` | **ĐẠT** |
| 3 | **TC_F6_03** | Giá trị biên Max+: `cancel_reason` 256 ký tự | `cancel_reason` 256 ký tự | Báo lỗi không vượt quá 255 ký tự | `Assert.Throws` | **ĐẠT** |
| 4 | **TC_F6_04** | Để trống phương thức thanh toán | `payment_method = ""` | Báo lỗi phương thức không hợp lệ | `Assert.Throws` | **ĐẠT** |
| 5 | **TC_F6_05** | Giá trị biên: Tiền nhận $499,999 < 500,000$ VNĐ | Tiền nhận thiếu 1 đồng | Báo lỗi tiền nhận phải $\ge$ tổng tiền | `Assert.Throws` | **ĐẠT** |
| 6 | **TC_F6_06** | Phân vùng tương đương: Tiền nhận âm ($-50,000$) | `amount_received = -50000` | Báo lỗi số tiền không hợp lệ | `Assert.Throws` | **ĐẠT** |
| 7 | **TC_F6_07** | Thanh toán tiền mặt hợp lệ | `payment_method = "TIEN_MAT"` | Trạng thái `PAID`, `paid_at` khác null | `Assert.AreEqual` | **ĐẠT** |
| 8 | **TC_F6_08** | Giá trị biên: Tiền nhận $1,000,000 > 500,000$ VNĐ | Tiền nhận dư | Tính đúng tiền thối lại $500,000$ VNĐ | `Assert.AreEqual` | **ĐẠT** |
| 9 | **TC_F6_09** | Quét mã VietQR thanh toán thành công | `payment_method = "VIETQR"` | Đồng bộ phiếu CLS `PAID` & bệnh nhân `Đã khám` | `Assert.AreEqual` | **ĐẠT** |

---

### 2.2 Kiểm thử Hộp trắng Dòng điều khiển (CFG) & Dòng dữ liệu (DFG)

| STT | Mã Ca | Loại kiểm thử | Kịch bản chi tiết | Kết quả kỳ vọng | Phương thức Assert | Trạng thái |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 10 | **TC_PAY_C1_01** | CFG C1 / C2 / C3 | Phương thức thanh toán lạ: `'BITCOIN'` | Ném ngoại lệ không hợp lệ | `Assert.Throws` | **ĐẠT** |
| 11 | **TC_PAY_C1_02** | CFG C1 / C2 / C3 | Hóa đơn không tồn tại (ID `9999`) | Ném ngoại lệ HTTP 404 | `Assert.Throws` | **ĐẠT** |
| 12 | **TC_PAY_C2_10** | CFG C2 / C3 / DFG | `reference_id` của phiếu CLS không có trong DB | Bỏ qua cập nhật CLS an toàn | `Assert.AreEqual` | **ĐẠT** |
| 13 | **TC_PAY_C2_11** | CFG C2 / C3 / DFG | Bệnh nhân `Chờ thanh toán` | Chuyển sang `Đã khám`, phát event | `Assert.AreEqual` | **ĐẠT** |
| 14 | **TC_PAY_C3_07** | CFG C3 / DFG | Hóa đơn tiền khám thông thường | Bỏ qua tra cứu phiếu CLS | `Assert.AreEqual` | **ĐẠT** |
| 15 | **TC_PAY_C3_08** | CFG C3 | Hóa đơn CLS nhưng `reference_id = null` | Bỏ qua tra cứu phiếu CLS | `Assert.AreEqual` | **ĐẠT** |
| 16 | **TC_PAY_C3_11** | CFG C3 | `patientRepository` trả về null | Bỏ qua đổi trạng thái bệnh nhân | `Assert.AreEqual` | **ĐẠT** |
| 17 | **TC_PAY_C3_12** | CFG C3 | Bệnh nhân có trạng thái `'Đang khám'` | Giữ nguyên trạng thái, không phát event | `Assert.AreEqual` | **ĐẠT** |
| 18 | **TC_PAY_CUSE_01** | DFG (All c-use) | Cặp def-use cho `payment_method`, `cashier`, `invoice`, `patient` | Các giá trị được sử dụng đúng mục đích | `Assert.AreEqual` | **ĐẠT** |
| 19 | **TC_PAY_CUSE_02** | DFG (All c-use) | Cặp def-use cho `reference_id` và `labOrder` | Phiếu CLS nhận đúng trạng thái `PAID` | `Assert.AreEqual` | **ĐẠT** |
| 20 | **TC_PAY_CUSE_03** | DFG (All c-use) | Fallback giá trị mặc định khi gọi không tham số | Mặc định `"TIEN_MAT"`, `"Trần Văn Thu Ngân"` | `Assert.AreEqual` | **ĐẠT** |
| 21 | **TC_PAY_PUSE_01** | DFG (All p-use) | Biểu thức điều kiện p-use với `'VNPAY'` | Nhánh sai bị chặn và ném ngoại lệ | `Assert.Throws` | **ĐẠT** |

---

## 3. LỆNH CHẠY KIỂM THỬ
```powershell
# Chạy trực tiếp qua script PowerShell của Vương:
.\backend\test\vuong\validators\04_Lenh_Chay.ps1 -Phan 02

# Hoặc qua lệnh Node.js test runner:
node --test backend/test/vuong/validators/02_thanhToanHoaDon.test.js
```
