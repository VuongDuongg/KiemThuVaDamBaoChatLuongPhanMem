# Tổng hợp test case kiểm thử đơn vị — Lê Tuấn Khanh

Ngày xác minh: 26/10/2026. Phạm vi: ba file unit test validate đã tạo cho chức năng 3.10–3.12. Tổng cộng **45 ca: 45 đạt, 0 không đạt, 0 bỏ qua**.

Mỗi dòng tương ứng một `test()` khi chạy. Một số ca có nhiều bộ dữ liệu hoặc nhiều phép so sánh; các biến thể đều được ghi trong bảng. Mã UT01–UT45 là số thứ tự tổng hợp, giữ mã TC_F16/TC_F17 sẵn có trong tên ca.

Các ca kiểm tra trực tiếp hàm validate, không kiểm tra thao tác giao diện, lưu CSDL, tải tệp thật, gửi thông báo hoặc gắn cờ chỉ số bất thường. `null` nghĩa là đầu vào hợp lệ; chuỗi thông báo nghĩa là đầu vào bị từ chối.

## 01. Tiếp nhận chỉ định cận lâm sàng

Hàm: `ReceiveOrderValidator.validateReceiveOrder`. Các trường không ghi trong bảng giữ dữ liệu mặc định sau:

```javascript
{ order_search_key: "CLS_123", selected_order_id: 1,
  payment_status: "PAID", order_dept: "LAB", technician_dept: "LAB" }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT01 | TC_F16_01 — Mã quá dài | order_search_key = "A" × 31 | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | Đạt |
| UT02 | TC_F16_02 — Ký tự đặc biệt | order_search_key = "CLS_123@" | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | Đạt |
| UT03 | TC_F16_03 — Không chọn phiếu | order_search_key = ""; selected_order_id = null | Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ. | Đạt |
| UT04 | TC_F16_04 — Chưa thanh toán | order_search_key = "A" × 30; payment_status = "UNPAID" | Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước. | Đạt |
| UT05 | TC_F16_05 — Khác phòng | technician_dept = "PACS" | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | Đạt |
| UT06 | TC_F16_06 — Hợp lệ | Dữ liệu mặc định | null | Đạt |
| UT07 | Mã tra cứu rỗng | order_search_key = "" | null | Đạt |
| UT08 | Mã đúng 30 ký tự | order_search_key = "A" × 30 | null | Đạt |
| UT09 | Khoảng trắng ở hai đầu | order_search_key = "  CLS_123  " | null | Đạt |
| UT10 | Thiếu thông tin hai phòng | order_dept = undefined; technician_dept = undefined | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | Đạt |

## 02. Nhập kết quả xét nghiệm định lượng

Hàm: `LabResultValidator.validateLabResult`. Dữ liệu mặc định:

```javascript
{ order: { id: 1, type: "LAB" }, test_value: "5.2", general_notes: "" }
```

Theo đặc tả đang áp dụng: chỉ số định lượng phải là số thực dương, nên giá trị 0 bị từ chối.

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT11 | TC_F17_01 — Phiếu không tồn tại hoặc sai nhóm | Lần lượt order = undefined; {}; {id: 1, type: "PACS"} | Mã phiếu chỉ định xét nghiệm không hợp lệ. | Đạt |
| UT12 | TC_F17_02 — Bỏ trống | test_value = "" | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT13 | TC_F17_03 — Lẫn chữ | test_value = "12.5A" | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT14 | TC_F17_04 — Số âm | test_value = -5.2 | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT15 | Giá trị null | test_value = null | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT16 | Giá trị undefined | test_value = undefined | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT17 | Chỉ có khoảng trắng | test_value = "   " | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT18 | Biên 0 | test_value = 0 | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT19 | Vô cực | test_value = Infinity | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT20 | Không phải số | test_value = NaN | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT21 | Kiểu boolean | test_value = true | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT22 | Kiểu mảng | test_value = [5] | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT23 | Chuỗi hệ 16 | test_value = "0x10" | Giá trị chỉ số phải là chữ số hợp lệ. | Đạt |
| UT24 | TC_F17_05 — Nhận xét vượt giới hạn | general_notes = "a" × 501 | Nhận xét tổng quát không được vượt quá 500 ký tự. | Đạt |
| UT25 | TC_F17_06 — Nhận xét rỗng | general_notes = "" | null | Đạt |
| UT26 | TC_F17_07 — Nhận xét đúng giới hạn | general_notes = "a" × 500 | null | Đạt |
| UT27 | Các dạng số dương hợp lệ | Lần lượt test_value = 0.01; 1; " 5.2 "; ".5" | null cho từng giá trị | Đạt |
| UT28 | Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào | test_value = 10 | null; không kiểm tra gắn cờ bất thường | Đạt |

## 03. Hình ảnh và kết luận PACS

Hàm: `PacsValidator.validatePacs`. Quy ước `MB = 1024 × 1024` byte; `"a" × n` là chuỗi lặp ký tự a đúng n lần. Dữ liệu mặc định:

```javascript
{ image_files: [{ name: "phoi.jpg", size: 1024 * 1024 }],
  image_description: "a".repeat(10), diagnostic_conclusion: "a".repeat(5) }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT29 | Không chọn tệp | image_files = [] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT30 | Thiếu danh sách tệp | image_files = undefined | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT31 | Sai định dạng | image_files = [{name: "phoi.pdf", size: MB}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT32 | Vượt 25MB | image_files = [{name: "phoi.jpg", size: 25.1 × MB}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT33 | Tệp rỗng | image_files = [{name: "phoi.jpg", size: 0}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT34 | Dung lượng NaN | image_files = [{name: "phoi.jpg", size: NaN}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT35 | Dung lượng vô cực | image_files = [{name: "phoi.jpg", size: Infinity}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT36 | Tệp thứ hai sai | image_files = [{name: "phoi.jpg", size: MB}, {name: "a.pdf", size: MB}] | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | Đạt |
| UT37 | Mô tả 0 ký tự | image_description = "a" × 0 | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Đạt |
| UT38 | Mô tả 9 ký tự | image_description = "a" × 9 | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Đạt |
| UT39 | Mô tả 2001 ký tự | image_description = "a" × 2001 | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | Đạt |
| UT40 | Kết luận 0 ký tự | diagnostic_conclusion = "a" × 0 | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Đạt |
| UT41 | Kết luận 4 ký tự | diagnostic_conclusion = "a" × 4 | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Đạt |
| UT42 | Kết luận 1001 ký tự | diagnostic_conclusion = "a" × 1001 | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Đạt |
| UT43 | Văn bản chỉ có khoảng trắng | Lượt 1: image_description = " " × 10. Lượt 2: diagnostic_conclusion = " " × 5 | Lượt 1: Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). Lượt 2: Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | Đạt |
| UT44 | Các biên hợp lệ | Tệp phoi.DCM = 25 × MB; độ dài mô tả ∈ {10, 2000}; độ dài kết luận ∈ {5, 1000}; chạy cả 4 tổ hợp | null cho cả 4 tổ hợp | Đạt |
| UT45 | Nhiều tệp đúng định dạng | 4 tệp phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm; mỗi tệp 1 × MB | null | Đạt |


