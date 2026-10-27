# Tổng hợp test case kiểm thử đơn vị — Ngô Tuấn Anh

Ngày xác minh: 26/10/2026. Phạm vi: ba file unit test validate đã tạo cho chức năng 1.1–1.3. Tổng cộng **45 ca: 45 đạt, 0 không đạt, 0 bỏ qua**.

Mỗi dòng tương ứng một `test()` khi chạy. Một số ca có nhiều bộ dữ liệu hoặc nhiều phép so sánh; các biến thể đều được ghi trong bảng. Mã UT01–UT45 là số thứ tự tổng hợp, giữ mã TC_F12/TC_F13/TC_F14 sẵn có trong tên ca.

Các ca kiểm tra trực tiếp hàm validate, không kiểm tra thao tác giao diện, lưu CSDL, gửi thông báo hoặc đồng bộ phân hệ khác. `null` nghĩa là đầu vào hợp lệ; chuỗi thông báo nghĩa là đầu vào bị từ chối.

## 01. Cập nhật thông tin bệnh án và chẩn đoán

Hàm: `ConsultationValidator.validateConsultation`. Các trường không ghi trong bảng giữ dữ liệu mặc định sau:

```javascript
{ chief_complaint: "Đau đầu âm ỉ kéo dài", history_and_symptoms: "Tiền sử khỏe mạnh, không dị ứng",
  icd10_main_code: "I10", icd10_sub_codes: ["E11"] }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT01 | TC_F12_01 — Lý do khám 4 ký tự | chief_complaint = "a" × 4 | Vui lòng nhập lý do đến khám của bệnh nhân. | Đạt |
| UT02 | TC_F12_02 — Lý do khám 2001 ký tự | chief_complaint = "a" × 2001 | Vui lòng nhập lý do đến khám của bệnh nhân. | Đạt |
| UT03 | TC_F12_03 — Triệu chứng 4001 ký tự | history_and_symptoms = "a" × 4001 | Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự). | Đạt |
| UT04 | TC_F12_04 — Bỏ trống mã chính | icd10_main_code = "" | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | Đạt |
| UT05 | TC_F12_05 — Mã phụ trùng mã chính | icd10_main_code = "I10"; icd10_sub_codes = ["I10"] | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | Đạt |
| UT06 | TC_F12_06 — Biên dưới hợp lệ | chief_complaint = "a" × 5; history_and_symptoms = ""; icd10_sub_codes = [] | null | Đạt |
| UT07 | TC_F12_07 — Biên trên hợp lệ | chief_complaint = "a" × 2000; history_and_symptoms = "a" × 4000; icd10_sub_codes = ["E11", "J00"] | null | Đạt |
| UT08 | Lý do khám chỉ có khoảng trắng | chief_complaint = "     " | Vui lòng nhập lý do đến khám của bệnh nhân. | Đạt |
| UT09 | Lý do khám null hoặc undefined | Lần lượt chief_complaint = null; undefined | Vui lòng nhập lý do đến khám của bệnh nhân. | Đạt |
| UT10 | Không truyền tiền sử & triệu chứng | history_and_symptoms = undefined | null | Đạt |
| UT11 | Mã chẩn đoán chính không thuộc ICD-10 | icd10_main_code = "MA_AO_99" | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | Đạt |
| UT12 | Mã chẩn đoán chính chỉ có khoảng trắng | icd10_main_code = "   " | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | Đạt |
| UT13 | Mã kèm theo không thuộc ICD-10 | icd10_sub_codes = ["E11", "MA_SAI"] | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | Đạt |
| UT14 | Mã kèm theo tự trùng lặp nhau | icd10_sub_codes = ["E11", "E11"] | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | Đạt |
| UT15 | Dữ liệu mặc định hợp lệ | Dữ liệu mặc định | null | Đạt |

## 02. Chỉ định dịch vụ cận lâm sàng

Hàm: `LabOrderValidator.validateLabOrder`. Dữ liệu mặc định:

```javascript
{ cls_service_ids: ["XQ01"], cls_clinical_instruction: "Chụp X-quang tim phổi thẳng" }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT16 | TC_F13_01 — Không chọn dịch vụ | cls_service_ids = [] | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT17 | TC_F13_02 — Ghi chú 501 ký tự | cls_clinical_instruction = "a" × 501 | Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự). | Đạt |
| UT18 | TC_F13_03 — 1 dịch vụ, ghi chú 0 ký tự | cls_service_ids = ["XQ01"]; cls_clinical_instruction = "" | null | Đạt |
| UT19 | TC_F13_04 — Nhiều dịch vụ, ghi chú 500 ký tự | cls_service_ids = ["XQ01", "SA01", "XN01"]; cls_clinical_instruction = "a" × 500 | null | Đạt |
| UT20 | Danh sách dịch vụ null hoặc undefined | Lần lượt cls_service_ids = null; undefined | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT21 | Danh sách dịch vụ không phải mảng | cls_service_ids = "XQ01" | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT22 | Mã dịch vụ chỉ có khoảng trắng | cls_service_ids = ["   "] | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT23 | Mã dịch vụ không tồn tại trong danh mục | cls_service_ids = ["CLS_KHONG_TON_TAI"] | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT24 | Danh sách có dịch vụ thứ hai không tồn tại | cls_service_ids = ["XQ01", "DV_AO"] | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | Đạt |
| UT25 | Ghi chú dặn dò để undefined | cls_clinical_instruction = undefined | null | Đạt |
| UT26 | Ghi chú dặn dò có khoảng trắng hai đầu | cls_clinical_instruction = "  Chụp tư thế đứng  " | null | Đạt |
| UT27 | Ghi chú dặn dò sai kiểu dữ liệu | cls_clinical_instruction = 12345 | Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự). | Đạt |

## 03. Kê đơn thuốc

Hàm: `PrescriptionValidator.validatePrescription`. Dữ liệu mặc định:

```javascript
{ drug_id: "MED001", available_stock: 50, quantity: 10,
  usage_instruction: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn",
  interaction_level: "NONE", interaction_override_confirm: false }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT28 | TC_F14_01 — Thuốc tồn kho bằng 0 | available_stock = 0 | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | Đạt |
| UT29 | TC_F14_02 — Số lượng cấp bằng 0 | quantity = 0 | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT30 | Số lượng cấp là số âm | quantity = -2 | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT31 | TC_F14_03 — Số lượng cấp vượt tồn kho | available_stock = 50; quantity = 51 | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT32 | TC_F14_04 — Hướng dẫn 251 ký tự | usage_instruction = "a" × 251 | Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc. | Đạt |
| UT33 | TC_F14_05 — Chống chỉ định tuyệt đối | interaction_level = "SEVERE"; interaction_override_confirm = true | Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối. | Đạt |
| UT34 | TC_F14_06 — Tương tác nhẹ, không xác nhận | interaction_level = "MILD"; interaction_override_confirm = false | Vui lòng xác nhận ghi đè cảnh báo tương tác thuốc mức độ nhẹ để tiếp tục kê đơn. | Đạt |
| UT35 | TC_F14_07 — Tương tác nhẹ, đồng ý kê | interaction_level = "MILD"; interaction_override_confirm = true | null | Đạt |
| UT36 | TC_F14_08 — Các biên trên hợp lệ | available_stock = 100; quantity = 100; usage_instruction = "a" × 250 | null | Đạt |
| UT37 | Mã thuốc không tồn tại hoặc rỗng | Lần lượt drug_id = ""; null; "MED_KHONG_CO" | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | Đạt |
| UT38 | Tồn kho âm hoặc NaN | Lần lượt available_stock = -5; NaN | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | Đạt |
| UT39 | Số lượng cấp là số thập phân | quantity = 2.5 | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT40 | Số lượng cấp lẫn chữ | quantity = "10A" | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT41 | Số lượng cấp không hợp lệ | Lần lượt quantity = null; undefined; NaN; Infinity; true | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | Đạt |
| UT42 | Biên dưới số lượng cấp | quantity = 1 | null | Đạt |
| UT43 | Hướng dẫn liều dùng để trống hoặc khoảng trắng | Lần lượt usage_instruction = ""; "     " | Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc. | Đạt |
| UT44 | Hướng dẫn liều dùng 1 ký tự | usage_instruction = "a" | null | Đạt |
| UT45 | Dữ liệu mặc định hợp lệ | Dữ liệu mặc định | null | Đạt |


Các file nguồn nằm tại `his-hospital/backend/test/tuan_anh/validators/`, gồm ba cặp file `.validator.js` và `.test.js` đánh số 01, 02, 03.