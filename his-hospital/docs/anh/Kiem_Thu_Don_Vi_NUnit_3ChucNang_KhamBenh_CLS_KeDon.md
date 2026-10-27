# BÁO CÁO ÁP DỤNG KIỂM THỬ ĐƠN VỊ (UNIT TESTING) THEO CHUẨN NUNIT
## KIỂM THỬ BỘ HÀM XÁC THỰC: KHÁM BỆNH - CHỈ ĐỊNH CẬN LÂM SÀNG - KÊ ĐƠN THUỐC (45 TEST CASES)
### HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)

**Tài liệu lý thuyết tham chiếu:** `docs/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)  
**Tệp đặc tả test case tham chiếu:** [testcasenta.md](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/anh/testcasenta.md) (Tác giả: Ngô Tuấn Anh)  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Phạm vi áp dụng:** Thực hiện kiểm thử đơn vị cho 3 chức năng nghiệp vụ Bác sĩ Khám bệnh thuộc mục 1.1 – 1.3:
1. **Cập nhật thông tin bệnh án và chẩn đoán ICD-10** (`ConsultationValidator.validateConsultation`, UT01 – UT15)
2. **Chỉ định dịch vụ cận lâm sàng** (`LabOrderValidator.validateLabOrder`, UT16 – UT27)
3. **Kê đơn thuốc ngoại trú & Cảnh báo tương tác thuốc** (`PrescriptionValidator.validatePrescription`, UT28 – UT45)

**Nguyên tắc cam kết cốt lõi:** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào bên trong thư mục nghiệp vụ `backend/src/` để làm pass test; kiểm thử độc lập, cô lập và tự động hóa 100%.

---

## MỤC LỤC
1. [TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT](#1-tóm-tắt-nội-dung-và-nguyên-tắc-cốt-lõi-từ-tài-liệu-slide-nunit)
2. [ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN](#2-ánh-xạ-phương-pháp-luận-từ-nunit-sang-môi-trường-dự-án)
3. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: CẬP NHẬT BỆNH ÁN & CHẨN ĐOÁN (UT01 – UT15)](#3-kiểm-thử-đơn-vị-chức-năng-1-cập-nhật-bệnh-án--chẩn-đoán-ut01--ut15)
4. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: CHỈ ĐỊNH DỊCH VỤ CẬN LÂM SÀNG (UT16 – UT27)](#4-kiểm-thử-đơn-vị-chức-năng-2-chỉ-định-dịch-vụ-cận-lâm-sàng-ut16--ut27)
5. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: KÊ ĐƠN THUỐC & CẢNH BÁO TƯƠNG TÁC (UT28 – UT45)](#5-kiểm-thử-đơn-vị-chức-năng-3-kê-đơn-thuốc--cảnh-báo-tương-tác-ut28--ut45)
6. [HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG](#6-hướng-dẫn-thực-thi--kết-quả-kiểm-thử-tự-động)
7. [TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG](#7-tổng-kết--đánh-giá-mức-độ-đáp-ứng)

---

## 1. TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT

Căn cứ theo tài liệu giảng dạy **"Kiểm thử và đảm bảo chất lượng phần mềm - Sử dụng công cụ kiểm thử đơn vị"** của ThS. Nguyễn Thị Phương Dung, các quy chuẩn lý thuyết và kỹ thuật áp dụng cho bộ 45 ca kiểm thử bao gồm:

### 1.1 Bản chất của kiểm thử đơn vị (Slide 2)
- Kiểm thử đơn vị (Unit Testing) tập trung kiểm tra từng module/hàm nhỏ nhất của chương trình trong trạng thái cô lập.
- Một đơn vị kiểm thử được thiết kế để xác minh một tác vụ với một **kết quả kỳ vọng giả định (expected result)**.
- Khi gọi hàm với dữ liệu đầu vào cụ thể, hàm trả về kết quả thực tế (**actual result**). Nếu kết quả thực tế không khớp với kết quả kỳ vọng, đơn vị kiểm thử bị đánh giá là **Thất bại (Fail)**.
- Đối với các hàm kiểm tra tính hợp lệ dữ liệu (Validator):
  - Giá trị hợp lệ trả về: `null`.
  - Giá trị không hợp lệ trả về: Chuỗi thông báo lỗi nghiệp vụ cụ thể.

### 1.2 Năm đặc điểm sống còn của Unit Test (Slide 3)
1. **Ngắn gọn, dễ đọc, dễ bảo trì:** Mỗi test case tập trung kiểm tra duy nhất một điều kiện biên hoặc phân vùng tương đương.
2. **Tính độc lập tuyệt đối:** Các ca kiểm thử từ UT01 đến UT45 hoàn toàn độc lập, không phụ thuộc vào thứ tự thực thi hoặc dữ liệu của nhau.
3. **Quy chuẩn đặt tên hàm kiểm thử:** Tên hàm kiểm thử phản ánh tường minh:
   $$\text{[Test] UTxx: TC\_MãCa - MôTảĐầuVào - KếtQuảKỳVọng}$$
4. **Tốc độ thực thi siêu tốc:** Toàn bộ quá trình kiểm thử không gọi cơ sở dữ liệu thật, không ghi đọc ổ đĩa hay mạng Internet. Do đó, thời gian chạy trọn bộ 45 test case chỉ mất dưới **150 mili-giây**.
5. **Cách ly thành phần (Test Isolation):** Kiểm thử trực tiếp thuật toán xác thực (Validation Rules) mà không cần giao diện đồ họa (UI) hay tầng lưu trữ cơ sở dữ liệu (Database).

### 1.3 Cấu trúc Suite và Lớp `Assert` NUnit (Slide 20 – 27)
- **Thuộc tính cấu trúc:**
  - `[TestFixture]`: Đánh dấu lớp/nhóm chứa các ca kiểm thử (ánh xạ bằng `describe` trong môi trường runner).
  - `[Test]`: Đánh dấu từng phương thức kiểm thử đơn vị cụ thể (ánh xạ bằng `test`).
- **Lớp `Assert` - Cầu nối kiểm định giả định:**
  - `Assert.AreEqual(expected, actual [, message])`: Xác minh chuỗi thông báo lỗi trả về khớp chính xác từng ký tự với tài liệu đặc tả.
  - `Assert.IsNull(actual [, message])`: Xác minh kết quả trả về là `null` khi dữ liệu đầu vào hoàn toàn hợp lệ.
  - `Assert.IsNotNull(actual [, message])`: Xác minh hàm trả về lỗi (khác `null`).
  - `Assert.IsTrue(condition [, message])`: Xác minh biểu thức điều kiện đúng.
  - `Assert.IsFalse(condition [, message])`: Xác minh biểu thức điều kiện sai.

---

## 2. ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN

Để đảm bảo chuẩn hóa 100% lý thuyết NUnit vừa tương thích nền tảng JavaScript/Node.js của HIS-Hospital, hệ thống sử dụng kiến trúc ánh xạ sau:

| Khái niệm trong Slide NUnit (.NET) | Công cụ áp dụng trong HIS-Hospital (Node.js) | Vị trí file trong dự án |
| :--- | :--- | :--- |
| **Test Runner & Engine** | **Node Native Test Runner** (`node:test`) & **Vitest** | Tích hợp sẵn trong Node.js LTS và devDependencies |
| **`[TestFixture]`** | `describe("[TestFixture] TenChucNang", ...)` | Phân tách suite cho từng bộ kiểm thử validator |
| **`[Test]`** | `test("[Test] UTxx: Ten_Ca_Kiem_Thu", ...)` | Từng ca kiểm thử độc lập |
| **Lớp `Assert` NUnit** (Slide 23-26) | **Lớp `Assert` NUnit Adapter** (`Assert.AreEqual`, `Assert.IsNull`,...) | [`backend/test/helpers/nunitAssert.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/nunitAssert.js) |
| **Test Bridge đa nền tảng** | **Test Bridge** tự động nhận diện Vitest và Node:test | [`backend/test/helpers/testBridge.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/testBridge.js) |

### Lớp Chuyển Đổi NUnit Assert (`backend/test/helpers/nunitAssert.js`):
```javascript
import assert from "node:assert/strict";

export class Assert {
  static AreEqual(expected, actual, message) {
    assert.strictEqual(actual, expected, message);
  }

  static IsNull(obj, message) {
    assert.ok(obj === null || obj === undefined, message || `Kỳ vọng null nhưng nhận được ${obj}`);
  }

  static IsNotNull(obj, message) {
    assert.ok(obj !== null && obj !== undefined, message || `Kỳ vọng khác null`);
  }

  static IsTrue(condition, message) {
    assert.strictEqual(Boolean(condition), true, message);
  }

  static IsFalse(condition, message) {
    assert.strictEqual(Boolean(condition), false, message);
  }

  static Throws(fn, errorMatcher, message) {
    assert.throws(fn, errorMatcher, message);
  }
}
```

---

## 3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: CẬP NHẬT BỆNH ÁN & CHẨN ĐOÁN (UT01 – UT15)

### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`ConsultationValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/01_consultation.validator.js), phương thức tĩnh `validateConsultation(input)`.
- **Tập tin kiểm thử:** [`backend/test/tuan_anh/validators/01_consultation.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/01_consultation.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    chief_complaint: "Đau đầu âm ỉ kéo dài",
    history_and_symptoms: "Tiền sử khỏe mạnh, không dị ứng",
    icd10_main_code: "I10",
    icd10_sub_codes: ["E11"]
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `chief_complaint` (Lý do khám): Bắt buộc, chuỗi sau khi cắt tỉa khoảng trắng phải có độ dài từ 5 đến 2000 ký tự. Nếu không hợp lệ $\rightarrow$ Thông báo: `"Vui lòng nhập lý do đến khám của bệnh nhân."`
  2. `history_and_symptoms` (Tiền sử & Triệu chứng): Tùy chọn. Nếu có dữ liệu thì độ dài tối đa là 4000 ký tự. Nếu vượt quá $\rightarrow$ Thông báo: `"Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự)."`
  3. `icd10_main_code` (Mã chẩn đoán chính): Bắt buộc, phải tuân thủ định dạng mã bệnh quốc tế ICD-10 (`/^[A-Z]\d{2}(\.\d{1,2})?$/i`). Nếu rỗng, chỉ có khoảng trắng hoặc sai định dạng $\rightarrow$ Thông báo: `"Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án."`
  4. `icd10_sub_codes` (Mã chẩn đoán kèm theo): Tùy chọn, là mảng các mã ICD-10. Từng mã phụ phải hợp lệ định dạng ICD-10, các mã phụ không được tự trùng nhau và không được trùng với mã chính. Nếu vi phạm $\rightarrow$ Thông báo: `"Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính."`

### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **UT01** | `[Test] UT01: TC_F12_01 - Lý do khám 4 ký tự` | `chief_complaint = "a".repeat(4)` | Vui lòng nhập lý do đến khám của bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 2 | **UT02** | `[Test] UT02: TC_F12_02 - Lý do khám 2001 ký tự` | `chief_complaint = "a".repeat(2001)` | Vui lòng nhập lý do đến khám của bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 3 | **UT03** | `[Test] UT03: TC_F12_03 - Triệu chứng 4001 ký tự` | `history_and_symptoms = "a".repeat(4001)` | Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 4 | **UT04** | `[Test] UT04: TC_F12_04 - Bỏ trống mã chính` | `icd10_main_code = ""` | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 5 | **UT05** | `[Test] UT05: TC_F12_05 - Mã phụ trùng mã chính` | `icd10_main_code = "I10"; icd10_sub_codes = ["I10"]` | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 6 | **UT06** | `[Test] UT06: TC_F12_06 - Biên dưới hợp lệ` | `chief_complaint = "a".repeat(5); history_and_symptoms = ""; icd10_sub_codes = []` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 7 | **UT07** | `[Test] UT07: TC_F12_07 - Biên trên hợp lệ` | `chief_complaint = "a".repeat(2000); history_and_symptoms = "a".repeat(4000); icd10_sub_codes = ["E11", "J00"]` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 8 | **UT08** | `[Test] UT08: Lý do khám chỉ có khoảng trắng` | `chief_complaint = "     "` | Vui lòng nhập lý do đến khám của bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 9 | **UT09** | `[Test] UT09: Lý do khám null hoặc undefined` | Lần lượt `chief_complaint = null; undefined` | Vui lòng nhập lý do đến khám của bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 10 | **UT10** | `[Test] UT10: Không truyền tiền sử & triệu chứng` | `history_and_symptoms = undefined` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 11 | **UT11** | `[Test] UT11: Mã chẩn đoán chính không thuộc ICD-10` | `icd10_main_code = "MA_AO_99"` | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 12 | **UT12** | `[Test] UT12: Mã chẩn đoán chính chỉ có khoảng trắng` | `icd10_main_code = "   "` | Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 13 | **UT13** | `[Test] UT13: Mã kèm theo không thuộc ICD-10` | `icd10_sub_codes = ["E11", "MA_SAI"]` | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 14 | **UT14** | `[Test] UT14: Mã kèm theo tự trùng lặp nhau` | `icd10_sub_codes = ["E11", "E11"]` | Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 15 | **UT15** | `[Test] UT15: Dữ liệu mặc định hợp lệ` | `{}` (dữ liệu mặc định) | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |

---

## 4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: CHỈ ĐỊNH DỊCH VỤ CẬN LÂM SÀNG (UT16 – UT27)

### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`LabOrderValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/02_labOrder.validator.js), phương thức tĩnh `validateLabOrder(input)`.
- **Tập tin kiểm thử:** [`backend/test/tuan_anh/validators/02_labOrder.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/02_labOrder.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    cls_service_ids: ["XQ01"],
    cls_clinical_instruction: "Chụp X-quang tim phổi thẳng"
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `cls_service_ids` (Danh sách dịch vụ cận lâm sàng): Phải là mảng không rỗng (`length > 0`), từng mã dịch vụ phải là chuỗi hợp lệ và tồn tại trong danh mục dịch vụ cận lâm sàng của bệnh viện (`XQ01`, `SA01`, `XN01`, `CLS_XN_MAU`,...). Nếu rỗng `[]`, `null`, `undefined`, chuỗi khoảng trắng `["   "]`, không phải mảng, hoặc chứa mã dịch vụ không tồn tại $\rightarrow$ Thông báo: `"Vui lòng chọn ít nhất một dịch vụ cận lâm sàng."`
  2. `cls_clinical_instruction` (Ghi chú dặn dò lâm sàng): Tùy chọn (cho phép `""`, `null`, `undefined`). Nếu có giá trị thì phải là kiểu chuỗi và độ dài sau khi cắt tỉa khoảng trắng tối đa 500 ký tự. Nếu vượt quá 500 ký tự hoặc sai kiểu dữ liệu $\rightarrow$ Thông báo: `"Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự)."`

### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 16 | **UT16** | `[Test] UT16: TC_F13_01 - Không chọn dịch vụ` | `cls_service_ids = []` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 17 | **UT17** | `[Test] UT17: TC_F13_02 - Ghi chú 501 ký tự` | `cls_clinical_instruction = "a".repeat(501)` | Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 18 | **UT18** | `[Test] UT18: TC_F13_03 - 1 dịch vụ, ghi chú 0 ký tự` | `cls_service_ids = ["XQ01"]; cls_clinical_instruction = ""` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 19 | **UT19** | `[Test] UT19: TC_F13_04 - Nhiều dịch vụ, ghi chú 500 ký tự` | `cls_service_ids = ["XQ01", "SA01", "XN01"]; cls_clinical_instruction = "a".repeat(500)` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 20 | **UT20** | `[Test] UT20: Danh sách dịch vụ null hoặc undefined` | Lần lượt `cls_service_ids = null; undefined` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` (2 trường hợp) | **ĐẠT (PASS)** |
| 21 | **UT21** | `[Test] UT21: Danh sách dịch vụ không phải mảng` | `cls_service_ids = "XQ01"` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 22 | **UT22** | `[Test] UT22: Mã dịch vụ chỉ có khoảng trắng` | `cls_service_ids = ["   "]` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 23 | **UT23** | `[Test] UT23: Mã dịch vụ không tồn tại trong danh mục` | `cls_service_ids = ["CLS_KHONG_TON_TAI"]` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 24 | **UT24** | `[Test] UT24: Danh sách có dịch vụ thứ hai không tồn tại` | `cls_service_ids = ["XQ01", "DV_AO"]` | Vui lòng chọn ít nhất một dịch vụ cận lâm sàng. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 25 | **UT25** | `[Test] UT25: Ghi chú dặn dò để undefined` | `cls_clinical_instruction = undefined` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 26 | **UT26** | `[Test] UT26: Ghi chú dặn dò có khoảng trắng hai đầu` | `cls_clinical_instruction = "  Chụp tư thế đứng  "` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 27 | **UT27** | `[Test] UT27: Ghi chú dặn dò sai kiểu dữ liệu` | `cls_clinical_instruction = 12345` | Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |

---

## 5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: KÊ ĐƠN THUỐC & CẢNH BÁO TƯƠNG TÁC (UT28 – UT45)

### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`PrescriptionValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/03_prescription.validator.js), phương thức tĩnh `validatePrescription(input)`.
- **Tập tin kiểm thử:** [`backend/test/tuan_anh/validators/03_prescription.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/tuan_anh/validators/03_prescription.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    drug_id: "MED001",
    available_stock: 50,
    quantity: 10,
    usage_instruction: "Ngày uống 2 lần, mỗi lần 1 viên sau ăn",
    interaction_level: "NONE",
    interaction_override_confirm: false
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `drug_id` & `available_stock` (Mã thuốc & Số lượng tồn kho): Mã thuốc phải tồn tại trong danh mục và lượng tồn kho phải là số hữu hạn lớn hơn 0 ($> 0$). Nếu mã thuốc rỗng `""`, `null`, không tồn tại trong danh mục, hoặc tồn kho $\le 0$, số âm, `NaN` $\rightarrow$ Thông báo: `"Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương."`
  2. `quantity` (Số lượng cấp): Bắt buộc là số nguyên dương strictly ($1 \le quantity \le available\_stock$). Nếu số lượng cấp là 0, số âm, số thập phân (`2.5`), chuỗi lẫn chữ (`"10A"`), `null`, `undefined`, `NaN`, `Infinity`, `true`, hoặc lớn hơn số lượng tồn kho $\rightarrow$ Thông báo: `"Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho."`
  3. `usage_instruction` (Hướng dẫn liều dùng & Cách dùng): Bắt buộc nhập, độ dài chuỗi sau khi cắt tỉa khoảng trắng từ 1 đến 250 ký tự. Nếu chuỗi rỗng `""`, chỉ có khoảng trắng, hoặc vượt quá 250 ký tự $\rightarrow$ Thông báo: `"Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc."`
  4. `interaction_level` & `interaction_override_confirm` (Cảnh báo tương tác thuốc):
     - Nếu `interaction_level === "SEVERE"` (Chống chỉ định tuyệt đối): Từ chối kê đơn vô điều kiện, kể cả bác sĩ đã tích xác nhận ghi đè $\rightarrow$ Thông báo: `"Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối."`
     - Nếu `interaction_level === "MILD"` (Tương tác nhẹ): Bắt buộc phải có cờ xác nhận `interaction_override_confirm === true`. Nếu `false` $\rightarrow$ Thông báo: `"Vui lòng xác nhận ghi đè cảnh báo tương tác thuốc mức độ nhẹ để tiếp tục kê đơn."`

### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 28 | **UT28** | `[Test] UT28: TC_F14_01 - Thuốc tồn kho bằng 0` | `available_stock = 0` | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 29 | **UT29** | `[Test] UT29: TC_F14_02 - Số lượng cấp bằng 0` | `quantity = 0` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 30 | **UT30** | `[Test] UT30: Số lượng cấp là số âm` | `quantity = -2` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 31 | **UT31** | `[Test] UT31: TC_F14_03 - Số lượng cấp vượt tồn kho` | `available_stock = 50; quantity = 51` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 32 | **UT32** | `[Test] UT32: TC_F14_04 - Hướng dẫn liều dùng 251 ký tự` | `usage_instruction = "a".repeat(251)` | Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 33 | **UT33** | `[Test] UT33: TC_F14_05 - Chống chỉ định tuyệt đối` | `interaction_level = "SEVERE"; interaction_override_confirm = true` | Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 34 | **UT34** | `[Test] UT34: TC_F14_06 - Tương tác nhẹ không xác nhận` | `interaction_level = "MILD"; interaction_override_confirm = false` | Vui lòng xác nhận ghi đè cảnh báo tương tác thuốc mức độ nhẹ để tiếp tục kê đơn. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 35 | **UT35** | `[Test] UT35: TC_F14_07 - Tương tác nhẹ có xác nhận ghi đè` | `interaction_level = "MILD"; interaction_override_confirm = true` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 36 | **UT36** | `[Test] UT36: TC_F14_08 - Các biên trên hợp lệ` | `available_stock = 100; quantity = 100; usage_instruction = "a".repeat(250)` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 37 | **UT37** | `[Test] UT37: Mã thuốc không tồn tại hoặc rỗng` | Lần lượt `drug_id = ""; null; "MED_KHONG_CO"` | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | `Assert.AreEqual` (3 trường hợp) | **ĐẠT (PASS)** |
| 38 | **UT38** | `[Test] UT38: Tồn kho âm hoặc NaN` | Lần lượt `available_stock = -5; NaN` | Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương. | `Assert.AreEqual` (2 trường hợp) | **ĐẠT (PASS)** |
| 39 | **UT39** | `[Test] UT39: Số lượng cấp là số thập phân` | `quantity = 2.5` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 40 | **UT40** | `[Test] UT40: Số lượng cấp lẫn chữ` | `quantity = "10A"` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 41 | **UT41** | `[Test] UT41: Số lượng cấp không hợp lệ` | Lần lượt `quantity = null; undefined; NaN; Infinity; true` | Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho. | `Assert.AreEqual` (5 trường hợp) | **ĐẠT (PASS)** |
| 42 | **UT42** | `[Test] UT42: Biên dưới số lượng cấp` | `quantity = 1` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 43 | **UT43** | `[Test] UT43: Hướng dẫn liều dùng để trống hoặc khoảng trắng` | Lần lượt `usage_instruction = ""; "     "` | Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc. | `Assert.AreEqual` (2 trường hợp) | **ĐẠT (PASS)** |
| 44 | **UT44** | `[Test] UT44: Hướng dẫn liều dùng 1 ký tự` | `usage_instruction = "a"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 45 | **UT45** | `[Test] UT45: Dữ liệu mặc định hợp lệ` | `{}` (dữ liệu mặc định) | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |

---

## 6. HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

### 6.1 Cấu trúc thư mục mã nguồn kiểm thử
```text
backend/test/tuan_anh/validators/
├── 01_consultation.validator.js  # Lớp nghiệp vụ ConsultationValidator
├── 01_consultation.test.js       # Suite kiểm thử UT01 -> UT15
├── 02_labOrder.validator.js      # Lớp nghiệp vụ LabOrderValidator
├── 02_labOrder.test.js           # Suite kiểm thử UT16 -> UT27
├── 03_prescription.validator.js  # Lớp nghiệp vụ PrescriptionValidator
├── 03_prescription.test.js       # Suite kiểm thử UT28 -> UT45
└── 04_Lenh_Chay.ps1              # Kịch bản PowerShell chạy nhanh linh hoạt
```

### 6.2 Lệnh thực thi kiểm thử

#### Cách 1: Chạy trực tiếp qua PowerShell script chuyên biệt
```powershell
# Chạy toàn bộ 45 test case của 3 chức năng:
.\test\tuan_anh\validators\04_Lenh_Chay.ps1

# Chạy riêng từng chức năng:
.\test\tuan_anh\validators\04_Lenh_Chay.ps1 -Phan 01
.\test\tuan_anh\validators\04_Lenh_Chay.ps1 -Phan 02
.\test\tuan_anh\validators\04_Lenh_Chay.ps1 -Phan 03
```

#### Cách 2: Chạy qua npm scripts với Node.js Native Test Runner
```bash
# Chạy toàn bộ 45 test case của Ngô Tuấn Anh:
npm run test:anh

# Lệnh gốc Node.js:
node --test test/tuan_anh/validators/01_consultation.test.js test/tuan_anh/validators/02_labOrder.test.js test/tuan_anh/validators/03_prescription.test.js
```

#### Cách 3: Chạy qua Vitest Test Runner (Giao diện dòng lệnh chi tiết)
```bash
npm run test:vitest:anh
```

### 6.3 Nhật ký kết quả thực thi thực tế (Terminal Execution Output)

#### Kết quả chạy `npm run test:anh` (Node Native Test Runner):
```text
> his-hospital-backend@1.0.0 test:anh
> node --test test/tuan_anh/validators/01_consultation.test.js test/tuan_anh/validators/02_labOrder.test.js test/tuan_anh/validators/03_prescription.test.js

▶ [TestFixture] 01_CapNhatBenhAnVaChanDoan_ConsultationValidator
  ✔ [Test] UT01: TC_F12_01 - Lý do khám 4 ký tự ('a' x 4) (0.7355ms)
  ✔ [Test] UT02: TC_F12_02 - Lý do khám 2001 ký tự ('a' x 2001) (0.1151ms)
  ✔ [Test] UT03: TC_F12_03 - Triệu chứng 4001 ký tự ('a' x 4001) (0.0873ms)
  ✔ [Test] UT04: TC_F12_04 - Bỏ trống mã chính (icd10_main_code = '') (0.0777ms)
  ✔ [Test] UT05: TC_F12_05 - Mã phụ trùng mã chính (icd10_main_code = 'I10', icd10_sub_codes = ['I10']) (0.1883ms)
  ✔ [Test] UT06: TC_F12_06 - Biên dưới hợp lệ (chief_complaint = 'a' x 5; history_and_symptoms = ''; icd10_sub_codes = []) (0.1968ms)
  ✔ [Test] UT07: TC_F12_07 - Biên trên hợp lệ (chief_complaint = 'a' x 2000; history_and_symptoms = 'a' x 4000; icd10_sub_codes = ['E11', 'J00']) (0.096ms)
  ✔ [Test] UT08: Lý do khám chỉ có khoảng trắng (chief_complaint = '     ') (0.146ms)
  ✔ [Test] UT09: Lý do khám null hoặc undefined (0.1344ms)
  ✔ [Test] UT10: Không truyền tiền sử & triệu chứng (history_and_symptoms = undefined) (0.1367ms)
  ✔ [Test] UT11: Mã chẩn đoán chính không thuộc ICD-10 (icd10_main_code = 'MA_AO_99') (0.1967ms)
  ✔ [Test] UT12: Mã chẩn đoán chính chỉ có khoảng trắng (icd10_main_code = '   ') (0.0942ms)
  ✔ [Test] UT13: Mã kèm theo không thuộc ICD-10 (icd10_sub_codes = ['E11', 'MA_SAI']) (0.0751ms)
  ✔ [Test] UT14: Mã kèm theo tự trùng lặp nhau (icd10_sub_codes = ['E11', 'E11']) (0.0661ms)
  ✔ [Test] UT15: Dữ liệu mặc định hợp lệ (0.0971ms)
✔ [TestFixture] 01_CapNhatBenhAnVaChanDoan_ConsultationValidator (3.543ms)

▶ [TestFixture] 02_ChiDinhDichVuCanLamSang_LabOrderValidator
  ✔ [Test] UT16: TC_F13_01 - Không chọn dịch vụ (cls_service_ids = []) (0.6729ms)
  ✔ [Test] UT17: TC_F13_02 - Ghi chú 501 ký tự (cls_clinical_instruction = 'a' x 501) (0.1379ms)
  ✔ [Test] UT18: TC_F13_03 - 1 dịch vụ, ghi chú 0 ký tự (cls_service_ids = ['XQ01'], cls_clinical_instruction = '') (0.1375ms)
  ✔ [Test] UT19: TC_F13_04 - Nhiều dịch vụ, ghi chú 500 ký tự (cls_service_ids = ['XQ01', 'SA01', 'XN01'], cls_clinical_instruction = 'a' x 500) (0.2622ms)
  ✔ [Test] UT20: Danh sách dịch vụ null hoặc undefined (0.2019ms)
  ✔ [Test] UT21: Danh sách dịch vụ không phải mảng (cls_service_ids = 'XQ01') (0.1097ms)
  ✔ [Test] UT22: Mã dịch vụ chỉ có khoảng trắng (cls_service_ids = ['   ']) (0.0794ms)
  ✔ [Test] UT23: Mã dịch vụ không tồn tại trong danh mục (cls_service_ids = ['CLS_KHONG_TON_TAI']) (0.1101ms)
  ✔ [Test] UT24: Danh sách có dịch vụ thứ hai không tồn tại (cls_service_ids = ['XQ01', 'DV_AO']) (0.1431ms)
  ✔ [Test] UT25: Ghi chú dặn dò để undefined (cls_clinical_instruction = undefined) (0.1899ms)
  ✔ [Test] UT26: Ghi chú dặn dò có khoảng trắng hai đầu (cls_clinical_instruction = '  Chụp tư thế đứng  ') (0.0863ms)
  ✔ [Test] UT27: Ghi chú dặn dò sai kiểu dữ liệu (cls_clinical_instruction = 12345) (0.116ms)
✔ [TestFixture] 02_ChiDinhDichVuCanLamSang_LabOrderValidator (3.3972ms)

▶ [TestFixture] 03_KeDonThuoc_PrescriptionValidator
  ✔ [Test] UT28: TC_F14_01 - Thuốc tồn kho bằng 0 (available_stock = 0) (0.8491ms)
  ✔ [Test] UT29: TC_F14_02 - Số lượng cấp bằng 0 (quantity = 0) (0.1198ms)
  ✔ [Test] UT30: Số lượng cấp là số âm (quantity = -2) (0.0951ms)
  ✔ [Test] UT31: TC_F14_03 - Số lượng cấp vượt tồn kho (available_stock = 50, quantity = 51) (0.0823ms)
  ✔ [Test] UT32: TC_F14_04 - Hướng dẫn liều dùng 251 ký tự ('a' x 251) (0.0883ms)
  ✔ [Test] UT33: TC_F14_05 - Chống chỉ định tuyệt đối (interaction_level = 'SEVERE', interaction_override_confirm = true) (0.0919ms)
  ✔ [Test] UT34: TC_F14_06 - Tương tác nhẹ không xác nhận (interaction_level = 'MILD', interaction_override_confirm = false) (0.0918ms)
  ✔ [Test] UT35: TC_F14_07 - Tương tác nhẹ có xác nhận ghi đè (interaction_level = 'MILD', interaction_override_confirm = true) (0.1761ms)
  ✔ [Test] UT36: TC_F14_08 - Các biên trên hợp lệ (available_stock = 100, quantity = 100, usage_instruction = 'a' x 250) (0.1006ms)
  ✔ [Test] UT37: Mã thuốc không tồn tại hoặc rỗng (drug_id = '', null, 'MED_KHONG_CO') (0.1451ms)
  ✔ [Test] UT38: Tồn kho âm hoặc NaN (available_stock = -5, NaN) (0.1219ms)
  ✔ [Test] UT39: Số lượng cấp là số thập phân (quantity = 2.5) (0.0778ms)
  ✔ [Test] UT40: Số lượng cấp lẫn chữ (quantity = '10A') (0.0572ms)
  ✔ [Test] UT41: Số lượng cấp không hợp lệ (null, undefined, NaN, Infinity, true) (0.1127ms)
  ✔ [Test] UT42: Biên dưới số lượng cấp (quantity = 1) (0.1588ms)
  ✔ [Test] UT43: Hướng dẫn liều dùng để trống hoặc khoảng trắng (usage_instruction = '', '     ') (0.0953ms)
  ✔ [Test] UT44: Hướng dẫn liều dùng 1 ký tự (usage_instruction = 'a') (0.1073ms)
  ✔ [Test] UT45: Dữ liệu mặc định hợp lệ (0.0687ms)
✔ [TestFixture] 03_KeDonThuoc_PrescriptionValidator (4.2975ms)

ℹ tests 45
ℹ suites 3
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 96.3783
```

#### Kết quả chạy `npm run test:vitest:anh` (Vitest Runner):
```text
 Test Files  3 passed (3)
      Tests  45 passed (45)
   Start at  09:57:36
   Duration  553ms
```

---

## 7. TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG

### 7.1 Thống kê tỷ lệ hoàn thành
| Phân hệ / Chức năng | Số ca kiểm thử | Số ca ĐẠT (PASS) | Số ca HỎNG (FAIL) | Tỷ lệ ĐẠT |
| :--- | :---: | :---: | :---: | :---: |
| **01. Cập nhật thông tin bệnh án và chẩn đoán ICD-10** (UT01 – UT15) | 15 | 15 | 0 | **100%** |
| **02. Chỉ định dịch vụ cận lâm sàng** (UT16 – UT27) | 12 | 12 | 0 | **100%** |
| **03. Kê đơn thuốc & Cảnh báo tương tác** (UT28 – UT45) | 18 | 18 | 0 | **100%** |
| **TỔNG CỘNG BỘ KIỂM THỬ** | **45** | **45** | **0** | **100%** |

### 7.2 Đánh giá tuân thủ quy chuẩn NUnit
1. **Tính độc lập & cách ly:** Toàn bộ 45 test case được xây dựng độc lập 100%, không chia sẻ trạng thái dùng chung (stateless).
2. **Khẳng định tính đúng đắn (Assertion Integrity):** Sử dụng triệt để các phương thức chuẩn NUnit `Assert.AreEqual` cho các ca biên lỗi và `Assert.IsNull` cho các ca dữ liệu hợp lệ.
3. **Bảo toàn mã nguồn hệ thống:** Tuyệt đối không can thiệp, sửa đổi hay làm sai lệch logic nghiệp vụ gốc trong `backend/src/`. Toàn bộ quá trình kiểm thử được thực thi an toàn và minh bạch.
