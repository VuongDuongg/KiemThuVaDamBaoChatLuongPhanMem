# BÁO CÁO ÁP DỤNG KIỂM THỬ ĐƠN VỊ (UNIT TESTING) THEO CHUẨN NUNIT
## KIỂM THỬ BỘ HÀM XÁC THỰC: ĐĂNG KÝ HỒ SƠ - ĐĂNG KÝ KHÁM - ĐIỀU PHỐI HÀNG ĐỢI (45 TEST CASES)
### HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)

**Tài liệu lý thuyết tham chiếu:** `docs/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)  
**Tệp đặc tả test case tham chiếu:** [testcasenta_md.md](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/thai/testcasenta_md.md) (Tác giả: Nguyễn Hồng Thái)  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Phạm vi áp dụng:** Thực hiện kiểm thử đơn vị cho 3 chức năng nghiệp vụ Tiếp đón & Điều phối bệnh nhân thuộc mục 1.1 – 1.3:
1. **Đăng ký hồ sơ bệnh nhân mới** (`PatientRegistrationValidator.validateCreatePatient`, UT01 – UT10)
2. **Đăng ký khám và cấp số thứ tự** (`ClinicAppointmentValidator.validateCreateAppointment`, UT11 – UT28)
3. **Điều phối và gọi số khám** (`QueueDispatchValidator.validateQueueDispatch`, UT29 – UT45)

**Nguyên tắc cam kết cốt lõi:** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào bên trong thư mục nghiệp vụ `backend/src/` để làm pass test; kiểm thử độc lập, cô lập và tự động hóa 100%.

---

## MỤC LỤC
1. [TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT](#1-tóm-tắt-nội-dung-và-nguyên-tắc-cốt-lõi-từ-tài-liệu-slide-nunit)
2. [ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN](#2-ánh-xạ-phương-pháp-luận-từ-nunit-sang-môi-trường-dự-án)
3. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: ĐĂNG KÝ HỒ SƠ BỆNH NHÂN MỚI (UT01 – UT10)](#3-kiểm-thử-đơn-vị-chức-năng-1-đăng-ký-hồ-sơ-bệnh-nhân-mới-ut01--ut10)
4. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: ĐĂNG KÝ KHÁM VÀ CẤP SỐ THỨ TỰ (UT11 – UT28)](#4-kiểm-thử-đơn-vị-chức-năng-2-đăng-ký-khám-và-cấp-số-thứ-tự-ut11--ut28)
5. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: ĐIỀU PHỐI VÀ GỌI SỐ KHÁM (UT29 – UT45)](#5-kiểm-thử-đơn-vị-chức-năng-3-điều-phối-và-gọi-số-khám-ut29--ut45)
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

---

## 3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: ĐĂNG KÝ HỒ SƠ BỆNH NHÂN MỚI (UT01 – UT10)

### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`PatientRegistrationValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/01_patientRegistration.validator.js), phương thức tĩnh `validateCreatePatient(input)`.
- **Tập tin kiểm thử:** [`backend/test/thai/validators/01_patientRegistration.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/01_patientRegistration.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    full_name: "Nguyen Van A",
    dob: "1990-05-15",
    gender: "MALE",
    phone: "0912345678",
    cccd: "001090012345",
    address: "123 Le Loi, Hanoi"
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `full_name` (Họ và tên): Bắt buộc, không được để trống, độ dài tối đa 100 ký tự sau khi cắt tỉa khoảng trắng hai đầu (`trim()`), không chứa ký tự đặc biệt hoặc chữ số. Nếu vi phạm $\rightarrow$ Thông báo: `"Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số)."`
  2. `dob` (Ngày sinh): Bắt buộc, theo định dạng chuẩn `YYYY-MM-DD` và giá trị phải nhỏ hơn hoặc bằng ngày hiện tại. Nếu sai định dạng hoặc ở tương lai $\rightarrow$ Thông báo: `"Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại)."`
  3. `gender` (Giới tính): Bắt buộc, chỉ chấp nhận một trong ba giá trị thuộc danh mục: `MALE`, `FEMALE`, `OTHER`. Nếu ngoài danh mục $\rightarrow$ Thông báo: `"Giới tính không hợp lệ (chỉ chấp nhận MALE, FEMALE, OTHER)."`
  4. `phone` (Số điện thoại): Bắt buộc, phải gồm đúng 10 chữ số và bắt đầu bằng các đầu số viễn thông hợp lệ tại Việt Nam (`03`, `05`, `07`, `08`, `09`). Nếu vi phạm $\rightarrow$ Thông báo: `"Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam)."`
  5. `cccd` (Số CCCD / Mã định danh): Bắt buộc, phải gồm đúng 12 chữ số. Nếu thiếu, thừa độ dài hoặc chứa chữ cái $\rightarrow$ Thông báo: `"Số CCCD/Định danh cá nhân phải đúng 12 chữ số."`

### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **UT01** | `[Test] UT01: TC_F01_01 - Họ tên rỗng` | `full_name = ""` | Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 2 | **UT02** | `[Test] UT02: TC_F01_02 - Họ tên chứa số/KĐB` | `full_name = "Nguyen Van A123@"` | Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 3 | **UT03** | `[Test] UT03: TC_F01_03 - Ngày sinh ở tương lai` | `dob = "2030-01-01"` | Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 4 | **UT04** | `[Test] UT04: TC_F01_04 - SĐT sai định dạng` | `phone = "091234"` | Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 5 | **UT05** | `[Test] UT05: TC_F01_05 - CCCD sai độ dài` | `cccd = "12345"` | Số CCCD/Định danh cá nhân phải đúng 12 chữ số. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 6 | **UT06** | `[Test] UT06: TC_F01_06 - Hợp lệ (Dữ liệu mặc định)` | `{}` (dữ liệu mặc định) | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 7 | **UT07** | `[Test] UT07: SĐT chứa ký tự chữ` | `phone = "091234567a"` | Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 8 | **UT08** | `[Test] UT08: CCCD chứa ký tự chữ` | `cccd = "00109001234a"` | Số CCCD/Định danh cá nhân phải đúng 12 chữ số. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 9 | **UT09** | `[Test] UT09: Khoảng trắng ở hai đầu họ tên` | `full_name = "  Nguyen Van A  "` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 10 | **UT10** | `[Test] UT10: Giới tính không hợp lệ` | `gender = "UNKNOWN"` | Giới tính không hợp lệ (chỉ chấp nhận MALE, FEMALE, OTHER). | `Assert.AreEqual` | **ĐẠT (PASS)** |

---

## 4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: ĐĂNG KÝ KHÁM VÀ CẤP SỐ THỨ TỰ (UT11 – UT28)

### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`ClinicAppointmentValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/02_clinicAppointment.validator.js), phương thức tĩnh `validateCreateAppointment(input)`.
- **Tập tin kiểm thử:** [`backend/test/thai/validators/02_clinicAppointment.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/02_clinicAppointment.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    patient_id: 101,
    clinic_id: 5,
    insurance_type: "NONE",
    insurance_code: "",
    reason: "Kham suc khoe dinh ky"
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `patient_id` (Mã bệnh nhân): Bắt buộc, phải là số nguyên dương hợp lệ. Nếu `null`, `undefined` hoặc là chuỗi chữ `ABC` $\rightarrow$ Thông báo: `"Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống."`
  2. `clinic_id` (Phòng khám chuyên khoa): Bắt buộc, phải là số nguyên dương hợp lệ. Nếu `undefined`, số âm (`-1`), hoặc không phải số (`NO_ID`) $\rightarrow$ Thông báo: `"Vui lòng chọn phòng khám chuyên khoa."`
  3. `insurance_type` (Loại đối tượng KCB): Bắt buộc, thuộc danh mục: `NONE`, `BHYT`, `SERVICE`. Nếu sai giá trị $\rightarrow$ Thông báo: `"Loại đối tượng KCB không hợp lệ (chỉ chấp nhận NONE, BHYT, SERVICE)."`
  4. `insurance_code` (Mã thẻ BHYT):
     - Khi `insurance_type === "BHYT"`: Bắt buộc nhập, chuỗi phải gồm đúng 15 ký tự chữ và số (sau khi cắt tỉa khoảng trắng). Nếu rỗng $\rightarrow$ Thông báo: `"Vui lòng nhập mã thẻ BHYT khi đăng ký đối tượng Bảo hiểm y tế."`; Nếu sai độ dài hoặc chứa ký tự đặc biệt $\rightarrow$ Thông báo: `"Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số)."`
     - Khi `insurance_type` là `NONE` hoặc `SERVICE`: Không bắt buộc nhập thẻ BHYT.
  5. `reason` (Lý do khám): Bắt buộc nhập, độ dài chuỗi sau khi cắt tỉa từ 5 đến 500 ký tự. Nếu rỗng, chỉ chứa khoảng trắng, dưới 5 ký tự hoặc vượt quá 500 ký tự $\rightarrow$ Thông báo: `"Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự)."`

### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 11 | **UT11** | `[Test] UT11: TC_F02_01 - Bệnh nhân không tồn tại` | `patient_id = null` | Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 12 | **UT12** | `[Test] UT12: TC_F02_02 - Chưa chọn phòng khám` | `clinic_id = undefined` | Vui lòng chọn phòng khám chuyên khoa. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 13 | **UT13** | `[Test] UT13: TC_F02_03 - BHYT đúng chuẩn` | `insurance_type = "BHYT"; insurance_code = "DN4010123456789"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 14 | **UT14** | `[Test] UT14: TC_F02_04 - Mã BHYT sai độ dài` | `insurance_type = "BHYT"; insurance_code = "DN123"` | Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 15 | **UT15** | `[Test] UT15: Thiếu mã BHYT khi chọn BHYT` | `insurance_type = "BHYT"; insurance_code = ""` | Vui lòng nhập mã thẻ BHYT khi đăng ký đối tượng Bảo hiểm y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 16 | **UT16** | `[Test] UT16: Mã BHYT có ký tự đặc biệt` | `insurance_type = "BHYT"; insurance_code = "DN401012345678@"` | Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 17 | **UT17** | `[Test] UT17: Lý do khám quá ngắn` | `reason = "Kham"` | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 18 | **UT18** | `[Test] UT18: Lý do khám rỗng` | `reason = ""` | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 19 | **UT19** | `[Test] UT19: Lý do khám vượt 500 ký tự` | `reason = "a".repeat(501)` | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 20 | **UT20** | `[Test] UT20: Lý do khám đúng 500 ký tự` | `reason = "a".repeat(500)` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 21 | **UT21** | `[Test] UT21: Lý do khám chỉ chứa khoảng trắng` | `reason = "     "` | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 22 | **UT22** | `[Test] UT22: Loại bảo hiểm không hợp lệ` | `insurance_type = "INVALID"` | Loại đối tượng KCB không hợp lệ (chỉ chấp nhận NONE, BHYT, SERVICE). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 23 | **UT23** | `[Test] UT23: ID phòng khám âm` | `clinic_id = -1` | Vui lòng chọn phòng khám chuyên khoa. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 24 | **UT24** | `[Test] UT24: ID bệnh nhân là chuỗi chữ` | `patient_id = "ABC"` | Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 25 | **UT25** | `[Test] UT25: TC_F02_05 - Nhận xét/Lý do khám biên 5 ký tự` | `reason = "12345"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 26 | **UT26** | `[Test] UT26: BHYT có khoảng trắng thừa` | `insurance_type = "BHYT"; insurance_code = " DN4010123456789 "` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 27 | **UT27** | `[Test] UT27: Đăng ký dịch vụ không thẻ BHYT` | `insurance_type = "SERVICE"; insurance_code = ""` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 28 | **UT28** | `[Test] UT28: ID phòng khám không phải số` | `clinic_id = "NO_ID"` | Vui lòng chọn phòng khám chuyên khoa. | `Assert.AreEqual` | **ĐẠT (PASS)** |

---

## 5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: ĐIỀU PHỐI VÀ GỌI SỐ KHÁM (UT29 – UT45)

### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Lớp [`QueueDispatchValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/03_queueDispatch.validator.js), phương thức tĩnh `validateQueueDispatch(input)`.
- **Tập tin kiểm thử:** [`backend/test/thai/validators/03_queueDispatch.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/thai/validators/03_queueDispatch.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    clinic_id: 5,
    current_ticket_number: 10,
    action: "CALL_NEXT",
    target_room_id: 102
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `clinic_id` (Phòng khám điều phối): Bắt buộc, phải là số nguyên dương hợp lệ (hoặc chuỗi số nguyên dương). Nếu `null`, `undefined`, $\le 0$ $\rightarrow$ Thông báo: `"Thông tin phòng khám điều phối không hợp lệ."`
  2. `current_ticket_number` (Số thứ tự gọi khám): Bắt buộc, phải là số nguyên dương strictly ($> 0$), hữu hạn (`isFinite`). Nếu là số âm, bằng 0, số thực (`10.5`), chữ cái (`ABC`), vô cực (`Infinity`), `null`, `undefined` $\rightarrow$ Thông báo: `"Số thứ tự gọi khám phải là số nguyên dương hợp lệ."`
  3. `action` (Hành động điều phối): Bắt buộc, thuộc danh mục: `CALL_NEXT`, `RECALL`, `SKIP`, `TRANSFER`. Nếu chuỗi rỗng `""`, `undefined`, hoặc hành động lạ (`JUMP_QUEUE`) $\rightarrow$ Thông báo: `"Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER)."`
  4. `target_room_id` (Phòng khám đích khi chuyển tiếp):
     - Chỉ bắt buộc khi `action === "TRANSFER"`.
     - Phải là số nguyên dương hợp lệ (hoặc chuỗi số). Nếu `null`, `undefined`, hoặc chuỗi không phải số (`ROOM_A`) $\rightarrow$ Thông báo: `"Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân."`
     - Phòng khám đích không được trùng với phòng khám hiện tại (`target_room_id === clinic_id`). Nếu trùng $\rightarrow$ Thông báo: `"Phòng khám đích phải khác với phòng khám hiện tại."`

### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 29 | **UT29** | `[Test] UT29: Không chọn phòng điều phối` | `clinic_id = null` | Thông tin phòng khám điều phối không hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 30 | **UT30** | `[Test] UT30: Số thứ tự hiện tại âm` | `current_ticket_number = -5` | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 31 | **UT31** | `[Test] UT31: Hành động không thuộc danh mục` | `action = "JUMP_QUEUE"` | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 32 | **UT32** | `[Test] UT32: Chuyển phòng nhưng thiếu room_id` | `action = "TRANSFER"; target_room_id = null` | Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 33 | **UT33** | `[Test] UT33: Chuyển phòng sang chính phòng cũ` | `action = "TRANSFER"; target_room_id = 5` | Phòng khám đích phải khác với phòng khám hiện tại. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 34 | **UT34** | `[Test] UT34: Số thứ tự không phải là số` | `current_ticket_number = "ABC"` | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 35 | **UT35** | `[Test] UT35: Số thứ tự bằng 0` | `current_ticket_number = 0` | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 36 | **UT36** | `[Test] UT36: Số thứ tự là số thực` | `current_ticket_number = 10.5` | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 37 | **UT37** | `[Test] UT37: Hành động gọi lại hợp lệ` | `action = "RECALL"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 38 | **UT38** | `[Test] UT38: Hành động bỏ qua hợp lệ` | `action = "SKIP"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 39 | **UT39** | `[Test] UT39: Chuyển phòng hợp lệ` | `action = "TRANSFER"; target_room_id = 103` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 40 | **UT40** | `[Test] UT40: Hành động rỗng` | `action = ""` | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 41 | **UT41** | `[Test] UT41: Phòng đích là chuỗi không hợp lệ` | `action = "TRANSFER"; target_room_id = "ROOM_A"` | Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 42 | **UT42** | `[Test] UT42: Thiếu hành động (undefined)` | `action = undefined` | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 43 | **UT43** | `[Test] UT43: Điều phối khi số thứ tự là Infinity` | `current_ticket_number = Infinity` | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 44 | **UT44** | `[Test] UT44: Các biên số thứ tự hợp lệ` | `current_ticket_number in {1, 9999}` | `null` cho cả 2 trường hợp | `Assert.IsNull` | **ĐẠT (PASS)** |
| 45 | **UT45** | `[Test] UT45: Truyền tham số phòng khám kiểu chuỗi số` | `clinic_id = "5"; target_room_id = "102"` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |

---

## 6. HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

### 6.1 Cấu trúc thư mục mã nguồn kiểm thử
```text
backend/test/thai/validators/
├── 01_patientRegistration.validator.js  # Lớp nghiệp vụ PatientRegistrationValidator
├── 01_patientRegistration.test.js       # Suite kiểm thử UT01 -> UT10
├── 02_clinicAppointment.validator.js    # Lớp nghiệp vụ ClinicAppointmentValidator
├── 02_clinicAppointment.test.js         # Suite kiểm thử UT11 -> UT28
├── 03_queueDispatch.validator.js        # Lớp nghiệp vụ QueueDispatchValidator
├── 03_queueDispatch.test.js             # Suite kiểm thử UT29 -> UT45
└── 04_Lenh_Chay.ps1                     # Kịch bản PowerShell chạy nhanh linh hoạt
```

### 6.2 Lệnh thực thi kiểm thử

#### Cách 1: Chạy trực tiếp qua PowerShell script
```powershell
# Chạy toàn bộ 45 test case của 3 chức năng:
.\test\thai\validators\04_Lenh_Chay.ps1

# Chạy riêng từng chức năng:
.\test\thai\validators\04_Lenh_Chay.ps1 -Phan 01
.\test\thai\validators\04_Lenh_Chay.ps1 -Phan 02
.\test\thai\validators\04_Lenh_Chay.ps1 -Phan 03
```

#### Cách 2: Chạy qua npm scripts với Node.js Native Test Runner
```bash
# Chạy toàn bộ 45 test case của Nguyễn Hồng Thái:
npm run test:thai

# Lệnh gốc Node.js:
node --test test/thai/validators/01_patientRegistration.test.js test/thai/validators/02_clinicAppointment.test.js test/thai/validators/03_queueDispatch.test.js
```

#### Cách 3: Chạy qua Vitest Test Runner (Giao diện dòng lệnh chi tiết)
```bash
npm run test:vitest:thai
```

### 6.3 Nhật ký kết quả thực thi thực tế (Terminal Execution Output)

#### Kết quả chạy `npm run test:thai` (Node Native Test Runner):
```text
> his-hospital-backend@1.0.0 test:thai
> node --test test/thai/validators/01_patientRegistration.test.js test/thai/validators/02_clinicAppointment.test.js test/thai/validators/03_queueDispatch.test.js

▶ [TestFixture] 01_DangKyHoSoBenhNhan_PatientRegistrationValidator
  ✔ [Test] UT01: TC_F01_01 - Họ tên rỗng (full_name = '') (0.6643ms)
  ✔ [Test] UT02: TC_F01_02 - Họ tên chứa số/KĐB (full_name = 'Nguyen Van A123@') (0.1249ms)
  ✔ [Test] UT03: TC_F01_03 - Ngày sinh ở tương lai (dob = '2030-01-01') (0.7243ms)
  ✔ [Test] UT04: TC_F01_04 - SĐT sai định dạng (phone = '091234') (0.1971ms)
  ✔ [Test] UT05: TC_F01_05 - CCCD sai độ dài (cccd = '12345') (0.1399ms)
  ✔ [Test] UT06: TC_F01_06 - Hợp lệ (Dữ liệu mặc định) (0.1756ms)
  ✔ [Test] UT07: SĐT chứa ký tự chữ (phone = '091234567a') (0.0904ms)
  ✔ [Test] UT08: CCCD chứa ký tự chữ (cccd = '00109001234a') (0.0847ms)
  ✔ [Test] UT09: Khoảng trắng ở hai đầu họ tên (full_name = '  Nguyen Van A  ') (0.1568ms)
  ✔ [Test] UT10: Giới tính không hợp lệ (gender = 'UNKNOWN') (0.1568ms)
✔ [TestFixture] 01_DangKyHoSoBenhNhan_PatientRegistrationValidator (3.5161ms)

▶ [TestFixture] 02_DangKyKhamVaCapSoThuTu_ClinicAppointmentValidator
  ✔ [Test] UT11: TC_F02_01 - Bệnh nhân không tồn tại (patient_id = null) (0.7271ms)
  ✔ [Test] UT12: TC_F02_02 - Chưa chọn phòng khám (clinic_id = undefined) (0.1069ms)
  ✔ [Test] UT13: TC_F02_03 - BHYT đúng chuẩn (insurance_type = 'BHYT', insurance_code = 'DN4010123456789') (0.172ms)
  ✔ [Test] UT14: TC_F02_04 - Mã BHYT sai độ dài (insurance_type = 'BHYT', insurance_code = 'DN123') (0.1336ms)
  ✔ [Test] UT15: Thiếu mã BHYT khi chọn BHYT (insurance_type = 'BHYT', insurance_code = '') (0.0866ms)
  ✔ [Test] UT16: Mã BHYT có ký tự đặc biệt (insurance_type = 'BHYT', insurance_code = 'DN401012345678@') (0.0816ms)
  ✔ [Test] UT17: Lý do khám quá ngắn (reason = 'Kham') (0.0895ms)
  ✔ [Test] UT18: Lý do khám rỗng (reason = '') (0.1014ms)
  ✔ [Test] UT19: Lý do khám vượt 500 ký tự (reason = 'a' x 501) (0.1199ms)
  ✔ [Test] UT20: Lý do khám đúng 500 ký tự (reason = 'a' x 500) (0.1434ms)
  ✔ [Test] UT21: Lý do khám chỉ chứa khoảng trắng (reason = '     ') (0.0913ms)
  ✔ [Test] UT22: Loại bảo hiểm không hợp lệ (insurance_type = 'INVALID') (0.0936ms)
  ✔ [Test] UT23: ID phòng khám âm (clinic_id = -1) (0.0559ms)
  ✔ [Test] UT24: ID bệnh nhân là chuỗi chữ (patient_id = 'ABC') (0.0865ms)
  ✔ [Test] UT25: TC_F02_05 - Nhận xét/Lý do khám biên 5 ký tự (reason = '12345') (0.0946ms)
  ✔ [Test] UT26: BHYT có khoảng trắng thừa (insurance_type = 'BHYT', insurance_code = ' DN4010123456789 ') (0.076ms)
  ✔ [Test] UT27: Đăng ký dịch vụ không thẻ BHYT (insurance_type = 'SERVICE', insurance_code = '') (0.8012ms)
  ✔ [Test] UT28: ID phòng khám không phải số (clinic_id = 'NO_ID') (0.1869ms)
✔ [TestFixture] 02_DangKyKhamVaCapSoThuTu_ClinicAppointmentValidator (4.4026ms)

▶ [TestFixture] 03_DieuPhoiVaGoiSoKham_QueueDispatchValidator
  ✔ [Test] UT29: Không chọn phòng điều phối (clinic_id = null) (0.7663ms)
  ✔ [Test] UT30: Số thứ tự hiện tại âm (current_ticket_number = -5) (0.1314ms)
  ✔ [Test] UT31: Hành động không thuộc danh mục (action = 'JUMP_QUEUE') (0.1157ms)
  ✔ [Test] UT32: Chuyển phòng nhưng thiếu room_id (action = 'TRANSFER', target_room_id = null) (0.1176ms)
  ✔ [Test] UT33: Chuyển phòng sang chính phòng cũ (action = 'TRANSFER', target_room_id = 5) (0.0933ms)
  ✔ [Test] UT34: Số thứ tự không phải là số (current_ticket_number = 'ABC') (0.0941ms)
  ✔ [Test] UT35: Số thứ tự bằng 0 (current_ticket_number = 0) (0.101ms)
  ✔ [Test] UT36: Số thứ tự là số thực (current_ticket_number = 10.5) (0.1238ms)
  ✔ [Test] UT37: Hành động gọi lại hợp lệ (action = 'RECALL') (0.1687ms)
  ✔ [Test] UT38: Hành động bỏ qua hợp lệ (action = 'SKIP') (0.1368ms)
  ✔ [Test] UT39: Chuyển phòng hợp lệ (action = 'TRANSFER', target_room_id = 103) (0.1222ms)
  ✔ [Test] UT40: Hành động rỗng (action = '') (0.0788ms)
  ✔ [Test] UT41: Phòng đích là chuỗi không hợp lệ (action = 'TRANSFER', target_room_id = 'ROOM_A') (0.0566ms)
  ✔ [Test] UT42: Thiếu hành động (action = undefined) (0.0941ms)
  ✔ [Test] UT43: Điều phối khi số thứ tự là Infinity (current_ticket_number = Infinity) (0.0897ms)
  ✔ [Test] UT44: Các biên số thứ tự hợp lệ (current_ticket_number in {1, 9999}) (0.1044ms)
  ✔ [Test] UT45: Truyền tham số phòng khám hợp lệ kiểu chuỗi số (clinic_id = '5', target_room_id = '102') (0.683ms)
✔ [TestFixture] 03_DieuPhoiVaGoiSoKham_QueueDispatchValidator (4.2271ms)

ℹ tests 45
ℹ suites 3
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 93.6895
```

#### Kết quả chạy `npm run test:vitest:thai` (Vitest Runner):
```text
 Test Files  3 passed (3)
      Tests  45 passed (45)
   Start at  10:07:29
   Duration  168ms
```

---

## 7. TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG

### 7.1 Thống kê tỷ lệ hoàn thành
| Phân hệ / Chức năng | Số ca kiểm thử | Số ca ĐẠT (PASS) | Số ca HỎNG (FAIL) | Tỷ lệ ĐẠT |
| :--- | :---: | :---: | :---: | :---: |
| **01. Đăng ký hồ sơ bệnh nhân mới** (UT01 – UT10) | 10 | 10 | 0 | **100%** |
| **02. Đăng ký khám và cấp số thứ tự** (UT11 – UT28) | 18 | 18 | 0 | **100%** |
| **03. Điều phối và gọi số khám** (UT29 – UT45) | 17 | 17 | 0 | **100%** |
| **TỔNG CỘNG BỘ KIỂM THỬ** | **45** | **45** | **0** | **100%** |

### 7.2 Đánh giá tuân thủ quy chuẩn NUnit
1. **Tính độc lập & cách ly:** Toàn bộ 45 test case được xây dựng độc lập 100%, không phụ thuộc dữ liệu phiên làm việc hay gọi CSDL.
2. **Khẳng định tính đúng đắn (Assertion Integrity):** Sử dụng các phương thức chuẩn NUnit `Assert.AreEqual` cho các trường hợp dữ liệu sai lỗi và `Assert.IsNull` cho các trường hợp dữ liệu hợp lệ.
3. **Bảo toàn mã nguồn hệ thống:** Tuyệt đối không can thiệp, sửa đổi hay làm sai lệch logic nghiệp vụ gốc trong `backend/src/`. Toàn bộ quá trình kiểm thử được thực thi an toàn và minh bạch.
