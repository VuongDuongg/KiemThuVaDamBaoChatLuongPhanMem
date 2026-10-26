# BÁO CÁO THỰC THI KIỂM THỬ ĐƠN VỊ 45 TEST CASE VALIDATE (CLS - LAB - PACS)
**Dự án:** Hệ Thống Quản Lý Bệnh Viện (HIS Hospital)  
**Tác giả đặc tả Test Case:** Lê Tuấn Khanh  
**Tệp đặc tả tham chiếu:** [Tong_Hop_45_Test_Case_Validate.md](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/Tong_Hop_45_Test_Case_Validate.md)  
**Môi trường thực thi:** Node.js Native Test Runner (`node:test`) & Vitest (`vitest`) kết hợp bộ chuyển đổi xác nhận NUnit (`Assert.AreEqual`, `Assert.IsNull`)  
**Nguyên tắc cam kết:** TUYỆT ĐỐI KHÔNG SỬA ĐỔI MÃ NGUỒN NGHIỆP VỤ ỨNG DỤNG ĐỂ VƯỢT QUA TEST.

---

## 1. TỔNG QUAN KẾT QUẢ THỰC THI

| Chỉ số | Giá trị | Tỷ lệ | Ghi chú |
|---|---|---|---|
| **Tổng số ca kiểm thử** | **45** | 100% | Phân bổ đều cho 3 chức năng CLS |
| **Số ca ĐẠT (PASS)** | **45** | **100%** | Toàn bộ kiểm thử thực tế khớp 100% kết quả kỳ vọng |
| **Số ca KHÔNG ĐẠT (FAIL)** | **0** | 0% | Không có ngoại lệ hoặc sai lệch logic |
| **Số ca BỎ QUA (SKIPPED)** | **0** | 0% | Tất cả ca kiểm thử đều được kích hoạt tự động |
| **Thời gian thực thi (Runtime)** | **~98 ms** | - | Chạy song song tốc độ cao trên Node/Vitest |

---

## 2. DANH MỤC CHI TIẾT 45 CA KIỂM THỬ ĐƠN VỊ

### Phân hệ 1: Tiếp nhận chỉ định cận lâm sàng (3.10)
* **Lớp kiểm thử:** `ReceiveOrderValidator.validateReceiveOrder`
* **File mã nguồn Validator:** [01_receiveOrder.validator.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/01_receiveOrder.validator.js)
* **File Test Suite:** [01_receiveOrder.test.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/01_receiveOrder.test.js)
* **Dữ liệu mặc định:** `{ order_search_key: "CLS_123", selected_order_id: 1, payment_status: "PAID", order_dept: "LAB", technician_dept: "LAB" }`

| STT | Mã kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|:---:|:---|:---|:---|:---|:---:|
| **UT01** | TC_F16_01 — Mã quá dài | `order_search_key = "A" × 31` | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | **ĐẠT (PASS)** |
| **UT02** | TC_F16_02 — Ký tự đặc biệt | `order_search_key = "CLS_123@"` | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | **ĐẠT (PASS)** |
| **UT03** | TC_F16_03 — Không chọn phiếu | `order_search_key = ""; selected_order_id = null` | Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ. | Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ. | **ĐẠT (PASS)** |
| **UT04** | TC_F16_04 — Chưa thanh toán | `order_search_key = "A" × 30; payment_status = "UNPAID"` | Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước. | Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước. | **ĐẠT (PASS)** |
| **UT05** | TC_F16_05 — Khác phòng | `technician_dept = "PACS"` | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | **ĐẠT (PASS)** |
| **UT06** | TC_F16_06 — Hợp lệ | Dữ liệu mặc định | `null` | `null` | **ĐẠT (PASS)** |
| **UT07** | Mã tra cứu rỗng | `order_search_key = ""` | `null` | `null` | **ĐẠT (PASS)** |
| **UT08** | Mã đúng 30 ký tự | `order_search_key = "A" × 30` | `null` | `null` | **ĐẠT (PASS)** |
| **UT09** | Khoảng trắng ở hai đầu | `order_search_key = "  CLS_123  "` | `null` | `null` | **ĐẠT (PASS)** |
| **UT10** | Thiếu thông tin hai phòng | `order_dept = undefined; technician_dept = undefined` | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | **ĐẠT (PASS)** |

---

### Phân hệ 2: Nhập kết quả xét nghiệm định lượng (3.11)
* **Lớp kiểm thử:** `LabResultValidator.validateLabResult`
* **File mã nguồn Validator:** [02_labResult.validator.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.validator.js)
* **File Test Suite:** [02_labResult.test.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.test.js)
* **Dữ liệu mặc định:** `{ order: { id: 1, type: "LAB" }, test_value: "5.2", general_notes: "" }`

| STT | Mã kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|:---:|:---|:---|:---|:---|:---:|
| **UT11** | TC_F17_01 — Phiếu không hợp lệ | Lần lượt `order = undefined; {}; {id: 1, type: "PACS"}` | Mã phiếu chỉ định xét nghiệm không hợp lệ. | Mã phiếu chỉ định xét nghiệm không hợp lệ. | **ĐẠT (PASS)** |
| **UT12** | TC_F17_02 — Bỏ trống | `test_value = ""` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT13** | TC_F17_03 — Lẫn chữ | `test_value = "12.5A"` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT14** | TC_F17_04 — Số âm | `test_value = -5.2` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT15** | Giá trị null | `test_value = null` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT16** | Giá trị undefined | `test_value = undefined` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT17** | Chỉ có khoảng trắng | `test_value = "   "` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT18** | Biên 0 | `test_value = 0` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT19** | Vô cực | `test_value = Infinity` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT20** | Không phải số | `test_value = NaN` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT21** | Kiểu boolean | `test_value = true` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT22** | Kiểu mảng | `test_value = [5]` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT23** | Chuỗi hệ 16 | `test_value = "0x10"` | Giá trị chỉ số phải là chữ số hợp lệ. | Giá trị chỉ số phải là chữ số hợp lệ. | **ĐẠT (PASS)** |
| **UT24** | TC_F17_05 — Nhận xét vượt 500 ký tự | `general_notes = "a" × 501` | Nhận xét tổng quát không được vượt quá 500 ký tự. | Nhận xét tổng quát không được vượt quá 500 ký tự. | **ĐẠT (PASS)** |
| **UT25** | TC_F17_06 — Nhận xét rỗng | `general_notes = ""` | `null` | `null` | **ĐẠT (PASS)** |
| **UT26** | TC_F17_07 — Nhận xét đúng 500 ký tự | `general_notes = "a" × 500` | `null` | `null` | **ĐẠT (PASS)** |
| **UT27** | Các dạng số dương hợp lệ | Lần lượt `test_value = 0.01; 1; " 5.2 "; ".5"` | `null` cho từng giá trị | `null` cho từng giá trị | **ĐẠT (PASS)** |
| **UT28** | Ngoài dải tham chiếu vẫn hợp lệ đầu vào | `test_value = 10` | `null` | `null` | **ĐẠT (PASS)** |

---

### Phân hệ 3: Hình ảnh và kết luận chẩn đoán PACS (3.12)
* **Lớp kiểm thử:** `PacsValidator.validatePacs`
* **File mã nguồn Validator:** [03_pacs.validator.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.validator.js)
* **File Test Suite:** [03_pacs.test.js](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.test.js)
* **Quy ước:** `MB = 1024 × 1024` byte.
* **Dữ liệu mặc định:** `{ image_files: [{ name: "phoi.jpg", size: 1024 * 1024 }], image_description: "a".repeat(10), diagnostic_conclusion: "a".repeat(5) }`

| STT | Mã kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|:---:|:---|:---|:---|:---|:---:|
| **UT29** | Không chọn tệp | `image_files = []` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT30** | Thiếu danh sách tệp | `image_files = undefined` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT31** | Sai định dạng tệp | `image_files = [{name: "phoi.pdf", size: MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT32** | Dung lượng vượt 25MB | `image_files = [{name: "phoi.jpg", size: 25.1 × MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT33** | Tệp rỗng (0 byte) | `image_files = [{name: "phoi.jpg", size: 0}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT34** | Dung lượng NaN | `image_files = [{name: "phoi.jpg", size: NaN}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT35** | Dung lượng vô cực | `image_files = [{name: "phoi.jpg", size: Infinity}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT36** | Tệp thứ hai sai | `image_files = [{name: "phoi.jpg", size: MB}, {name: "a.pdf", size: MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | **ĐẠT (PASS)** |
| **UT37** | Mô tả 0 ký tự | `image_description = "a" × 0` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | **ĐẠT (PASS)** |
| **UT38** | Mô tả 9 ký tự (dưới min) | `image_description = "a" × 9` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | **ĐẠT (PASS)** |
| **UT39** | Mô tả 2001 ký tự (vượt max) | `image_description = "a" × 2001` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | **ĐẠT (PASS)** |
| **UT40** | Kết luận 0 ký tự | `diagnostic_conclusion = "a" × 0` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | **ĐẠT (PASS)** |
| **UT41** | Kết luận 4 ký tự (dưới min) | `diagnostic_conclusion = "a" × 4` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | **ĐẠT (PASS)** |
| **UT42** | Kết luận 1001 ký tự (vượt max) | `diagnostic_conclusion = "a" × 1001` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | **ĐẠT (PASS)** |
| **UT43** | Văn bản chỉ có khoảng trắng | Lượt 1: `desc = " " × 10`<br>Lượt 2: `concl = " " × 5` | Lượt 1: Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).<br>Lượt 2: Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Khớp đúng thông báo lỗi ở cả 2 lượt | **ĐẠT (PASS)** |
| **UT44** | Các biên hợp lệ (4 tổ hợp) | Tệp `phoi.DCM` 25MB; độ dài mô tả ∈ {10, 2000}; độ dài kết luận ∈ {5, 1000} | `null` cho cả 4 tổ hợp | `null` cho cả 4 tổ hợp | **ĐẠT (PASS)** |
| **UT45** | Nhiều tệp đúng định dạng | 4 tệp `phoi.jpg`, `phoi.jpeg`, `phoi.png`, `phoi.dcm`; mỗi tệp 1MB | `null` | `null` | **ĐẠT (PASS)** |

---

## 3. HƯỚNG DẪN THỰC THI VÀ LỆNH CHẠY TỰ ĐỘNG

Người dùng và kiểm thử viên có thể chạy kiểm thử theo bất kỳ cách nào dưới đây:

### Cách 1: Sử dụng PowerShell script `04_Lenh_Chay.ps1`
Đứng tại thư mục: `his-hospital/backend/test/khanh/validators/`:

```powershell
# Chạy toàn bộ 45 ca kiểm thử:
.\04_Lenh_Chay.ps1

# Chạy riêng phần 01 - Tiếp nhận chỉ định cận lâm sàng (10 ca):
.\04_Lenh_Chay.ps1 -Phan 01

# Chạy riêng phần 02 - Nhập kết quả xét nghiệm định lượng (18 ca):
.\04_Lenh_Chay.ps1 -Phan 02

# Chạy riêng phần 03 - Hình ảnh và kết luận PACS (17 ca):
.\04_Lenh_Chay.ps1 -Phan 03
```

### Cách 2: Sử dụng lệnh npm script chuẩn
Đứng tại thư mục gốc backend `his-hospital/backend/`:

```powershell
# Chạy riêng 45 ca kiểm thử validate:
npm run test:validate

# Chạy tổng hợp các bộ unit test:
npm run test:unit

# Chạy kiểm thử trên Vitest runner:
npm run test:vitest

# Chạy toàn bộ test suite của dự án (189/189 ca ĐẠT):
npm test
```
