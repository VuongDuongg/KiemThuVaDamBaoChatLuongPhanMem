# BÁO CÁO BÀI TẬP MÔN HỌC KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG PHẦN MỀM
**Đề tài:** Kiểm thử dự án quản lý và điều phối bệnh viện TKAV (HIS-Hospital)  
**Giảng viên phụ trách môn học:** TS. Nguyễn Thị Phương Dung  
**Đơn vị:** Khoa Công nghệ Thông tin - Trường Đại học Thủy Lợi  

---

## DANH SÁCH THÀNH VIÊN VÀ BẢNG PHÂN CÔNG NHIỆM VỤ
| STT | Họ và tên | Chức năng đảm nhiệm đặc tả & kiểm thử |
| --- | --- | --- |
| 1 | **Nguyễn Hồng Thái** | 1. Đăng ký hồ sơ bệnh nhân mới<br>2. Đăng ký khám và cấp số thứ tự<br>3. Điều phối và gọi số khám |
| 2 | **Dương Quốc Vượng** | 1. Lập hóa đơn viện phí<br>2. Thanh toán hóa đơn viện phí<br>3. Quản lý danh mục thuốc và tồn kho |
| 3 | **Ngô Tuấn Anh** | 1. Cập nhật thông tin bệnh án và chẩn đoán<br>2. Chỉ định dịch vụ cận lâm sàng<br>3. Kê đơn thuốc |
| 4 | **Lê Tuấn Khanh** | 1. Tiếp nhận chỉ định cận lâm sàng<br>2. Nhập kết quả xét nghiệm định lượng<br>3. Tải lên hình ảnh chẩn đoán và kết luận PACS |


---

# Nguyễn Hồng Thái

## Chức năng 1: Đăng ký hồ sơ bệnh nhân mới

### 1. Đặc tả


#### 1.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-THAI-02 |
| --- | --- |
| Tên Use Case (Use Case Name) | Đăng ký hồ sơ bệnh nhân mới |
| Người thực hiện & Ngày tạo | Nguyễn Hồng Thái — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Nhân viên tiếp nhận |
| Điều kiện tiên quyết (Pre-conditions) | Nhân viên tiếp nhận đã đăng nhập hợp lệ. Bệnh nhân chưa có thông tin trên hệ thống. |
| Điều kiện sau thành công (Post-conditions) | Hồ sơ bệnh nhân được lưu thành công vào cơ sở dữ liệu và được hệ thống tự động cấp một mã bệnh nhân duy nhất. |
| Kích hoạt (Trigger) | Nhân viên tiếp nhận chọn chức năng "Thêm mới bệnh nhân". |


#### 1.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | full_name | Họ và tên [Text Input] | String | Có (Y) | Không được để trống. | "Vui lòng nhập họ và tên" |
| 2 | date_of_birth | Ngày sinh [Date Picker] | Date (dd/MM/yyyy) | Có (Y) | Không được để trống; định dạng ngày hợp lệ. | "Ngày sinh không hợp lệ" |
| 3 | gender | Giới tính [Dropdown/Radio] | String | Có (Y) | Chọn 1 trong các giá trị hợp lệ (Nam/Nữ). | "Vui lòng chọn giới tính" |
| 4 | cccd_number | Số CCCD [Text Input] | String (Numeric) | Có (Y) | Đúng 12 chữ số; không trùng với CCCD đã tồn tại trong hệ thống. | "Số CCCD này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại" |
| 5 | phone_number | Số điện thoại [Text Input] | String (Numeric) | Có (Y) | Đúng định dạng số điện thoại hợp lệ. | "Số điện thoại không hợp lệ" |
| 6 | address | Địa chỉ [Text Input] | String | Có (Y) | Không được để trống. | "Vui lòng nhập địa chỉ" |
| 7 | exam_type | Đối tượng khám (BHYT/Viện phí) [Dropdown] | String | Có (Y) | Chọn 1 trong các giá trị hợp lệ. | "Vui lòng chọn đối tượng khám" |
| 8 | bhyt_code | Mã thẻ BHYT [Text Input] | String | Không (N) bắt buộc nếu chọn BHYT | Bắt buộc nhập nếu exam_type = BHYT. | "Vui lòng nhập mã thẻ BHYT" |


#### 1.3. Dữ liệu đầu ra (Outputs)

Thành công: Hồ sơ bệnh nhân mới được lưu vào cơ sở dữ liệu và hiển thị thông báo: "Đăng ký hồ sơ bệnh nhân thành công" kèm mã bệnh nhân vừa tạo.
Thất bại: Hệ thống đánh dấu viền đỏ các ô lỗi kèm ghi chú lỗi cụ thể và yêu cầu điền/sửa lại cho đúng; dữ liệu đã nhập được giữ nguyên trên biểu mẫu.

#### 1.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Nhân viên tiếp nhận chọn chức năng "Thêm mới bệnh nhân".**
- **Bước 2: Hệ thống hiển thị biểu mẫu nhập thông tin bệnh nhân.**
- **Bước 3: Nhân viên nhập các thông tin bắt buộc: Họ và tên, Ngày sinh, Giới tính, Số CCCD, Số điện thoại, Địa chỉ.**
- **Bước 4: Nhân viên chọn đối tượng khám (Bảo hiểm y tế hoặc Viện phí) và nhập mã thẻ BHYT nếu có.**
- **Bước 5: Nhân viên nhấn nút "Lưu thông tin".**
- **Bước 6: Hệ thống kiểm tra tính hợp lệ của dữ liệu nhập.**
- **Bước 7: Hệ thống sinh mã bệnh nhân duy nhất, lưu hồ sơ bệnh nhân mới vào cơ sở dữ liệu và hiển thị thông báo: "Đăng ký hồ sơ bệnh nhân thành công" kèm mã bệnh nhân vừa tạo. Kết thúc Use Case.**

#### 1.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã rẽ nhánh [A1]: Hủy bỏ đăng ký
 Tại bất kỳ thời điểm nào trong khoảng bước 2–5, nhân viên tiếp nhận nhấn "Hủy" → Hệ thống đóng biểu mẫu và không lưu lại các thông tin đã nhập → Hủy việc tạo hồ sơ bệnh nhân.**
- **Mã ngoại lệ [E1]: Trùng số CCCD
 Tại bước 6, hệ thống phát hiện số CCCD đã được sử dụng cho một bệnh nhân khác → Hiển thị cảnh báo: "Số CCCD này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại" → Nhân viên tiếp nhận kiểm tra, sửa lại thông tin (hoặc chuyển sang tra cứu hồ sơ đã tồn tại) → Quay lại bước 3.**
- **Mã ngoại lệ [E2]: Dữ liệu nhập không hợp lệ
 Tại bước 6, nhân viên để trống ô bắt buộc hoặc nhập sai định dạng (VD: CCCD không đủ 12 số, số điện thoại sai định dạng, ngày sinh không hợp lệ) → Hệ thống đánh dấu viền đỏ các ô lỗi kèm ghi chú cụ thể và yêu cầu điền/sửa lại cho đúng → Nhân viên tiếp nhận sửa lại thông tin rồi quay lại bước 5.**
- **Mã ngoại lệ [E3]: Hệ thống gặp sự cố khi lưu dữ liệu
 Tại bước 7, hệ thống không thể lưu hồ sơ do lỗi kết nối hoặc lỗi hệ thống → Hệ thống hiển thị thông báo lỗi và đề nghị nhân viên thử lại sau; dữ liệu đã nhập được giữ nguyên trên biểu mẫu.**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Đăng ký hồ sơ bệnh nhân mới" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm kiểm soát tính toàn vẹn của dữ liệu cá nhân và logic nghiệp vụ BHYT.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào các ràng buộc định dạng bắt buộc như Số CCCD, Ngày sinh và sự phụ thuộc của Mã thẻ BHYT.**

Trường cccd_number (Số CCCD):
Miền hợp lệ: Đúng 12 chữ số, không chứa ký tự chữ cái/đặc biệt. Giá trị biên: Đúng 12 ký tự.
Miền không hợp lệ: Dưới 12 chữ số (VD: 11 số - Min-), trên 12 chữ số (VD: 13 số - Max+), chứa chữ cái/khoảng trắng.
Sự phụ thuộc exam_type và bhyt_code:
Nếu exam_type = "BHYT", bhyt_code trở thành trường bắt buộc (Không được trống).
Nếu exam_type = "Viện phí", bhyt_code không bắt buộc (Có thể bỏ trống).

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

Các điều kiện (C):
C1: Các trường bắt buộc (full_name, date_of_birth, gender, address, phone_number) nhập đủ và đúng định dạng?
C2: cccd_number đúng định dạng (12 số) và chưa từng tồn tại trên hệ thống?
C3: Nếu chọn khám BHYT, đã nhập bhyt_code chưa?
C4: Thao tác xác nhận là "Lưu thông tin" (T) hay "Hủy" (F)?
Các hành động (A):
A1: Hủy thao tác, đóng biểu mẫu, không lưu (Mã rẽ nhánh A1).
A2: Viền đỏ ô lỗi, báo: "Vui lòng nhập..." / "Sai định dạng" (Mã ngoại lệ E2).
A3: Cảnh báo: "Số CCCD này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại" (Mã ngoại lệ E1).
A4: Sinh mã bệnh nhân, lưu CSDL, thông báo: "Đăng ký hồ sơ bệnh nhân thành công".
| Điều kiện | C1: Các trường cơ bản hợp lệ? | - | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | C2: CCCD hợp lệ, duy nhất? | - | - | F (Trùng) | T | T | T |
|  | C3: Nhập BHYT (nếu chọn BHYT)? | - | - | - | F | T | T |
|  | C4: Hành động Lưu (T)/Hủy (F)? | F | T | T | T | T | T |
| Hành động | A1: Hủy tạo hồ sơ (A1) | X |  |  |  |  |  |
|  | A2: Báo lỗi định dạng/thiếu (E2) |  | X |  | X |  |  |
|  | A3: Báo lỗi trùng CCCD (E1) |  |  | X |  |  |  |
|  | A4: Tạo hồ sơ thành công |  |  |  |  | X | X |


**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F02_01 | Bảng quyết định (Q1) | Người dùng đang nhập dữ liệu bất kỳ, bấm nút "Hủy". | Biểu mẫu đóng lại, dữ liệu không được lưu vào hệ thống. |
| TC_F02_02 | Giá trị biên (Q2) | Nhập cccd_number có 11 chữ số (Min-). Bấm Lưu. | Viền đỏ ô CCCD, báo lỗi sai định dạng (yêu cầu đủ 12 số). |
| TC_F02_03 | Giá trị biên (Q2) | Nhập cccd_number có 13 chữ số (Max+). Bấm Lưu. | Viền đỏ ô CCCD, báo lỗi sai định dạng (yêu cầu đủ 12 số). |
| TC_F02_04 | Phân vùng TĐ (Q2) | Bỏ trống full_name hoặc nhập phone_number chứa chữ cái. | Viền đỏ ô lỗi, báo "Vui lòng nhập họ và tên" hoặc "Số điện thoại không hợp lệ". |
| TC_F02_05 | Bảng quyết định (Q3) | Nhập CCCD đúng 12 số nhưng mã này đã tồn tại của một bệnh nhân khác. | Báo lỗi: "Số CCCD này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại". Dữ liệu form giữ nguyên. |
| TC_F02_06 | Bảng quyết định (Q4) | Chọn exam_type = BHYT, nhưng bỏ trống ô bhyt_code. | Báo lỗi: "Vui lòng nhập mã thẻ BHYT". |
| TC_F02_07 | Bảng quyết định (Q5) | Nhập hợp lệ toàn bộ. Chọn exam_type = BHYT, nhập mã bhyt_code hợp lệ. Bấm Lưu. | Lưu thành công, sinh mã BN, báo: "Đăng ký hồ sơ bệnh nhân thành công". |
| TC_F02_08 | Bảng quyết định (Q6) | Nhập hợp lệ toàn bộ. Chọn exam_type = Viện phí, bỏ trống bhyt_code. Bấm Lưu. | Lưu thành công, sinh mã BN, báo: "Đăng ký hồ sơ bệnh nhân thành công". |
| TC_F02_09 | Phân tích ngoại lệ | Dữ liệu hợp lệ, nhấn Lưu nhưng ngắt kết nối mạng/lỗi máy chủ. | Báo lỗi hệ thống (E3), yêu cầu thử lại sau. Form giữ nguyên dữ liệu. |



### 3. Kiểm thử hộp trắng


#### 1.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
function createPatient(payload) {
1.  const { name, identity_card_number, phone } = payload || {};
2.  if (!name || name.trim().length < 2) {
3.    const error = new Error("Họ và tên bắt buộc và tối thiểu 2 ký tự");
4.    error.statusCode = 400;
5.    throw error;
6.  }
7.  if (!identity_card_number || !/^\d{12}$/.test(identity_card_number.trim())) {
8.    const error = new Error("Số CCCD phải gồm đúng 12 chữ số");
9.    error.statusCode = 400;
10.   throw error;
11. }
12. if (!phone || !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
13.   const error = new Error("Số điện thoại phải 10 số đầu mạng VN hợp lệ");
14.   error.statusCode = 400;
15.   throw error;
16. }
17. const nextId = patientRepository.getNextId();
18. const newPatient = EntityFactory.createPatient(payload, nextId);
19. patientRepository.create(newPatient);
20. eventBus.emitEvent(EVENT_TYPES.PATIENT_CREATED, {
21.   patient: newPatient,
22.   message: `Bệnh nhân mới [{newPatient.patient_code}) vừa được tiếp đón vào phòng khám.`
23. });
24. return newPatient;
}
```


#### 1.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN

1.2.1. Đồ thị dòng điều khiển cho Độ đo C1 và C2
1.2.2. Phân tích độ phức tạp cho C1/C2
Trên đồ thị C1/C2: Số điểm quyết định  (tại các đỉnh 2, 7, 12).
Công thức McCabe: . Cần tối thiểu 4 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh.
1.2.3. Thiết kế ca kiểm thử cho Độ đo C1
Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 24 ít nhất một lần.
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 | 1 -> 2 -> 3..6 | { name: "A", identity_card_number: "001092001234", phone: "0912345678" } | Lỗi: “Họ và tên bắt buộc và tối thiểu 2 ký tự” | 1, 2, 3, 4, 5, 6 |
| 2 | TC_C1_02 | 1 -> 2 -> 7 -> 8..11 | { name: "Nguyễn Văn A", identity_card_number: "123", phone: "0912345678" } | Lỗi: “Số CCCD phải gồm đúng 12 chữ số” | 7, 8, 9, 10, 11 |
| 3 | TC_C1_03 | 1 -> 2 -> 7 -> 12 -> 13..16 | { name: "Nguyễn Văn A", identity_card_number: "001092001234", phone: "01234" } | Lỗi: “Số điện thoại phải 10 số đầu mạng VN hợp lệ” | 12, 13, 14, 15, 16 |
| 4 | TC_C1_04 | 1 -> 2 -> 7 -> 12 -> 17..24 | { name: "Nguyễn Văn A", identity_card_number: "001092001234", phone: "0912345678" } | Thành công: Tạo hồ sơ và phát sự kiện | 17, 18, 19, 20, 21, 22, 23, 24 |

Tỷ lệ bao phủ C1: 24/24 câu lệnh = 100%.
1.2.4. Thiết kế ca kiểm thử cho Độ đo C2
Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 7, 12 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
| Điểm QĐ | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !name \|\| name.trim().length < 2 | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 7) |
| Đỉnh 7 | !identity_card_number \|\| !/^\d{12}$/.test(...) | TC_C2_03 (Nhảy sang Đỉnh 8) | TC_C2_04 (Đi tiếp Đỉnh 12) |
| Đỉnh 12 | !phone \|\| !/^0(3\|5\|7\|8\|9)\d{8}$/.test(...) | TC_C2_05 (Nhảy sang Đỉnh 13) | TC_C2_06 (Đi tiếp Đỉnh 17) |

Tỷ lệ bao phủ C2: 6/6 nhánh quyết định = 100%.
1.2.5. Đồ thị và Bảng phân tích điều kiện con C3 (Condition Coverage)
Phân rã điều kiện con: Đỉnh 2 có (!name, length < 2), Đỉnh 7 có (!CCCD, !Regex_CCCD), Đỉnh 12 có (!phone, !Regex_Phone).
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | 2a = True | { name: "", identity_card_number: "001092001234", phone: "0912345678" } | Lỗi: Họ và tên bắt buộc |
| TC_C3_02 | 2a = False, 2b = True | { name: "N", identity_card_number: "001092001234", phone: "0912345678" } | Lỗi: Tên tối thiểu 2 ký tự |
| TC_C3_03 | 2 = False, 7a = True | { name: "Nguyễn A", identity_card_number: "", phone: "0912345678" } | Lỗi: Số CCCD bắt buộc |
| TC_C3_04 | 7a = False, 7b = True | { name: "Nguyễn A", identity_card_number: "123", phone: "0912345678" } | Lỗi: CCCD phải 12 chữ số |
| TC_C3_05 | 7 = False, 12a = True | { name: "Nguyễn A", identity_card_number: "001092001234", phone: "" } | Lỗi: Số điện thoại bắt buộc |
| TC_C3_06 | 12a = False, 12b = True | { name: "Nguyễn A", identity_card_number: "001092001234", phone: "012345678" } | Lỗi: SĐT mạng VN hợp lệ |
| TC_C3_07 | Tất cả con = False | { name: "Nguyễn Văn A", identity_card_number: "001092001234", phone: "0988777666" } | Thành công |


#### 1.3. KIỂM THỬ DÒNG DỮ LIỆU

1.3.1. Bảng 1 & 2: Def-Use và P-use
Def-Use tóm tắt: payload (def đỉnh 1, c-use đỉnh 18); name, identity_card_number, phone (def đỉnh 1, c-use đỉnh 2, 7, 12); nextId (def đỉnh 17, c-use đỉnh 18); newPatient (def đỉnh 18, c-use đỉnh 19, 21, 24).
1.3.2. Sơ đồ trạng thái U-D-R-A cho biến cốt lõi


### 4. Kiểm thử đơn vị


> **3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: ĐĂNG KÝ HỒ SƠ BỆNH NHÂN MỚI (UT01 – UT10)**



#### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

## Chức năng 2: Đăng ký khám và cấp số thứ tự

### 1. Đặc tả


#### 2.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-THAI-03 |
| --- | --- |
| Tên Use Case (Use Case Name) | Đăng ký khám và cấp số thứ tự |
| Người thực hiện & Ngày tạo | Nguyễn Hồng Thái — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Nhân viên tiếp nhận, Bệnh nhân |
| Điều kiện tiên quyết (Pre-conditions) | Bệnh nhân đã có hồ sơ thông tin trên hệ thống. |
| Điều kiện sau thành công (Post-conditions) | Lượt khám được khởi tạo, số thứ tự được cấp thành công, phiếu khám được in ra và thông tin được chuyển sang quầy Thu ngân. |
| Kích hoạt (Trigger) | Nhân viên tiếp nhận chọn phòng khám và bấm "Đăng ký khám & Cấp số". |


#### 2.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | department_code | Chuyên khoa/Phòng khám [Dropdown] | String | Có (Y) | Phải chọn 1 chuyên khoa/phòng khám đang hoạt động. | "Vui lòng chọn chuyên khoa/phòng khám" |
| 2 | priority_level | Chế độ ưu tiên [Radio/Checkbox] | String | Không (N) | Chỉ áp dụng nếu bệnh nhân là người già, trẻ nhỏ hoặc ca cấp cứu. | — |


#### 2.3. Dữ liệu đầu ra (Outputs)

Thành công: Số thứ tự khám được cấp tự động (đảm bảo không trùng số), phiếu khám (gồm thông tin bệnh nhân, phòng khám, số thứ tự) được in ra để trao cho bệnh nhân; thông tin lượt khám được đồng bộ sang danh sách chờ thu tiền của bộ phận Thu ngân.
Thất bại (Phòng khám đã nhận đủ số lượng): Hiển thị cảnh báo "Phòng khám đã đủ số lượng tiếp nhận. Vui lòng chọn phòng khám khác".

#### 2.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Nhân viên tiếp nhận chọn chuyên khoa và phòng khám theo yêu cầu của bệnh nhân.**
- **Bước 2: Nhân viên chọn chế độ ưu tiên nếu bệnh nhân là người già, trẻ nhỏ hoặc ca cấp cứu.**
- **Bước 3: Nhân viên nhấn nút "Đăng ký khám & Cấp số".**
- **Bước 4: Hệ thống kiểm tra số lượng tiếp nhận còn lại của phòng khám và tự động tính toán, cấp số thứ tự tiếp theo một cách tuần tự, đảm bảo không trùng số.**
- **Bước 5: Hệ thống lưu lượt khám mới vào cơ sở dữ liệu ở trạng thái chờ thanh toán.**
- **Bước 6: Hệ thống tự động đồng bộ thông tin lượt khám sang danh sách chờ thu tiền của bộ phận Thu ngân.**
- **Bước 7: Hệ thống gửi lệnh in phiếu khám (gồm thông tin bệnh nhân, phòng khám, số thứ tự) để trao cho bệnh nhân. Kết thúc Use Case.**

#### 2.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã rẽ nhánh [A1]: Đổi/hủy lựa chọn phòng khám trước khi cấp số
 Tại bước 1 hoặc bước 2, nhân viên tiếp nhận chọn nhầm chuyên khoa/phòng khám và muốn đổi lại → Nhân viên chọn lại chuyên khoa/phòng khám phù hợp trước khi bấm "Đăng ký khám & Cấp số" → Quay lại bước 1.**
- **Mã ngoại lệ [E1]: Phòng khám đã nhận đủ số lượng trong ngày
 Tại bước 4, hệ thống phát hiện phòng khám đã đạt giới hạn tiếp nhận tối đa → Hệ thống hiển thị cảnh báo: "Phòng khám đã đủ số lượng tiếp nhận. Vui lòng chọn phòng khám khác" → Nhân viên tiếp nhận quay lại bước 1 để chọn phòng khám/chuyên khoa khác.**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Đăng ký khám và cấp số thứ tự" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định để kiểm soát chặt chẽ trạng thái sức chứa của phòng khám và tính chính xác của cơ chế cấp số thứ tự tự động.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra tính hợp lệ của việc lựa chọn chuyên khoa/phòng khám và giới hạn số lượng tiếp nhận.**

Trường department_code (Chuyên khoa/Phòng khám):
Miền hợp lệ: Chọn đúng 01 chuyên khoa hoặc phòng khám đang hoạt động trên hệ thống.
Miền không hợp lệ: Bỏ trống lựa chọn (không chọn phòng nào) hoặc truyền vào mã phòng khám không tồn tại/đã ngừng hoạt động.
Sức chứa phòng khám (Department Capacity):
Miền hợp lệ (Còn chỗ): Số lượng bệnh nhân đã đăng ký trong ngày < Giới hạn tối đa của phòng khám.
Miền không hợp lệ (Hết chỗ): Số lượng bệnh nhân đã đăng ký trong ngày ≥ Giới hạn tối đa của phòng khám.

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Người dùng đã chọn chuyên khoa/phòng khám (department_code) hợp lệ chưa?
C2: Phòng khám được chọn đã đạt giới hạn tiếp nhận tối đa trong ngày chưa?
C3: Nhân viên có thực hiện thao tác đổi/hủy lựa chọn phòng khám trước khi cấp số không (Luồng rẽ nhánh A1)?
Các hành động (A):
A1: Chặn thao tác, hiển thị thông báo lỗi: "Vui lòng chọn chuyên khoa/phòng khám".
A2: Hiển thị cảnh báo: "Phòng khám đã đủ số lượng tiếp nhận. Vui lòng chọn phòng khám khác" (Mã ngoại lệ E1).
A3: Hủy lựa chọn cũ, cho phép chọn lại phòng khám mới (Mã rẽ nhánh A1).
A4: Khởi tạo lượt khám, cấp số thứ tự tự động tuần tự không trùng, lưu CSDL ở trạng thái chờ thanh toán, đồng bộ sang bộ phận Thu ngân và in phiếu khám cho bệnh nhân.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Đã chọn chuyên khoa/phòng khám hợp lệ? | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- |
|  | C2: Phòng khám đã đạt giới hạn tối đa? | - | - | T | F | F |
|  | C3: Thực hiện đổi/hủy lựa chọn trước khi cấp? | - | F | - | F | T |
| Hành động (A) | A1: Báo lỗi "Vui lòng chọn chuyên khoa/phòng khám" | X |  |  |  |  |
|  | A2: Cảnh báo phòng khám đã đủ số lượng (E1) |  |  | X |  |  |
|  | A3: Cho phép đổi/hủy lựa chọn phòng khám (A1) |  |  |  |  | X |
|  | A4: Cấp số tự động, lưu CSDL, đồng bộ thu ngân, in phiếu |  |  |  | X |  |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F03_01 | Bảng quyết định (Q1) | Nhân viên tiếp nhận để trống trường department_code (không chọn phòng khám) và bấm "Đăng ký khám & Cấp số". | Hệ thống chặn thao tác, hiển thị thông báo lỗi: "Vui lòng chọn chuyên khoa/phòng khám". |
| TC_F03_02 | Bảng quyết định (Q5) / Rẽ nhánh A1 | Nhân viên chọn nhầm Phòng Nội 1, sau đó thay đổi lựa chọn sang Phòng Nội 2 trước khi bấm nút đăng ký. | Hệ thống ghi nhận đúng lựa chọn mới là Phòng Nội 2 và hủy bỏ lựa chọn phòng cũ. |
| TC_F03_03 | Bảng quyết định (Q3) / Ngoại lệ E1 | Nhân viên chọn một phòng khám đã đạt giới hạn tiếp nhận tối đa trong ngày và bấm "Đăng ký khám & Cấp số". | Hệ thống hiển thị cảnh báo: "Phòng khám đã đủ số lượng tiếp nhận. Vui lòng chọn phòng khám khác". Không cấp số. |
| TC_F03_04 | Phân vùng TĐ / BQ (Q4) | Nhân viên chọn phòng khám còn chỗ, không chọn chế độ ưu tiên, bấm "Đăng ký khám & Cấp số". | Khởi tạo lượt khám thành công, cấp số thứ tự tuần tự không trùng, lưu CSDL ở trạng thái chờ thanh toán, đồng bộ sang Thu ngân và in phiếu khám. |
| TC_F03_05 | Phân vùng TĐ / BQ (Q4) | Nhân viên chọn phòng khám còn chỗ, tích chọn chế độ ưu tiên (người già/trẻ nhỏ/cấp cứu), bấm "Đăng ký khám & Cấp số". | Khởi tạo lượt khám ưu tiên thành công, cấp số thứ tự riêng biệt không trùng, đồng bộ Thu ngân và in phiếu khám cho bệnh nhân. |



### 3. Kiểm thử hộp trắng


#### 2.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
static createPatient(raw, nextId) {
1.  const formattedDate = dayjs().format("DD/MM/YYYY");
2.  return {
3.    id: nextId,
4.    patient_code: raw.patient_code || `BN2026${String(nextId).padStart(4, "0")}`,
5.    name: raw.name.trim(),
6.    gender: raw.gender || "Nam",
7.    birth_date: raw.birth_date || "01/01/2000",
8.    phone: raw.phone.trim(),
9.    identity_card_number: raw.identity_card_number.trim(),
10.   insurance_code: raw.insurance_code ? raw.insurance_code.trim() : null,
11.   department: raw.department || "Khoa Nội Tổng Hợp",
12.   doctor: raw.doctor || "BS. Chưa chỉ định",
13.   reception_date: raw.reception_date || formattedDate,
14.   status: raw.status || "Chờ khám",
15.   address: raw.address || "Hà Nội",
16.   symptoms: raw.symptoms || "Đăng ký khám mới",
17.   created_at: new Date().toISOString()
};
}
```


#### 2.2. ĐỒ THỊ DÒNG ĐIỂU KHIỂN C1/C2


#### 2.3. BẢNG THIẾT KẾ CA KIỂM THỬ C1, C2 & C3

| Mã TC | Dữ liệu đầu vào (raw, nextId) | Mục đích kiểm tra | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_EF_01 | raw = { name: " Trần Văn B ", phone: " 0988777666 ", identity_card_number: " 001092009999 " }, nextId = 5 | Kiểm tra kích hoạt toàn bộ giá trị mặc định (Fallback). | patient_code = "BN20260005", gender = "Nam", department = "Khoa Nội Tổng Hợp", status = "Chờ khám". |
| TC_EF_02 | raw = { patient_code: "BN9999", name: "Lê Thị C", gender: "Nữ", birth_date: "15/05/1995", phone: "0355444333", identity_card_number: "034195001234", insurance_code: "DN479123", department: "Khoa Khám Bệnh", status: "Đang khám" }, nextId = 10 | Kiểm tra ghi đè toàn bộ giá trị tường minh từ người dùng. | Giữ nguyên các giá trị tùy chỉnh, trim bỏ khoảng trắng thừa. |



### 4. Kiểm thử đơn vị


> **4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: ĐĂNG KÝ KHÁM VÀ CẤP SỐ THỨ TỰ (UT11 – UT28)**



#### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

## Chức năng 3: Điều phối và gọi số khám

### 1. Đặc tả


#### 3.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-THAI-04 |
| --- | --- |
| Tên Use Case (Use Case Name) | Điều phối và gọi số khám |
| Người thực hiện & Ngày tạo | Nguyễn Hồng Thái — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Nhân viên tại phòng khám (bác sĩ/điều dưỡng thực hiện gọi số), Bệnh nhân |
| Điều kiện tiên quyết (Pre-conditions) | Hệ thống quản lý hàng chờ đang hoạt động bình thường và có ít nhất một số thứ tự đang chờ trong hàng đợi. |
| Điều kiện sau thành công (Post-conditions) | Màn hình sảnh chờ luôn phản ánh đúng số thứ tự đang được gọi và các số tiếp theo, kèm âm thanh thông báo tương ứng đã được phát. |
| Kích hoạt (Trigger) | - T1 — Khởi động màn hình: Màn hình hiển thị tại sảnh chờ được bật và kết nối vào hệ thống.<br>- T2 — Sự kiện gọi số: Nhân viên tại quầy/phòng khám nhấn nút "Gọi số tiếp theo" hoặc "Gọi lại" trong suốt ca làm việc. |


#### 3.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | call_next_action | Nút "Gọi số tiếp theo" [Button] | Action | Có (Y) | Chỉ khả dụng khi còn số thứ tự đang chờ trong hàng đợi của quầy/phòng khám. | — |
| 2 | recall_action | Nút "Gọi lại" [Button] | Action | Không (N) | Chỉ áp dụng cho số đã được gọi trước đó và thuộc hàng đợi hiện tại của quầy. | "Số này không thuộc hàng đợi hiện tại của quầy" |


#### 3.3. Dữ liệu đầu ra (Outputs)

Màn hình sảnh chờ: Hiển thị bảng trạng thái hàng đợi gồm: Số đang phục vụ tại từng quầy và danh sách các số chuẩn bị tiếp theo.
Âm thanh thông báo: Phát kèm hiệu ứng nháy sáng số vừa được gọi để mời bệnh nhân đến quầy.
Cập nhật hàng đợi: Danh sách các số chờ tiếp theo tự động dịch chuyển lên một vị trí sau mỗi lần gọi số.

#### 3.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Màn hình sảnh chờ khởi động, kết nối vào hệ thống và hiển thị bảng trạng thái hàng đợi gồm: Số đang phục vụ tại từng quầy và danh sách các số chuẩn bị tiếp theo.**
- **Bước 2: Khi nhân viên tại quầy nhấn nút "Gọi số tiếp theo", hệ thống cập nhật số thứ tự mới cho quầy đó.**
- **Bước 3: Màn hình sảnh chờ lập tức nháy sáng số vừa gọi kèm phát âm thanh thông báo mời bệnh nhân đến quầy.**
- **Bước 4: Danh sách các số chờ tiếp theo tự động dịch chuyển lên một vị trí.**
- **Bước 5: Hệ thống lặp lại bước 2–4 mỗi khi có sự kiện gọi số, cho đến khi kết thúc ca làm việc. Kết thúc Use Case.**

#### 3.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã rẽ nhánh [A1]: Gọi lại số (bệnh nhân không có mặt khi được gọi)
 Sau bước 3, bệnh nhân không đến quầy trong thời gian quy định → Nhân viên tại quầy nhấn nút "Gọi lại" → Hệ thống phát lại thông báo số đó (nháy sáng + âm thanh) trên màn hình sảnh chờ, không dịch chuyển thứ tự hàng đợi → Quay lại bước 3.**
- **Mã ngoại lệ [E1]: Mất kết nối hiển thị
 Hệ thống phát hiện màn hình sảnh chờ bị mất tín hiệu → Hệ thống tự động kích hoạt cơ chế kết nối lại cho đến khi khôi phục trạng thái → Sau khi kết nối lại thành công, hệ thống đồng bộ lại toàn bộ trạng thái hàng đợi hiện tại lên màn hình để đảm bảo không hiển thị sai hoặc hiển thị số đã cũ.**
- **Mã ngoại lệ [E2]: Gọi trùng hoặc gọi nhầm số
 Tại bước 2, hệ thống phát hiện số thứ tự vừa gọi đã được gọi trước đó hoặc không thuộc hàng đợi hiện tại của quầy → Hệ thống từ chối cập nhật, hiển thị cảnh báo nhắc nhở nhân viên tại quầy và giữ nguyên trạng thái màn hình hiện tại → Nhân viên tại quầy kiểm tra và chọn lại đúng số cần gọi, quay lại bước 2.**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Điều phối và gọi số khám" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định để kiểm soát chặt chẽ trạng thái hàng đợi, cơ chế kết nối màn hình hiển thị sảnh chờ và tính chính xác của các thao tác gọi số.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra tính khả dụng của các nút hành động (call_next_action, recall_action) dựa trên trạng thái thực tế của hàng đợi.**

Trường call_next_action (Nút "Gọi số tiếp theo"):
Miền hợp lệ: Hàng chờ của quầy/phòng khám còn ít nhất một số thứ tự đang chờ.
Miền không hợp lệ: Hàng chờ trống (0 số đang chờ).
Trường recall_action (Nút "Gọi lại"):
Miền hợp lệ: Số thứ tự cần gọi lại là số đã được gọi trước đó và thuộc hàng đợi hiện tại của quầy.
Miền không hợp lệ: Số không thuộc hàng đợi hiện tại của quầy hoặc chưa từng được gọi.

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Hàng đợi của quầy/phòng khám có còn số thứ tự đang chờ không?
C2: Thao tác thực hiện là "Gọi số tiếp theo" hay "Gọi lại"?
C3: Số thứ tự được chọn gọi lại có thuộc hàng đợi hiện tại của quầy không (đối với thao tác gọi lại)?
C4: Trạng thái kết nối mạng giữa hệ thống và màn hình sảnh chờ có ổn định không?
Các hành động (A):
A1: Nút "Gọi số tiếp theo" bị vô hiệu hóa hoặc hệ thống thông báo hàng đợi đang trống.
A2: Cập nhật số thứ tự mới cho quầy, màn hình sảnh chờ nháy sáng, phát âm thanh mời bệnh nhân và danh sách chờ dịch chuyển lên một vị trí (Luồng chính).
A3: Phát lại thông báo (nháy sáng + âm thanh) trên màn hình sảnh chờ, không dịch chuyển thứ tự hàng đợi (Rẽ nhánh A1).
A4: Từ chối cập nhật, hiển thị cảnh báo nhắc nhở nhân viên: "Số này không thuộc hàng đợi hiện tại của quầy" (Ngoại lệ E2).
A5: Tự động kích hoạt cơ chế kết nối lại, đồng bộ toàn bộ trạng thái hàng đợi hiện tại lên màn hình sảnh chờ sau khi khôi phục (Ngoại lệ E1).
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Hàng chờ còn số thứ tự đang chờ? | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- |
|  | C2: Thao tác là "Gọi số tiếp theo"? | - | T | F (Gọi lại) | F (Gọi lại) | T |
|  | C3: Số gọi lại thuộc hàng đợi hiện tại? | - | - | F | T | - |
|  | C4: Màn hình sảnh chờ kết nối ổn định? | - | T | T | T | F (Mất kết nối) |
| Hành động (A) | A1: Vô hiệu hóa nút / Báo hàng đợi trống | X |  |  |  |  |
|  | A2: Cập nhật số mới, nháy sáng, dịch chuyển hàng chờ |  | X |  |  |  |
|  | A3: Phát lại thông báo cũ, giữ nguyên hàng chờ (A1) |  |  |  | X |  |
|  | A4: Báo lỗi số không thuộc hàng đợi (E2) |  |  | X |  |  |
|  | A5: Tự động kết nối lại, đồng bộ màn hình (E1) |  |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F04_01 | Bảng quyết định (Q1) | Hàng chờ của phòng khám hiện đang trống (0 số chờ). Nhân viên quan sát nút "Gọi số tiếp theo". | Nút "Gọi số tiếp theo" không khả dụng (bị vô hiệu hóa). |
| TC_F04_02 | Bảng quyết định (Q2) | Hàng chờ có sẵn bệnh nhân. Nhân viên bấm nút "Gọi số tiếp theo". | Hệ thống cập nhật số thứ tự mới, màn hình sảnh chờ nháy sáng kèm âm thanh mời bệnh nhân, hàng chờ dịch chuyển lên 1 vị trí. |
| TC_F04_03 | Bảng quyết định (Q4) / Rẽ nhánh A1 | Sau khi gọi số nhưng bệnh nhân vắng mặt, nhân viên nhấn nút "Gọi lại". | Hệ thống phát lại thông báo (nháy sáng + âm thanh) số đó trên màn hình sảnh chờ, thứ tự hàng đợi không thay đổi. |
| TC_F04_04 | Bảng quyết định (Q3) / Ngoại lệ E2 | Nhân viên thao tác chọn một số thứ tự không thuộc hàng đợi hiện tại của quầy để gọi lại. | Hệ thống từ chối cập nhật, hiển thị cảnh báo: "Số này không thuộc hàng đợi hiện tại của quầy", giữ nguyên trạng thái màn hình. |
| TC_F04_05 | Bảng quyết định (Q5) / Ngoại lệ E1 | Màn hình sảnh chờ bị mất tín hiệu kết nối trong ca làm việc. Nhân viên thực hiện gọi số mới. | Hệ thống tự động kích hoạt cơ chế kết nối lại, sau khi khôi phục sẽ tự động đồng bộ lại toàn bộ trạng thái hàng đợi hiện tại lên màn hình. |



### 3. Kiểm thử hộp trắng


#### 3.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
updatePatient(idOrCode, updateData) {
1.  const existing = patientRepository.findByIdOrCode(idOrCode);
2.  if (!existing) {
3.    const error = new Error("Không tìm thấy hồ sơ bệnh nhân");
4.    error.statusCode = 404;
5.    throw error;
6.  }
7.  const { name, identity_card_number, phone, status } = updateData || {};
8.  if (name && name.trim().length < 2) {
9.    const error = new Error("Họ và tên phải có ít nhất 2 ký tự");
10.   error.statusCode = 400;
11.   throw error;
12. }
13. if (identity_card_number && !/^\d{12}$/.test(identity_card_number.trim())) {
14.   const error = new Error("Số CCCD phải gồm đúng 12 chữ số");
15.   error.statusCode = 400;
16.   throw error;
17. }
18. if (phone && !/^0(3|5|7|8|9)\d{8}$/.test(phone.trim())) {
19.   const error = new Error("Số điện thoại phải 10 số đầu mạng VN hợp lệ");
20.   error.statusCode = 400;
21.   throw error;
22. }
23. if (status && status !== existing.status) {
24.   const check = EncounterStateMachine.canTransition(existing.status, status);
25.   if (!check.isValid) {
26.     console.warn(`[EncounterState Warning]: ${check.reason}`);
27.   }
28. }
29. const updated = patientRepository.update(idOrCode, updateData);
30. eventBus.emitEvent(EVENT_TYPES.PATIENT_UPDATED, {
31.   patient: updated,
32.   message: `Hồ sơ bệnh nhân [{updated.patient_code}) vừa được cập nhật.`
33. });
34. return updated;
}
```


#### 3.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN

3.2.1. Đồ thị dòng điều khiển cho C1 và C2 (Đỉnh đánh số chính xác)
3.2.2. Phân tích độ phức tạp cho C1/C2
Số điểm quyết định  (tại các đỉnh 2, 8, 13, 18, 23, 25).
Công thức McCabe: . Cần tối thiểu 6 đường đi cơ sở.
4.3.2.3. Thiết kế ca kiểm thử cho Độ đo C1
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (idOrCode, updateData) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_UP_01 | 1 -> 2 -> 3..6 | idOrCode = "BN9999", updateData = {} | Lỗi HTTP 404: “Không tìm thấy hồ sơ bệnh nhân” | 1, 2, 3, 4, 5, 6 |
| 2 | TC_UP_02 | 1 -> 2 -> 7 -> 8 -> 9..12 | idOrCode = "BN0001", updateData = { name: "A" } | Lỗi HTTP 400: “Họ và tên phải có ít nhất 2 ký tự” | 7, 8, 9, 10, 11, 12 |
| 3 | TC_UP_03 | 1 -> 2 -> 7 -> 8 -> 13 -> 14..17 | idOrCode = "BN0001", updateData = { identity_card_number: "123" } | Lỗi HTTP 400: “Số CCCD phải gồm đúng 12 chữ số” | 13, 14, 15, 16, 17 |
| 4 | TC_UP_04 | 1 -> 2 -> 7 -> 8 -> 13 -> 18 -> 19..22 | idOrCode = "BN0001", updateData = { phone: "123" } | Lỗi HTTP 400: “Số điện thoại 10 số đầu mạng VN hợp lệ” | 18, 19, 20, 21, 22 |
| 5 | TC_UP_05 | Đường qua State Machine | idOrCode = "BN0001", updateData = { status: "Trạng Thái Sai" } | Ghi log console.warn, cập nhật thành công | 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 |
| 6 | TC_UP_06 | Đường thành công | idOrCode = "BN0001", updateData = { status: "Đang khám" } | Cập nhật thành công, phát sự kiện PATIENT_UPDATED | Các câu lệnh cập nhật thông thường |

3.2.4. Thiết kế ca kiểm thử cho Độ đo C2
| Điểm QĐ | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !existing | TC_UP_C2_01 (Nhảy sang Đỉnh 3) | TC_UP_C2_02 (Đi tiếp Đỉnh 7) |
| Đỉnh 8 | name && name.trim().length < 2 | TC_UP_C2_03 (Nhảy sang Đỉnh 9) | TC_UP_C2_04 (Đi tiếp Đỉnh 13) |
| Đỉnh 13 | identity_card_number && !Regex_CCCD | TC_UP_C2_05 (Nhảy sang Đỉnh 14) | TC_UP_C2_06 (Đi tiếp Đỉnh 18) |
| Đỉnh 18 | phone && !Regex_Phone | TC_UP_C2_07 (Nhảy sang Đỉnh 19) | TC_UP_C2_08 (Đi tiếp Đỉnh 23) |
| Đỉnh 23 | status && status !== existing.status | TC_UP_C2_09 (Nhảy sang Đỉnh 24) | TC_UP_C2_10 (Đi tiếp Đỉnh 29) |

3.2.5. Sơ đồ và Bảng phân tích điều kiện con C3
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (idOrCode, updateData) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_UP_C3_01 | 8a = True, 8b = True | idOrCode = "BN0001", updateData = { name: "X" } | Quăng lỗi: Tên ít nhất 2 ký tự |
| TC_UP_C3_02 | 13a = True, 13b = True | idOrCode = "BN0001", updateData = { identity_card_number: "123" } | Quăng lỗi: CCCD phải 12 chữ số |
| TC_UP_C3_03 | 18a = True, 18b = True | idOrCode = "BN0001", updateData = { phone: "0123" } | Quăng lỗi: SĐT mạng VN hợp lệ |
| TC_UP_C3_04 | 23a = True, 23b = True | idOrCode = "BN0001", updateData = { status: "Đang khám" } | Kiểm tra chuyển đổi trạng thái hợp lệ |


#### 3.3. KIỂM THỬ DÒNG DỮ LIỆU

3.1. Sơ đồ trạng thái U-D-R-A cho biến cốt lõi


### 4. Kiểm thử đơn vị


> **5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: ĐIỀU PHỐI VÀ GỌI SỐ KHÁM (UT29 – UT45)**



#### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

# Dương Quốc Vượng

## Chức năng 1: Lập hóa đơn viện phí

### 1. Đặc tả


#### 1.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-THUNGAN-05 |
| --- | --- |
| Tên Use Case (Use Case Name) | Lập hóa đơn viện phí |
| Người thực hiện & Ngày tạo | Dương Quốc Vượng — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Nhân viên Thu ngân |
| Điều kiện tiên quyết (Pre-conditions) | Bệnh nhân đã được tiếp đón đăng ký khám hoặc đã được bác sĩ chỉ định dịch vụ cận lâm sàng. |
| Điều kiện sau thành công (Post-conditions) | Hóa đơn thanh toán được tạo thành công ở trạng thái chờ thanh toán. Hệ thống tự động chuyển sang giao diện thực hiện thanh toán. |
| Kích hoạt (Trigger) | Thu ngân chọn một bệnh nhân trong danh sách chờ thu tiền, tìm kiếm theo mã bệnh nhân hoặc quét mã vạch. |


#### 1.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | patient_id | Mã bệnh nhân [Search Box / Barcode Scanner] | String | Có (nếu để trống Họ tên) | - Tối đa 20 ký tự.<br><br>- Chỉ chứa chữ cái và số, không chứa ký tự đặc biệt.<br><br>- Phải tồn tại trong CSDL bệnh nhân. | "Mã bệnh nhân không hợp lệ hoặc không tồn tại trên hệ thống." |
| 2 | patient_name | Họ tên bệnh nhân [Search Box] | String | Có (nếu để trống Mã BN) | - Tối đa 50 ký tự.<br><br>- Chỉ chứa chữ cái và khoảng trắng.<br><br>- Cho phép tìm kiếm gần đúng (fuzzy search). | "Họ tên bệnh nhân không hợp lệ (tối đa 50 ký tự, không chứa số/ký tự đặc biệt)." |
| 3 | selected_services | Danh sách khoản phí [Checkbox List] | Array (String) | Có | - Phải chọn ít nhất 1 khoản mục chi phí chưa thanh toán.<br><br>- Các dịch vụ chọn phải có giá trị hợp lệ (> 0 VNĐ). | "Vui lòng chọn ít nhất một dịch vụ cần lập hóa đơn." |


#### 1.3. Dữ liệu đầu ra

Data Grid (Bảng chi tiết chi phí): Danh sách các khoản mục cần thanh toán bao gồm: Tên dịch vụ (tiền khám chuyên khoa, tiền xét nghiệm, tiền chụp chiếu), Số lượng, Đơn giá, Thành tiền.
Summary Block (Khối tổng hợp tiền): Hiển thị các thông số đã được hệ thống tự động tính toán: [Tổng số tiền], [Phần trăm bảo hiểm y tế chi trả], [Số tiền người bệnh thực tế phải đóng].
Status Notification: Mã Hóa đơn mới được tạo thành công kèm nhãn trạng thái (Badge) 'Chờ thanh toán'.

#### 1.4. Luồng sự kiện chính

- **Bước 1: Thu ngân tìm kiếm bệnh nhân theo mã bệnh nhân hoặc quét mã vạch.**
- **Bước 2: Hệ thống truy xuất dữ liệu và hiển thị danh sách các khoản mục cần thanh toán (tiền khám chuyên khoa, tiền xét nghiệm, tiền chụp chiếu).**
- **Bước 3: Hệ thống tự động tính toán tổng số tiền, phần trăm bảo hiểm y tế chi trả và số tiền người bệnh thực tế phải đóng.**
- **Bước 4: Thu ngân kiểm tra lại các mục chi phí và nhấn nút "Tạo hóa đơn".**
- **Bước 5: Hệ thống ghi nhận hóa đơn mới và chuyển sang giao diện thực hiện thanh toán.**

#### 1.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh

- **Mã ngoại lệ [E1.1]: Để trống trường tìm kiếm: Người dùng nhấn tìm kiếm nhưng không nhập patient_id hoặc patient_name -> Đổi viền ô tìm kiếm sang màu đỏ, hiển thị lỗi inline: 'Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm'.**
- **Mã ngoại lệ [E1.2]: Lỗi định dạng dữ liệu đầu vào: Người dùng nhập dữ liệu vi phạm quy tắc (quá số ký tự, chứa ký tự đặc biệt) -> Hiển thị lỗi inline tương ứng (tham khảo bảng 3.1.2), vô hiệu hóa nút Tìm kiếm.**
- **Mã ngoại lệ [E1.3]: Không tìm thấy bệnh nhân: Hệ thống không tìm thấy hồ sơ khớp với từ khóa -> Hiển thị thông báo Toast/Inline: 'Không tìm thấy thông tin bệnh nhân trên hệ thống'.**
- **Mã ngoại lệ [E1.4]: Dịch vụ đã được thanh toán: Tại bước 2, hệ thống phát hiện các dịch vụ này đã có người thu trước đó -> Hệ thống hiển thị thông báo: "Các khoản chi phí này đã được thanh toán đầy đủ", đồng thời vô hiệu hóa (làm mờ) nút 'Tạo hóa đơn'.**
- **Mã ngoại lệ [E1.5]: Bệnh nhân chưa có chỉ định/yêu cầu khám: Bệnh nhân hợp lệ nhưng không có chi phí phát sinh -> Hiển thị thông báo: 'Bệnh nhân chưa có chỉ định dịch vụ hoặc yêu cầu khám nào cần thanh toán'.**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Lập hóa đơn viện phí" được thực hiện dựa trên việc kết hợp các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định để bao phủ toàn bộ các ràng buộc dữ liệu đầu vào và luồng nghiệp vụ.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên**

Tập trung vào việc kiểm tra độ dài và định dạng của các trường văn bản nhập liệu.
Trường patient_id (Mã bệnh nhân):
Miền hợp lệ: Độ dài 1 - 20 ký tự, định dạng [a-zA-Z0-9]. Giá trị biên: 1 ký tự (Min), 20 ký tự (Max).
Miền không hợp lệ: Bỏ trống (khi patient_name cũng trống), vượt độ dài 21 ký tự (Max+), chứa ký tự đặc biệt.
Trường patient_name (Họ tên bệnh nhân):
Miền hợp lệ: Độ dài 1 - 50 ký tự, định dạng chữ cái và khoảng trắng. Giá trị biên: 1 ký tự (Min), 50 ký tự (Max).
Miền không hợp lệ: Bỏ trống (khi patient_id cũng trống), vượt độ dài 51 ký tự (Max+), chứa chữ số hoặc ký tự đặc biệt.
Trường selected_services (Danh sách khoản phí):
Miền hợp lệ:
Miền không hợp lệ: Chọn 0 dịch vụ.

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Dữ liệu tìm kiếm (patient_id hoặc patient_name) có đúng định dạng và không bị bỏ trống hay không?
C2: Bệnh nhân có tồn tại trong cơ sở dữ liệu hệ thống hay không?
C3: Bệnh nhân có khoản phí dịch vụ nào phát sinh/chưa thanh toán hay không?
C4: Nhân viên thu ngân có tick chọn ít nhất 1 khoản phí (selected_services) để lập hóa đơn hay không?
Các hành động (A):
A1: Hiển thị lỗi định dạng hoặc lỗi để trống dữ liệu (Mã ngoại lệ E1.1, E1.2), hệ thống chặn truy vấn tìm kiếm.
A2: Hiển thị thông báo "Không tìm thấy thông tin bệnh nhân trên hệ thống" (Mã ngoại lệ E1.3).
A3: Hiển thị cảnh báo "Các khoản chi phí này đã được thanh toán đầy đủ" hoặc "Bệnh nhân chưa có chỉ định...", đồng thời vô hiệu hóa (làm mờ) nút 'Tạo hóa đơn' (Mã ngoại lệ E1.4, E1.5).
A4: Hiển thị thông báo lỗi "Vui lòng chọn ít nhất một dịch vụ cần lập hóa đơn".
A5: Hiển thị chi tiết Bảng chi phí (Data Grid), tính toán Tổng tiền (Summary Block), cho phép nhấn "Tạo hóa đơn" thành công và chuyển trạng thái hóa đơn sang 'Chờ thanh toán'.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện | C1: Dữ liệu tìm kiếm đúng định dạng/không bỏ trống? | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- |
|  | C2: Bệnh nhân có tồn tại trong CSDL? | - | F | T | T | T |
|  | C3: Có khoản phí phát sinh/chưa thanh toán? | - | - | F | T | T |
|  | C4: Chọn ít nhất 1 khoản phí (selected_services)? | - | - | - | F | T |
| Hành động | A1: Báo lỗi định dạng / Báo lỗi để trống | X |  |  |  |  |
|  | A2: Thông báo "Không tìm thấy thông tin..." |  | X |  |  |  |
|  | A3: Cảnh báo "Đã thanh toán..." / "Chưa có chỉ định...", mờ nút |  |  | X |  |  |
|  | A4: Thông báo "Vui lòng chọn ít nhất một dịch vụ..." |  |  |  | X |  |
|  | A5: Bảng chi phí hiển thị, cho phép "Tạo hóa đơn" thành công |  |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không cần xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F5_01 | Giá trị biên | Nhập patient_id = "B" (1 ký tự - Min), patient_name trống. | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| TC_F5_02 | Giá trị biên | Nhập patient_id = "BN123456789012345678" (20 ký tự - Max). | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| TC_F5_03 | Giá trị biên | Nhập patient_id có 21 ký tự (Max+). | Lỗi inline: "Mã bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| TC_F5_04 | Phân vùng tương đương | Nhập patient_id = "BN-123@". | Lỗi inline: "Mã bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| TC_F5_05 | Giá trị biên | Nhập patient_name = "A" (1 ký tự - Min), patient_id trống. | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| TC_F5_06 | Giá trị biên | Nhập patient_name = chuỗi đúng 50 ký tự (Max). | Vượt qua validate định dạng, tiến hành truy xuất CSDL. |
| TC_F5_07 | Giá trị biên | Nhập patient_name = chuỗi có 51 ký tự (Max+). | Lỗi inline: "Họ tên bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| TC_F5_08 | Phân vùng tương đương | Nhập patient_name = "Nguyen Van A123". | Lỗi inline: "Họ tên bệnh nhân không hợp lệ...". Vô hiệu hóa tìm kiếm. |
| TC_F5_09 | Bảng quyết định (Q1) | Bỏ trống hoàn toàn cả patient_id và patient_name. | Viền đỏ ô nhập liệu, lỗi: 'Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm'. |
| TC_F5_10 | Bảng quyết định (Q2) | Nhập patient_id hợp lệ, nhưng hồ sơ không có trong CSDL. | Hiển thị Toast/Inline: 'Không tìm thấy thông tin bệnh nhân trên hệ thống'. |
| TC_F5_11 | Bảng quyết định (Q3) | Tìm đúng bệnh nhân, nhưng không có chỉ định phí nào. | Hiển thị: 'Bệnh nhân chưa có chỉ định dịch vụ hoặc yêu cầu khám nào cần thanh toán'. |
| TC_F5_12 | Bảng quyết định (Q3) | Tìm đúng bệnh nhân, nhưng các dịch vụ đã thu tiền trước đó. | Hiển thị: "Các khoản chi phí này đã được thanh toán đầy đủ". Nút 'Tạo hóa đơn' bị làm mờ. |
| TC_F5_13 | Bảng quyết định (Q4) | Tìm đúng BN có dịch vụ chưa thanh toán, nhưng Thu ngân bỏ tick toàn bộ danh sách selected_services (0 khoản mục). | Lỗi: "Vui lòng chọn ít nhất một dịch vụ cần lập hóa đơn." Không thể tạo hóa đơn. |
| TC_F5_14 | Bảng quyết định (Q5) | Tìm đúng BN, có dịch vụ, tick chọn ≥ 1 dịch vụ và nhấn "Tạo hóa đơn". | Hiển thị Data Grid chi phí, Summary Block tính tổng tiền, bảo hiểm và thực thu. Tạo hóa đơn thành công ở trạng thái 'Chờ thanh toán', chuyển giao diện. |



### 3. Kiểm thử hộp trắng


#### 1.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
function executeCreateInvoice(payload) {

1.  const { patient_code, patient_name, item_type, description, total_amount, insurance_discount = 0, insurance_percent = 0, payment_method = "CHUA_THANH_TOAN", cashier = "Trần Văn Thu Ngân", items = [], reference_id = null } = payload || {};

2.  if (!patient_code || !patient_name || total_amount === undefined || total_amount === null)

3.      throw new Error("Thiếu thông tin bắt buộc (mã BN, tên BN, tổng số tiền)");

3.  const total = Number(total_amount);

5.  if (isNaN(total) || total <= 0)

6.      throw new Error("Tổng tiền hóa đơn phải lớn hơn 0");

7.  const discount = Number(insurance_discount) || 0;

8.  if (discount < 0)

9.      throw new Error("Mức giảm trừ bảo hiểm không được là số âm");

10. if (discount > total)

11.     throw new Error("Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)");

12. const patientPay = Math.max(0, total - discount);

13. const calculation = { totalAmount: total, insuranceDiscount: discount, patientPay };

13. const nextId = invoiceRepository.getNextId();

15. const finalItemType = item_type || "TIEN_KHAM";

16. const finalDesc = description || "Thanh toán viện phí";

17. const isPaid = payment_method && payment_method !== "CHUA_THANH_TOAN";

18. const invoiceStatus = isPaid ? "PAID" : "UNPAID";

19. const newInvoice = { id: nextId, invoice_code: `HD${String(nextId).padStart(6, "0")}`, patient_code, patient_name, item_type: finalItemType, description: finalDesc, total_amount: calculation.totalAmount, insurance_discount: calculation.insuranceDiscount, insurance_percent, patient_pay: calculation.patientPay, payment_method, status: invoiceStatus, cashier, items, reference_id };

20. invoiceRepository.create(newInvoice);

21. eventBus.emitEvent("INVOICE_CREATED", { invoice: newInvoice });

22. return newInvoice;

}
```


#### 1.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 1.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2

Trong đồ thị C1/C2, mỗi cấu trúc rẽ nhánh if được xem như một điểm quyết định đơn nhất (xét giá trị chân lý toàn cục của biểu thức True hoặc False):
Đỉnh 1: Khối khởi tạo, nhận và bóc tách payload.
Đỉnh 2: Điểm quyết định kiểm tra bắt buộc (!patient_code || !patient_name || total_amount === undefined || total_amount === null).
Đỉnh 3: Quăng ngoại lệ thiếu thông tin bắt buộc  Kết thúc sớm lỗi 1.
Đỉnh 4: Khối ép kiểu total = Number(total_amount).
Đỉnh 5: Điểm quyết định kiểm tra tiền hợp lệ (isNaN(total) || total <= 0).
Đỉnh 6: Quăng ngoại lệ tổng tiền   Kết thúc sớm lỗi 2.
Đỉnh 7: Khối ép kiểu discount = Number(insurance_discount) || 0.
Đỉnh 8: Điểm quyết định kiểm tra giảm trừ âm (discount < 0).
Đỉnh 9: Quăng ngoại lệ giảm trừ BHYT âm  Kết thúc sớm lỗi 3.
Đỉnh 10: Điểm quyết định kiểm tra giảm trừ vượt tổng tiền (discount > total).
Đỉnh 11: Quăng ngoại lệ giảm trừ BHYT vượt quá tổng tiền  Kết thúc sớm lỗi 4.
Đỉnh 12-16: Khối tính patientPay, lấy nextId, gán fallback item_type, description.
Đỉnh 17: Điểm quyết định kiểm tra thanh toán ngay (payment_method && payment_method !== "CHUA_THANH_TOAN").
Đỉnh 18a: Nhánh True của 17: invoiceStatus = "PAID".
Đỉnh 18b: Nhánh False của 17: invoiceStatus = "UNPAID".
Đỉnh 19-22: Khối tạo newInvoice, lưu DB, phát event và return  Kết thúc thành công.

#### 1.2.2 Phân tích độ phức tạp cho C1/C2

Trên đồ thị C1/C2: - Số điểm quyết định  (tại các đỉnh 2, 5, 8, 10, 17). - Công thức McCabe:
Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 1.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 22 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1: - Cần kích hoạt 4 nhánh throw (câu lệnh 3, 6, 9, 11). - Cần đi qua nhánh gán PAID (câu lệnh 18a) và UNPAID (câu lệnh 18b) cùng toàn bộ khối xử lý thành công (câu lệnh 19-22).
| Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- |
| TC_C1_01 |  | { patient_name: "Nguyễn Văn A", total_amount: 100000 } (thiếu patient_code) | Lỗi: “Thiếu thông tin bắt buộc…” | 1, 2, 3 |
| TC_C1_02 |  | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 0 } | Lỗi: “Tổng tiền hóa đơn phải lớn hơn 0” | 4, 5, 6 |
| TC_C1_03 |  | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: -20000 } | Lỗi: “Mức giảm trừ bảo hiểm không được là số âm” | 7, 8, 9 |
| TC_C1_04 |  | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 150000 } | Lỗi: “Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)” | 10, 11 |
| TC_C1_05 |  | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 80000, payment_method: "CHUA_THANH_TOAN" } | Thành công: status = "UNPAID", patient_pay = 20000 | 12, 13, 14, 15, 16, 17, 18b, 19, 20, 21, 22 |
| TC_C1_06 |  | { patient_code: "BN02", patient_name: "Trần Thị B", total_amount: 200000, insurance_discount: 0, payment_method: "TIEN_MAT" } | Thành công: status = "PAID", patient_pay = 200000 | 18a |

Tỷ lệ bao phủ C1:  câu lệnh = 100%.

#### 1.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 8, 10, 17 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !patient_code \\|\\| !patient_name \\|\\| total_amount === undefined \\|\\| total_amount === null | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 5 | isNaN(total) \\|\\| total <= 0 | TC_C2_03 (Nhảy sang Đỉnh 6) | TC_C2_04 (Đi tiếp Đỉnh 7) |
| Đỉnh 8 | discount < 0 | TC_C2_05 (Nhảy sang Đỉnh 9) | TC_C2_06 (Đi tiếp Đỉnh 10) |
| Đỉnh 10 | discount > total | TC_C2_07 (Nhảy sang Đỉnh 11) | TC_C2_08 (Đi tiếp Đỉnh 12-16) |
| Đỉnh 17 | payment_method && payment_method !== "CHUA_THANH_TOAN" | TC_C2_09 (Nhánh 18a: PAID) | TC_C2_10 (Nhánh 18b: UNPAID) |

Bảng tổng hợp ca kiểm thử C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { patient_name: "Lê Văn C", total_amount: 100000 } (thiếu patient_code) | Lỗi HTTP 400 |
| TC_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 8 (False), Đỉnh 10 (False), Đỉnh 17 (False) | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: 500000, insurance_discount: 100000, payment_method: "CHUA_THANH_TOAN" } | Tạo thành công hóa đơn UNPAID, patient_pay = 400000 |
| TC_C2_03 | Đỉnh 5 (True) | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: -1000 } | Lỗi: “Tổng tiền hóa đơn phải lớn hơn 0” |
| TC_C2_05 | Đỉnh 8 (True) | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: 500000, insurance_discount: -1 } | Lỗi: “Mức giảm trừ bảo hiểm không được là số âm” |
| TC_C2_07 | Đỉnh 10 (True) | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: 500000, insurance_discount: 600000 } | Lỗi: “Mức giảm trừ bảo hiểm không hợp lệ…” |
| TC_C2_09 | Đỉnh 17 (True) | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: 500000, insurance_discount: 0, payment_method: "VIETQR" } | Tạo thành công hóa đơn PAID, patient_pay = 500000 |

Tỷ lệ bao phủ C2:  nhánh quyết định = 100%.

#### 1.2.5 Đồ thị dòng điều khiển cho Độ đo C3

Tại độ đo C3, các biểu thức điều kiện phức hợp được tách nhỏ thành từng điều kiện con độc lập để kiểm soát ngắn mạch (short-circuit evaluation).
Điểm quyết định 2 gồm 4 điều kiện con:
(2a): !patient_code
(2b): !patient_name
(2c): total_amount === undefined
(2d): total_amount === null
Điểm quyết định 5 gồm 2 điều kiện con:
(5a): isNaN(total)
(5b): total <= 0
Điểm quyết định 17 gồm 2 điều kiện con:
(17a): Boolean(payment_method)
(17b): payment_method !== "CHUA_THANH_TOAN"

#### 1.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | ​ | patient_code = "" hoặc undefined | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 2 | ​ | patient_name = "" hoặc null | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 2 | ​ | Thuộc tính total_amount bị bỏ qua | True / False | TC_C3_03 (True) / TC_C3_04 (False) |
| 2 | ​ | total_amount = null | True / False | TC_C3_04 (True) / TC_C3_05 (False) |
| 5 | ​ | total_amount = "abc" | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 5 | ​ | total_amount = 0 hoặc -50000 | True / False | TC_C3_06 (True) / TC_C3_07 (False) |
| 8 | ​ | insurance_discount = -10000 | True / False | TC_C3_07 (True) / TC_C3_08 (False) |
| 10 | ​ | insurance_discount = 200000 > total = 100000 | True / False | TC_C3_08 (True) / TC_C3_09 (False) |
| 17 | ​ | payment_method = "" hoặc null | False / True | TC_C3_10 (False) / TC_C3_09 (True) |
| 17 | ​ | payment_method = "CHUA_THANH_TOAN" vs "TIEN_MAT" | False / True | TC_C3_11 (False) / TC_C3_09 (True) |

Bảng chi tiết bộ ca kiểm thử đạt C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | ​ | { patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_02 | ​ | { patient_code: "BN01", patient_name: "", total_amount: 100000 } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_03 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: undefined } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_04 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: null } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_05 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: "KHONG_PHAI_SO" } | Quăng lỗi: Tổng tiền phải lớn hơn 0 |
| TC_C3_06 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 0 } | Quăng lỗi: Tổng tiền phải lớn hơn 0 |
| TC_C3_07 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: -5000 } | Quăng lỗi: Giảm trừ BHYT không được âm |
| TC_C3_08 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 120000 } | Quăng lỗi: Giảm trừ BHYT vượt quá tổng tiền |
| TC_C3_09 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 20000, payment_method: "TIEN_MAT" } | Tạo thành công hóa đơn PAID, patient_pay = 80000 |
| TC_C3_10 | (rỗng) | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 20000, payment_method: "" } | Tạo thành công hóa đơn UNPAID |
| TC_C3_11 | ​ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 20000, payment_method: "CHUA_THANH_TOAN" } | Tạo thành công hóa đơn UNPAID |


#### 1.3. KIỂM THỬ DÒNG DỮ LIỆU


#### 1.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu học tập kiểm thử phần mềm: Đồ thị dòng dữ liệu của một đơn vị chương trình là một đồ thị có hướng , trong đó:
- Tập đỉnh (): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. Đồ thị  có hai đỉnh đặc biệt là đỉnh bắt đầu (tương ứng với lệnh def của các biến tham số) và đỉnh kết thúc đơn vị chương trình.
- Tập cạnh (): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ nhánh (p-use) của các biến.

#### 1.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh | ​ | ​ |
| --- | --- | --- |
| 1 | {patient_code, patient_name, total_amount, insurance_discount, payment_method, item_type, description, cashier, items, reference_id} | {} |
| 2 | {} | {} |
| 3 | {} | {} |
| 4 | {total} | {total_amount} |
| 5 | {} | {} |
| 6 | {} | {} |
| 7 | {discount} | {insurance_discount} |
| 8 | {} | {} |
| 9 | {} | {} |
| 10 | {} | {} |
| 11 | {patientPay, calculation, nextId, finalItemType, finalDesc} | {total, discount, item_type, description} |
| 12 | {} | {} |
| 13 | {invoiceStatus} | {} |
| 14 | {invoiceStatus} | {} |
| 15 | {newInvoice} | {nextId, patient_code, patient_name, finalItemType, finalDesc, calculation, payment_method, invoiceStatus, cashier, items, reference_id} |
| 16 | {} | {newInvoice} |


#### 1.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| ​ | Điều kiện tại cạnh | ​ |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!patient_code \|\| !patient_name \|\| total_amount == undefined \|\| total_amount == null) | {patient_code, patient_name, total_amount} |
| (2, 4) | ~(!patient_code \|\| !patient_name \|\| total_amount == undefined \|\| total_amount == null) | {patient_code, patient_name, total_amount} |
| (4, 5) | True | {} |
| (5, 6) | (isNaN(total) \|\| total <= 0) | {total} |
| (5, 7) | ~(isNaN(total) \|\| total <= 0) | {total} |
| (7, 8) | True | {} |
| (8, 9) | (discount < 0) | {discount} |
| (8, 10) | (discount > total) | {discount, total} |
| (8, 11) | ~((discount < 0) \|\| (discount > total)) | {discount, total} |
| (11, 12) | True | {} |
| (12, 13) | (payment_method && payment_method != ‘CHUA_THANH_TOAN’) | {payment_method} |
| (12, 14) | ~(payment_method && payment_method != ‘CHUA_THANH_TOAN’) | {payment_method} |
| (13, 15) | True | {} |
| (14, 15) | True | {} |
| (15, 16) | True | {} |


#### 1.3.4 Đồ thị dòng dữ liệu

Dưới đây là Đồ thị dòng dữ liệu của hàm createInvoice:
Các đỉnh xử lý/tính toán/khởi tạo chứa câu lệnh tương ứng.
Các đỉnh rẽ nhánh kiểm tra điều kiện được gán nhãn NULL.
Các cạnh chuyển tiếp mang nhãn biểu thức điều kiện, phủ định ~(...) hoặc true

#### 1.3.5 Bảng tổng hợp chi tiết Def-Use theo biến

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| payload | Tham số hàm () | (Destructuring các trường) | - |
| patient_code | ​ | (Gán vào newInvoice) | , |
| patient_name | ​ | (Gán newInvoice, nội dung eventBus) | , |
| total_amount | ​ | (Number(total_amount)) | , |
| total | ​ | (total - discount),  (calculation) | , , , |
| insurance_discount | ​ | (Number(insurance_discount)) | - |
| discount | ​ | (total - discount),  (calculation) | , , |
| patientPay | ​ | (calculation),  (newInvoice) | - |
| payment_method | ​ | (Gán vào newInvoice) | , |
| invoiceStatus | , | (Gán vào newInvoice.status) | - |
| newInvoice | ​ | (Gọi create, emitEvent),  (return) | - |


#### 1.3.6 Phân tích bất thường dòng dữ liệu

Bất thường Loại 1 (dd - Gán giá trị rồi lại gán tiếp giá trị ngay sau đó mà không sử dụng):
Đánh giá: KHÔNG CÓ. Tất cả các biến trung gian (total, discount, patientPay, invoiceStatus, newInvoice) đều được khai báo dạng const và khởi tạo duy nhất 1 lần, không xảy ra hiện tượng gán đè làm mất giá trị trước đó.
Bất thường Loại 2 (ur - Chưa gán giá trị nhưng đã được sử dụng):
Phân tích rủi ro: Nếu payload không có giá trị (undefined), việc đọc thuộc tính sẽ gây lỗi crash runtime TypeError.
Phòng vệ mã nguồn: Đoạn code đã dùng cơ chế fallback payload || {}, insurance_discount = 0, payment_method = "CHUA_THANH_TOAN".
Đối với giá trị total_amount: Nhánh kiểm tra tại cạnh  chặn triệt để trường hợp undefined hoặc null, ngăn chặn lỗi NaN trong phép tính tại .
Bất thường Loại 3 (du - Đã khai báo và gán giá trị nhưng không được sử dụng / Biến chết):
Đánh giá: KHÔNG CÓ. Mọi biến được định nghĩa ở , , ,  đều được truyền vào đối tượng newInvoice tại  và trả về ở .

#### 1.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi patientPay

Chuỗi biến đổi trạng thái là . Biến không bao giờ rơi vào trạng thái lỗi  (Anomaly).

#### 1.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| payload | ​ | ​ | ​ | Bóc tách an toàn các trường tham số từ payload. |
| total_amount | ​ | ​ | ​ | Giá trị chuỗi/số của total_amount chuyển hóa thành total tại . |
| insurance_discount | ​ | ​ | ​ | Giá trị giảm trừ BHYT chuyển hóa thành discount tại . |
| total | ​ | ​ | ​ | Biến total được dùng trong phép trừ total - discount và object calculation. |
| discount | ​ | ​ | ​ | Biến discount được dùng trong phép trừ total - discount và object calculation. |
| patientPay | ​ | ​ | ​ | Dùng patientPay đóng gói vào calculation.patientPay. |
| patientPay | ​ | ​ | (hoặc qua ) | Dùng patientPay gán vào newInvoice.patient_pay và format tiền trên eventBus. |
| patient_code | ​ | ​ | ​ | Giá trị patient_code được bảo toàn xuyên suốt đến khi lưu hóa đơn. |
| patient_name | ​ | ​ | ​ | Giá trị patient_name được gán vào newInvoice và nội dung thông báo Event. |
| item_type | ​ | ​ | ​ | Gán fallback finalItemType = item_type \\|\\| "TIEN_KHAM". |
| description | ​ | ​ | ​ | Gán fallback finalDesc = description \\|\\| "Thanh toán viện phí". |
| invoiceStatus | ​ | ​ | ​ | Trạng thái PAID được đưa vào newInvoice.status. |
| invoiceStatus | ​ | ​ | ​ | Trạng thái UNPAID được đưa vào newInvoice.status. |
| newInvoice | ​ | ​ | ​ | Đối tượng newInvoice sau khi lưu DB được trả về ở lệnh return. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_CUSE_01 | total_amount (), insurance_discount (), total (), discount (), patientPay (), invoiceStatus (), newInvoice () | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 500000, insurance_discount: 100000, payment_method: "CHUA_THANH_TOAN" } | Hóa đơn được tạo thành công:- total = 500000- discount = 100000- patient_pay = 400000- status = "UNPAID" |
| TC_CUSE_02 | invoiceStatus (), item_type (), description (), newInvoice () | { patient_code: "BN02", patient_name: "Trần Thị B", item_type: "CAN_LAM_SANG", description: "Siêu âm tổng quát", total_amount: 300000, insurance_discount: 0, payment_method: "TIEN_MAT" } | Hóa đơn được tạo thành công:- status = "PAID"- item_type = "CAN_LAM_SANG"- description = "Siêu âm tổng quát"- patient_pay = 300000 |
| TC_CUSE_03 | Fallback của item_type, description và insurance_discount () | { patient_code: "BN03", patient_name: "Lê Văn C", total_amount: 150000 } (không truyền item_type, description, insurance_discount) | Hóa đơn được tạo với giá trị fallback:- discount = 0- patient_pay = 150000- item_type = "TIEN_KHAM"- description = "Thanh toán viện phí" |


#### 1.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| patient_code | ​ | ​ | ​ | !patient_code nhận giá trị True. |
| patient_code | ​ | ​ | ​ | !patient_code nhận giá trị False (đầy đủ). |
| patient_name | ​ | ​ | ​ | !patient_name nhận giá trị True. |
| patient_name | ​ | ​ | ​ | !patient_name nhận giá trị False (đầy đủ). |
| total_amount | ​ | ​ | ​ | total_amount === undefined \\|\\| null nhận True. |
| total_amount | ​ | ​ | ​ | total_amount hợp lệ nhận False. |
| total | ​ | ​ | ​ | isNaN(total) \\|\\| total <= 0 nhận True. |
| total | ​ | ​ | ​ | total > 0 nhận False (hợp lệ). |
| total | ​ | ​ | ​ | discount > total nhận True. |
| total | ​ | ​ | ​ | discount <= total nhận False (hợp lệ). |
| discount | ​ | ​ | ​ | discount < 0 nhận True. |
| discount | ​ | ​ | ​ | discount > total nhận True. |
| discount | ​ | ​ | ​ | 0 <= discount <= total nhận Hợp lệ. |
| payment_method | ​ | ​ | ​ | payment_method && payment_method !== "CHUA_THANH_TOAN" nhận True. |
| payment_method | ​ | ​ | ​ | !payment_method \\|\\| payment_method === "CHUA_THANH_TOAN" nhận True. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_PUSE_01 | patient_code trên | { patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_02 | patient_name trên | { patient_code: "BN01", patient_name: "", total_amount: 100000 } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_03 | total_amount trên | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: null } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_04 | total trên | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: -50000 } | Quăng lỗi: Tổng tiền hóa đơn phải lớn hơn 0 |
| TC_PUSE_05 | discount trên | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: -10000 } | Quăng lỗi: Mức giảm trừ bảo hiểm không được là số âm |
| TC_PUSE_06 | total, discount trên | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: 300000 } | Quăng lỗi: Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền) |
| TC_PUSE_07 | payment_method trên  kèm các cạnh hợp lệ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: 50000, payment_method: "VIETQR" } | Tạo thành công hóa đơn PAID, patient_pay = 150000 |
| TC_PUSE_08 | payment_method trên  kèm các cạnh hợp lệ | { patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 200000, insurance_discount: 50000, payment_method: "CHUA_THANH_TOAN" } | Tạo thành công hóa đơn UNPAID, patient_pay = 150000 |



### 4. Kiểm thử đơn vị


> **3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ**



#### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Phương thức `invoiceService.createInvoice(payload)` và `StandardBillingStrategy.calculate(totalAmount, insuranceDiscount)`.
- **Tập tin kiểm thử:** [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js#L35-L167)
- **Quy tắc nghiệp vụ kiểm thử:**
  1. Thiếu thông tin bắt buộc (`patient_code`, `patient_name`, `total_amount`) $\rightarrow$ Ném lỗi HTTP 400.
  2. Tổng tiền phải là số hợp lệ và $> 0$. Nếu $\le 0$ hoặc `NaN` $\rightarrow$ Ném lỗi.
  3. Mức giảm trừ BHYT không được âm ($< 0$) và không được vượt quá tổng tiền ($> total$).
  4. Số tiền bệnh nhân phải nộp: $\text{patientPay} = \max(0, \text{total} - \text{discount})$.
  5. Phương thức thanh toán `"CHUA_THANH_TOAN"` gán trạng thái `"UNPAID"`. Phương thức `"TIEN_MAT"` gán `"PAID"`.


#### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Test Case | Tên hàm kiểm thử (Chuẩn slide: `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Phương thức `Assert` NUnit sử dụng |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 1 | **UT_INV_01** | `Test_CreateInvoice_ThieuMaBenhNhan_NemNgoaiLe400` | `{ patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 }` | Báo lỗi 400: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 2 | **UT_INV_02** | `Test_CreateInvoice_ThieuTenBenhNhan_NemNgoaiLe400` | `{ patient_code: "BN001", patient_name: "", total_amount: 100000 }` | Báo lỗi 400: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 3 | **UT_INV_03** | `Test_CreateInvoice_TongTienNull_NemNgoaiLe400` | `{ patient_code: "BN001", patient_name: "Nguyễn Văn A", total_amount: null }` | Báo lỗi 400: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 4 | **UT_INV_04** | `Test_CreateInvoice_TongTienKhongPhaiSo_NemNgoaiLe` | `{ total_amount: "KHONG_PHAI_SO" }` | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` |
| 5 | **UT_INV_05** | `Test_CreateInvoice_TongTienBangKhong_NemNgoaiLe` | `{ total_amount: 0 }` | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` |
| 6 | **UT_INV_06** | `Test_CreateInvoice_TongTienAm_NemNgoaiLe` | `{ total_amount: -50000 }` | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` |
| 7 | **UT_INV_07** | `Test_CreateInvoice_GiamTruBHYTAm_NemNgoaiLe` | `{ total_amount: 200000, insurance_discount: -10000 }` | Ngoại lệ: *"Mức giảm trừ bảo hiểm không được là số âm"* | `Assert.Throws` |
| 8 | **UT_INV_08** | `Test_CreateInvoice_GiamTruBHYTVuotQuaTongTien_NemNgoaiLe` | `{ total_amount: 200000, insurance_discount: 250000 }` | Ngoại lệ: *"Mức giảm trừ bảo hiểm không hợp lệ..."* | `Assert.Throws` |
| 9 | **UT_INV_09** | `Test_CreateInvoice_ChuaThanhToan_TrangThaiUNPAID_ThanhCong` | `{ total: 300000, discount: 60000, payment_method: "CHUA_THANH_TOAN" }` | `status = "UNPAID"`, `patient_pay = 240000`, phát sự kiện `INVOICE_CREATED` | `Assert.IsNotNull`<br>`Assert.AreEqual`<br>`Assert.Less`<br>`Assert.Greater` |
| 10 | **UT_INV_10** | `Test_CreateInvoice_ThanhToanNgay_TrangThaiPAID_ThanhCong` | `{ total: 150000, discount: 0, payment_method: "TIEN_MAT" }` | `status = "PAID"`, `patient_pay = 150000` | `Assert.AreEqual` |
| 11 | **UT_INV_11** | `Test_StandardBillingStrategy_ChiTraToanBo_PatientPayBangKhong` | `total = 500000`, `discount = 500000` | `patientPay = 0`, $patientPay \le totalAmount$, $patientPay \ge 0$ | `Assert.AreEqual`<br>`Assert.LessOrEqual`<br>`Assert.GreaterOrEqual` |
| 12 | **UT_INV_12** | `Test_CreateInvoice_GiaTriMacDinh_ThanhCong` | `{ patient_code: "BN003", total_amount: 250000 }` (không truyền discount/type/cashier) | `discount = 0`, `item_type = "TIEN_KHAM"`, `cashier = "Trần Văn Thu Ngân"`, code bắt đầu bằng "HD" | `Assert.AreEqual`<br>`Assert.IsTrue` |

---

---

## Chức năng 2: Thanh toán hóa đơn viện phí

### 1. Đặc tả


#### 2.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-THUNGAN-06 |
| --- | --- |
| Tên Use Case (Use Case Name) | Thanh toán hóa đơn viện phí |
| Người thực hiện & Ngày tạo | Dương Quốc Vượng — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Nhân viên Thu ngân |
| Điều kiện tiên quyết (Pre-conditions) | Hóa đơn viện phí đang ở trạng thái chưa thanh toán. |
| Điều kiện sau thành công (Post-conditions) | Hóa đơn chuyển trạng thái đã thanh toán. Hệ thống tự động gửi tín hiệu mở khóa để tên bệnh nhân xuất hiện trên màn hình chờ khám của bác sĩ. |
| Kích hoạt (Trigger) | Thu ngân nhấn nút "Xác nhận thanh toán" sau khi nhận tiền từ người bệnh. |


#### 2.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | invoice_id | Mã hóa đơn [Text Input / Hidden Data] | String | Có (Y) | - Mã hóa đơn phải tồn tại trong CSDL.<br><br>- Trạng thái hóa đơn phải là "Chờ thanh toán". | "Mã hóa đơn không tồn tại hoặc đã được thanh toán trước đó." |
| 2 | payment_method | Hình thức thanh toán [Radio Buttons] | String | Có (Y) | - Bắt buộc chọn 1 trong các giá trị: "Tiền mặt", "Quét mã QR" hoặc "Thẻ ngân hàng". | "Vui lòng chọn hình thức thanh toán." |
| 3 | amount_received | Số tiền khách đưa [Number Input] | Decimal | Có (nếu chọn Tiền mặt) | - Là số dương (>= 0).<br><br>- Phải lớn hơn hoặc bằng Tổng số tiền cần thanh toán trên hóa đơn.<br>- Phải lớn hơn hoặc bằng Tổng số tiền cần thanh toán trên hóa đơn. | "Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán." |
| 4 | cancel_reason | Lý do hủy [Text Area] | String | Không (chỉ bắt buộc khi Hủy) | - Không vượt quá 255 ký tự (nếu áp dụng luồng hủy thanh toán). | "Lý do hủy không được vượt quá 255 ký tự." |


#### 2.3. Dữ liệu đầu ra

Mã QR động (Dynamic QR): Nếu chọn quét mã QR, hệ thống tạo mã QR động chứa thông tin số tiền chính xác để người bệnh quét chuyển khoản.
Trạng thái Dữ liệu: Hệ thống cập nhật trạng thái hóa đơn thành "Đã thanh toán" và lưu thời gian thu tiền.
Đồng bộ hàng chờ: Chuyển trạng thái bệnh nhân sang danh sách "Đã nộp phí - Sẵn sàng khám" và tự động đồng bộ dữ liệu sang phòng khám của Bác sĩ.
Biên lai (Receipt): Hệ thống in biên lai thu tiền viện phí để giao cho người bệnh.

#### 2.4. Luồng sự kiện chính

- **Bước 1: Thu ngân chọn hình thức thanh toán: "Tiền mặt" hoặc "Quét mã QR".**
- **Bước 2: Nếu chọn quét mã QR, hệ thống tạo mã QR động chứa thông tin số tiền chính xác để người bệnh quét chuyển khoản.**
- **Bước 3: Sau khi xác nhận tiền đã nhận đủ, Thu ngân nhấn nút "Xác nhận thanh toán thành công".**
- **Bước 4: Hệ thống cập nhật trạng thái hóa đơn thành "Đã thanh toán" và lưu thời gian thu tiền.**
- **Bước 5: Hệ thống tự động đồng bộ dữ liệu sang phòng khám của Bác sĩ, chuyển trạng thái bệnh nhân sang danh sách "Đã nộp phí - Sẵn sàng khám".**
- **Bước 6: Hệ thống in biên lai thu tiền viện phí để giao cho người bệnh.**

#### 2.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh

Luồng rẽ nhánh [A1.1] Hủy giao dịch thanh toán: Trong trường hợp bệnh nhân đổi ý không muốn khám dịch vụ đó nữa. Thu ngân nhấn "Hủy thanh toán", hóa đơn được chuyển về trạng thái hủy.
- **Mã ngoại lệ [E1.1] Chưa chọn hình thức thanh toán: Thu ngân nhấn "Xác nhận thanh toán" nhưng chưa tick chọn "Tiền mặt" hay "Quét mã QR" -> Đổi viền khối UI thành màu đỏ, hiển thị lỗi inline: 'Vui lòng chọn hình thức thanh toán trước khi xác nhận'.**
- **Mã ngoại lệ [E1.2] Lỗi lưu dữ liệu/Giao dịch thất bại: Giao dịch thanh toán bị hủy hoặc lỗi lưu dữ liệu (do lỗi đường truyền hoặc hệ thống máy chủ gián đoạn) -> Hệ thống hiển thị thông báo Toast/Alert: 'Lỗi lưu dữ liệu. Giao dịch chưa được ghi nhận, vui lòng thử lại'.**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Thanh toán hóa đơn viện phí" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm đảm bảo tính chính xác của các giao dịch tài chính.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra tính hợp lệ của số tiền khách đưa và lý do hủy giao dịch.**

Trường amount_received (Số tiền khách đưa - giả sử tổng hóa đơn là X):
Miền hợp lệ:
Miền không hợp lệ: Số tiền < X, Số âm (< 0). Giá trị biên: X - 1 (Max không hợp lệ).
Trường cancel_reason (Lý do hủy - áp dụng khi chọn Hủy thanh toán):
Miền hợp lệ: Chuỗi văn bản từ 1 đến 255 ký tự. Giá trị biên: 1 ký tự (Min), 255 ký tự (Max).
Miền không hợp lệ: Vượt quá 255 ký tự. Giá trị biên: 256 ký tự (Max+).
Trường payment_method (Hình thức thanh toán):
Miền hợp lệ: Chọn 1 trong 3 ("Tiền mặt", "Quét mã QR", "Thẻ ngân hàng").
Miền không hợp lệ: Không chọn hình thức nào (Bỏ trống).

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Hóa đơn hợp lệ và đang ở trạng thái "Chờ thanh toán"?
C2: Thu ngân thực hiện thao tác "Xác nhận thanh toán" (T) hay "Hủy thanh toán" (F)?
C3: (Nếu Xác nhận) Thu ngân đã tick chọn payment_method hợp lệ chưa?
C4: (Nếu thanh toán Tiền mặt) Số tiền khách đưa amount_received ≥ Tổng tiền hóa đơn?
Các hành động (A):
A1: Hệ thống báo lỗi "Mã hóa đơn không tồn tại hoặc đã được thanh toán trước đó", chặn thao tác.
A2: Chuyển trạng thái hóa đơn về "Đã hủy", lưu trữ cancel_reason.
A3: Đổi viền khối UI thành màu đỏ, báo lỗi "Vui lòng chọn hình thức thanh toán".
A4: Báo lỗi "Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán".
A5: Cập nhật trạng thái "Đã thanh toán", lưu thời gian, đồng bộ hàng chờ bác sĩ và in biên lai.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Hóa đơn hợp lệ / "Chờ thanh toán"? | F | T | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | C2: Thao tác là "Xác nhận thanh toán"? | - | F | T | T | T | T |
|  | C3: Đã chọn hình thức thanh toán? | - | - | F | T | T | T |
|  |  | - | - | - | F | T | Không áp dụng (QR/Thẻ) |
| Hành động (A) | A1: Báo lỗi mã hóa đơn không hợp lệ/đã TT | X |  |  |  |  |  |
|  | A2: Cập nhật "Đã hủy", lưu lý do |  | X |  |  |  |  |
|  | A3: Báo lỗi chưa chọn hình thức thanh toán |  |  | X |  |  |  |
|  | A4: Báo lỗi thiếu tiền (nếu chọn Tiền mặt) |  |  |  | X |  |  |
|  | A5: Cập nhật "Đã thanh toán", in biên lai |  |  |  |  | X | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến)

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên các phân tích trên, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F6_01 | Bảng quyết định (Q1) | Gọi mã hóa đơn đã được thanh toán từ trước, Thu ngân nhấn "Xác nhận". | Hệ thống báo lỗi: "Mã hóa đơn không tồn tại hoặc đã được thanh toán trước đó". Chặn giao dịch. |
| TC_F6_02 | Giá trị biên / BQ (Q2) | Hóa đơn "Chờ thanh toán", Thu ngân nhấn "Hủy", nhập cancel_reason đúng 255 ký tự (Max). | Giao dịch bị hủy thành công, trạng thái hóa đơn đổi thành "Đã hủy", lưu lý do hủy đầy đủ. |
| TC_F6_03 | Giá trị biên | Hóa đơn "Chờ thanh toán", Thu ngân nhấn "Hủy", nhập cancel_reason 256 ký tự (Max+). | Báo lỗi inline: "Lý do hủy không được vượt quá 255 ký tự". Không thể hủy hóa đơn. |
| TC_F6_04 | Bảng quyết định (Q3) | Hóa đơn "Chờ thanh toán", Thu ngân không tick chọn payment_method và nhấn "Xác nhận". | Viền đỏ khối UI, báo lỗi: "Vui lòng chọn hình thức thanh toán". |
| TC_F6_05 | Giá trị biên / BQ (Q4) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount_received = 499,999 VNĐ. | Báo lỗi: "Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán". |
| TC_F6_06 | Phân vùng TĐ | Chọn "Tiền mặt", nhập amount_received = -50,000 VNĐ (Số âm). | Hệ thống chặn nhập hoặc báo lỗi số tiền không hợp lệ. |
| TC_F6_07 | Giá trị biên / BQ (Q5) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount_received = 500,000 VNĐ (Min hợp lệ), nhấn Xác nhận. | Thanh toán thành công. Trạng thái -> "Đã thanh toán", in biên lai, đồng bộ Bác sĩ. |
| TC_F6_08 | Giá trị biên / BQ (Q5) | Chọn "Tiền mặt", tổng tiền hóa đơn là 500,000 VNĐ. Nhập amount_received = 1,000,000 VNĐ (> Tổng tiền), nhấn Xác nhận. | Thanh toán thành công. Trạng thái -> "Đã thanh toán", in biên lai. (Giao diện có thể hiện số tiền thối lại). |
| TC_F6_09 | Bảng quyết định (Q6) | Chọn "Quét mã QR", hệ thống sinh mã QR động. Nhấn "Xác nhận thanh toán thành công". | Thanh toán thành công. Trạng thái -> "Đã thanh toán", in biên lai, đồng bộ Bác sĩ. |



### 3. Kiểm thử hộp trắng


#### 2.1. ĐÁNH SỐ DÒNG MÃ NGUỒN


```javascript
function executeProcessPayment(idOrCode, paymentDetails) {

1.  const { payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân" } = paymentDetails || {};

2.  if (!payment_method || !VALID_METHODS.includes(payment_method))

3.      throw new Error("Phương thức thanh toán không hợp lệ (hỗ trợ: TIEN_MAT, VIETQR, THE, CHUYEN_KHOAN)");

4.  const invoice = invoiceRepository.findByIdOrCode(idOrCode);

5.  if (!invoice)

6.      throw Object.assign(new Error("Không tìm thấy hóa đơn"), { statusCode: 404 });

7.  if (invoice.status === "PAID")

8.      throw Object.assign(new Error("Hóa đơn này đã được thanh toán trước đó"), { statusCode: 400 });

9.  InvoiceStateMachine.transition(invoice, "PAID");
    invoice.payment_method = payment_method;
    invoice.paid_at = dayjs().format("DD/MM/YYYY HH:mm");
    invoice.cashier = cashier;

10. if (invoice.item_type === "CAN_LAM_SANG" && invoice.reference_id)

11.     const labOrder = labOrderRepository.findOrderByIdOrCode(invoice.reference_id);

12.     if (labOrder)

13.         labOrder.payment_status = "PAID";

14. const patient = patientRepository.findByIdOrCode(invoice.patient_code);

15. if (patient && patient.status === "Chờ thanh toán")

16.     patient.status = "Đã khám";
        eventBus.emitEvent("PATIENT_STATUS_CHANGED", { patient_code: patient.patient_code, status: "Đã khám", message: `Bệnh nhân [${patient.name}] đã hoàn tất thanh toán viện phí.` });

17. eventBus.emitEvent("INVOICE_PAID", { invoice, patient_code: invoice.patient_code, message: `Hóa đơn [${invoice.invoice_code}] đã được thanh toán thành công qua [${payment_method}] bởi ${cashier}` });

18. return invoice;

}
```


#### 2.2.KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 2.2.1 Đồ thị dòng điều khiển CFG cho Độ đo C1 và C2

Trong đồ thị C1/C2, mỗi cấu trúc rẽ nhánh if được xem như một điểm quyết định đơn nhất (xét giá trị chân lý toàn cục của biểu thức True hoặc False):
Đỉnh 1: Khởi tạo và bóc tách paymentDetails.
Đỉnh 2: Điểm quyết định kiểm tra phương thức thanh toán: (!payment_method || !VALID_METHODS.includes(payment_method)).
Đỉnh 3: Quăng ngoại lệ phương thức thanh toán không hợp lệ  Kết thúc sớm lỗi 1.
Đỉnh 4: Khối gọi hàm tìm hóa đơn: const invoice = invoiceRepository.findByIdOrCode(idOrCode).
Đỉnh 5: Điểm quyết định kiểm tra tồn tại hóa đơn: (!invoice).
Đỉnh 6: Quăng ngoại lệ không tìm thấy hóa đơn (HTTP 404)  Kết thúc sớm lỗi 2.
Đỉnh 7: Điểm quyết định kiểm tra hóa đơn đã thanh toán: (invoice.status === "PAID").
Đỉnh 8: Quăng ngoại lệ hóa đơn đã thanh toán trước đó (HTTP 400)  Kết thúc sớm lỗi 3.
Đỉnh 9: Khối chuyển trạng thái hóa đơn sang PAID và cập nhật thông tin (paid_at, payment_method, cashier).
Đỉnh 10: Điểm quyết định kiểm tra dịch vụ cận lâm sàng: (invoice.item_type === "CAN_LAM_SANG" && invoice.reference_id).
Đỉnh 11: Khối tìm phiếu chỉ định CLS: const labOrder = labOrderRepository.findOrderByIdOrCode(invoice.reference_id).
Đỉnh 12: Điểm quyết định kiểm tra tìm thấy phiếu chỉ định CLS: (labOrder).
Đỉnh 13: Khối cập nhật labOrder.payment_status = "PAID".
Đỉnh 14: Khối tìm kiếm hồ sơ bệnh nhân: const patient = patientRepository.findByIdOrCode(invoice.patient_code).
Đỉnh 15: Điểm quyết định kiểm tra trạng thái bệnh nhân: (patient && patient.status === "Chờ thanh toán").
Đỉnh 16: Khối cập nhật trạng thái bệnh nhân thành "Đã khám" và phát sự kiện PATIENT_STATUS_CHANGED.
Đỉnh 17-18: Khối phát sự kiện INVOICE_PAID và return invoice  Kết thúc thành công.

#### 2.2.2 Phân tích độ phức tạp Cyclomatic  cho C1/C2

Trên đồ thị C1/C2: - Số đỉnh:  (trong đó 17_18 gom cụm câu lệnh kết thúc). - Số cạnh: . - Số điểm quyết định đơn:  (tại các đỉnh 2, 5, 7, 10, 12, 15). - Công thức McCabe:
(Hoặc )
Cần tối thiểu 7 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 2.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến câu lệnh 18 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1 cần kích hoạt:
- 3 nhánh lỗi throw: câu lệnh 3, 6, 8.
- Nhánh xử lý thành công không có CLS và không đổi trạng thái bệnh nhân. - Nhánh xử lý thành công có CLS (câu lệnh 11, 13) và có đổi trạng thái bệnh nhân (câu lệnh 16).
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_PAY_C1_01 | ​ | idOrCode: 1, paymentDetails: { payment_method: "BITCOIN" } | Lỗi: “Phương thức thanh toán không hợp lệ…” | 1, 2, 3 |
| 2 | TC_PAY_C1_02 | ​ | idOrCode: 9999 (hóa đơn không tồn tại), paymentDetails: { payment_method: "TIEN_MAT" } | Lỗi HTTP 404: “Không tìm thấy hóa đơn” | 4, 5, 6 |
| 3 | TC_PAY_C1_03 | ​ | idOrCode: "HD000001" (hóa đơn đã có status = “PAID”), paymentDetails: { payment_method: "TIEN_MAT" } | Lỗi HTTP 400: “Hóa đơn này đã được thanh toán trước đó” | 7, 8 |
| 4 | TC_PAY_C1_04 | ​ | idOrCode: "HD000002" (status = “UNPAID”, item_type = “TIEN_KHAM”, BN trạng thái “Đang khám”), paymentDetails: { payment_method: "TIEN_MAT" } | Thành công: invoice.status = "PAID", không gọi CLS, không đổi trạng thái BN | 9, 10, 14, 15, 17, 18 |
| 5 | TC_PAY_C1_05 | ​ | idOrCode: "HD000003" (status = “UNPAID”, item_type = “CAN_LAM_SANG”, reference_id = “CLS001” tồn tại, BN trạng thái “Chờ thanh toán”), paymentDetails: { payment_method: "VIETQR" } | Thành công: invoice.status = "PAID", labOrder.payment_status = "PAID", patient.status = "Đã khám" | 11, 12, 13, 16 |

Tỷ lệ bao phủ C1:  câu lệnh = 100%.

#### 2.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 7, 10, 12, 15 đều phải được thực thi ở cả hai nhánh ĐÚNG (True) và SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !payment_method \\|\\| !VALID_METHODS.includes(payment_method) | TC_PAY_C2_01 (Đi sang Đỉnh 3) | TC_PAY_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 5 | !invoice | TC_PAY_C2_03 (Đi sang Đỉnh 6) | TC_PAY_C2_04 (Đi tiếp Đỉnh 7) |
| Đỉnh 7 | invoice.status === "PAID" | TC_PAY_C2_05 (Đi sang Đỉnh 8) | TC_PAY_C2_06 (Đi tiếp Đỉnh 9) |
| Đỉnh 10 | invoice.item_type === "CAN_LAM_SANG" && invoice.reference_id | TC_PAY_C2_07 (Đi sang Đỉnh 11) | TC_PAY_C2_08 (Bỏ qua sang Đỉnh 14) |
| Đỉnh 12 | labOrder (tồn tại phiếu chỉ định) | TC_PAY_C2_09 (Đi sang Đỉnh 13) | TC_PAY_C2_10 (Bỏ qua sang Đỉnh 14) |
| Đỉnh 15 | patient && patient.status === "Chờ thanh toán" | TC_PAY_C2_11 (Đi sang Đỉnh 16) | TC_PAY_C2_12 (Bỏ qua sang Đỉnh 17) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_PAY_C2_01 | Đỉnh 2 (True) | idOrCode: 1, paymentDetails: { payment_method: "PAYPAL" } | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| TC_PAY_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 7 (False), Đỉnh 10 (False), Đỉnh 15 (False) | idOrCode: "HD01", { payment_method: "TIEN_MAT" } (Hóa đơn khám, BN có status = "Đang khám") | Thanh toán thành công, hóa đơn chuyển PAID |
| TC_PAY_C2_03 | Đỉnh 5 (True) | idOrCode: "HD_KHONG_TON_TAI", { payment_method: "TIEN_MAT" } | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| TC_PAY_C2_05 | Đỉnh 7 (True) | idOrCode: "HD_DA_THANH_TOAN" (status = "PAID"), { payment_method: "TIEN_MAT" } | Quăng lỗi HTTP 400: Hóa đơn đã được thanh toán trước đó |
| TC_PAY_C2_07 | Đỉnh 10 (True), Đỉnh 12 (True) | idOrCode: "HD_CLS_01" (item_type = "CAN_LAM_SANG", reference_id = "CLS01" có tồn tại trong DB), { payment_method: "VIETQR" } | Thanh toán thành công, labOrder.payment_status = "PAID" |
| TC_PAY_C2_10 | Đỉnh 10 (True), Đỉnh 12 (False) | idOrCode: "HD_CLS_02" (item_type = "CAN_LAM_SANG", reference_id = "CLS_AO" không tồn tại trong DB) | Thanh toán thành công hóa đơn, bỏ qua cập nhật phiếu CLS |
| TC_PAY_C2_11 | Đỉnh 15 (True) | idOrCode: "HD_BN_CHO" (Hóa đơn hợp lệ của BN có status = "Chờ thanh toán"), { payment_method: "THE" } | Thanh toán thành công, patient.status = "Đã khám", phát PATIENT_STATUS_CHANGED |

Tỷ lệ bao phủ C2:  nhánh quyết định = 100%.

#### 2.2.5 Đồ thị dòng điều khiển CFG riêng cho Độ đo C3

Tại độ đo C3, các biểu thức điều kiện phức hợp được tách nhỏ thành từng điều kiện con độc lập để kiểm soát ngắn mạch (short-circuit evaluation).
Điểm quyết định 2 gồm 4 điều kiện con:
(2a): !patient_code
(2b): !patient_name
(2c): total_amount === undefined
(2d): total_amount === null
Điểm quyết định 5 gồm 2 điều kiện con:
(5a): isNaN(total)
(5b): total <= 0
Điểm quyết định 17 gồm 2 điều kiện con:
(17a): Boolean(payment_method)
(17b): payment_method !== "CHUA_THANH_TOAN"

#### 2.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử đạt 100% C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | ​ | payment_method = "" hoặc null | True / False | TC_PAY_C3_01 (True) / TC_PAY_C3_02 (False) |
| 2 | ​ | payment_method = "MOMO" | True / False | TC_PAY_C3_02 (True) / TC_PAY_C3_03 (False) |
| 5 | ​ | invoice không tồn tại | True / False | TC_PAY_C3_04 (True) / TC_PAY_C3_05 (False) |
| 7 | ​ | status = "PAID" | True / False | TC_PAY_C3_06 (True) / TC_PAY_C3_07 (False) |
| 10 | ​ | item_type = "TIEN_THUOC" vs "CAN_LAM_SANG" | False / True | TC_PAY_C3_07 (False) / TC_PAY_C3_08 (True) |
| 10 | ​ | reference_id = null vs "CLS01" | False / True | TC_PAY_C3_08 (False) / TC_PAY_C3_09 (True) |
| 12 | ​ | Phiếu CLS có trong DB vs không có | False / True | TC_PAY_C3_10 (False) / TC_PAY_C3_09 (True) |
| 15 | ​ | Bệnh nhân không tồn tại vs có tồn tại | False / True | TC_PAY_C3_11 (False) / TC_PAY_C3_12 (True) |
| 15 | ​ | status = "Đang khám" vs "Chờ thanh toán" | False / True | TC_PAY_C3_12 (False) / TC_PAY_C3_13 (True) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock DB | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| TC_PAY_C3_01 | ​ | id: 1, { payment_method: null } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| TC_PAY_C3_02 | ​ | id: 1, { payment_method: "TIEN_AO" } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| TC_PAY_C3_04 | ​ | id: "HD_999", { payment_method: "TIEN_MAT" } | Không có hóa đơn | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| TC_PAY_C3_06 | ​ | id: "HD_01", { payment_method: "TIEN_MAT" } | invoice.status = "PAID" | Quăng lỗi HTTP 400: Hóa đơn đã thanh toán trước đó |
| TC_PAY_C3_07 | ​ | id: "HD_02", { payment_method: "TIEN_MAT" } | Hóa đơn item_type = "TIEN_KHAM" | Không gọi CLS, chuyển sang kiểm tra BN |
| TC_PAY_C3_08 | ​ | id: "HD_03", { payment_method: "TIEN_MAT" } | Hóa đơn item_type = "CAN_LAM_SANG", reference_id = null | Bỏ qua tìm CLS |
| TC_PAY_C3_09 | ​ | id: "HD_04", { payment_method: "VIETQR" } | Hóa đơn CLS có reference_id = "CLS01", có labOrder | labOrder.payment_status = "PAID" |
| TC_PAY_C3_10 | ​ | id: "HD_05", { payment_method: "VIETQR" } | Hóa đơn CLS có reference_id = "CLS_AO", không thấy labOrder | Bỏ qua cập nhật CLS |
| TC_PAY_C3_11 | ​ | id: "HD_06", { payment_method: "THE" } | patientRepository trả về null | Không quăng lỗi, bỏ qua đổi trạng thái BN |
| TC_PAY_C3_12 | ​ | id: "HD_07", { payment_method: "CHUYEN_KHOAN" } | BN có trạng thái "Đang khám" | Giữ nguyên trạng thái BN, không phát PATIENT_STATUS_CHANGED |
| TC_PAY_C3_13 | ​ | id: "HD_08", { payment_method: "CHUYEN_KHOAN" } | BN có trạng thái "Chờ thanh toán" | patient.status = "Đã khám", phát PATIENT_STATUS_CHANGED |


#### 2.3. KIỂM THỬ DÒNG DỮ LIỆU


#### 2.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu kiểm thử phần mềm chuẩn: Đồ thị dòng dữ liệu của hàm processPayment là một đồ thị có hướng : - Tập đỉnh (): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. - Tập cạnh (): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ nhánh (p-use) của các biến.

#### 2.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh | ​ | ​ |
| --- | --- | --- |
| 1 | {payment_method, cashier} | {paymentDetails} |
| 2 | {} | {} |
| 3 | {} | {} |
| 4 | {invoice} | {idOrCode} |
| 5 | {} | {} |
| 6 | {} | {} |
| 7 | {} | {} |
| 8 | {} | {} |
| 9 | {invoice.status, invoice.payment_method, invoice.paid_at, invoice.cashier} | {invoice, payment_method, cashier} |
| 10 | {} | {} |
| 11 | {labOrder} | {invoice.reference_id} |
| 12 | {} | {} |
| 13 | {labOrder.payment_status} | {} |
| 14 | {patient} | {invoice.patient_code} |
| 15 | {} | {} |
| 16 | {patient.status} | {patient} |
| 17 | {} | {invoice, payment_method, cashier} |
| 18 | {} | {invoice} |


#### 2.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| ​ | Điều kiện tại cạnh | ​ |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!payment_method \|\| !VALID_METHODS.includes(payment_method)) | {payment_method} |
| (2, 4) | ~(!payment_method \|\| !VALID_METHODS.includes(payment_method)) | {payment_method} |
| (4, 5) | True | {} |
| (5, 6) | (!invoice) | {invoice} |
| (5, 7) | ~( !invoice) | {invoice} |
| (7, 8) | (invoice.status === ‘PAID’) | {invoice.status} |
| (7, 9) | ~(invoice.status === ‘PAID’) | {invoice.status} |
| (9, 10) | True | {} |
| (10, 11) | (invoice.item_type === ‘CAN_LAM_SANG’ && invoice.reference_id) | {invoice.item_type, invoice.reference_id} |
| (10, 14) | ~(invoice.item_type === ‘CAN_LAM_SANG’ && invoice.reference_id) | {invoice.item_type, invoice.reference_id} |
| (11, 12) | True | {} |
| (12, 13) | (labOrder) | {labOrder} |
| (12, 14) | ~(labOrder) | {labOrder} |
| (13, 14) | True | {} |
| (14, 15) | True | {} |
| (15, 16) | (patient && patient.status === ‘Chờ thanh toán’) | {patient, patient.status} |
| (15, 17) | ~(patient && patient.status === ‘Chờ thanh toán’) | {patient, patient.status} |
| (16, 17) | True | {} |
| (17, 18) | True | {} |


#### 2.3.4 Đồ thị dòng dữ liệu

Dưới đây là Đồ thị dòng dữ liệu của hàm createInvoice:
Các đỉnh xử lý/tính toán/khởi tạo chứa câu lệnh tương ứng.
Các đỉnh rẽ nhánh kiểm tra điều kiện được gán nhãn NULL.
Các cạnh chuyển tiếp mang nhãn biểu thức điều kiện, phủ định ~(...) hoặc true.

#### 2.3.5 Bảng tổng hợp chi tiết Def-Use theo biến (All Variables Mapping)

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| idOrCode | Tham số hàm () | (findByIdOrCode(idOrCode)) | - |
| paymentDetails | Tham số hàm () | (Bóc tách destructuring) | - |
| payment_method | ​ | (invoice.payment_method = payment_method),  (emitEvent message) | , |
| cashier | ​ | (invoice.cashier = cashier),  (emitEvent message) | - |
| invoice | ​ | (transition, gán thuộc tính),  (reference_id),  (patient_code),  (emitEvent),  (return) | , , , , , |
| labOrder | ​ | (labOrder.payment_status = "PAID") | , |
| patient | ​ | (patient.status = "Đã khám", emitEvent) | , |


#### 2.3.6 Phân tích bất thường dòng dữ liệu (Anomalies Loại 1 dd, Loại 2 ur, Loại 3 du)

Bất thường Loại 1 (dd - Định nghĩa lại biến trước khi dùng):
Đánh giá: KHÔNG CÓ. Các biến đối tượng và tham số idOrCode, paymentDetails, invoice, labOrder, patient đều được khởi tạo một lần dạng tham chiếu và chỉ thay đổi trạng thái các thuộc tính nội tại, không bị gán đè biến (re-assignment).
Bất thường Loại 2 (ur - Sử dụng biến khi chưa định nghĩa):
Phòng vệ mã nguồn:
paymentDetails có giá trị fallback paymentDetails || {} phòng ngừa gọi processPayment(id) mà không truyền tham số thứ hai.
invoice.status chỉ được truy cập sau khi đã vượt qua rào chắn kiểm tra !invoice tại .
labOrder.payment_status chỉ được gán khi đã vượt qua rào chắn labOrder tại .
patient.status chỉ được đọc khi đã kiểm tra tồn tại patient qua biểu thức ngắn mạch patient && patient.status... tại .
Bất thường Loại 3 (du - Định nghĩa biến nhưng không bao giờ dùng):
Đánh giá: KHÔNG CÓ. Tất cả các biến được trích xuất hoặc khởi tạo (payment_method, cashier, invoice, labOrder, patient) đều được sử dụng trong việc cập nhật CSDL, kích hoạt máy trạng thái hoặc phát sự kiện EventBus.

#### 2.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi invoice

Chuỗi biến đổi trạng thái của invoice tuân thủ nghiêm ngặt chu trình , hoàn toàn không gặp trạng thái bất thường  (Anomaly).

#### 2.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| paymentDetails | Tham số () | ​ | ​ | Trích xuất payment_method và cashier. |
| idOrCode | Tham số () | ​ | ​ | Truy vấn hóa đơn từ DB bằng mã hoặc ID. |
| payment_method | ​ | ​ | ​ | Cập nhật invoice.payment_method. |
| payment_method | ​ | ​ | ​ | Ghép chuỗi thông điệp trong INVOICE_PAID. |
| cashier | ​ | ​ | ​ | Cập nhật invoice.cashier. |
| cashier | ​ | ​ | ​ | Ghép chuỗi thông điệp trong INVOICE_PAID. |
| invoice | ​ | ​ | ​ | Chuyển đổi trạng thái hóa đơn qua State Machine. |
| invoice | ​ | ​ | ​ | Lấy invoice.reference_id để tìm CLS. |
| invoice | ​ | ​ | ​ | Lấy invoice.patient_code để tìm người bệnh. |
| invoice | ​ | ​ | ​ | Đính kèm invoice vào dữ liệu sự kiện EventBus. |
| invoice | ​ | ​ | ​ | Trả về invoice cho caller. |
| labOrder | ​ | ​ | ​ | Cập nhật labOrder.payment_status = "PAID". |
| patient | ​ | ​ | ​ | Cập nhật patient.status = "Đã khám" và phát event. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock Data | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| TC_PAY_CUSE_01 | payment_method, cashier, invoice (), patient () | id: 101, { payment_method: "TIEN_MAT", cashier: "Nguyễn Thu Ngân" } | Hóa đơn khám bệnh, BN có status = "Chờ thanh toán" | Hóa đơn chuyển PAID, thu ngân được cập nhật, BN chuyển Đã khám, trả về invoice. |
| TC_PAY_CUSE_02 | invoice (), labOrder () | id: 102, { payment_method: "VIETQR" } | Hóa đơn CLS có reference_id = "CLS_102", BN có status = "Đã khám" | labOrder.payment_status = "PAID", hóa đơn chuyển PAID. |
| TC_PAY_CUSE_03 | Fallback của payment_method & cashier () | id: 103 (không truyền paymentDetails) | Hóa đơn hợp lệ | Dùng giá trị mặc định: payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân". |


#### 2.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| payment_method | ​ | ​ | ​ | Phương thức rỗng hoặc không nằm trong danh mục hỗ trợ. |
| payment_method | ​ | ​ | ​ | Phương thức hợp lệ (TIEN_MAT, VIETQR,…). |
| invoice | ​ | ​ | ​ | Không tìm thấy hóa đơn (invoice == null). |
| invoice | ​ | ​ | ​ | Tìm thấy hóa đơn. |
| invoice | ​ | ​ | ​ | invoice.status === "PAID" (đã thanh toán). |
| invoice | ​ | ​ | ​ | invoice.status !== "PAID" (chưa thanh toán). |
| invoice | ​ | ​ | ​ | Hóa đơn là CLS và có reference_id. |
| invoice | ​ | ​ | ​ | Hóa đơn không phải CLS hoặc thiếu reference_id. |
| labOrder | ​ | ​ | ​ | Tìm thấy phiếu chỉ định CLS trong DB. |
| labOrder | ​ | ​ | ​ | Không tìm thấy phiếu chỉ định CLS trong DB. |
| patient | ​ | ​ | ​ | Bệnh nhân tồn tại và có status === "Chờ thanh toán". |
| patient | ​ | ​ | ​ | Bệnh nhân không tồn tại hoặc status !== "Chờ thanh toán". |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (idOrCode, paymentDetails) | Trạng thái Mock Data | Kết quả mong đợi |
| --- | --- | --- | --- | --- |
| TC_PAY_PUSE_01 | payment_method trên | id: 1, { payment_method: "VNPAY" } | Bất kỳ | Quăng lỗi: Phương thức thanh toán không hợp lệ |
| TC_PAY_PUSE_02 | payment_method trên , invoice trên | id: "HD_KHONG_CO", { payment_method: "TIEN_MAT" } | Không có hóa đơn | Quăng lỗi HTTP 404: Không tìm thấy hóa đơn |
| TC_PAY_PUSE_03 | invoice trên  và | id: "HD_DA_TRA", { payment_method: "TIEN_MAT" } | invoice.status = "PAID" | Quăng lỗi HTTP 400: Hóa đơn này đã được thanh toán trước đó |
| TC_PAY_PUSE_04 | invoice trên  và , patient trên | id: "HD_TIEN_KHAM", { payment_method: "TIEN_MAT" } | Hóa đơn khám, BN có status = "Đã khám" | Bỏ qua CLS, bỏ qua đổi trạng thái BN, hoàn tất thành công |
| TC_PAY_PUSE_05 | invoice trên , labOrder trên | id: "HD_CLS_HOP_LE", { payment_method: "VIETQR" } | Hóa đơn CLS có reference_id = "CLS01" có trong DB | labOrder.payment_status = "PAID" |
| TC_PAY_PUSE_06 | labOrder trên | id: "HD_CLS_AO", { payment_method: "VIETQR" } | Hóa đơn CLS có reference_id = "CLS_AO" không có trong DB | Bỏ qua gán labOrder, hoàn tất thành công |
| TC_PAY_PUSE_07 | patient trên | id: "HD_CHO_TT", { payment_method: "THE" } | BN có status = "Chờ thanh toán" | patient.status = "Đã khám", phát PATIENT_STATUS_CHANGED |



### 4. Kiểm thử đơn vị


> **4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ**



#### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Phương thức `invoiceService.processPayment(idOrCode, paymentDetails)`, `PaymentMethodValidatorStrategy.validate`, và `InvoiceStateMachine.transition`.
- **Tập tin kiểm thử:** [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js#L170-L290)
- **Quy tắc nghiệp vụ kiểm thử:**
  1. Phương thức thanh toán phải thuộc danh sách hợp lệ: `["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"]`. Nếu không $\rightarrow$ Ném lỗi ngoại lệ.
  2. Hóa đơn không tồn tại $\rightarrow$ Báo lỗi 404.
  3. Hóa đơn đã ở trạng thái `PAID` $\rightarrow$ Báo lỗi 400 (không thanh toán lặp).
  4. Chuyển trạng thái an toàn: `UNPAID` $\rightarrow$ `PAID`, gán thời gian `paid_at`, thu ngân `cashier`.
  5. Đồng bộ hóa trạng thái phiếu cận lâm sàng (`labOrder.payment_status = "PAID"`).
  6. Đồng bộ hóa trạng thái bệnh nhân: Bệnh nhân `Chờ thanh toán` $\rightarrow$ `Đã khám`.


#### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Test Case | Tên hàm kiểm thử (Chuẩn slide: `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Phương thức `Assert` NUnit sử dụng |
| :---: | :---: | :--- | :--- | :--- | :--- |
| 13 | **UT_PAY_01** | `Test_ProcessPayment_PhuongThucThanhToanRong_NemNgoaiLe` | `id = 1`, `payment_method = ""` | Ngoại lệ: *"Phương thức thanh toán không hợp lệ..."* | `Assert.Throws` |
| 14 | **UT_PAY_02** | `Test_ProcessPayment_PhuongThucKhongHoTro_NemNgoaiLe` | `id = 1`, `payment_method = "TIEN_AO_BITCOIN"` | Ngoại lệ: *"Phương thức thanh toán không hợp lệ..."* | `Assert.Throws` |
| 15 | **UT_PAY_03** | `Test_ProcessPayment_HoaDonKhongTonTai_NemNgoaiLe404` | `id = 99999`, `payment_method = "TIEN_MAT"` | Ngoại lệ 404: *"Không tìm thấy hóa đơn"* | `Assert.Throws` |
| 16 | **UT_PAY_04** | `Test_ProcessPayment_HoaDonDaThanhToanTruocDo_NemNgoaiLe400` | Hóa đơn trạng thái `PAID`, gọi thanh toán tiếp | Ngoại lệ 400: *"Hóa đơn này đã được thanh toán trước đó"* | `Assert.Throws` |
| 17 | **UT_PAY_05** | `Test_ProcessPayment_ThanhToanTienMat_TrangThaiChuyenSangPAID_ThanhCong` | Hóa đơn `UNPAID`, thanh toán `"TIEN_MAT"`, thu ngân `"Lê Thị Thu Ngân"` | `status = "PAID"`, `payment_method = "TIEN_MAT"`, `paid_at` khác null | `Assert.AreEqual`<br>`Assert.IsNotNull` |
| 18 | **UT_PAY_06** | `Test_ProcessPayment_ThanhToanVietQR_PhatSuKienThanhToan` | Hóa đơn `"HD0001"`, thanh toán `"VIETQR"` | `status = "PAID"`, phát sự kiện `INVOICE_PAID` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 19 | **UT_PAY_07** | `Test_ProcessPayment_HoaDonCanLamSang_DongBoTrangThaiLabOrderSangPAID` | Hóa đơn CLS (`reference_id = "CLS000001"`), thanh toán | Phiếu chỉ định CLS chuyển `payment_status = "PAID"` | `Assert.AreEqual` |
| 20 | **UT_PAY_08** | `Test_ProcessPayment_BenhNhanDangChoThanhToan_DongBoSangDaKham` | Bệnh nhân `BN000001` đang `Chờ thanh toán`, hóa đơn hoàn tất | Bệnh nhân chuyển sang `Đã khám`, phát sự kiện `PATIENT_STATUS_CHANGED` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 21 | **UT_PAY_09** | `Test_InvoiceStateMachine_CanTransition_UNPAID_Sang_PAID_TraVeTrue` | `currentState = "UNPAID"`, `nextState = "PAID"` | Chuyển đổi hợp lệ (`isValid = true`) | `Assert.IsTrue` |
| 22 | **UT_PAY_10** | `Test_InvoiceStateMachine_CanTransition_PAID_Sang_CANCELLED_TraVeFalse` | `currentState = "PAID"`, `nextState = "CANCELLED"` | Chuyển đổi không hợp lệ (`isValid = false`), có lý do `reason` khác null | `Assert.IsFalse`<br>`Assert.IsNotNull` |
| 23 | **UT_PAY_11** | `Test_PaymentMethodValidatorStrategy_CacPhuongThucHopLe` | Lặp qua `["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"]` | Tất cả phương thức chuẩn đều trả về `true` | `Assert.IsTrue` |

---

---

## Chức năng 3: Quản lý danh mục thuốc và tồn kho

### 1. Đặc tả


#### 3.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-DUOC-09 |
| --- | --- |
| Tên Use Case (Use Case Name) | Quản lý danh mục thuốc và tồn kho |
| Người thực hiện & Ngày tạo | Dương Quốc Vượng — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Dược sĩ, Quản lý kho dược |
| Điều kiện tiên quyết (Pre-conditions) | Người dùng có quyền truy cập vào phân hệ Quản lý kho. |
| Điều kiện sau thành công (Post-conditions) | Thông tin danh mục thuốc và số lượng tồn kho được cập nhật chính xác. |
| Kích hoạt (Trigger) | Người dùng chọn chức năng "Quản lý kho dược". |


#### 3.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

Bảng này tập trung vào luồng "Nhập kho thuốc mới" hoặc điều chỉnh thông tin kho.
| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | drug_id | Mã/Tên thuốc [Dropdown / Autocomplete] | String | Có (Y) | - Thuốc phải thuộc danh mục thuốc hợp lệ trên hệ thống. | "Vui lòng chọn một loại thuốc hợp lệ." |
| 2 | added_quantity | Số lượng nhập thêm [Number Input] | Integer | Có (Y) | - Phải là số nguyên dương (> 0). | "Số lượng nhập thêm phải lớn hơn 0." |
| 3 | batch_number | Số lô [Text Box] | String | Có (Y) | - Không được để trống; tối đa 50 ký tự. | "Vui lòng nhập số lô của thuốc." |
| 4 | expiration_date | Hạn sử dụng [Date Picker] | Date | Có (Y) | - Phải lớn hơn hoặc bằng ngày hiện tại (Current Date). | "Hạn sử dụng không hợp lệ (phải từ ngày hiện tại trở đi)." |


#### 3.3. Dữ liệu đầu ra

Data Grid (Bảng danh mục thuốc): Hệ thống hiển thị danh sách các loại thuốc bao gồm các cột: Tên thuốc, Hoạt chất, Đơn vị tính, Giá bán, Số lượng tồn kho hiện tại, Hạn sử dụng.
Trạng thái lưu (Toast Message): Khi nhập thêm thành công, hệ thống hiển thị thông báo: "Cập nhật kho thuốc thành công".
Cảnh báo trực quan (Warning Badge): Biểu tượng cảnh báo màu vàng hiển thị cạnh dòng thuốc để Dược sĩ lưu ý đối với thuốc sắp hết hạn hoặc hết hàng.

#### 3.4. Luồng sự kiện chính

- **Bước 1: Dược sĩ truy cập vào giao diện "Quản lý kho thuốc".**
- **Bước 2: Hệ thống hiển thị danh sách các loại thuốc: Tên thuốc, Hoạt chất, Đơn vị tính, Giá bán, Số lượng tồn kho hiện tại, Hạn sử dụng.**
- **Bước 3: Dược sĩ có thể tìm kiếm thuốc hoặc bấm nút "Nhập kho thuốc mới".**
- **Bước 4: Dược sĩ nhập số lượng nhập thêm, số lô và hạn sử dụng.**
- **Bước 5: Dược sĩ nhấn nút "Lưu thông tin kho".**
- **Bước 6: Hệ thống cập nhật tăng số lượng tồn kho và thông báo: "Cập nhật kho thuốc thành công".**

#### 3.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh

- **Mã ngoại lệ [E1.1] Cảnh báo thuốc sắp hết hạn hoặc sắp hết hàng: Hệ thống phát hiện thuốc có hạn sử dụng dưới 30 ngày hoặc số lượng tồn dưới định mức tối thiểu. -> Hệ thống đánh dấu biểu tượng cảnh báo màu vàng cạnh dòng thuốc để Dược sĩ lưu ý.**
- **Mã ngoại lệ [E1.2] Lỗi hệ thống khi lưu trữ: Xảy ra lỗi hệ thống khi lưu trữ thông tin kho (do gián đoạn kết nối máy chủ hoặc lỗi database) -> Hệ thống không cộng dồn tồn kho, hiển thị thông báo lỗi Toast: "Lỗi hệ thống khi lưu trữ thông tin kho, vui lòng thử lại sau".**
- **Mã ngoại lệ [E1.3] Nhập thiếu thông tin bắt buộc: Tại bước 4, người dùng bỏ trống hoặc nhập sai định dạng các trường added_quantity, batch_number, expiration_date -> Hệ thống tô viền đỏ ô nhập liệu, hiển thị thông báo lỗi inline tương ứng (tham khảo bảng 2.9.2) và vô hiệu hóa nút "Lưu thông tin kho".**


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Quản lý danh mục thuốc và tồn kho" sử dụng kết hợp các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm đảm bảo tính chính xác của dữ liệu nhập kho và logic cảnh báo nghiệp vụ.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra các trường số lượng, chuỗi văn bản và ngày tháng.**

Trường added_quantity (Số lượng nhập thêm):
Miền hợp lệ: Số nguyên dương (> 0). Giá trị biên: 1 (Min hợp lệ).
Miền không hợp lệ: Số <= 0. Giá trị biên: 0 (Max không hợp lệ).
Trường batch_number (Số lô):
Miền hợp lệ: Chuỗi từ 1 đến 50 ký tự. Giá trị biên: 1 ký tự (Min), 50 ký tự (Max).
Miền không hợp lệ: Bỏ trống (0 ký tự) hoặc vượt quá 50 ký tự. Giá trị biên: 51 ký tự (Max+).
Trường expiration_date (Hạn sử dụng):
Miền hợp lệ: >= Ngày hiện tại (Current Date). Giá trị biên: Đúng Ngày hiện tại (Min hợp lệ).
Miền không hợp lệ: < Ngày hiện tại. Giá trị biên: Ngày hiện tại - 1 ngày (Max không hợp lệ).
Điều kiện cảnh báo (E1.1): Khoảng thời gian từ Ngày hiện tại đến Hạn sử dụng < 30 ngày.

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Đã chọn drug_id hợp lệ từ danh mục?
C2: Các trường added_quantity, batch_number, expiration_date có nhập đủ và đúng định dạng?
C3: Hệ thống CSDL có kết nối và hoạt động bình thường lúc "Lưu thông tin"?
C4: expiration_date nhập vào có khoảng thời gian < 30 ngày so với hiện tại (hoặc số lượng tồn dưới định mức)?
Các hành động (A):
A1: Báo lỗi inline "Vui lòng chọn một loại thuốc hợp lệ".
A2: Tô viền đỏ các ô nhập liệu sai, báo lỗi inline tương ứng, vô hiệu hóa nút Lưu (Mã ngoại lệ E1.3).
A3: Hiển thị thông báo Toast "Lỗi hệ thống khi lưu trữ thông tin kho...", không cộng dồn tồn kho (Mã ngoại lệ E1.2).
A4: Cộng dồn tồn kho, báo Toast "Cập nhật kho thuốc thành công".
A5: Đánh dấu biểu tượng cảnh báo màu vàng cạnh dòng thuốc (Mã ngoại lệ E1.1).
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Chọn drug_id hợp lệ? | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- |
|  | C2: Dữ liệu nhập đúng định dạng? | - | F | T | T | T |
|  | C3: Hệ thống lưu trữ bình thường? | - | - | F | T | T |
|  | C4: Hạn sử dụng < 30 ngày? | - | - | - | T | F |
| Hành động (A) | A1: Báo lỗi chưa chọn thuốc | X |  |  |  |  |
|  | A2: Báo lỗi inline các trường, chặn Lưu |  | X |  |  |  |
|  | A3: Báo lỗi Toast hệ thống (E1.2) |  |  | X |  |  |
|  | A4: Lưu thành công, báo Toast cập nhật |  |  |  | X | X |
|  | A5: Hiển thị Badge vàng cảnh báo (E1.1) |  |  |  | X |  |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F9_01 | Bảng quyết định (Q1) | Không chọn drug_id (để trống dropdown), nhập đủ các trường khác. | Viền đỏ ô chọn thuốc, báo lỗi: "Vui lòng chọn một loại thuốc hợp lệ." |
| TC_F9_02 | Giá trị biên / BQ (Q2) | added_quantity = 0 (Min không hợp lệ). | Viền đỏ ô Số lượng, báo lỗi: "Số lượng nhập thêm phải lớn hơn 0." Nút Lưu vô hiệu hóa. |
| TC_F9_03 | Giá trị biên / BQ (Q2) | batch_number để trống (0 ký tự). | Viền đỏ ô Số lô, báo lỗi: "Vui lòng nhập số lô của thuốc." Nút Lưu vô hiệu hóa. |
| TC_F9_04 | Giá trị biên / BQ (Q2) | batch_number nhập chuỗi dài 51 ký tự (Max+). | Chặn nhập hoặc báo lỗi inline nếu vượt quá 50 ký tự. |
| TC_F9_05 | Giá trị biên / BQ (Q2) | expiration_date = Ngày hiện tại - 1 ngày (Hôm qua). | Viền đỏ ô Hạn SD, báo lỗi: "Hạn sử dụng không hợp lệ...". Nút Lưu vô hiệu hóa. |
| TC_F9_06 | Bảng quyết định (Q3) | Dữ liệu hợp lệ toàn bộ, nhưng ngắt kết nối DB khi bấm "Lưu thông tin kho". | Hiển thị Toast đỏ: "Lỗi hệ thống khi lưu trữ thông tin kho, vui lòng thử lại sau". Tồn kho không thay đổi. |
| TC_F9_07 | Giá trị biên / BQ (Q4) | expiration_date = Đúng Ngày hiện tại (Min hợp lệ). Bấm Lưu. | Cập nhật kho thành công. Hiển thị Badge màu vàng cạnh dòng thuốc (do hạn < 30 ngày). |
| TC_F9_08 | Giá trị biên / BQ (Q4) | expiration_date = Ngày hiện tại + 29 ngày. Bấm Lưu. | Cập nhật kho thành công. Hiển thị Badge màu vàng cảnh báo sắp hết hạn. |
| TC_F9_09 | Phân vùng TĐ / BQ (Q5) | added_quantity = 1, batch_number = chuỗi 50 ký tự, expiration_date = Ngày hiện tại + 6 tháng. Bấm Lưu. | Cập nhật kho thành công, số lượng tăng thêm 1. Hiển thị Toast "Cập nhật kho thuốc thành công". Dòng thuốc không có cảnh báo vàng. |



### 3. Kiểm thử hộp trắng


#### A. CHỨC NĂNG 1:NHẬP THUỐC MỚI VÀO KHO


#### 3.1. ĐÁNH SỐ DÒNG MÃ NGUỒN


```javascript
function executeCreateMedicine(payload) {

1.  const { medicine_name, active_ingredient, unit = "Viên", unit_price, stock_quantity = 0, category = "Khác", expiry_date } = payload || {};

2.  if (!medicine_name || !medicine_name.trim())

3.      throw Object.assign(new Error("Tên thuốc là bắt buộc"), { statusCode: 400 });

4.  const numPrice = Number(unit_price);

5.  if (unit_price === undefined || isNaN(numPrice) || numPrice <= 0)

6.      throw Object.assign(new Error("Đơn giá thuốc phải lớn hơn 0"), { statusCode: 400 });

7.  const numStock = Number(stock_quantity);

8.  if (isNaN(numStock) || numStock < 0)

9.      throw Object.assign(new Error("Số lượng tồn kho không được là số âm"), { statusCode: 400 });

10. const nextId = medicineRepository.getNextId();

11. const trimmedActive = active_ingredient ? active_ingredient.trim() : "";

12. const finalExpiry = expiry_date || "2027-12-31";

13. const newMed = { id: nextId, medicine_code: `MED${String(nextId).padStart(3, "0")}`, medicine_name: medicine_name.trim(), active_ingredient: trimmedActive, unit, unit_price: numPrice, stock_quantity: numStock, category, expiry_date: finalExpiry };

14. medicineRepository.create(newMed);

15. eventBus.emitEvent("MEDICINE_ADDED", { medicine: newMed, message: `Đã thêm thuốc mới vào kho: ${newMed.medicine_name} (${newMed.stock_quantity} ${newMed.unit})` });

16. return newMed;

}
```


#### 3.2 KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 3.2.1 Đồ thị dòng điều khiển CFG cho Độ đo C1 và C2

Trong đồ thị C1/C2, mỗi cấu trúc rẽ nhánh if được xem như một điểm quyết định đơn nhất (xét giá trị chân lý toàn cục của biểu thức True hoặc False):
Đỉnh 1: Khởi tạo và bóc tách payload.
Đỉnh 2: Điểm quyết định kiểm tra tên thuốc: (!medicine_name || !medicine_name.trim()).
Đỉnh 3: Quăng ngoại lệ tên thuốc không hợp lệ (HTTP 400)  Kết thúc sớm lỗi 1.
Đỉnh 4: Khối ép kiểu đơn giá: numPrice = Number(unit_price).
Đỉnh 5: Điểm quyết định kiểm tra đơn giá: (unit_price === undefined || isNaN(numPrice) || numPrice <= 0).
Đỉnh 6: Quăng ngoại lệ đơn giá thuốc  (HTTP 400)  Kết thúc sớm lỗi 2.
Đỉnh 7: Khối ép kiểu số lượng tồn kho: numStock = Number(stock_quantity).
Đỉnh 8: Điểm quyết định kiểm tra tồn kho: (isNaN(numStock) || numStock < 0).
Đỉnh 9: Quăng ngoại lệ số lượng tồn kho âm (HTTP 400)  Kết thúc sớm lỗi 3.
Đỉnh 10: Lấy ID tiếp theo: nextId = medicineRepository.getNextId().
Đỉnh 11: Điểm quyết định gán hoạt chất: (active_ingredient ? active_ingredient.trim() : "").
Đỉnh 11a: Nhánh True của 11: trimmedActive = active_ingredient.trim().
Đỉnh 11b: Nhánh False của 11: trimmedActive = "".
Đỉnh 12-16: Khối gán finalExpiry, đóng gói newMed, lưu kho, phát sự kiện và return  Kết thúc thành công.
Đỉnh Exit (Kết thúc): Điểm kết thúc của hàm (hội tụ cả các nhánh kết thúc sớm do ném ngoại lệ và nhánh kết thúc thành công).

#### 3.2.2 Phân tích độ phức tạp Cyclomatic  cho C1/C2

Trên đồ thị C1/C2: - Số đỉnh:  (Đỉnh 12_16 gom cụm câu lệnh 12-16 kết thúc). - Số cạnh: . - Số điểm quyết định đơn:  (tại các đỉnh 2, 5, 8, 11). - Công thức McCabe:
(Hoặc )
Cần tối thiểu 5 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 3.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến câu lệnh 16 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1 cần kích hoạt: - 3 nhánh lỗi throw: câu lệnh 3, 6, 9. - 2 nhánh gán hoạt chất: có hoạt chất (câu lệnh 11a) và không có hoạt chất (câu lệnh 11b) cùng toàn bộ khối xử lý thành công (câu lệnh 12-16).
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_MED_C1_01 | ​ | { medicine_name: "   ", unit_price: 5000 } | Lỗi HTTP 400: “Tên thuốc là bắt buộc” | 1, 2, 3 |
| 2 | TC_MED_C1_02 | ​ | { medicine_name: "Paracetamol 500mg", unit_price: 0 } | Lỗi HTTP 400: “Đơn giá thuốc phải lớn hơn 0” | 4, 5, 6 |
| 3 | TC_MED_C1_03 | ​ | { medicine_name: "Paracetamol 500mg", unit_price: 2000, stock_quantity: -5 } | Lỗi HTTP 400: “Số lượng tồn kho không được là số âm” | 7, 8, 9 |
| 4 | TC_MED_C1_04 | ​ | { medicine_name: "Amoxicillin 500mg", active_ingredient: "Amoxicillin", unit_price: 3500, stock_quantity: 200, unit: "Viên", category: "Kháng sinh" } | Tạo thành công: medicine_code = "MED001", active_ingredient = "Amoxicillin", phát event | 10, 11a, 12, 13, 14, 15, 16 |
| 5 | TC_MED_C1_05 | ​ | { medicine_name: "Nước muối sinh lý 0.9%", unit_price: 10000, stock_quantity: 50 } (không truyền active_ingredient) | Tạo thành công: active_ingredient = "", dùng unit = "Viên" mặc định | 11b |

Tỷ lệ bao phủ C1:  câu lệnh = 100%.

#### 3.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 8, 11 đều phải có ca kiểm thử thực thi ở cả hai nhánh ĐÚNG (True) và SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !medicine_name \\|\\| !medicine_name.trim() | TC_MED_C2_01 (Đi sang Đỉnh 3) | TC_MED_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 5 | unit_price === undefined \\|\\| isNaN(numPrice) \\|\\| numPrice <= 0 | TC_MED_C2_03 (Đi sang Đỉnh 6) | TC_MED_C2_04 (Đi tiếp Đỉnh 7) |
| Đỉnh 8 | isNaN(numStock) \\|\\| numStock < 0 | TC_MED_C2_05 (Đi sang Đỉnh 9) | TC_MED_C2_06 (Đi tiếp Đỉnh 10) |
| Đỉnh 11 | Boolean(active_ingredient) | TC_MED_C2_07 (Nhánh 11a: Có hoạt chất) | TC_MED_C2_08 (Nhánh 11b: Chuỗi rỗng) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_MED_C2_01 | Đỉnh 2 (True) | { medicine_name: "", unit_price: 10000 } | Quăng lỗi: Tên thuốc là bắt buộc |
| TC_MED_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 8 (False), Đỉnh 11 (True) | { medicine_name: "Panadol Extra", active_ingredient: "Paracetamol, Caffeine", unit_price: 2500, stock_quantity: 500 } | Tạo thành công thuốc, lưu kho và phát event |
| TC_MED_C2_03 | Đỉnh 5 (True) | { medicine_name: "Panadol", unit_price: -100 } | Quăng lỗi: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_C2_05 | Đỉnh 8 (True) | { medicine_name: "Panadol", unit_price: 2000, stock_quantity: -10 } | Quăng lỗi: Số lượng tồn kho không được là số âm |
| TC_MED_C2_08 | Đỉnh 11 (False) | { medicine_name: "Bông băng y tế", unit_price: 5000, stock_quantity: 100 } | Tạo thành công thuốc với active_ingredient = "" |

Tỷ lệ bao phủ C2:  nhánh quyết định = 100%.

#### 3.2.5 Đồ thị dòng điều khiển cho Độ đo C3

Tại độ đo C3, các biểu thức điều kiện phức hợp được tách nhỏ thành từng điều kiện con độc lập để kiểm soát hiện tượng ngắn mạch (short-circuit evaluation):
Điểm quyết định 2 gồm 2 điều kiện con:
(2a): !medicine_name
(2b): !medicine_name.trim()
Điểm quyết định 5 gồm 3 điều kiện con:
(5a): unit_price === undefined
(5b): isNaN(numPrice)
(5c): numPrice <= 0
Điểm quyết định 8 gồm 2 điều kiện con:
(8a): isNaN(numStock)
(8b): numStock < 0
Điểm quyết định 11 gồm 1 điều kiện con:
(11): Boolean(active_ingredient)

#### 3.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử đạt 100% C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | ​ | medicine_name = null hoặc undefined | True / False | TC_MED_C3_01 (True) / TC_MED_C3_02 (False) |
| 2 | ​ | medicine_name = "   " (chỉ có khoảng trắng) | True / False | TC_MED_C3_02 (True) / TC_MED_C3_03 (False) |
| 5 | ​ | Không truyền trường unit_price | True / False | TC_MED_C3_03 (True) / TC_MED_C3_04 (False) |
| 5 | ​ | unit_price = "HAI_NGHIN" | True / False | TC_MED_C3_04 (True) / TC_MED_C3_05 (False) |
| 5 | ​ | unit_price = 0 hoặc -5000 | True / False | TC_MED_C3_05 (True) / TC_MED_C3_06 (False) |
| 8 | ​ | stock_quantity = "KHONG_RO" | True / False | TC_MED_C3_06 (True) / TC_MED_C3_07 (False) |
| 8 | ​ | stock_quantity = -1 | True / False | TC_MED_C3_07 (True) / TC_MED_C3_08 (False) |
| 11 | ​ | Có truyền hoạt chất vs không truyền hoạt chất | True / False | TC_MED_C3_08 (True) / TC_MED_C3_09 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_MED_C3_01 | ​ | { medicine_name: null, unit_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| TC_MED_C3_02 | ​ | { medicine_name: "     ", unit_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| TC_MED_C3_03 | ​ | { medicine_name: "Aspirin 81mg" } (thiếu unit_price) | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_C3_04 | ​ | { medicine_name: "Aspirin 81mg", unit_price: "ABC" } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_C3_05 | ​ | { medicine_name: "Aspirin 81mg", unit_price: 0 } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_C3_06 | ​ | { medicine_name: "Aspirin 81mg", unit_price: 1500, stock_quantity: "VO_HAN" } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| TC_MED_C3_07 | ​ | { medicine_name: "Aspirin 81mg", unit_price: 1500, stock_quantity: -10 } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| TC_MED_C3_08 | ​ | { medicine_name: "  Aspirin 81mg  ", active_ingredient: "  Acid acetylsalicylic  ", unit_price: "1500", stock_quantity: 100, unit: "Vỉ" } | Tạo thành công: medicine_name = "Aspirin 81mg", active_ingredient = "Acid acetylsalicylic", stock_quantity = 100 |
| TC_MED_C3_09 | ​ | { medicine_name: "Băng cá nhân Urgo", unit_price: 2000, stock_quantity: 0 } (không truyền active_ingredient) | Tạo thành công: active_ingredient = "", stock_quantity = 0, category = "Khác", expiry_date = "2027-12-31" |


#### 3.3 KIỂM THỬ DÒNG DỮ LIỆU


#### 3.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu kiểm thử phần mềm chuẩn: Đồ thị dòng dữ liệu của hàm createMedicine là một đồ thị có hướng : - Tập đỉnh (): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. - Tập cạnh (): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ nhánh (p-use) của các biến.

#### 3.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh | ​ | ​ |
| --- | --- | --- |
| 1 | {medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date} | {payload} |
| 2 | {} | {} |
| 3 | {} | {} |
| 4 | {numPrice} | {unit_price} |
| 5 | {} | {} |
| 6 | {} | {} |
| 7 | {numStock} | {stock_quantity} |
| 8 | {} | {} |
| 9 | {} | {} |
| 10 | {nextId} | {} |
| 11a | {trimmedActive} | {active_ingredient} |
| 11b | {trimmedActive} | {} |
| 12 | {finalExpiry} | {expiry_date} |
| 13 | {newMed} | {nextId, medicine_name, trimmedActive, unit, numPrice, numStock, category, finalExpiry} |
| 14 | {} | {newMed} |
| 15 | {} | {newMed} |
| 16 | {} | {newMed} |


#### 3.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| ​ | Điều kiện tại cạnh | ​ |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!medicine_name \|\| !medicine_name.trim()) | {medicine_name} |
| (2, 4) | ~(!medicine_name \|\| !medicine_name.trim()) | {medicine_name} |
| (4, 5) | True | {} |
| (5, 6) | (unit_price === undefined \|\| isNaN(numPrice) \|\| numPrice <= 0) | {unit_price, numPrice} |
| (5, 7) | ~(unit_price === undefined \|\| isNaN(numPrice) \|\| numPrice <= 0) | {unit_price, numPrice} |
| (7, 8) | True | {} |
| (8, 9) | (isNaN(numStock) \|\| numStock < 0) | {numStock} |
| (8, 10) | ~(isNaN(numStock) \|\| numStock < 0) | {numStock} |
| (10, 11) | True | {} |
| (11, 11a) | (Boolean(active_ingredient)) | {active_ingredient} |
| (11, 11b) | ~(Boolean(active_ingredient)) | {active_ingredient} |
| (11a, 12) | True | {} |
| (11b, 12) | True | {} |
| (12, 13) | True | {} |
| (13, 14) | True | {} |
| (14, 15) | True | {} |
| (15, 16) | True | {} |


#### 3.3.4 Đồ thị dòng dữ liệu

Dưới đây là Đồ thị dòng dữ liệu của hàm createMedicine:
Các đỉnh xử lý/tính toán/khởi tạo chứa câu lệnh tương ứng.
Các đỉnh rẽ nhánh kiểm tra điều kiện được gán nhãn NULL.
Các cạnh chuyển tiếp mang nhãn biểu thức điều kiện, phủ định ~(...) hoặc true.

#### 3.3.5 Bảng tổng hợp chi tiết Def-Use theo biến

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| payload | Tham số hàm () | (Bóc tách destructuring) | - |
| medicine_name | ​ | (medicine_name.trim()) | , |
| unit_price | ​ | (Number(unit_price)) | , |
| numPrice | ​ | (Gán vào newMed.unit_price) | , |
| stock_quantity | ​ | (Number(stock_quantity)) | - |
| numStock | ​ | (Gán vào newMed.stock_quantity) | , |
| active_ingredient | ​ | (active_ingredient.trim()) | , |
| trimmedActive | ​ | (Gán vào newMed.active_ingredient) | - |
| expiry_date | ​ | (expiry_date \\|\\| "2027-12-31") | - |
| finalExpiry | ​ | (Gán vào newMed.expiry_date) | - |
| nextId | ​ | (Gán vào newMed.id và format medicine_code) | - |
| newMed | ​ | (repository.create),  (emitEvent),  (return) | - |


#### 3.3.6 Phân tích bất thường dòng dữ liệu

Bất thường Loại 1 (dd - Gán đè giá trị mà không sử dụng giá trị trước):
Đánh giá: KHÔNG CÓ. Các biến trung gian (numPrice, numStock, nextId, finalExpiry, newMed) đều là hằng số (const) và chỉ gán một lần duy nhất.
Bất thường Loại 2 (ur - Sử dụng biến khi chưa gán giá trị hợp lệ):
Phòng vệ mã nguồn:
Khi payload là undefined hoặc null, cơ chế fallback payload || {} kích hoạt an toàn.
Các trường unit = "Viên", stock_quantity = 0, category = "Khác" đều có giá trị mặc định chống undefined.
trimmedActive được bảo vệ bởi rẽ nhánh kiểm tra active_ingredient tại , ngăn chặn lỗi crash TypeError: Cannot read properties of undefined (reading 'trim').
numPrice và numStock đều được ép kiểu Number() và kiểm tra isNaN() trước khi đưa vào cấu trúc thực thể.
Bất thường Loại 3 (du - Khai báo, gán giá trị nhưng không dùng đến):
Đánh giá: KHÔNG CÓ. Mọi tham số và biến trung gian sau khi tính toán đều được đưa vào đối tượng newMed ở , lưu vào DB ở , phát sự kiện ở  và trả về ở .

#### 3.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi newMed

Chuỗi biến đổi trạng thái của thực thể newMed là . Biến không bao giờ rơi vào trạng thái lỗi  (Anomaly).

#### 3.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| payload | ​ | ​ | ​ | Trích xuất các trường từ payload. |
| medicine_name | ​ | ​ | ​ | Cắt tỉa khoảng trắng medicine_name.trim() gán vào newMed. |
| unit_price | ​ | ​ | ​ | Chuyển đổi Number(unit_price) thành numPrice. |
| numPrice | ​ | ​ | ​ | Đưa numPrice vào newMed.unit_price. |
| stock_quantity | ​ | ​ | ​ | Chuyển đổi Number(stock_quantity) thành numStock. |
| numStock | ​ | ​ | ​ | Đưa numStock vào newMed.stock_quantity. |
| active_ingredient | ​ | ​ | ​ | Cắt khoảng trắng hoạt chất active_ingredient.trim(). |
| trimmedActive | ​ | ​ | ​ | Đưa hoạt chất hợp lệ vào newMed.active_ingredient. |
| trimmedActive | ​ | ​ | ​ | Đưa chuỗi rỗng "" vào newMed.active_ingredient. |
| expiry_date | ​ | ​ | ​ | Lấy ngày hết hạn hoặc dùng fallback "2027-12-31". |
| nextId | ​ | ​ | ​ | Tạo medicine_code dạng MED${pad(nextId)}. |
| newMed | ​ | ​ | ​ | Lưu kho DB, phát thông báo EventBus và return. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_MED_CUSE_01 | medicine_name, numPrice, numStock, active_ingredient (), trimmedActive (), expiry_date, nextId, newMed | { medicine_name: "  Paracetamol 500mg ", active_ingredient: "  Paracetamol ", unit: "Viên", unit_price: "2000", stock_quantity: 500, category: "Giảm đau", expiry_date: "2028-06-30" } | Thuốc được tạo thành công:- medicine_name = "Paracetamol 500mg"- active_ingredient = "Paracetamol"- unit_price = 2000- stock_quantity = 500- expiry_date = "2028-06-30" |
| TC_MED_CUSE_02 | trimmedActive (), fallback expiry_date (), fallback unit, fallback category | { medicine_name: "Oresol 245", unit_price: 5000, stock_quantity: 100 } (không truyền active_ingredient, unit, category, expiry_date) | Thuốc được tạo thành công với giá trị fallback:- active_ingredient = "" (từ )- unit = "Viên"- category = "Khác"- expiry_date = "2027-12-31" |
| TC_MED_CUSE_03 | Fallback stock_quantity = 0 () | { medicine_name: "Cồn đỏ Povidine 10%", unit_price: 15000 } (không truyền stock_quantity) | Thuốc được tạo thành công với stock_quantity = 0. |


#### 3.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến , bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến .
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| medicine_name | ​ | ​ | ​ | !medicine_name \\|\\| !medicine_name.trim() nhận True. |
| medicine_name | ​ | ​ | ​ | Tên thuốc hợp lệ (nhận False). |
| unit_price | ​ | ​ | ​ | unit_price === undefined nhận True. |
| numPrice | ​ | ​ | ​ | isNaN(numPrice) \\|\\| numPrice <= 0 nhận True. |
| numPrice | ​ | ​ | ​ | numPrice > 0 nhận False (hợp lệ). |
| numStock | ​ | ​ | ​ | isNaN(numStock) \\|\\| numStock < 0 nhận True. |
| numStock | ​ | ​ | ​ | numStock >= 0 nhận False (hợp lệ). |
| active_ingredient | ​ | ​ | ​ | Boolean(active_ingredient) nhận True. |
| active_ingredient | ​ | ​ | ​ | Boolean(active_ingredient) nhận False. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_MED_PUSE_01 | medicine_name trên | { medicine_name: "", unit_price: 5000 } | Quăng lỗi HTTP 400: Tên thuốc là bắt buộc |
| TC_MED_PUSE_02 | unit_price trên | { medicine_name: "Klacid 500mg" } (thiếu unit_price) | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_PUSE_03 | numPrice trên | { medicine_name: "Klacid 500mg", unit_price: -500 } | Quăng lỗi HTTP 400: Đơn giá thuốc phải lớn hơn 0 |
| TC_MED_PUSE_04 | numStock trên | { medicine_name: "Klacid 500mg", unit_price: 25000, stock_quantity: -1 } | Quăng lỗi HTTP 400: Số lượng tồn kho không được là số âm |
| TC_MED_PUSE_05 | active_ingredient trên  kèm các cạnh hợp lệ | { medicine_name: "Klacid 500mg", active_ingredient: "Clarithromycin", unit_price: 25000, stock_quantity: 100 } | Tạo thành công: medicine_code = "MED001", active_ingredient = "Clarithromycin" |
| TC_MED_PUSE_06 | active_ingredient trên  kèm các cạnh hợp lệ | { medicine_name: "Bông cồn sát trùng", active_ingredient: null, unit_price: 15000, stock_quantity: 50 } | Tạo thành công: active_ingredient = "" |


#### B. CHỨC NĂNG 2: CẬP NHẬT THUỐC & TỒN KHO


#### 3.1. ĐÁNH SỐ DÒNG MÃ NGUỒN


```javascript
function executeUpdateMedicine(idOrCode, updateData) {

1.  const existing = medicineRepository.findByIdOrCode(idOrCode);

2.  if (!existing)

3.      throw Object.assign(new Error("Không tìm thấy thuốc"), { statusCode: 404 });

4.  const { medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date } = updateData || {};

5.  const updated = {
        ...existing,
        ...(medicine_name && { medicine_name: medicine_name.trim() }),
        ...(active_ingredient !== undefined && { active_ingredient: active_ingredient.trim() }),
        ...(unit && { unit }),
        ...(unit_price !== undefined && { unit_price: Number(unit_price) }),
        ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
        ...(category && { category }),
        ...(expiry_date && { expiry_date })
    };

6.  const all = medicineRepository.findAll();

7.  const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);

8.  if (idx !== -1)

9.      all[idx] = updated;

10. eventBus.emitEvent("MEDICINE_STOCK_UPDATED", {
        medicine: updated,
        message: `Cập nhật thông tin kho thuốc: ${updated.medicine_name} (Tồn kho: ${updated.stock_quantity})`
    });

11. return updated;

}
```


#### 3.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN - CHỨC NĂNG CẬP NHẬT


#### 3.2.1 Đồ thị CFG C1/C2 & Độ phức tạp Cyclomatic

Đỉnh 1: Tìm thuốc hiện tại: const existing = medicineRepository.findByIdOrCode(idOrCode).
Đỉnh 2: Điểm quyết định kiểm tra tồn tại: (!existing).
Đỉnh 3: Quăng lỗi HTTP 404  Kết thúc sớm lỗi.
Đỉnh 4-7: Khối bóc tách, merge đối tượng updated, lấy danh mục all và tìm chỉ mục idx.
Đỉnh 8: Điểm quyết định kiểm tra chỉ mục trong mảng: (idx !== -1).
Đỉnh 9: Khối gán all[idx] = updated.
Đỉnh 10-11: Phát sự kiện MEDICINE_STOCK_UPDATED và return updated  Kết thúc thành công.
Độ phức tạp Cyclomatic của McCabe:
Số điểm quyết định đơn:  (Đỉnh 2 và Đỉnh 8).
Cần tối thiểu 3 đường đi cơ sở để phủ trọn toàn bộ nhánh rẽ của đồ thị.

#### 3.2.2 Thiết kế ca kiểm thử đạt 100% C1 và C2 (updateMedicine)

| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Trạng thái Mock Data | Kết quả mong đợi | Nhánh / Câu lệnh phủ |
| --- | --- | --- | --- | --- | --- |
| TC_UP_01 | Đỉnh 2 (True) | id: 9999, { stock_quantity: 50 } | Thuốc không tồn tại trong kho | Quăng lỗi HTTP 404: “Không tìm thấy thuốc” | C1: 1, 2, 3C2: Đỉnh 2 (True) |
| TC_UP_02 | Đỉnh 2 (False), Đỉnh 8 (True) | id: 1, { stock_quantity: 350, unit_price: 2200 } | Có thuốc ID 1 trong kho và tìm thấy trong mảng all | Cập nhật thành công: stock_quantity = 350, unit_price = 2200, phát event | C1: 4..11 (đầy đủ)C2: Đỉnh 2 (F), Đỉnh 8 (T) |
| TC_UP_03 | Đỉnh 8 (False) | id: "MED_AO", { stock_quantity: 100 } | findByIdOrCode trả về object nhưng all.findIndex trả về -1 | Cập nhật đối tượng updated nhưng bỏ qua gán mảng, phát event | C2: Đỉnh 8 (False) |

Tỷ lệ bao phủ C1 & C2:  câu lệnh = 100% C1,  nhánh rẽ = 100% C2.

#### 3.2.3 Đồ thị CFG C3 & Bảng phân tích điều kiện con C3

Tại câu lệnh 7, biểu thức tìm vị trí idx: String(m.id) === String(idOrCode) || m.medicine_code === idOrCode
- (7a): String(m.id) === String(idOrCode)
- (7b): m.medicine_code === idOrCode
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (idOrCode) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_UP_C3_01 | (Khớp theo ID số) | idOrCode: 1 hoặc "1" | Khớp ngay tại , tìm thấy idx = 0 |
| TC_UP_C3_02 | (Khớp theo mã thuốc) | idOrCode: "MED001" | False, nhảy sang  True  tìm thấy idx = 0 |
| TC_UP_C3_03 | ​ | idOrCode: "KHONG_TRUNG" | Cả 2 False  idx = -1 |


#### 3.3. KIỂM THỬ DÒNG DỮ LIỆU - CHỨC NĂNG CẬP NHẬT


#### 3.3.1 Bảng def(i) và c-use(i) tại các đỉnh

| Đỉnh | ​ | ​ |
| --- | --- | --- |
| 1 | {existing} | {idOrCode} |
| 2 | {} | {} |
| 3 | {} | {} |
| 4 | {medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date} | {updateData} |
| 5 | {updated} | {existing, medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date} |
| 6 | {all} | {} |
| 7 | {idx} | {all, idOrCode} |
| 8 | {} | {} |
| 9 | {all[idx]} | {updated, idx} |
| 10 | {} | {updated} |
| 11 | {} | {updated} |


#### 3.3.2 Bảng điều kiện và p-use của các cạnh

| ​ | Điều kiện tại cạnh | ​ |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!existing) | {existing} |
| (2, 4) | ~(!existing) | {existing} |
| (4, 5) | True | {} |
| (5, 6) | True | {} |
| (6, 7) | True | {} |
| (7, 8) | True | {} |
| (8, 9) | (idx !== -1) | {idx} |
| (8, 10) | ~(idx !== -1) | {idx} |
| (9, 10) | True | {} |
| (10, 11) | True | {} |


#### 3.3.3 Sơ đồ DFG Cập nhật


#### 3.3.4 Ca kiểm thử đạt 100% All c-use và All p-use cho Cập nhật

| Mã TC | Biến & Cặp def -> use được phủ | Dữ liệu kiểm thử | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_UP_DF_01 | existing (), stock_quantity (), updated (), idx () | id: 1, { stock_quantity: 120 } | Cập nhật số lượng tồn kho lên 120, gán vào mảng và phát event |
| TC_UP_DF_02 | unit_price (), active_ingredient (), medicine_name () | id: 1, { medicine_name: "Panadol Extra Mới", active_ingredient: "Paracetamol 650mg", unit_price: 3000 } | Cập nhật tên, hoạt chất và đơn giá thành công |
| TC_UP_DF_03 | existing trên rẽ nhánh | id: 8888 (không có trong DB) | Quăng lỗi HTTP 404: Không tìm thấy thuốc |


#### C. CHỨC NĂNG 3: XÓA THUỐC KHỎI KHO


#### 3.1 ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
function executeDeleteMedicine(idOrCode) {

1.  const existing = medicineRepository.findByIdOrCode(idOrCode);

2.  if (!existing)

3.      throw Object.assign(new Error("Không tìm thấy thuốc"), { statusCode: 404 });

4.  const all = medicineRepository.findAll();

5.  const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);

6.  const deleted = all.splice(idx, 1)[0];

7.  return deleted;

}
```


#### 3.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN - CHỨC NĂNG XÓA

Phân tích Cyclomatic :
Số điểm quyết định  (tại Đỉnh 2).
Cần tối thiểu 2 ca kiểm thử để đạt 100% C1, C2 và C3.
| Mã TC | Điểm QĐ phủ | Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_DEL_01 | Đỉnh 2 (True) | id: 9999 (không tồn tại) | Quăng lỗi HTTP 404: “Không tìm thấy thuốc” |
| TC_DEL_02 | Đỉnh 2 (False) | id: 1 (tồn tại trong kho) | Xóa thành công thuốc khỏi kho và trả về đối tượng deleted |


#### 3.3 KIỂM THỬ DÒNG DỮ LIỆU - CHỨC NĂNG XÓA

Bảng Def-Use tại các đỉnh:
Đỉnh 1: , .
Cạnh (2, 3) & (2, 4): .
Đỉnh 4: .
Đỉnh 5: , .
Đỉnh 6: , .
Đỉnh 7: .


### 4. Kiểm thử đơn vị


> **5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO**



#### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Lớp `MedicineService` với 3 phương thức nghiệp vụ CRUD:
  1. `createMedicine(payload)`: Thêm mới thuốc & Khởi tạo tồn kho
  2. `updateMedicine(idOrCode, updateData)`: Cập nhật thông tin & Số lượng tồn kho
  3. `deleteMedicine(idOrCode)`: Xóa thuốc khỏi danh mục kho dược
- **Tập tin kiểm thử:** [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js#L293-L435)
- **Quy tắc nghiệp vụ kiểm thử:**
  1. `medicine_name` bắt buộc, không được để trống hoặc chỉ chứa khoảng trắng.
  2. `unit_price` bắt buộc và phải là số $> 0$.
  3. `stock_quantity` khởi tạo không được âm ($\ge 0$).
  4. Chuẩn hóa cắt tỉa khoảng trắng đầu/cuối chuỗi (`trim()`), sinh mã thuốc tự động `MED` + 3 số (ví dụ: `MED011`).
  5. Cập nhật tồn kho hoặc đơn giá theo ID/mã thuốc. Nếu không tìm thấy $\rightarrow$ Báo lỗi 404.
  6. Xóa thuốc theo ID/mã thuốc. Sau khi xóa, tìm kiếm lại thuốc phải trả về `null/undefined`.


#### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Test Case | Tên hàm kiểm thử (Chuẩn slide: `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Phương thức `Assert` NUnit sử dụng |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **A** | **Thêm thuốc mới** | | | | |
| 24 | **UT_MED_01** | `Test_CreateMedicine_TenThuocRong_NemNgoaiLe400` | `{ medicine_name: "   ", unit_price: 5000 }` | Báo lỗi 400: *"Tên thuốc là bắt buộc"* | `Assert.Throws` |
| 25 | **UT_MED_02** | `Test_CreateMedicine_DonGiaUndefined_NemNgoaiLe400` | `{ medicine_name: "Ibuprofen 400mg" }` (không truyền giá) | Báo lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 26 | **UT_MED_03** | `Test_CreateMedicine_DonGiaBangKhong_NemNgoaiLe400` | `{ medicine_name: "Ibuprofen 400mg", unit_price: 0 }` | Báo lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 27 | **UT_MED_04** | `Test_CreateMedicine_DonGiaAm_NemNgoaiLe400` | `{ medicine_name: "Ibuprofen 400mg", unit_price: -2500 }` | Báo lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 28 | **UT_MED_05** | `Test_CreateMedicine_SoLuongTonKhoAm_NemNgoaiLe400` | `{ medicine_name: "Ibuprofen", unit_price: 2500, stock_quantity: -10 }` | Báo lỗi 400: *"Số lượng tồn kho không được là số âm"* | `Assert.Throws` |
| 29 | **UT_MED_06** | `Test_CreateMedicine_DuLieuHopLe_ThemThanhCong_SinhMaMEDChuan` | `{ name: "  Klacid 500mg  ", ingredient: "  Clarithromycin  ", unit_price: 25000, stock: 200 }` | Tên đã trim, mã `MED011`, tồn kho $> 0$, phát sự kiện `MEDICINE_ADDED` | `Assert.IsNotNull`<br>`Assert.AreEqual`<br>`Assert.Greater`<br>`Assert.IsTrue` |
| 30 | **UT_MED_07** | `Test_CreateMedicine_GiaTriMacDinh_DonViVien_DanhMucKhac` | `{ medicine_name: "Vitamin B6", unit_price: 1000 }` | Mặc định `unit = "Viên"`, `category = "Khác"`, `stock = 0`, `expiry = "2027-12-31"` | `Assert.AreEqual` |
| **B** | **Cập nhật thuốc** | | | | |
| 31 | **UT_MED_08** | `Test_UpdateMedicine_MaThuocKhongTonTai_NemNgoaiLe404` | `id = 99999`, `{ stock_quantity: 100 }` | Báo lỗi 404: *"Không tìm thấy thuốc"* | `Assert.Throws` |
| 32 | **UT_MED_09** | `Test_UpdateMedicine_CapNhatTonKhoVaDonGia_ThanhCong` | `id = 1`, `{ stock_quantity: 1200, unit_price: 1800 }` | `stock = 1200`, `price = 1800`, bảo toàn tên cũ, phát `MEDICINE_STOCK_UPDATED` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 33 | **UT_MED_10** | `Test_UpdateMedicine_CapNhatTheoMa_CatKhoangTrangThanhCong` | `code = "MED002"`, `{ name: "  Amoxicillin 500mg (Hộp 10 vỉ)  " }` | Tên mới đã trim khoảng trắng | `Assert.AreEqual` |
| **C** | **Xóa thuốc** | | | | |
| 34 | **UT_MED_11** | `Test_DeleteMedicine_MaThuocKhongTonTai_NemNgoaiLe404` | `id = 99999` | Báo lỗi 404: *"Không tìm thấy thuốc"* | `Assert.Throws` |
| 35 | **UT_MED_12** | `Test_DeleteMedicine_ThuocTonTai_XoaKhoiDanhSachThanhCong` | `id = 1` (`"MED001"`) | Trả về thuốc đã xóa khác null, số lượng kho giảm đi 1, tìm lại trả về null | `Assert.IsNotNull`<br>`Assert.AreEqual`<br>`Assert.IsNull` |

---

---

# Ngô Tuấn Anh

## Chức năng 1: Cập nhật thông tin bệnh án và chẩn đoán

### 1. Đặc tả


#### 1.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-DOC-12 |
| --- | --- |
| Tên Use Case (Use Case Name) | Cập nhật thông tin bệnh án và chẩn đoán |
| Người thực hiện & Ngày tạo | Ngô Tuấn Anh — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Bác sĩ |
| Điều kiện tiên quyết (Pre-conditions) | Bệnh nhân đang trong phiên khám chính thức của Bác sĩ (trạng thái "Đang khám"). |
| Điều kiện sau thành công (Post-conditions) | Toàn bộ thông tin lý do khám, tiền sử, triệu chứng lâm sàng và mã chẩn đoán bệnh chuẩn (ICD-10) được lưu trữ thành công vào CSDL bệnh án điện tử. |
| Kích hoạt (Trigger) | Bác sĩ thực hiện thăm khám, nhập dữ liệu diễn biến bệnh và bấm nút "Lưu bệnh án" trên màn hình. |


#### 1.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường (Field Name) | Tên hiển thị & Điều khiển (UI Control) | Kiểu dữ liệu | Bắt buộc | Các ràng buộc(Validation Rules & Constraints) | Thông báo lỗi (Error Message) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | chief_complaint | Lý do đến khám [Text Area] | String | Có | - Bắt buộc nhập cho mọi ca khám. <br>- Tối thiểu 5 ký tự, tối đa 2000 ký tự. | "Vui lòng nhập lý do đến khám của bệnh nhân." |
| 2 | history_and_symptoms | Tiền sử & Triệu chứng lâm sàng [Text Area] | String | - Có nếu là bệnh mạn tính hoặc ca phức tạp. <br>- Không  với ca khám đơn giản. | - Tối đa 4000 ký tự. <br>-Dùng ghi nhận diễn biến lâm sàng và tiền sử dị ứng/bệnh lý. | "Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự)." |
| 3 | icd10_main_code | Chẩn đoán bệnh chính [Autocomplete Input] | String | Có | - Phải thuộc danh mục mã bệnh chuẩn ICD-10 lưu trong hệ thống. <br>- Bắt buộc phải chọn đúng 1 mã bệnh chính trước khi lưu hồ sơ. | "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án." |
| 4 | icd10_sub_codes | Chẩn đoán kèm theo [Multi-Select Tag Input] | Array (String) | - Không nếu chỉ mắc 1 bệnh chính. <br>- Có nếu có bệnh lý nền kèm theo. | - Các mã chọn thêm phải thuộc danh mục ICD-10.<br>- Không trùng lặp với mã chẩn đoán bệnh chính. | "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính." |


#### 1.3. Dữ liệu đầu ra (Outputs)

EMR Record Update: Toàn bộ lý do đến khám, diễn biến lâm sàng, kết quả khám các cơ quan và mã bệnh ICD-10 được lưu trữ thành công vào CSDL.
EMR Saved Notification: Hiển thị thông báo Toast xanh: "Lưu bệnh án thành công" và cập nhật mốc thời gian lưu trên giao diện.

#### 1.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Bác sĩ nhập lý do đến khám và các triệu chứng ghi nhận được vào ô văn bản trên bệnh án.**
- **Bước 2: Bác sĩ thăm khám lâm sàng các cơ quan và nhập kết quả ghi nhận.**
- **Bước 3: Tại ô chẩn đoán bệnh, bác sĩ gõ từ khóa tên bệnh hoặc mã chuẩn ICD-10.**
- **Bước 4: Hệ thống tìm kiếm và hiển thị danh sách gợi ý các mã bệnh phù hợp.**
- **Bước 5: Bác sĩ chọn 1 mã bệnh chẩn đoán chính và chọn các mã chẩn đoán kèm theo (nếu có).**
- **Bước 6: Bác sĩ nhấn nút "Lưu bệnh án".**
- **Bước 7: Hệ thống kiểm tra tính hợp lệ của dữ liệu, ghi nhận thông tin vào CSDL và hiển thị thông báo "Lưu bệnh án thành công". Kết thúc Use Case.**

#### 1.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã ngoại lệ [E12.1] (Bỏ trống mã chẩn đoán bệnh chính):**
Tại Bước 6, bác sĩ bấm nút lưu nhưng chưa nhập/chọn mã chẩn đoán chính.
Hệ thống chặn thao tác lưu, đánh dấu viền đỏ ô chẩn đoán và hiển thị cảnh báo: "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án".
Bác sĩ quay lại bước 3 để hoàn thiện thông tin.


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Cập nhật thông tin bệnh án và chẩn đoán" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm kiểm soát chặt chẽ độ dài ký tự của các trường văn bản mô tả và tính hợp lệ của mã chuẩn chẩn đoán ICD-10.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên**

Tập trung kiểm tra độ dài đầu vào của lý do khám, triệu chứng và quy tắc chọn mã ICD-10.
Trường chief_complaint (Lý do đến khám):
Miền hợp lệ: Từ 5 đến 2000 ký tự. Giá trị biên: 5 ký tự (Min hợp lệ), 2000 ký tự (Max hợp lệ).
Miền không hợp lệ: Dưới 5 ký tự hoặc vượt quá 2000 ký tự. Giá trị biên: 4 ký tự (Min-), 2001 ký tự (Max+).
Trường history_and_symptoms (Tiền sử & Triệu chứng lâm sàng):
Miền hợp lệ: Từ 0 đến 4000 ký tự (cho phép để trống đối với ca khám đơn giản). Giá trị biên: 4000 ký tự (Max hợp lệ).
Miền không hợp lệ: Vượt quá 4000 ký tự. Giá trị biên: 4001 ký tự (Max+).
Trường icd10_sub_codes (Chẩn đoán kèm theo):
Miền hợp lệ: Các mã chọn thêm thuộc danh mục ICD-10 và không bị trùng lặp với mã chẩn đoán chính.
Miền không hợp lệ: Mã chọn kèm bị trùng lặp hoàn toàn với mã chẩn đoán chính icd10_main_code.

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: chief_complaint có độ dài hợp lệ (từ 5 đến 2000 ký tự) không?
C2: history_and_symptoms có nằm trong giới hạn cho phép (  ký tự) không?
C3: Bác sĩ đã chọn đúng 01 mã chẩn đoán bệnh chính thuộc danh mục ICD-10 (icd10_main_code) chưa?
C4: Các mã chẩn đoán kèm theo (icd10_sub_codes) có hợp lệ và không bị trùng lặp với mã chính không?
Các hành động (A):
A1: Hệ thống báo lỗi độ dài trường Lý do đến khám (bắt buộc từ 5-2000 ký tự).
A2: Hệ thống báo lỗi: "Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự)".
A3: Chặn thao tác lưu, đánh dấu viền đỏ ô chẩn đoán và hiển thị cảnh báo: "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án" (Mã ngoại lệ E12.1).
A4: Hệ thống báo lỗi: "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính".
A5: Lưu trữ thành công toàn bộ thông tin vào cơ sở dữ liệu bệnh án điện tử và hiển thị thông báo Toast xanh: "Lưu bệnh án thành công" kèm mốc thời gian.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: chief_complaint hợp lệ (5-2000 ký tự)? | F | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- |
|  | C2: history_and_symptoms  ký tự? | - | F | T | T | T |
|  | C3: Đã chọn mã chính icd10_main_code hợp lệ? | - | - | F | T | T |
|  | C4: icd10_sub_codes không trùng mã chính? | - | - | - | F | T |
| Hành động (A) | A1: Báo lỗi độ dài Lý do đến khám | X |  |  |  |  |
|  | A2: Báo lỗi độ dài Tiền sử & Triệu chứng |  | X |  |  |  |
|  | A3: Báo lỗi chưa nhập chẩn đoán chính (E12.1) |  |  | X |  |  |
|  | A4: Báo lỗi mã phụ trùng lặp / không hợp lệ |  |  |  | X |  |
|  | A5: Lưu bệnh án thành công, hiển thị Toast xanh |  |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước kiểm tra trước đó).

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F12_01 | Giá trị biên (Q1) | Nhập chief_complaint có độ dài 4 ký tự (Min-), các trường khác hợp lệ. Bấm Lưu. | Hệ thống chặn lưu, hiển thị thông báo lỗi yêu cầu lý do khám tối thiểu 5 ký tự. |
| TC_F12_02 | Giá trị biên (Q1) | Nhập chief_complaint có độ dài 2001 ký tự (Max+), các trường khác hợp lệ. Bấm Lưu. | Hệ thống chặn lưu, báo lỗi vượt quá giới hạn ký tự cho phép của lý do khám. |
| TC_F12_03 | Giá trị biên (Q2) | Nhập history_and_symptoms có độ dài 4001 ký tự (Max+), các trường khác hợp lệ. Bấm Lưu. | Hệ thống chặn lưu, hiển thị lỗi: "Nội dung tiền sử và triệu chứng vượt quá độ dài cho phép (tối đa 4000 ký tự)". |
| TC_F12_04 | Bảng quyết định (Q3) / Ngoại lệ E12.1 | Nhập đầy đủ chief_complaint, nhưng bỏ trống ô chẩn đoán chính (icd10_main_code). Bấm Lưu. | Hệ thống chặn thao tác lưu, đánh dấu viền đỏ ô chẩn đoán và hiển thị cảnh báo: "Vui lòng nhập chẩn đoán bệnh trước khi lưu bệnh án". |
| TC_F12_05 | Phân vùng TĐ (Q4) | Nhập mã chính icd10_main_code hợp lệ, nhưng chọn thêm icd10_sub_codes bị trùng lặp với mã chính. Bấm Lưu. | Hệ thống chặn lưu, hiển thị lỗi: "Mã chẩn đoán kèm theo không hợp lệ hoặc bị trùng với chẩn đoán chính". |
| TC_F12_06 | Giá trị biên / BQ (Q5) | Nhập chief_complaint đúng 5 ký tự (Min), bỏ trống triệu chứng (0 ký tự), chọn đúng 1 icd10_main_code chuẩn. Bấm Lưu. | Lưu bệnh án thành công vào cơ sở dữ liệu, hiển thị thông báo Toast xanh: "Lưu bệnh án thành công" kèm mốc thời gian. |
| TC_F12_07 | Giá trị biên / BQ (Q5) | Nhập chief_complaint đúng 2000 ký tự (Max), history_and_symptoms đúng 4000 ký tự (Max), chọn 1 mã chính và nhiều mã phụ hợp lệ không trùng. Bấm Lưu. | Lưu bệnh án thành công vào cơ sở dữ liệu, hiển thị thông báo Toast xanh: "Lưu bệnh án thành công" kèm mốc thời gian. |



### 3. Kiểm thử hộp trắng


#### 1.1. ĐÁNH SỐ DÒNG MÃ NGUỒN


```javascript
function executeCreateConsultation(payload) {
 1.  const { patient_code, patient_name, doctor = "BS. Lê Hoàng Nam", vitals, symptoms, icd10_code, icd10_name = "Bệnh lý chung", doctor_notes = "", treatment_plan = "Điều trị ngoại trú" } = payload || {};
 2.  if (!patient_code || !symptoms || !icd10_code)
 3.  	throw new Error("Vui lòng nhập đầy đủ thông tin bệnh nhân, triệu chứng và mã chẩn đoán ICD-10");
 4.  const hasVitals = Boolean(vitals);
 5.  if (hasVitals && vitals.blood_pressure && !/^\d{2,3}\/\d{2,3}$/.test(String(vitals.blood_pressure).trim()))
 6.  	throw new Error("Huyết áp phải có định dạng chuẩn (VD: 120/80)");
 7.  const temp = hasVitals && vitals.temperature !== undefined ? Number(vitals.temperature) : 37.0;
 8.  if (temp < 34.0 || temp > 43.0)
 9.  	throw new Error("Thân nhiệt không hợp lệ (phải từ 34.0°C đến 43.0°C)");
 10. const spo2Val = hasVitals && vitals.spo2 !== undefined ? Number(vitals.spo2) : 98;
 11. if (spo2Val < 50 || spo2Val > 100)
 12. 	throw new Error("Chỉ số SpO2 không hợp lệ (phải từ 50% đến 100%)");
 13. const defaultVitals = { blood_pressure: "120/80", pulse: 80, temperature: temp, spo2: spo2Val };
 14. const finalVitals = hasVitals ? { ...defaultVitals, ...vitals } : defaultVitals;
 15. const nextId = consultationRepository.getNextId();
 16. const patient = patientRepository.findByIdOrCode(patient_code);
 17. const hasPatient = Boolean(patient);
 18. const patientStatus = hasPatient ? "ĐÃ_KHÁM" : "CHỜ_KHÁM";
 19. const newConsultation = { id: nextId, encounter_id: nextId, patient_code, patient_name: patient_name || "Bệnh nhân", doctor, vitals: finalVitals, symptoms, icd10_code, icd10_name, doctor_notes, treatment_plan, status: "COMPLETED", patient_status: patientStatus, created_at: dayjs().format("DD/MM/YYYY HH:mm") };
 20. consultationRepository.create(newConsultation);
 21. eventBus.emitEvent("CONSULTATION_CREATED", { consultation: newConsultation });
 22. return newConsultation;
 }
```


#### 1.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 1.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2


#### 1.2.2 Phân tích độ phức tạp cho C1/C2

Trên đồ thị C1/C2:
 - Số điểm quyết định P = 5 (tại các đỉnh 2, 5, 8, 11, 17).
 - Số đỉnh N = 21, số cạnh E = 25.
 - Công thức McCabe: V(G) = P + 1 = 5 + 1 = 6 (hoặc V(G) = E - N + 2 = 25 - 21 + 2 = 6).
Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 1.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 22 ít nhất một lần. Tập hợp các ca kiểm thử đạt 100% C1:
 - Cần kích hoạt 4 nhánh throw (câu lệnh 3, 6, 9, 12).
 - Cần đi qua nhánh gán ĐÃ_KHÁM (câu lệnh 18a) và CHỜ_KHÁM (câu lệnh 18b) cùng toàn bộ khối xử lý thành công (câu lệnh 19-22).
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 | 1 -> 2 -> 3 | { patient_code: "BN01", symptoms: "Ho sốt" } (thiếu icd10_code) | Lỗi: "Vui lòng nhập đầy đủ thông tin..." | 1, 2, 3 |
| 2 | TC_C1_02 | 1 -> 2 -> 4 -> 5 -> 6 | { patient_code: "BN01", symptoms: "Đau đầu", icd10_code: "G44", vitals: { blood_pressure: "120-80" } } | Lỗi: "Huyết áp phải có định dạng chuẩn..." | 4, 5, 6 |
| 3 | TC_C1_03 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 | { patient_code: "BN01", symptoms: "Sốt cao", icd10_code: "R50", vitals: { temperature: 44.5 } } | Lỗi: "Thân nhiệt không hợp lệ..." | 7, 8, 9 |
| 4 | TC_C1_04 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 12 | { patient_code: "BN01", symptoms: "Khó thở", icd10_code: "R06", vitals: { spo2: 45 } } | Lỗi: "Chỉ số SpO2 không hợp lệ..." | 10, 11, 12 |
| 5 | TC_C1_05 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18b -> 19 -> 20 -> 21 -> 22 | { patient_code: "BN_UNKNOWN", symptoms: "Khám định kỳ", icd10_code: "Z00" } (chưa có trong DB) | Thành công: patient_status = "CHỜ_KHÁM", status = "COMPLETED" | 13, 14, 15, 16, 17, 18b, 19, 20, 21, 22 |
| 6 | TC_C1_06 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18a -> 19 -> 20 -> 21 -> 22 | { patient_code: "BN000001", symptoms: "Khám tổng quát", icd10_code: "I10", vitals: { blood_pressure: "120/80", temperature: 36.8, spo2: 98 } } (có trong DB) | Thành công: patient_status = "ĐÃ_KHÁM", status = "COMPLETED" | 18a |

Tỷ lệ bao phủ C1: 22/22 câu lệnh = 100%.

#### 1.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 8, 11, 17 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !patient_code \|\| !symptoms \|\| !icd10_code | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4-5) |
| Đỉnh 5 | hasVitals && vitals.blood_pressure && !regex.test(...) | TC_C2_03 (Nhảy sang Đỉnh 6) | TC_C2_04 (Đi tiếp Đỉnh 7-8) |
| Đỉnh 8 | temp < 34.0 \|\| temp > 43.0 | TC_C2_05 (Nhảy sang Đỉnh 9) | TC_C2_06 (Đi tiếp Đỉnh 10-11) |
| Đỉnh 11 | spo2Val < 50 \|\| spo2Val > 100 | TC_C2_07 (Nhảy sang Đỉnh 12) | TC_C2_08 (Đi tiếp Đỉnh 13-17) |
| Đỉnh 17 | hasPatient (patient != null) | TC_C2_09 (Nhánh 18a: ĐÃ_KHÁM) | TC_C2_10 (Nhánh 18b: CHỜ_KHÁM) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { symptoms: "Ho", icd10_code: "J00" } (thiếu patient_code) | Lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 8 (False), Đỉnh 11 (False), Đỉnh 17 (False) | { patient_code: "BN_UNKNOWN", symptoms: "Viêm họng", icd10_code: "J02" } | Tạo bệnh án thành công, patient_status = "CHỜ_KHÁM" |
| TC_C2_03 | Đỉnh 5 (True) | { patient_code: "BN01", symptoms: "Chóng mặt", icd10_code: "R42", vitals: { blood_pressure: "SAI_DINH_DANG" } } | Lỗi: Huyết áp phải có định dạng chuẩn |
| TC_C2_05 | Đỉnh 8 (True) | { patient_code: "BN01", symptoms: "Hạ thân nhiệt", icd10_code: "T68", vitals: { temperature: 32.0 } } | Lỗi: Thân nhiệt không hợp lệ |
| TC_C2_07 | Đỉnh 11 (True) | { patient_code: "BN01", symptoms: "Khó thở", icd10_code: "R06", vitals: { spo2: 105 } } | Lỗi: Chỉ số SpO2 không hợp lệ |
| TC_C2_09 | Đỉnh 17 (True) | { patient_code: "BN000001", symptoms: "Khám định kỳ", icd10_code: "Z00.0", vitals: { blood_pressure: "120/80", temperature: 37, spo2: 98 } } | Tạo bệnh án thành công, patient_status = "ĐÃ_KHÁM" |

Tỷ lệ bao phủ C2: 10/10 nhánh quyết định = 100%.

#### 1.2.5 Đồ thị dòng điều khiển cho Độ đo C3


#### 1.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | !patient_code | patient_code = "" hoặc undefined | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 2 | !symptoms | symptoms = "" hoặc null | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 2 | !icd10_code | icd10_code = "" hoặc undefined | True / False | TC_C3_03 (True) / TC_C3_04 (False) |
| 5 | hasVitals | vitals truyền vào null hoặc có giá trị | True / False | TC_C3_04 (True) / TC_C3_05 (False) |
| 5 | !regex.test(BP) | blood_pressure sai format (120-80) | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 8 | temp < 34.0 | temperature = 32.5°C | True / False | TC_C3_06 (True) / TC_C3_07 (False) |
| 8 | temp > 43.0 | temperature = 44.5°C | True / False | TC_C3_07 (True) / TC_C3_08 (False) |
| 11 | spo2Val < 50 | spo2 = 40% | True / False | TC_C3_08 (True) / TC_C3_09 (False) |
| 11 | spo2Val > 100 | spo2 = 105% | True / False | TC_C3_09 (True) / TC_C3_10 (False) |
| 17 | hasPatient | patient tìm thấy trong CSDL hay không | True / False | TC_C3_10 (True) / TC_C3_11 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | !patient_code = True | { patient_code: "", symptoms: "Đau đầu", icd10_code: "R51" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_02 | !symptoms = True | { patient_code: "BN01", symptoms: "", icd10_code: "R51" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_03 | !icd10_code = True | { patient_code: "BN01", symptoms: "Đau đầu", icd10_code: "" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_04 | hasVitals = False | { patient_code: "BN000001", symptoms: "Khám thường", icd10_code: "Z00" } (vitals = null) | Lưu thành công với fallback vitals |
| TC_C3_05 | !regex.test(BP) = True | { patient_code: "BN01", symptoms: "Khám", icd10_code: "Z00", vitals: { blood_pressure: "120-80" } } | Quăng lỗi: Huyết áp phải có định dạng chuẩn |
| TC_C3_06 | temp < 34.0 = True | { patient_code: "BN01", symptoms: "Lạnh", icd10_code: "T68", vitals: { temperature: 32.0 } } | Quăng lỗi: Thân nhiệt không hợp lệ |
| TC_C3_07 | temp > 43.0 = True | { patient_code: "BN01", symptoms: "Sốt", icd10_code: "R50", vitals: { temperature: 44.5 } } | Quăng lỗi: Thân nhiệt không hợp lệ |
| TC_C3_08 | spo2Val < 50 = True | { patient_code: "BN01", symptoms: "Khó thở", icd10_code: "R06", vitals: { spo2: 40 } } | Quăng lỗi: Chỉ số SpO2 không hợp lệ |
| TC_C3_09 | spo2Val > 100 = True | { patient_code: "BN01", symptoms: "Khó thở", icd10_code: "R06", vitals: { spo2: 105 } } | Quăng lỗi: Chỉ số SpO2 không hợp lệ |
| TC_C3_10 | hasPatient = True | { patient_code: "BN000001", symptoms: "Tái khám", icd10_code: "I10", vitals: { blood_pressure: "120/80", temperature: 37, spo2: 98 } } | Lưu thành công, patient_status = "ĐÃ_KHÁM" |
| TC_C3_11 | hasPatient = False | { patient_code: "BN_UNKNOWN", symptoms: "Khám ngoài", icd10_code: "I10" } | Lưu thành công, patient_status = "CHỜ_KHÁM" |


#### 1.3. KIỂM THỬ DÒNG DỮ LIỆU


#### 1.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu học tập kiểm thử phần mềm: Đồ thị dòng dữ liệu của một đơn vị chương trình là một đồ thị có hướng G = (V, E), trong đó:
 - Tập đỉnh (V): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. Đồ thị G có hai đỉnh đặc biệt là đỉnh bắt đầu (tương ứng với lệnh def của các biến tham số) và đỉnh kết thúc đơn vị chương trình.
 - Tập cạnh (E): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ nhánh (p-use) của các biến.

#### 1.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh i | def(i) | c-use(i) |
| --- | --- | --- |
| 1 | {patient_code, patient_name, doctor, vitals, symptoms, icd10_code, icd10_name, doctor_notes, treatment_plan} | {} |
| 2 | {} | {} |
| 3 | {} | {} |
| 4 | {hasVitals} | {vitals} |
| 5 | {} | {} |
| 6 | {} | {} |
| 7 | {temp} | {hasVitals, vitals} |
| 8 | {} | {} |
| 9 | {} | {} |
| 10 | {spo2Val} | {hasVitals, vitals} |
| 11 | {} | {} |
| 12 | {} | {} |
| 13-14 | {defaultVitals, finalVitals} | {temp, spo2Val, hasVitals, vitals} |
| 15 | {nextId} | {} |
| 16 | {patient} | {patient_code} |
| 17 | {hasPatient} | {patient} |
| 18a | {patientStatus} | {} |
| 18b | {patientStatus} | {} |
| 19 | {newConsultation} | {nextId, patient_code, patient_name, doctor, finalVitals, symptoms, icd10_code, icd10_name, patientStatus} |
| 20-21 | {} | {newConsultation} |
| 22 | {} | {newConsultation} |


#### 1.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| Cạnh (i, j) | Điều kiện tại cạnh | p-use(i, j) |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!patient_code \|\| !symptoms \|\| !icd10_code) | {patient_code, symptoms, icd10_code} |
| (2, 4) | ~(!patient_code \|\| !symptoms \|\| !icd10_code) | {patient_code, symptoms, icd10_code} |
| (4, 5) | True | {} |
| (5, 6) | (hasVitals && vitals.blood_pressure && !regex) | {hasVitals, vitals} |
| (5, 7) | ~(hasVitals && vitals.blood_pressure && !regex) | {hasVitals, vitals} |
| (7, 8) | True | {} |
| (8, 9) | (temp < 34.0 \|\| temp > 43.0) | {temp} |
| (8, 10) | ~(temp < 34.0 \|\| temp > 43.0) | {temp} |
| (10, 11) | True | {} |
| (11, 12) | (spo2Val < 50 \|\| spo2Val > 100) | {spo2Val} |
| (11, 13) | ~(spo2Val < 50 \|\| spo2Val > 100) | {spo2Val} |
| (13, 16) | True | {} |
| (16, 17) | True | {} |
| (17, 18a) | hasPatient | {hasPatient} |
| (17, 18b) | ~hasPatient | {hasPatient} |
| (18a, 19) | True | {} |
| (18b, 19) | True | {} |
| (19, 20) | True | {} |
| (20, 22) | True | {} |


#### 1.3.4 Đồ thị dòng dữ liệu


#### 1.3.5 Bảng tổng hợp chi tiết Def-Use theo biến

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| payload | Tham số hàm (0) | 1 (Destructuring các trường) | - |
| patient_code | 1 | 16, 19 (Gán vào newConsultation) | (2, 3), (2, 4) |
| symptoms | 1 | 19 (Gán vào newConsultation) | (2, 3), (2, 4) |
| icd10_code | 1 | 19 (Gán vào newConsultation) | (2, 3), (2, 4) |
| vitals | 1 | 4, 7, 10, 14 | (5, 6), (5, 7) |
| hasVitals | 4 | 7, 10, 14 | (5, 6), (5, 7) |
| temp | 7 | 13 (Đóng gói defaultVitals) | (8, 9), (8, 10) |
| spo2Val | 10 | 13 (Đóng gói defaultVitals) | (11, 12), (11, 13) |
| finalVitals | 14 | 19 (Gán vào newConsultation.vitals) | - |
| nextId | 15 | 19 (Gán vào id, encounter_id) | - |
| patient | 16 | 17 (hasPatient = Boolean(patient)) | - |
| hasPatient | 17 | - | (17, 18a), (17, 18b) |
| patientStatus | 18a, 18b | 19 (Gán vào newConsultation.patient_status) | - |
| newConsultation | 19 | 20 (create), 21 (emitEvent), 22 (return) | - |


#### 1.3.6 Phân tích bất thường dòng dữ liệu

Bất thường Loại 1 (dd - Gán giá trị rồi lại gán tiếp giá trị ngay sau đó mà không sử dụng):
Đánh giá: KHÔNG CÓ. Tất cả các biến trung gian (hasVitals, temp, spo2Val, defaultVitals, finalVitals, patientStatus, newConsultation) đều được khai báo dạng const và khởi tạo duy nhất 1 lần, không xảy ra hiện tượng gán đè làm mất giá trị trước đó.
Bất thường Loại 2 (ur - Chưa gán giá trị nhưng đã được sử dụng):
Phân tích rủi ro: Nếu payload không có giá trị (undefined), việc đọc thuộc tính sẽ gây lỗi crash runtime TypeError.
 Phòng vệ mã nguồn: Đoạn code đã dùng cơ chế fallback payload || {}, doctor = "BS. Lê Hoàng Nam", icd10_name = "Bệnh lý chung".
 Đối với giá trị sinh hiệu: Nhánh kiểm tra tại cạnh (2, 3) chặn triệt để trường hợp thiếu thông tin bắt buộc, các biến temp và spo2Val đều có giá trị mặc định phòng vệ (37.0°C và 98%).
Bất thường Loại 3 (du - Đã khai báo và gán giá trị nhưng không được sử dụng / Biến chết):
Đánh giá: KHÔNG CÓ. Mọi biến được định nghĩa ở 1, 4, 7, 10, 14, 15, 18a/18b đều được truyền vào đối tượng newConsultation tại 19 và trả về ở 22.

#### 1.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi newConsultation


#### 1.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| payload | 0 | 1 | 0 -> 1 | Bóc tách an toàn các trường tham số từ payload. |
| vitals | 1 | 4, 7, 10, 14 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> 14 | Chuyển hóa dữ liệu sinh hiệu sang temp, spo2Val và finalVitals. |
| temp | 7 | 13 | 7 -> 8 -> 10 -> 11 -> 13 | Biến temp được đóng gói vào defaultVitals. |
| spo2Val | 10 | 13 | 10 -> 11 -> 13 | Biến spo2Val được đóng gói vào defaultVitals. |
| finalVitals | 14 | 19 | 14 -> 15 -> 16 -> 17 -> 18a -> 19 | Gán đối tượng finalVitals vào newConsultation.vitals. |
| patient_code | 1 | 16, 19 | 1 -> 2 -> 4 -> ... -> 16 -> 19 | Giá trị patient_code được bảo toàn xuyên suốt đến khi lưu bệnh án. |
| patientStatus | 18a | 19 | 18a -> 19 | Trạng thái ĐÃ_KHÁM được đưa vào newConsultation. |
| patientStatus | 18b | 19 | 18b -> 19 | Trạng thái CHỜ_KHÁM được đưa vào newConsultation. |
| newConsultation | 19 | 20, 21, 22 | 19 -> 20 -> 21 -> 22 | Đối tượng newConsultation được lưu DB, bắn Event và trả về. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_CUSE_01 | vitals (1->4,7,10,14), temp (7->13), spo2Val (10->13), finalVitals (14->19), patientStatus (18a->19), newConsultation (19->20,21,22) | { patient_code: "BN000001", symptoms: "Đau đầu âm ỉ", icd10_code: "G44.2", vitals: { blood_pressure: "125/85", temperature: 36.8, spo2: 98 } } | Bệnh án lưu thành công:<br> - vitals.temp = 36.8<br> - vitals.spo2 = 98<br> - patient_status = "ĐÃ_KHÁM"<br> - status = "COMPLETED" |
| TC_CUSE_02 | patientStatus (18b->19), newConsultation (19->22), fallback vitals (13->14) | { patient_code: "BN_NEW", symptoms: "Khám thể lực", icd10_code: "Z00" } (vitals = null, chưa có trong DB) | Bệnh án lưu thành công với fallback:<br> - vitals.blood_pressure = "120/80"<br> - patient_status = "CHỜ_KHÁM" |
| TC_CUSE_03 | doctor_notes, treatment_plan, patient_code (1->16,19) | { patient_code: "BN000002", symptoms: "Viêm phế quản", icd10_code: "J20", doctor_notes: "Kê đơn ngoại trú", treatment_plan: "Uống thuốc 5 ngày" } | Bệnh án lưu đầy đủ ghi chú bác sĩ và phác đồ điều trị |


#### 1.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| patient_code | 1 | (2, 3) | 1 -> 2 -> 3 | !patient_code nhận giá trị True. |
| patient_code | 1 | (2, 4) | 1 -> 2 -> 4 | !patient_code nhận giá trị False (hợp lệ). |
| symptoms | 1 | (2, 3) | 1 -> 2 -> 3 | !symptoms nhận giá trị True. |
| symptoms | 1 | (2, 4) | 1 -> 2 -> 4 | !symptoms nhận giá trị False (hợp lệ). |
| icd10_code | 1 | (2, 3) | 1 -> 2 -> 3 | !icd10_code nhận giá trị True. |
| icd10_code | 1 | (2, 4) | 1 -> 2 -> 4 | !icd10_code nhận giá trị False (hợp lệ). |
| hasVitals, vitals | 1, 4 | (5, 6) | 1 -> 2 -> 4 -> 5 -> 6 | blood_pressure sai format nhận True. |
| hasVitals, vitals | 1, 4 | (5, 7) | 1 -> 2 -> 4 -> 5 -> 7 | blood_pressure đúng format nhận False. |
| temp | 7 | (8, 9) | 7 -> 8 -> 9 | temp < 34 \|\| temp > 43 nhận True. |
| temp | 7 | (8, 10) | 7 -> 8 -> 10 | 34 <= temp <= 43 nhận False (hợp lệ). |
| spo2Val | 10 | (11, 12) | 10 -> 11 -> 12 | spo2Val < 50 \|\| spo2Val > 100 nhận True. |
| spo2Val | 10 | (11, 13) | 10 -> 11 -> 13 | 50 <= spo2Val <= 100 nhận False (hợp lệ). |
| hasPatient | 17 | (17, 18a) | 17 -> 18a | hasPatient nhận True. |
| hasPatient | 17 | (17, 18b) | 17 -> 18b | hasPatient nhận False. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_PUSE_01 | patient_code trên (2, 3) | { patient_code: "", symptoms: "Đau đầu", icd10_code: "R51" } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_02 | symptoms trên (2, 3) | { patient_code: "BN01", symptoms: "", icd10_code: "R51" } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_03 | icd10_code trên (2, 3) | { patient_code: "BN01", symptoms: "Đau đầu", icd10_code: "" } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_04 | vitals, BP trên (5, 6) | { patient_code: "BN01", symptoms: "Khám", icd10_code: "Z00", vitals: { blood_pressure: "120-80" } } | Quăng lỗi: Huyết áp phải có định dạng chuẩn |
| TC_PUSE_05 | temp trên (8, 9) | { patient_code: "BN01", symptoms: "Sốt rét", icd10_code: "B50", vitals: { temperature: 32.0 } } | Quăng lỗi: Thân nhiệt không hợp lệ |
| TC_PUSE_06 | spo2Val trên (11, 12) | { patient_code: "BN01", symptoms: "Khó thở", icd10_code: "R06", vitals: { spo2: 45 } } | Quăng lỗi: Chỉ số SpO2 không hợp lệ |
| TC_PUSE_07 | hasPatient trên (17, 18a) kèm các cạnh hợp lệ | { patient_code: "BN000001", symptoms: "Khám tổng quát", icd10_code: "Z00.0", vitals: { blood_pressure: "120/80", temperature: 37, spo2: 98 } } | Tạo bệnh án thành công, patient_status = "ĐÃ_KHÁM" |
| TC_PUSE_08 | hasPatient trên (17, 18b) kèm các cạnh hợp lệ | { patient_code: "BN_UNKNOWN", symptoms: "Khám ngoài", icd10_code: "Z00.0" } | Tạo bệnh án thành công, patient_status = "CHỜ_KHÁM" |



### 4. Kiểm thử đơn vị


> **3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: CẬP NHẬT BỆNH ÁN & CHẨN ĐOÁN (UT01 – UT15)**



#### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

## Chức năng 2: Chỉ định dịch vụ cận lâm sàng

### 1. Đặc tả


#### 2.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-DOC-13 |
| --- | --- |
| Tên Use Case (Use Case Name) | Chỉ định dịch vụ cận lâm sàng |
| Người thực hiện & Ngày tạo | Ngô Tuấn Anh — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Bác sĩ |
| Điều kiện tiên quyết (Pre-conditions) | Hồ sơ bệnh án điện tử đang mở và ca khám chưa bị kết thúc. |
| Điều kiện sau thành công (Post-conditions) | Phiếu chỉ định PCLS được khởi tạo thành công, tự động chuyển thông tin sang quầy Thu ngân để thu phí và sang phòng máy cận lâm sàng để thực hiện; lượt khám chuyển sang trạng thái "Chờ kết quả". |
| Kích hoạt (Trigger) | Bác sĩ nhấn nút "Chỉ định dịch vụ cận lâm sàng" trên màn hình bệnh án. |


#### 2.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường (Field Name) | Tên hiển thị & Điều khiển (UI Control) | Kiểu dữ liệu | Bắt buộc | Các ràng buộc(Validation Rules & Constraints) | Thông báo lỗi (Error Message) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | cls_service_ids | Danh sách dịch vụ cận lâm sàng [Checkbox List] | Array (String) | Có | - Bắt buộc chọn ít nhất 1 dịch vụ (Xét nghiệm, X-quang, Siêu âm...) từ danh mục dịch vụ đang hoạt động. | "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng." |
| 2 | cls_clinical_instruction | Lời dặn / Ghi chú PCLS [Text Area] | String | - Có nếu có dặn dò đặc biệt (VD: Chụp tư thế đứng...).   <br>- Không  với xét nghiệm thường. | - Tối đa 500 ký tự.  <br>- Dùng truyền đạt chú ý chuyên môn cho Kỹ thuật viên cận lâm sàng. | "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự)." |


#### 2.3. Dữ liệu đầu ra (Outputs)

Service Order Created: Phiếu chỉ định cận lâm sàng (PCLS) được tạo thành công với mã phiếu duy nhất.
Billing Queue Sync: Thông tin dịch vụ chỉ định được chuyển tự động sang danh sách chờ thu tiền của phân hệ thu ngân.
EMR Status Transition: Lượt khám của bệnh nhân chuyển sang trạng thái “Chờ kết quả” và đưa vào danh sách theo dõi trên màn hình bác sĩ.

#### 2.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Bác sĩ chọn chức năng "Chỉ định cận lâm sàng" trên giao diện bệnh án.**
- **Bước 2: Hệ thống hiển thị bảng danh mục các dịch vụ cận lâm sàng hiện có (Xét nghiệm, X-quang, Siêu âm...).**
- **Bước 3: Bác sĩ tìm kiếm và tích chọn các dịch vụ cần thực hiện.**
- **Bước 4: Bác sĩ nhập lời dặn hoặc ghi chú chuyên môn cho kỹ thuật viên (nếu có).**
- **Bước 5: Bác sĩ nhấn nút "Lưu chỉ định".**
- **Bước 6: Hệ thống lưu phiếu chỉ định và đồng bộ dữ liệu sang phân hệ thu ngân để chờ người bệnh đóng tiền.**
- **Bước 7: Hệ thống cập nhật danh sách dịch vụ đã chỉ định lên màn hình bệnh án ở trạng thái “Chờ kết quả”.**
- **Bước 8: Hệ thống giải phóng giao diện buồng khám, đưa bệnh nhân này vào danh sách “Chờ kết quả” để Bác sĩ tiếp tục gọi người tiếp theo. Kết thúc Use Case.**

#### 2.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã rẽ nhánh [A13.1] (Tự động nhận thông báo khi có kết quả PCLS):**
Sau khi Kỹ thuật viên phòng cận lâm sàng duyệt và trả kết quả, màn hình bác sĩ tự động hiển thị thông báo tin nhắn/chuông báo có kết quả mới.
Bác sĩ bấm vào thông báo để xem trực tiếp các chỉ số xét nghiệm và tệp hình ảnh chụp chiếu ngay trên bệnh án.
- **Mã ngoại lệ [E13.1] (Chưa chọn dịch vụ cận lâm sàng):**
Tại Bước 5, Bác sĩ bấm "Lưu chỉ định" nhưng chưa tích chọn bất kỳ dịch vụ nào.
Hệ thống hiển thị cảnh báo: "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng".


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Chỉ định dịch vụ cận lâm sàng" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định để kiểm soát chặt chẽ việc chọn dịch vụ y tế và giới hạn độ dài của ghi chú chuyên môn cho kỹ thuật viên.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên**

Tập trung kiểm tra số lượng dịch vụ được chọn và độ dài trường ghi chú.
Trường cls_service_ids (Danh sách dịch vụ cận lâm sàng):
Miền hợp lệ: Chọn tối thiểu từ 01 dịch vụ trở lên từ danh mục đang hoạt động. Giá trị biên: Chọn đúng 1 dịch vụ (Min hợp lệ).
Miền không hợp lệ: Không chọn dịch vụ nào (0 dịch vụ - Bỏ trống).
Trường cls_clinical_instruction (Lời dặn / Ghi chú PCLS):
Miền hợp lệ: Từ 0 đến 500 ký tự (cho phép để trống đối với xét nghiệm thường). Giá trị biên: 0 ký tự (Min), 500 ký tự (Max).
Miền không hợp lệ: Vượt quá 500 ký tự. Giá trị biên: 501 ký tự (Max+).

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Bác sĩ đã tích chọn ít nhất 01 dịch vụ cận lâm sàng (cls_service_ids) chưa?
C2: Trường lời dặn/ghi chú (cls_clinical_instruction) có nằm trong giới hạn cho phép (  ký tự) không?
Các hành động (A):
A1: Chặn thao tác lưu, hiển thị cảnh báo: "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng" (Mã ngoại lệ E13.1).
A2: Chặn thao tác lưu, hiển thị cảnh báo: "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự)".
A3: Khởi tạo phiếu chỉ định PCLS thành công với mã duy nhất, tự động đồng bộ sang phân hệ thu ngân, chuyển trạng thái lượt khám sang "Chờ kết quả", đưa bệnh nhân vào danh sách theo dõi và giải phóng giao diện buồng khám cho bác sĩ.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Tích chọn  dịch vụ cận lâm sàng? | F | T | T |
| --- | --- | --- | --- | --- |
|  | C2: Ghi chú  ký tự? | - | F | T |
| Hành động (A) | A1: Báo lỗi chưa chọn dịch vụ (E13.1) | X |  |  |
|  | A2: Báo lỗi ghi chú vượt quá 500 ký tự |  | X |  |
|  | A3: Tạo phiếu PCLS, đồng bộ thu ngân, chuyển trạng thái |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước kiểm tra trước đó).

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F13_01 | Bảng quyết định (Q1) / Ngoại lệ E13.1 | Bác sĩ mở danh mục, không tích chọn bất kỳ dịch vụ nào (0 dịch vụ) và bấm nút "Lưu chỉ định". | Hệ thống chặn thao tác, hiển thị cảnh báo: "Vui lòng chọn ít nhất một dịch vụ cận lâm sàng". |
| TC_F13_02 | Giá trị biên (Q2) | Chọn 1 dịch vụ hợp lệ. Nhập cls_clinical_instruction dài đúng 501 ký tự (Max+). Bấm "Lưu chỉ định". | Hệ thống chặn thao tác, hiển thị cảnh báo: "Ghi chú dặn dò vượt quá độ dài cho phép (tối đa 500 ký tự)". |
| TC_F13_03 | Giá trị biên / BQ (Q3) | Chọn đúng 1 dịch vụ (Min hợp lệ). Để trống ghi chú (cls_clinical_instruction = 0 ký tự). Bấm "Lưu chỉ định". | Tạo phiếu chỉ định PCLS thành công, đồng bộ sang danh sách chờ thu tiền của Thu ngân, đổi trạng thái lượt khám sang "Chờ kết quả" và giải phóng buồng khám. |
| TC_F13_04 | Giá trị biên / BQ (Q3) | Chọn nhiều dịch vụ (Xét nghiệm, X-quang, Siêu âm). Nhập ghi chú dài đúng 500 ký tự (Max hợp lệ). Bấm "Lưu chỉ định". | Tạo phiếu chỉ định PCLS thành công với đầy đủ các dịch vụ, đồng bộ dữ liệu sang phân hệ Thu ngân, cập nhật trạng thái "Chờ kết quả" trên màn hình bác sĩ. |



### 3. Kiểm thử hộp trắng


#### 2.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
function executeCreateLabOrder(payload) {
 1.  const { consultation_id, patient_code, patient_name, doctor = "BS. Lê Hoàng Nam", service_code, clinical_notes = "" } = payload || {};
 2.  if (!patient_code || !service_code)
 3.  	throw new Error("Thiếu thông tin bắt buộc (mã bệnh nhân, mã dịch vụ CLS)");
 4.  const service = labRepository.findServiceByCode(service_code);
 5.  if (!service)
 6.  	throw new Error("Mã dịch vụ cận lâm sàng không tồn tại trong danh mục");
 7.  const notesLength = String(clinical_notes).trim().length;
 8.  if (notesLength > 500)
 9.  	throw new Error("Ghi chú chỉ định vượt quá độ dài cho phép (tối đa 500 ký tự)");
 10. const servicePrice = Number(service.price) || 0;
 11. if (servicePrice <= 0)
 12. 	throw new Error("Giá dịch vụ cận lâm sàng phải lớn hơn 0");
 13. const nextId = labRepository.getNextId();
 14. const orderCode = `CLS${String(nextId).padStart(6, "0")}`;
 15. const newOrder = { id: nextId, order_code: orderCode, consultation_id: consultation_id || nextId, patient_code, patient_name: patient_name || "Bệnh nhân", doctor, service_code: service.service_code, service_name: service.service_name, price: servicePrice, status: "PENDING", clinical_notes };
 16. labRepository.createOrder(newOrder);
 17. const patient = patientRepository.findByIdOrCode(patient_code);
 18. const hasPatient = Boolean(patient);
 19. const encounterStatus = hasPatient ? "CHỜ_KẾT_QUẢ_CLS" : "CHỜ_KHÁM";
 20. const nextInvId = invoiceRepository.getNextId();
 21. const invoice = { id: nextInvId, invoice_code: `HD${String(nextInvId).padStart(6, "0")}`, patient_code, total_amount: servicePrice, patient_pay: servicePrice, status: "UNPAID", encounter_status: encounterStatus };
 22. return { newOrder, invoice };
 }
```


#### 2.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 2.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2


#### 2.2.2 Phân tích độ phức tạp cho C1/C2

Trên đồ thị C1/C2:
 - Số điểm quyết định P = 5 (tại các đỉnh 2, 5, 8, 11, 18).
 - Số đỉnh N = 21, số cạnh E = 25.
 - Công thức McCabe: V(G) = P + 1 = 5 + 1 = 6 (hoặc V(G) = E - N + 2 = 25 - 21 + 2 = 6).
Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 2.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 22 ít nhất một lần. Tập hợp các ca kiểm thử đạt 100% C1:
 - Cần kích hoạt 4 nhánh throw (câu lệnh 3, 6, 9, 12).
 - Cần đi qua nhánh chuyển trạng thái CHỜ_KẾT_QUẢ_CLS (câu lệnh 19a) và CHỜ_KHÁM (câu lệnh 19b) cùng toàn bộ khối xử lý thành công (câu lệnh 13-22).
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 | 1 -> 2 -> 3 | { patient_code: "BN01" } (thiếu service_code) | Lỗi: "Thiếu thông tin bắt buộc..." | 1, 2, 3 |
| 2 | TC_C1_02 | 1 -> 2 -> 4 -> 5 -> 6 | { patient_code: "BN01", service_code: "CLS_KHONG_TON_TAI" } | Lỗi: "Mã dịch vụ cận lâm sàng không tồn tại..." | 4, 5, 6 |
| 3 | TC_C1_03 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 | { patient_code: "BN01", service_code: "XQ01", clinical_notes: "A"*550 } | Lỗi: "Ghi chú chỉ định vượt quá độ dài cho phép..." | 7, 8, 9 |
| 4 | TC_C1_04 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 12 | { patient_code: "BN01", service_code: "CLS_MIEN_PHI" } (giá = 0) | Lỗi: "Giá dịch vụ cận lâm sàng phải lớn hơn 0" | 10, 11, 12 |
| 5 | TC_C1_05 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> ... -> 18 -> 19b -> 20 -> 21 -> 22 | { patient_code: "BN_UNKNOWN", service_code: "XQ01" } (chưa có trong DB) | Thành công: encounter_status = "CHỜ_KHÁM" | 13, 14, 15, 16, 17, 18, 19b, 20, 21, 22 |
| 6 | TC_C1_06 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 10 -> 11 -> 13 -> ... -> 18 -> 19a -> 20 -> 21 -> 22 | { patient_code: "BN000001", service_code: "XQ01", clinical_notes: "Chụp tư thế đứng" } (có trong DB) | Thành công: encounter_status = "CHỜ_KẾT_QUẢ_CLS" | 19a |

Tỷ lệ bao phủ C1: 22/22 câu lệnh = 100%.

#### 2.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 8, 11, 18 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !patient_code \|\| !service_code | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4-5) |
| Đỉnh 5 | !service | TC_C2_03 (Nhảy sang Đỉnh 6) | TC_C2_04 (Đi tiếp Đỉnh 7-8) |
| Đỉnh 8 | notesLength > 500 | TC_C2_05 (Nhảy sang Đỉnh 9) | TC_C2_06 (Đi tiếp Đỉnh 10-11) |
| Đỉnh 11 | servicePrice <= 0 | TC_C2_07 (Nhảy sang Đỉnh 12) | TC_C2_08 (Đi tiếp Đỉnh 13-17) |
| Đỉnh 18 | hasPatient (patient != null) | TC_C2_09 (Nhánh 19a: CHỜ_KẾT_QUẢ_CLS) | TC_C2_10 (Nhánh 19b: CHỜ_KHÁM) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { patient_code: "", service_code: "XQ01" } | Lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_C2_02 | Đỉnh 2, 5, 8, 11, 18 (False) | { patient_code: "BN_UNKNOWN", service_code: "XQ01" } | Tạo phiếu CLS thành công, encounter_status = "CHỜ_KHÁM" |
| TC_C2_03 | Đỉnh 5 (True) | { patient_code: "BN01", service_code: "SAI_MA" } | Lỗi HTTP 400: Mã dịch vụ CLS không tồn tại |
| TC_C2_05 | Đỉnh 8 (True) | { patient_code: "BN01", service_code: "XQ01", clinical_notes: "A"*550 } | Lỗi HTTP 400: Ghi chú vượt quá 500 ký tự |
| TC_C2_07 | Đỉnh 11 (True) | { patient_code: "BN01", service_code: "CLS_0VND" } | Lỗi HTTP 400: Giá dịch vụ cận lâm sàng phải lớn hơn 0 |
| TC_C2_09 | Đỉnh 18 (True) | { patient_code: "BN000001", service_code: "XQ01", clinical_notes: "Chụp X-quang" } | Tạo phiếu CLS thành công, encounter_status = "CHỜ_KẾT_QUẢ_CLS" |

Tỷ lệ bao phủ C2: 10/10 nhánh quyết định = 100%.

#### 2.2.5 Đồ thị dòng điều khiển cho Độ đo C3


#### 2.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | !patient_code | patient_code rỗng hoặc undefined | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 2 | !service_code | service_code rỗng hoặc null | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 5 | !service | service_code không khớp dịch vụ trong DB | True / False | TC_C3_03 (True) / TC_C3_04 (False) |
| 8 | notesLength > 500 | Độ dài ghi chú 501 ký tự | True / False | TC_C3_04 (True) / TC_C3_05 (False) |
| 11 | servicePrice <= 0 | service.price = 0 hoặc âm | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 18 | hasPatient | Bệnh nhân có trong CSDL hay không | True / False | TC_C3_06 (True) / TC_C3_07 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | !patient_code = True | { patient_code: "", service_code: "XQ01" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_02 | !service_code = True | { patient_code: "BN01", service_code: "" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_03 | !service = True | { patient_code: "BN01", service_code: "NOT_FOUND" } | Quăng lỗi: Mã dịch vụ CLS không tồn tại |
| TC_C3_04 | notesLength > 500 = True | { patient_code: "BN01", service_code: "XQ01", clinical_notes: "B"*501 } | Quăng lỗi: Ghi chú vượt quá 500 ký tự |
| TC_C3_05 | servicePrice <= 0 = True | { patient_code: "BN01", service_code: "CLS_ZERO" } | Quăng lỗi: Giá dịch vụ cận lâm sàng phải lớn hơn 0 |
| TC_C3_06 | hasPatient = True | { patient_code: "BN000001", service_code: "XQ01" } | Lưu thành công, encounter_status = "CHỜ_KẾT_QUẢ_CLS" |
| TC_C3_07 | hasPatient = False | { patient_code: "BN_UNKNOWN", service_code: "XQ01" } | Lưu thành công, encounter_status = "CHỜ_KHÁM" |


#### 2.3. KIỂM THỬ DÒNG DỮ LIỆU


#### 2.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu học tập kiểm thử phần mềm: Đồ thị dòng dữ liệu của một đơn vị chương trình là một đồ thị có hướng G = (V, E), trong đó:
 - Tập đỉnh (V): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. Đồ thị G có hai đỉnh đặc biệt là đỉnh bắt đầu (tương ứng với lệnh def của các biến tham số) và đỉnh kết thúc đơn vị chương trình.
 - Tập cạnh (E): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ nhánh (p-use) của các biến.

#### 2.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh i | def(i) | c-use(i) |
| --- | --- | --- |
| 1 | {consultation_id, patient_code, patient_name, doctor, service_code, clinical_notes} | {} |
| 2, 3 | {} | {} |
| 4 | {service} | {service_code} |
| 5, 6 | {} | {} |
| 7 | {notesLength} | {clinical_notes} |
| 8, 9 | {} | {} |
| 10 | {servicePrice} | {service} |
| 11, 12 | {} | {} |
| 13 | {nextId} | {} |
| 14 | {orderCode} | {nextId} |
| 15 | {newOrder} | {nextId, orderCode, consultation_id, patient_code, patient_name, doctor, service, servicePrice, clinical_notes} |
| 16 | {} | {newOrder} |
| 17 | {patient} | {patient_code} |
| 18 | {hasPatient} | {patient} |
| 19a, 19b | {encounterStatus} | {} |
| 20 | {nextInvId} | {} |
| 21 | {invoice} | {nextInvId, patient_code, servicePrice, encounterStatus} |
| 22 | {} | {newOrder, invoice} |


#### 2.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| Cạnh (i, j) | Điều kiện tại cạnh | p-use(i, j) |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!patient_code \|\| !service_code) | {patient_code, service_code} |
| (2, 4) | ~(!patient_code \|\| !service_code) | {patient_code, service_code} |
| (4, 5) | True | {} |
| (5, 6) | (!service) | {service} |
| (5, 7) | ~(!service) | {service} |
| (7, 8) | True | {} |
| (8, 9) | (notesLength > 500) | {notesLength} |
| (8, 10) | ~(notesLength > 500) | {notesLength} |
| (10, 11) | True | {} |
| (11, 12) | (servicePrice <= 0) | {servicePrice} |
| (11, 13) | ~(servicePrice <= 0) | {servicePrice} |
| (13, 16) | True | {} |
| (16, 17) | True | {} |
| (17, 18) | True | {} |
| (18, 19a) | hasPatient | {hasPatient} |
| (18, 19b) | ~hasPatient | {hasPatient} |
| (19a, 20) | True | {} |
| (19b, 20) | True | {} |
| (20, 21) | True | {} |
| (21, 22) | True | {} |


#### 2.3.4 Đồ thị dòng dữ liệu


#### 2.3.5 Bảng tổng hợp chi tiết Def-Use theo biến

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| payload | Tham số (0) | 1 (Destructuring các trường) | - |
| patient_code | 1 | 15 (newOrder), 17 (tìm BN), 21 (invoice) | (2, 3), (2, 4) |
| service_code | 1 | 4 (findServiceByCode) | (2, 3), (2, 4) |
| service | 4 | 10 (servicePrice), 15 (newOrder) | (5, 6), (5, 7) |
| clinical_notes | 1 | 7 (tính độ dài), 15 (gán newOrder) | - |
| notesLength | 7 | - | (8, 9), (8, 10) |
| servicePrice | 10 | 15 (newOrder.price), 21 (invoice.total_amount) | (11, 12), (11, 13) |
| nextId | 13 | 14 (orderCode), 15 (id) | - |
| orderCode | 14 | 15 (newOrder.order_code) | - |
| newOrder | 15 | 16 (createOrder), 22 (return) | - |
| patient | 17 | 18 (hasPatient = Boolean(patient)) | - |
| hasPatient | 18 | - | (18, 19a), (18, 19b) |
| encounterStatus | 19a, 19b | 21 (invoice.encounter_status) | - |
| nextInvId | 20 | 21 (id, invoice_code) | - |
| invoice | 21 | 22 (return) | - |


#### 2.3.6 Phân tích bất thường dòng dữ liệu

Bất thường Loại 1 (dd - Gán giá trị rồi lại gán tiếp giá trị ngay sau đó mà không sử dụng):
Đánh giá: KHÔNG CÓ. Tất cả các biến trung gian (service, notesLength, servicePrice, nextId, orderCode, newOrder, hasPatient, encounterStatus, invoice) đều được khai báo dạng const và khởi tạo duy nhất 1 lần.
Bất thường Loại 2 (ur - Chưa gán giá trị nhưng đã được sử dụng):
Phân tích rủi ro: Nếu payload = undefined hoặc service = null, đọc thuộc tính sẽ gây crash TypeError.
 Phòng vệ mã nguồn: Đoạn code đã dùng cơ chế fallback payload || {}, doctor = "BS. Lê Hoàng Nam", clinical_notes = "". Nhánh kiểm tra tại (5, 6) chặn hoàn toàn mã DV không hợp lệ.
Bất thường Loại 3 (du - Đã khai báo và gán giá trị nhưng không được sử dụng / Biến chết):
Đánh giá: KHÔNG CÓ. Mọi biến được định nghĩa ở 1, 4, 7, 10, 13, 14, 15, 17, 18, 19, 20, 21 đều được sử dụng trong luồng nghiệp vụ tạo phiếu hoặc sinh hóa đơn.

#### 2.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi newOrder

Chuỗi biến đổi trạng thái là u -> d -> r -> r. Biến không bao giờ rơi vào trạng thái lỗi a (Anomaly).

#### 2.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| payload | 0 | 1 | 0 -> 1 | Bóc tách các trường từ payload. |
| service_code | 1 | 4 | 1 -> 2 -> 4 | Truy vấn dịch vụ trong danh mục. |
| clinical_notes | 1 | 7, 15 | 1 -> 2 -> 4 -> ... -> 7 -> ... -> 15 | Kiểm tra độ dài và lưu vào phiếu chỉ định. |
| service | 4 | 10, 15 | 4 -> 5 -> 7 -> ... -> 10 -> ... -> 15 | Lấy giá dịch vụ và thông tin chuyên môn. |
| servicePrice | 10 | 15, 21 | 10 -> 11 -> 13 -> 15 -> ... -> 21 | Gán giá tiền vào phiếu CLS và hóa đơn viện phí. |
| patient_code | 1 | 15, 17, 21 | 1 -> ... -> 15 -> ... -> 17 -> ... -> 21 | Bảo toàn mã bệnh nhân xuyên suốt luồng xử lý. |
| encounterStatus | 19a | 21 | 19a -> 20 -> 21 | Trạng thái CHỜ_KẾT_QUẢ_CLS được đưa vào hóa đơn. |
| encounterStatus | 19b | 21 | 19b -> 20 -> 21 | Trạng thái CHỜ_KHÁM được đưa vào hóa đơn. |
| newOrder | 15 | 16, 22 | 15 -> 16 -> ... -> 22 | Lưu phiếu vào CSDL và trả về kết quả. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_CUSE_01 | service (4->10,15), servicePrice (10->15,21), encounterStatus (19a->21), newOrder (15->16,22) | { patient_code: "BN000001", service_code: "XQ01", clinical_notes: "Chụp X-quang phổi" } | Phiếu CLS và hóa đơn tạo thành công:<br> - price = 150,000đ<br> - encounter_status = "CHỜ_KẾT_QUẢ_CLS" |
| TC_CUSE_02 | encounterStatus (19b->21), newOrder (15->22) | { patient_code: "BN_UNKNOWN", service_code: "XQ01" } | Phiếu CLS tạo thành công với bệnh nhân ngoài:<br> - encounter_status = "CHỜ_KHÁM" |
| TC_CUSE_03 | clinical_notes rỗng (1->7,15) | { patient_code: "BN000001", service_code: "SA01" } | Phiếu chỉ định siêu âm tạo thành công, ghi chú rỗng |


#### 2.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| patient_code | 1 | (2, 3) | 1 -> 2 -> 3 | !patient_code nhận giá trị True. |
| patient_code | 1 | (2, 4) | 1 -> 2 -> 4 | !patient_code nhận giá trị False (hợp lệ). |
| service_code | 1 | (2, 3) | 1 -> 2 -> 3 | !service_code nhận giá trị True. |
| service_code | 1 | (2, 4) | 1 -> 2 -> 4 | !service_code nhận giá trị False (hợp lệ). |
| service | 4 | (5, 6) | 4 -> 5 -> 6 | !service nhận giá trị True. |
| service | 4 | (5, 7) | 4 -> 5 -> 7 | !service nhận giá trị False (hợp lệ). |
| notesLength | 7 | (8, 9) | 7 -> 8 -> 9 | notesLength > 500 nhận True. |
| notesLength | 7 | (8, 10) | 7 -> 8 -> 10 | notesLength <= 500 nhận False (hợp lệ). |
| servicePrice | 10 | (11, 12) | 10 -> 11 -> 12 | servicePrice <= 0 nhận True. |
| servicePrice | 10 | (11, 13) | 10 -> 11 -> 13 | servicePrice > 0 nhận False (hợp lệ). |
| hasPatient | 18 | (18, 19a) | 18 -> 19a | hasPatient nhận True. |
| hasPatient | 18 | (18, 19b) | 18 -> 19b | hasPatient nhận False. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_PUSE_01 | patient_code trên (2, 3) | { patient_code: "", service_code: "XQ01" } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_02 | service_code trên (2, 3) | { patient_code: "BN01", service_code: "" } | Quăng lỗi HTTP 400: Thiếu thông tin bắt buộc |
| TC_PUSE_03 | service trên (5, 6) | { patient_code: "BN01", service_code: "NOT_FOUND" } | Quăng lỗi HTTP 400: Mã dịch vụ CLS không tồn tại |
| TC_PUSE_04 | notesLength trên (8, 9) | { patient_code: "BN01", service_code: "XQ01", clinical_notes: "C"*520 } | Quăng lỗi HTTP 400: Ghi chú vượt quá 500 ký tự |
| TC_PUSE_05 | servicePrice trên (11, 12) | { patient_code: "BN01", service_code: "CLS_0VND" } | Quăng lỗi HTTP 400: Giá dịch vụ cận lâm sàng phải lớn hơn 0 |
| TC_PUSE_06 | hasPatient trên (18, 19a) kèm các cạnh hợp lệ | { patient_code: "BN000001", service_code: "XQ01" } | Tạo phiếu CLS thành công, encounter_status = "CHỜ_KẾT_QUẢ_CLS" |
| TC_PUSE_07 | hasPatient trên (18, 19b) kèm các cạnh hợp lệ | { patient_code: "BN_UNKNOWN", service_code: "XQ01" } | Tạo phiếu CLS thành công, encounter_status = "CHỜ_KHÁM" |



### 4. Kiểm thử đơn vị


> **4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: CHỈ ĐỊNH DỊCH VỤ CẬN LÂM SÀNG (UT16 – UT27)**



#### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

## Chức năng 3: Kê đơn thuốc

### 1. Đặc tả


#### 3.1. Mô tả tổng quan Use Case

| Mã Use Case (Use Case ID) | UC-DOC-14 |
| --- | --- |
| Tên Use Case (Use Case Name) | Kê đơn thuốc |
| Người thực hiện & Ngày tạo | Ngô Tuấn Anh — 19/09/2026 |
| Tác nhân kích hoạt (Actor) | Bác sĩ |
| Điều kiện tiên quyết (Pre-conditions) | Hồ sơ bệnh án đã có chẩn đoán bệnh chính (mã ICD-10) của ca khám. |
| Điều kiện sau thành công (Post-conditions) | Đơn thuốc điện tử được khởi tạo, ký duyệt và chuyển tự động dữ liệu sang phân hệ Thu ngân/Kho dược để cấp phát. |
| Kích hoạt (Trigger) | Bác sĩ chọn chức năng "Kê đơn thuốc" trên giao diện làm việc bệnh án. |


#### 3.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào (Input Data Requirements)

| STT | Tên trường (Field Name) | Tên hiển thị & Điều khiển (UI Control) | Kiểu dữ liệu | Bắt buộc | Các ràng buộc(Validation Rules & Constraints) | Thông báo lỗi (Error Message) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | drug_id | Tên thuốc / Hoạt chất [Autocomplete Input] | String | Có | - Phải thuộc danh mục thuốc hiện có trong kho bệnh viện <br>- Số lượng tồn kho khả dụng phải > 0. | "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương." |
| 2 | quantity | Số lượng cấp [Numeric Input] | Integer | Có | - Là số nguyên dương (> 0). <br>- Phải <= Số lượng tồn kho khả dụng tại thời điểm kê. | "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho." |
| 3 | usage_instruction | Liều dùng & Cách dùng [Dropdown / Text Input] | String | Có | - Bắt buộc nhập đầy đủ: Số lần uống/ngày, số lượng/lần, thời điểm uống (trước/sau ăn).<br><br>- Tối đa 250 ký tự. | "Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc." |
| 4 | interaction_override_confirm | Xác nhận đè cảnh báo tương tác nhẹ [Checkbox / Confirmation Modal] | Boolean | - Có nếu hệ thống phát hiện cặp thuốc có tương tác mức nhẹ (Cảnh báo vàng).<br>- Không nếu đơn thuốc không có tương tác hoặc vướng chống chỉ định (Cảnh báo đỏ). | - Bác sĩ phải tích chọn/xác nhận ghi đè rủi ro chuyên môn để tiếp tục kê.<br><br>- Bị cấm hoàn toàn nếu thuộc danh mục chống chỉ định nghiêm trọng. | "Không thể kê đơn chứa các loại thuốc bị CHỐNG CHỈ ĐỊNH tuyệt đối." |


#### 3.3. Dữ liệu đầu ra (Outputs)

Prescription Created: Đơn thuốc điện tử hoàn chỉnh được tạo thành công kèm chữ ký điện tử của bác sĩ.
Pharmacy Queue Sync: Dữ liệu đơn thuốc được chuyển tự động sang quầy thu ngân/cấp phát thuốc của kho dược.
Interaction Audit Log: Ghi nhận lịch sử kiểm tra tương tác thuốc và phản ứng dị ứng vào CSDL.

#### 3.4. Luồng sự kiện chính (Main Flow / Happy Path)

- **Bước 1: Bác sĩ chọn chức năng "Kê đơn thuốc" trên màn hình bệnh án.**
- **Bước 2: Bác sĩ tìm kiếm và chọn thuốc từ danh mục thuốc sẵn có trong bệnh viện.**
- **Bước 3: Hệ thống hiển thị số lượng tồn kho khả dụng của từng loại thuốc tại quầy dược để Bác sĩ tham khảo.**
- **Bước 4: Bác sĩ nhập số lượng cấp, số lần uống/ngày, số lượng mỗi lần và lời dặn dùng thuốc.**
- **Bước 5: Hệ thống tự động chạy thuật toán kiểm tra tương tác giữa các loại thuốc trong đơn và tiền sử dị ứng của người bệnh.**
- **Bước 6: Bác sĩ nhấn nút "Ký và lưu đơn thuốc".**
- **Bước 7: Hệ thống ghi nhận đơn thuốc điện tử và đồng bộ dữ liệu sang bộ phận Dược. Kết thúc Use Case.**

#### 3.5. Luồng sự kiện ngoại lệ & Luồng rẽ nhánh (Alternative & Exception Flows)

- **Mã rẽ nhánh [A14.1] (Cảnh báo tương tác thuốc mức độ nhẹ):**
Tại Bước 5, hệ thống phát hiện cặp thuốc có tương tác mức độ nhẹ (Cảnh báo màu vàng).
Bác sĩ cân nhắc chuyên môn và chọn "Đồng ý tiếp tục kê" để xác nhận giữ nguyên đơn thuốc.
- **Mã ngoại lệ [E14.1] (Thuốc chọn đã hết trong kho):**
Tại Bước 2, Bác sĩ chọn một loại thuốc có số lượng tồn kho khả dụng bằng $0$.
Hệ thống báo lỗi: "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương".
- **Mã ngoại lệ [E14.2] (Tương tác thuốc nghiêm trọng - CHỐNG CHỈ ĐỊNH):**
Tại Bước 5, hệ thống phát hiện cặp thuốc kỵ nhau hoàn toàn gây nguy hiểm tính mạng (Cảnh báo màu đỏ).
Hệ thống hiển thị hộp thoại cảnh báo nghiêm trọng và khóa nút Lưu, bắt buộc Bác sĩ phải xóa 1 trong 2 loại thuốc khỏi đơn mới được đi tiếp.


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Kê đơn thuốc" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm đảm bảo kiểm soát chặt chẽ số lượng tồn kho của thuốc, tính hợp lệ của liều dùng và hệ thống cảnh báo tương tác thuốc/chống chỉ định.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên**

Tập trung kiểm tra tính hợp lệ của số lượng thuốc cấp và độ dài hướng dẫn sử dụng.
Trường quantity (Số lượng cấp):
Miền hợp lệ: Là số nguyên dương ( ) và nhỏ hơn hoặc bằng số lượng tồn kho khả dụng tại thời điểm kê.
Giá trị biên: 1 (Min hợp lệ), Đúng bằng số lượng tồn kho (Max hợp lệ).
Miền không hợp lệ: Số lượng  hoặc lớn hơn tồn kho khả dụng.
Giá trị biên: Tồn kho + 1 (Max+ không hợp lệ).
Trường usage_instruction (Liều dùng & Cách dùng):
Miền hợp lệ: Chuỗi ký tự từ 1 đến 250 ký tự, nhập đầy đủ thông tin.
Giá trị biên: 1 ký tự (Min), 250 ký tự (Max).
Miền không hợp lệ: Bỏ trống hoặc vượt quá 250 ký tự.
Giá trị biên: 251 ký tự (Max+).

**b) Kỹ thuật Bảng quyết định (Decision Table) cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện (Conditions) và hành động (Actions)**
Các điều kiện (C):
C1: Thuốc được chọn (drug_id) có tồn tại trong kho và số lượng tồn kho khả dụng  không?
C2: quantity nhập vào có là số nguyên dương và  tồn kho không?
C3: usage_instruction có được nhập đầy đủ và  ký tự không?
C4: Hệ thống phát hiện tương tác thuốc nghiêm trọng (Chống chỉ định tuyệt đối - Cảnh báo đỏ) không?
C5: Hệ thống phát hiện tương tác mức độ nhẹ (Cảnh báo vàng) và bác sĩ có chọn xác nhận ghi đè (interaction_override_confirm) không?
Các hành động (A):
A1: Hệ thống báo lỗi: "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương" (Mã ngoại lệ E14.1).
A2: Hệ thống báo lỗi: "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho".
A3: Hệ thống báo lỗi: "Vui lòng nhập chi tiết hướng dẫn liều dùng và cách dùng thuốc" hoặc quá giới hạn 250 ký tự.
A4: Hệ thống hiển thị hộp thoại cảnh báo nghiêm trọng, khóa nút Lưu, bắt buộc xóa thuốc (Mã ngoại lệ E14.2).
A5: Khởi tạo đơn thuốc điện tử hoàn chỉnh, ký duyệt, đồng bộ sang phân hệ Thu ngân/Kho dược và ghi nhận audit log.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Tồn kho thuốc ? | F | T | T | T | T | T |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | C2: quantity hợp lệ (  tồn kho)? | - | F | T | T | T | T |
|  | C3: usage_instruction hợp lệ (  ký tự)? | - | - | F | T | T | T |
|  | C4: Có tương tác chống chỉ định nghiêm trọng (Đỏ)? | - | - | - | T | F | F |
|  | C5: Tương tác nhẹ (Vàng) kèm xác nhận ghi đè? | - | - | - | - | F (Không đồng ý) | T (Đồng ý kê) |
| Hành động (A) | A1: Báo lỗi hết thuốc trong kho (E14.1) | X |  |  |  |  |  |
|  | A2: Báo lỗi số lượng cấp không hợp lệ |  | X |  |  |  |  |
|  | A3: Báo lỗi hướng dẫn liều dùng |  |  | X |  |  |  |
|  | A4: Khóa nút Lưu, cảnh báo chống chỉ định (E14.2) |  |  |  | X |  |  |
|  | A5: Dừng kê đơn do từ chối cảnh báo nhẹ |  |  |  |  | X |  |
|  | A6: Tạo đơn thuốc điện tử thành công, đồng bộ Dược |  |  |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước kiểm tra trước đó).

**c) Danh sách ca kiểm thử cụ thể (Test Cases)**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F14_01 | Bảng quyết định (Q1) / Ngoại lệ E14.1 | Bác sĩ tìm kiếm và chọn một loại thuốc có số lượng tồn kho khả dụng bằng 0. | Hệ thống hiển thị thông báo lỗi: "Thuốc này hiện đã hết trong kho. Vui lòng chọn thuốc khác tương đương". |
| TC_F14_02 | Giá trị biên (Q2) | Thuốc có tồn kho = 50. Nhập quantity = 0 hoặc số âm (VD: -2). Bấm Lưu. | Hệ thống chặn lưu, hiển thị thông báo: "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho". |
| TC_F14_03 | Giá trị biên (Q2) | Thuốc có tồn kho = 50. Nhập quantity = 51 (Max+). Bấm Lưu. | Hệ thống chặn lưu, hiển thị thông báo: "Số lượng cấp phải là số nguyên dương và không vượt quá số lượng tồn kho". |
| TC_F14_04 | Giá trị biên (Q3) | Nhập usage_instruction dài đúng 251 ký tự (Max+). Bấm Lưu. | Hệ thống chặn lưu, hiển thị thông báo yêu cầu nhập chi tiết liều dùng nằm trong giới hạn cho phép. |
| TC_F14_05 | Bảng quyết định (Q4) / Ngoại lệ E14.2 | Bác sĩ kê đơn chứa cặp thuốc có tương tác chống chỉ định tuyệt đối (Cảnh báo đỏ). | Hệ thống hiển thị hộp thoại cảnh báo nghiêm trọng, khóa hoàn toàn nút Lưu, bắt buộc bác sĩ phải xóa 1 trong 2 loại thuốc. |
| TC_F14_06 | Bảng quyết định (Q5) / Rẽ nhánh A14.1 | Bác sĩ kê đơn chứa cặp thuốc có tương tác mức độ nhẹ (Cảnh báo vàng). Bác sĩ cân nhắc và không chọn xác nhận ghi đè. | Hệ thống yêu cầu xác nhận hoặc không cho phép tiếp tục lưu đơn thuốc. |
| TC_F14_07 | Bảng quyết định (Q6) / Rẽ nhánh A14.1 | Bác sĩ kê đơn có tương tác nhẹ (Cảnh báo vàng), tích chọn "Đồng ý tiếp tục kê" (interaction_override_confirm = True). | Hệ thống ghi nhận xác nhận, cho phép lưu và khởi tạo đơn thuốc điện tử, đồng bộ sang phân hệ Dược. |
| TC_F14_08 | Giá trị biên / BQ (Q6) | Chọn thuốc có tồn kho = 100. Nhập quantity = 100 (Max hợp lệ). Nhập usage_instruction đúng 250 ký tự (Max). Không có tương tác. Bấm Ký và lưu. | Khởi tạo đơn thuốc điện tử thành công kèm chữ ký điện tử của bác sĩ, chuyển dữ liệu tự động sang quầy thu ngân/kho dược và ghi nhận audit log. |



### 3. Kiểm thử hộp trắng


#### 3.1. ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
function executeAddPrescription(idOrCode, items) {
 1.  const consultation = consultationRepository.findByIdOrCode(idOrCode);
 2.  if (!consultation)
 3.  	throw new Error("Không tìm thấy hồ sơ bệnh án");
 4.  const hasItems = Boolean(items && Array.isArray(items) && items.length > 0);
 5.  if (!hasItems)
 6.  	throw new Error("Đơn thuốc phải có ít nhất một loại thuốc");
 7.  const firstItem = items[0] || {};
 8.  const qty = Number(firstItem.quantity);
 9.  if (isNaN(qty) || qty <= 0)
 10. 	throw new Error("Số lượng thuốc phải là số nguyên dương");
 11. const med = medicineRepository.findByCode(firstItem.medicine_code);
 12. const availableStock = med ? med.stock_quantity : 0;
 13. if (availableStock < qty)
 14. 	throw new Error(`Số lượng thuốc trong kho không đủ (còn ${availableStock})`);
 15. const unitPrice = med ? med.unit_price : 2000;
 16. const totalCost = unitPrice * qty;
 17. if (med) { med.stock_quantity -= qty; }
 18. consultation.prescriptions = items;
 19. const nextInvId = invoiceRepository.getNextId();
 20. const medInvoice = { id: nextInvId, invoice_code: `HDT${String(nextInvId).padStart(6, "0")}`, patient_code: consultation.patient_code, total_amount: totalCost, patient_pay: totalCost, status: "UNPAID" };
 21. invoiceRepository.create(medInvoice);
 22. return { consultation, medInvoice };
 }
```


#### 3.2. KIỂM THỬ DÒNG ĐIỀU KHIỂN


#### 3.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2


#### 3.2.2 Phân tích độ phức tạp cho C1/C2

Trên đồ thị C1/C2:
 - Số điểm quyết định P = 5 (tại các đỉnh 2, 5, 9, 13, 17).
 - Số đỉnh N = 21, số cạnh E = 25.
 - Công thức McCabe: V(G) = P + 1 = 5 + 1 = 6 (hoặc V(G) = E - N + 2 = 25 - 21 + 2 = 6).
Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.

#### 3.2.3 Thiết kế ca kiểm thử cho Độ đo C1

Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 22 ít nhất một lần. Tập hợp các ca kiểm thử đạt 100% C1:
 - Cần kích hoạt 4 nhánh throw (câu lệnh 3, 6, 10, 14).
 - Cần đi qua nhánh trừ kho (câu lệnh 17a) và bỏ qua trừ kho (câu lệnh 17b) cùng toàn bộ khối xử lý thành công (câu lệnh 18-22).
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 | 1 -> 2 -> 3 | idOrCode = "9999", items = [...] (không tồn tại bệnh án) | Lỗi: "Không tìm thấy hồ sơ bệnh án" | 1, 2, 3 |
| 2 | TC_C1_02 | 1 -> 2 -> 4 -> 5 -> 6 | idOrCode = "1", items = [] (đơn thuốc rỗng) | Lỗi: "Đơn thuốc phải có ít nhất một loại thuốc" | 4, 5, 6 |
| 3 | TC_C1_03 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 10 | idOrCode = "1", items = [{ medicine_code: "MED01", quantity: 0 }] | Lỗi: "Số lượng thuốc phải là số nguyên dương" | 7, 8, 9, 10 |
| 4 | TC_C1_04 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 11 -> 12 -> 13 -> 14 | idOrCode = "1", items = [{ medicine_code: "MED005", quantity: 99999 }] | Lỗi: "Số lượng thuốc trong kho không đủ..." | 11, 12, 13, 14 |
| 5 | TC_C1_05 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 11 -> 12 -> 13 -> 15 -> 16 -> 17b -> 18 -> 19 -> 20 -> 21 -> 22 | idOrCode = "1", items = [{ medicine_code: "MED_OTHER", quantity: 2 }] (thuốc ngoài danh mục kho, unitPrice = 2000) | Thành công: sinh hóa đơn, không trừ kho med | 15, 16, 17b, 18, 19, 20, 21, 22 |
| 6 | TC_C1_06 | 1 -> 2 -> 4 -> 5 -> 7 -> 8 -> 9 -> 11 -> 12 -> 13 -> 15 -> 16 -> 17a -> 18 -> 19 -> 20 -> 21 -> 22 | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 5 }] | Thành công: sinh hóa đơn tiền thuốc, med.stock giảm 5 | 17a |

Tỷ lệ bao phủ C1: 22/22 câu lệnh = 100%.

#### 3.2.4 Thiết kế ca kiểm thử cho Độ đo C2

Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 9, 13, 17 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !consultation | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4-5) |
| Đỉnh 5 | !hasItems (!items \|\| !isArray \|\| len == 0) | TC_C2_03 (Nhảy sang Đỉnh 6) | TC_C2_04 (Đi tiếp Đỉnh 7-9) |
| Đỉnh 9 | isNaN(qty) \|\| qty <= 0 | TC_C2_05 (Nhảy sang Đỉnh 10) | TC_C2_06 (Đi tiếp Đỉnh 11-13) |
| Đỉnh 13 | availableStock < qty | TC_C2_07 (Nhảy sang Đỉnh 14) | TC_C2_08 (Đi tiếp Đỉnh 15-17) |
| Đỉnh 17 | med != null (có đối tượng thuốc trong kho) | TC_C2_09 (Nhánh 17a: Trừ tồn kho) | TC_C2_10 (Nhánh 17b: Bỏ qua) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | idOrCode = "9999", items = [{ medicine_code: "MED001", quantity: 1 }] | Lỗi HTTP 404: Không tìm thấy hồ sơ bệnh án |
| TC_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 9 (False), Đỉnh 13 (False), Đỉnh 17 (False) | idOrCode = "1", items = [{ medicine_code: "MED_OTHER", quantity: 2 }] | Kê đơn thành công, sinh hóa đơn tiền thuốc |
| TC_C2_03 | Đỉnh 5 (True) | idOrCode = "1", items = null | Lỗi HTTP 400: Đơn thuốc phải có ít nhất một loại thuốc |
| TC_C2_05 | Đỉnh 9 (True) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: -2 }] | Lỗi HTTP 400: Số lượng thuốc phải là số nguyên dương |
| TC_C2_07 | Đỉnh 13 (True) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 9999 }] | Lỗi HTTP 400: Số lượng thuốc trong kho không đủ |
| TC_C2_09 | Đỉnh 17 (True) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 5 }] | Kê đơn thành công, trừ tồn kho MED001 |

Tỷ lệ bao phủ C2: 10/10 nhánh quyết định = 100%.

#### 3.2.5 Đồ thị dòng điều khiển cho Độ đo C3


#### 3.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3

Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | !consultation | consultation tìm thấy hay null | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 5 | !items | items = null hoặc undefined | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 5 | items.length == 0 | items = [] (mảng rỗng) | True / False | TC_C3_03 (True) / TC_C3_04 (False) |
| 9 | isNaN(qty) | firstItem.quantity = "abc" | True / False | TC_C3_04 (True) / TC_C3_05 (False) |
| 9 | qty <= 0 | firstItem.quantity = 0 hoặc -1 | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 13 | availableStock < qty | Tồn kho nhỏ hơn số lượng kê | True / False | TC_C3_06 (True) / TC_C3_07 (False) |
| 17 | med != null | Tìm thấy mã thuốc trong danh mục kho | True / False | TC_C3_07 (True) / TC_C3_08 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | !consultation = True | idOrCode = "9999", items = [{ medicine_code: "MED001", quantity: 1 }] | Quăng lỗi 404: Không tìm thấy hồ sơ bệnh án |
| TC_C3_02 | !items = True | idOrCode = "1", items = null | Quăng lỗi: Đơn thuốc phải có ít nhất một loại thuốc |
| TC_C3_03 | items.length == 0 = True | idOrCode = "1", items = [] | Quăng lỗi: Đơn thuốc phải có ít nhất một loại thuốc |
| TC_C3_04 | isNaN(qty) = True | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: "abc" }] | Quăng lỗi: Số lượng thuốc phải là số nguyên dương |
| TC_C3_05 | qty <= 0 = True | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 0 }] | Quăng lỗi: Số lượng thuốc phải là số nguyên dương |
| TC_C3_06 | availableStock < qty = True | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 99999 }] | Quăng lỗi: Số lượng thuốc trong kho không đủ |
| TC_C3_07 | med != null = True | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 5 }] | Kê đơn thành công, trừ kho và sinh hóa đơn |
| TC_C3_08 | med != null = False | idOrCode = "1", items = [{ medicine_code: "MED_NGOAI", quantity: 3 }] | Kê đơn thành công, đơn giá mặc định 2000đ, sinh hóa đơn |


#### 3.3. KIỂM THỬ DÒNG DỮ LIỆU


#### 3.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu

Theo Định nghĩa 6 trong tài liệu học tập kiểm thử phần mềm: Đồ thị dòng dữ liệu của một đơn vị chương trình là một đồ thị có hướng G = (V, E), trong đó:
 - Tập đỉnh (V): Tương ứng với các câu lệnh định nghĩa (def) hoặc sử dụng tính toán (c-use) của các biến. Đồ thị G có hai đỉnh đặc biệt là đỉnh bắt đầu (tương ứng với lệnh def của các biến tham số) và đỉnh kết thúc đơn vị chương trình.
 - Tập cạnh (E): Tương ứng với các câu lệnh hoặc biểu thức sử dụng trong điều kiện rẽ
nhánh (p-use) của các biến.

#### 3.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh

| Đỉnh i | def(i) | c-use(i) |
| --- | --- | --- |
| 1 | {consultation} | {idOrCode} |
| 2, 3 | {} | {} |
| 4 | {hasItems} | {items} |
| 5, 6 | {} | {} |
| 7 | {firstItem} | {items} |
| 8 | {qty} | {firstItem} |
| 9, 10 | {} | {} |
| 11 | {med} | {firstItem} |
| 12 | {availableStock} | {med} |
| 13, 14 | {} | {} |
| 15 | {unitPrice} | {med} |
| 16 | {totalCost} | {unitPrice, qty} |
| 17a | {med.stock_quantity} | {qty} |
| 17b | {} | {} |
| 18 | {consultation.prescriptions} | {items} |
| 19 | {nextInvId} | {} |
| 20 | {medInvoice} | {nextInvId, consultation.patient_code, totalCost} |
| 21 | {} | {medInvoice} |
| 22 | {} | {consultation, medInvoice} |


#### 3.3.3 Bảng 2: Các điều kiện và p-use của các cạnh

| Cạnh (i, j) | Điều kiện tại cạnh | p-use(i, j) |
| --- | --- | --- |
| (1, 2) | True | {} |
| (2, 3) | (!consultation) | {consultation} |
| (2, 4) | ~(!consultation) | {consultation} |
| (4, 5) | True | {} |
| (5, 6) | (!hasItems) | {hasItems} |
| (5, 7) | ~(!hasItems) | {hasItems} |
| (7, 9) | True | {} |
| (9, 10) | (isNaN(qty) \|\| qty <= 0) | {qty} |
| (9, 11) | ~(isNaN(qty) \|\| qty <= 0) | {qty} |
| (11, 13) | True | {} |
| (13, 14) | (availableStock < qty) | {availableStock, qty} |
| (13, 15) | ~(availableStock < qty) | {availableStock, qty} |
| (15, 17) | True | {} |
| (17, 17a) | med != null | {med} |
| (17, 17b) | med == null | {med} |
| (17a, 18) | True | {} |
| (17b, 18) | True | {} |
| (18, 20) | True | {} |
| (20, 21) | True | {} |
| (21, 22) | True | {} |


#### 3.3.4 Đồ thị dòng dữ liệu


#### 3.3.5 Bảng tổng hợp chi tiết Def-Use theo biến

| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng trong điều kiện rẽ nhánh (p-use) |
| --- | --- | --- | --- |
| idOrCode | Tham số (0) | 1 (Tìm kiếm bệnh án) | - |
| items | Tham số (0) | 4 (Kiểm tra mảng), 7 (Lấy item đầu), 18 (Gán đơn thuốc) | - |
| consultation | 1 | 18 (prescriptions), 20 (patient_code), 22 (return) | (2, 3), (2, 4) |
| hasItems | 4 | - | (5, 6), (5, 7) |
| firstItem | 7 | 8 (quantity), 11 (medicine_code) | - |
| qty | 8 | 16 (Tính totalCost), 17a (Trừ kho) | (9, 10), (9, 11), (13, 14), (13, 15) |
| med | 11 | 12 (stock), 15 (unitPrice), 17a (trừ kho) | (17, 17a), (17, 17b) |
| availableStock | 12 | - | (13, 14), (13, 15) |
| unitPrice | 15 | 16 (Tính totalCost = unitPrice * qty) | - |
| totalCost | 16 | 20 (Gán vào medInvoice.total_amount) | - |
| nextInvId | 19 | 20 (Gán vào id, invoice_code) | - |
| medInvoice | 20 | 21 (create), 22 (return) | - |


#### 3.3.6 Phân tích bất thường dòng dữ liệu

Bất thường Loại 1 (dd - Gán giá trị rồi lại gán tiếp giá trị ngay sau đó mà không sử dụng):
Đánh giá: KHÔNG CÓ. Tất cả các biến trung gian (hasItems, firstItem, qty, med, availableStock, unitPrice, totalCost, medInvoice) đều được khai báo dạng const và khởi tạo duy nhất 1 lần.
Bất thường Loại 2 (ur - Chưa gán giá trị nhưng đã được sử dụng):
Phân tích rủi ro: Nếu items = null hoặc rỗng, việc đọc firstItem.quantity sẽ gây lỗi runtime TypeError.
 Phòng vệ mã nguồn: Nhánh kiểm tra tại cạnh (5, 6) chặn hoàn toàn mảng rỗng hoặc null, đồng thời firstItem có fallback {} ngăn chặn crash.
Bất thường Loại 3 (du - Đã khai báo và gán giá trị nhưng không được sử dụng / Biến chết):
Đánh giá: KHÔNG CÓ. Mọi biến được định nghĩa ở 1, 4, 7, 8, 11, 12, 15, 16, 19, 20 đều được sử dụng trong tính toán viện phí hoặc đóng gói đối tượng trả về.

#### 3.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi medInvoice

Chuỗi biến đổi trạng thái là u -> d -> r -> r. Biến không bao giờ rơi vào trạng thái lỗi a (Anomaly).

#### 3.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use

1. Định nghĩa độ đo All c-use (Tất cả các sử dụng tính toán):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi điểm sử dụng tính toán c-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử hợp lệ (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| idOrCode | 0 | 1 | 0 -> 1 | Truy vấn hồ sơ bệnh án theo mã/ID. |
| items | 0 | 4, 7, 18 | 0 -> 4 -> 7 -> ... -> 18 | Bóc tách các thuốc trong đơn và gán vào bệnh án. |
| firstItem | 7 | 8, 11 | 7 -> 8 -> 11 | Đọc số lượng quantity và mã thuốc medicine_code. |
| qty | 8 | 16, 17a | 8 -> 11 -> 13 -> 15 -> 16 -> 17a | Tính tổng tiền thuốc và trừ tồn kho. |
| unitPrice | 15 | 16 | 15 -> 16 | Nhân với số lượng để ra totalCost. |
| totalCost | 16 | 20 | 16 -> 17 -> 18 -> 19 -> 20 | Gán viện phí thuốc vào hóa đơn medInvoice. |
| nextInvId | 19 | 20 | 19 -> 20 | Sinh mã hóa đơn tiền thuốc duy nhất. |
| medInvoice | 20 | 21, 22 | 20 -> 21 -> 22 | Lưu hóa đơn vào DB và trả về kết quả. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All c-use:
| Mã TC | Biến & Cặp def -> c-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_CUSE_01 | idOrCode (0->1), items (0->4,7,18), qty (8->16,17a), unitPrice (15->16), totalCost (16->20), medInvoice (20->21,22) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 5 }] (đơn giá Paracetamol = 2000đ) | Kê đơn thành công:<br> - med.stock giảm 5<br> - medInvoice.total_amount = 10,000đ<br> - medInvoice.status = "UNPAID" |
| TC_CUSE_02 | unitPrice fallback = 2000đ, không trừ kho (17b) | idOrCode = "1", items = [{ medicine_code: "MED_OTHER", quantity: 3 }] | Kê đơn thành công:<br> - totalCost = 6,000đ<br> - không trừ kho do không có mã thuốc trong kho |
| TC_CUSE_03 | firstItem, qty, items gán vào consultation.prescriptions (18) | idOrCode = "1", items = [{ medicine_code: "MED002", quantity: 2, dosage: "Uống 1 viên" }] | Đơn thuốc được lưu vào bệnh án kèm hướng dẫn liều dùng |


#### 3.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use

1. Định nghĩa độ đo All p-use (Tất cả các sử dụng vị từ / rẽ nhánh):
Với mỗi câu lệnh định nghĩa def(v) của biến v, bộ kiểm thử phải chứa ít nhất một đường đi def-clear từ điểm định nghĩa đó đến mọi cạnh sử dụng vị từ p-use(v) của biến v.
2. Bảng sinh đường đi cho độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử hợp lệ (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| consultation | 1 | (2, 3) | 1 -> 2 -> 3 | !consultation nhận giá trị True. |
| consultation | 1 | (2, 4) | 1 -> 2 -> 4 | !consultation nhận giá trị False (hợp lệ). |
| hasItems | 4 | (5, 6) | 4 -> 5 -> 6 | !hasItems nhận giá trị True. |
| hasItems | 4 | (5, 7) | 4 -> 5 -> 7 | !hasItems nhận giá trị False (hợp lệ). |
| qty | 8 | (9, 10) | 8 -> 9 -> 10 | isNaN(qty) \|\| qty <= 0 nhận True. |
| qty | 8 | (9, 11) | 8 -> 9 -> 11 | qty > 0 nhận False (hợp lệ). |
| availableStock, qty | 8, 12 | (13, 14) | 8 -> 11 -> 12 -> 13 -> 14 | availableStock < qty nhận True. |
| availableStock, qty | 8, 12 | (13, 15) | 8 -> 11 -> 12 -> 13 -> 15 | availableStock >= qty nhận False (hợp lệ). |
| med | 11 | (17, 17a) | 11 -> 13 -> 15 -> 17 -> 17a | med != null nhận True. |
| med | 11 | (17, 17b) | 11 -> 13 -> 15 -> 17 -> 17b | med == null nhận False. |

3. Bảng thiết kế các ca kiểm thử đạt 100% độ đo All p-use:
| Mã TC | Biến & Cạnh p-use được phủ | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_PUSE_01 | consultation trên (2, 3) | idOrCode = "9999", items = [{ medicine_code: "MED001", quantity: 1 }] | Quăng lỗi HTTP 404: Không tìm thấy hồ sơ bệnh án |
| TC_PUSE_02 | hasItems trên (5, 6) | idOrCode = "1", items = [] | Quăng lỗi HTTP 400: Đơn thuốc phải có ít nhất một loại thuốc |
| TC_PUSE_03 | qty trên (9, 10) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 0 }] | Quăng lỗi HTTP 400: Số lượng thuốc phải là số nguyên dương |
| TC_PUSE_04 | availableStock trên (13, 14) | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 99999 }] | Quăng lỗi HTTP 400: Số lượng thuốc trong kho không đủ |
| TC_PUSE_05 | med trên (17, 17a) kèm các cạnh hợp lệ | idOrCode = "1", items = [{ medicine_code: "MED001", quantity: 5 }] | Kê đơn thành công, trừ tồn kho MED001 |
| TC_PUSE_06 | med trên (17, 17b) kèm các cạnh hợp lệ | idOrCode = "1", items = [{ medicine_code: "MED_OTHER", quantity: 2 }] | Kê đơn thành công, sinh hóa đơn tiền thuốc |



### 4. Kiểm thử đơn vị


> **5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: KÊ ĐƠN THUỐC & CẢNH BÁO TƯƠNG TÁC (UT28 – UT45)**



#### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

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


#### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


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

---

# Lê Tuấn Khanh

## Chức năng 1: Tiếp nhận chỉ định cận lâm sàng

### 1. Đặc tả


#### 2.20.1. Mô tả tổng quan Use Case

| Thuộc tính | Nội dung mô tả |
| --- | --- |
| Mã Use Case (Use Case ID) | UC-CANLAMSANG-16 |
| Tên Use Case (Use Case Name) | Tiếp nhận chỉ định cận lâm sàng |
| Người thực hiện & Ngày tạo | Lê Tuấn Khanh — 23/09/2026 |
| Tác nhân kích hoạt (Actor) | Kỹ thuật viên xét nghiệm, Kỹ thuật viên chẩn đoán hình ảnh |
| Điều kiện tiên quyết (Pre-conditions) | Kỹ thuật viên đã đăng nhập tài khoản hợp lệ thuộc phân hệ Cận lâm sàng; Bệnh nhân đã được bác sĩ chỉ định và hoàn tất thanh toán tiền dịch vụ tại quầy thu ngân. |
| Điều kiện sau thành công (Post-conditions) | Phiếu chỉ định cận lâm sàng chuyển sang trạng thái "Đang thực hiện", ghi nhận thời gian tiếp nhận và thông báo trạng thái tiến trình đến phòng khám của Bác sĩ. |
| Kích hoạt (Trigger) | Kỹ thuật viên mở danh sách "Hàng chờ cận lâm sàng" hoặc dùng máy quét mã vạch/nhập mã trên phiếu chỉ định của bệnh nhân. |


#### 2.10.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | order_search_key | Tìm kiếm / Quét mã chỉ định [Search Box / Barcode Scanner] | String | Không | -Tối đa 30 ký tự.<br>-Dùng để lọc nhanh theo Mã phiếu chỉ định hoặc Mã bệnh nhân.<br>-Nếu để trống, hệ thống hiển thị toàn bộ hàng chờ mặc định theo phòng chức năng. | "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)." |
| 2 | selected_order_id | Chọn ca chỉ định tiếp nhận [Row Selection / Action Button] | String | Có | -Phải chọn 01 ca chỉ định có trạng thái thanh toán là "Đã thu tiền".<br>-Phiếu chỉ định phải thuộc chuyên khoa/phòng kỹ thuật tương ứng của Kỹ thuật viên đang thao tác. | "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước." |


#### 2.10.3. Đầu vào và đầu ra kiểm thử

Đầu vào (Inputs):
order_search_key: Từ khóa tìm kiếm hoặc mã quét vạch (Để trống / Hợp lệ <= 30 ký tự / Chứa ký tự đặc biệt hoặc vượt quá 30 ký tự).
selected_order_id: Ca chỉ định được chọn tiếp nhận (Không chọn / Chọn ca chưa thanh toán hoặc khác phòng kỹ thuật / Chọn ca hợp lệ đã thanh toán đúng phòng ban).
Đầu ra (Expected Outputs):
A1 (Tiếp nhận thành công): Cập nhật trạng thái phiếu chỉ định sang "Đang thực hiện", lưu thời gian tiếp nhận, gửi thông báo tiến trình đến phòng khám của Bác sĩ và hiển thị thông báo thành công.
A2 (Lỗi từ khóa tìm kiếm): Hiển thị cảnh báo lỗi: "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)."
A3 (Lỗi ca chỉ định chưa đóng tiền hoặc không hợp lệ): Chặn tiếp nhận, hiển thị thông báo lỗi: "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước."
A4 (Lỗi chưa chọn ca chỉ định): Chặn thao tác, yêu cầu người dùng chọn một phiếu chỉ định trên danh sách hàng chờ.


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Tiếp nhận chỉ định cận lâm sàng" áp dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm đảm bảo tính chính xác trong việc tra cứu và tiếp nhận bệnh nhân thực hiện dịch vụ.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra độ dài và định dạng của từ khóa tra cứu.**

Trường order_search_key (Mã tìm kiếm/Quét mã chỉ định):
Miền hợp lệ: Độ dài từ 0 đến 30 ký tự (cho phép để trống), không chứa ký tự đặc biệt. Giá trị biên: 0 ký tự (Min), 30 ký tự (Max).
Miền không hợp lệ: Vượt quá 30 ký tự hoặc chứa ký tự đặc biệt. Giá trị biên: 31 ký tự (Max+).

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện và hành động**
Các điều kiện (C):
C1: order_search_key nhập vào có hợp lệ (đúng định dạng,  ký tự, hoặc để trống) không?
C2: Kỹ thuật viên có chọn một ca chỉ định (selected_order_id) trên danh sách để tiếp nhận không?
C3: Ca chỉ định được chọn đã được thanh toán ("Đã thu tiền") và thuộc đúng phòng chuyên môn của Kỹ thuật viên thao tác?
Các hành động (A):
A1: Hệ thống hiển thị cảnh báo lỗi: "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)."
A2: Chặn thao tác, yêu cầu người dùng chọn một phiếu chỉ định trên danh sách hàng chờ.
A3: Chặn tiếp nhận, hiển thị thông báo lỗi: "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước."
A4: Cập nhật trạng thái phiếu chỉ định sang "Đang thực hiện", lưu thời gian tiếp nhận, gửi thông báo tiến trình đến phòng khám của Bác sĩ và hiển thị thông báo thành công.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: order_search_key hợp lệ? | F | T | T | T |
| --- | --- | --- | --- | --- | --- |
|  | C2: Có chọn ca chỉ định (selected_order_id)? | - | F | T | T |
|  | C3: Ca chỉ định hợp lệ, đã thu tiền? | - | - | F | T |
| Hành động (A) | A1: Báo lỗi mã tra cứu không hợp lệ | X |  |  |  |
|  | A2: Yêu cầu chọn một phiếu chỉ định |  | X |  |  |
|  | A3: Báo lỗi chưa nộp phí / Khác phòng |  |  | X |  |
|  | A4: Tiếp nhận thành công, cập nhật trạng thái |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F16_01 | Giá trị biên | Nhập order_search_key = chuỗi có 31 ký tự (Max+). | Báo lỗi: "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)." |
| TC_F16_02 | Phân vùng TĐ (Q1) | Nhập order_search_key = "CLS_123@". | Báo lỗi: "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)." |
| TC_F16_03 | Giá trị biên / BQ (Q2) | Để trống order_search_key (Min - hợp lệ), danh sách hiển thị toàn bộ hàng chờ. Kỹ thuật viên nhấn "Tiếp nhận" nhưng không chọn ca nào. | Chặn thao tác, yêu cầu người dùng chọn một phiếu chỉ định trên danh sách hàng chờ. |
| TC_F16_04 | Giá trị biên / BQ (Q3) | Nhập order_search_key = chuỗi đúng 30 ký tự (Max - hợp lệ), lọc ra ca chỉ định đúng phòng nhưng chưa đóng tiền. Nhấn Tiếp nhận. | Chặn tiếp nhận, báo lỗi: "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước." |
| TC_F16_05 | Bảng quyết định (Q3) | Quét mã vạch tìm ra ca chỉ định đã đóng tiền nhưng thuộc phòng chức năng khác (VD: KTV X-Quang quét mã xét nghiệm máu). Nhấn Tiếp nhận. | Chặn tiếp nhận, báo lỗi ca chỉ định không hợp lệ hoặc không thuộc phòng chuyên môn. |
| TC_F16_06 | Bảng quyết định (Q4) | Quét mã vạch hợp lệ. Kỹ thuật viên tick chọn 01 ca chỉ định có trạng thái "Đã thu tiền" và thuộc đúng phòng kỹ thuật. Nhấn Tiếp nhận. | Cập nhật trạng thái phiếu chỉ định sang "Đang thực hiện", lưu thời gian tiếp nhận, gửi thông báo tiến trình đến phòng khám của Bác sĩ. |



### 3. Kiểm thử hộp trắng


#### 4.10.1 ĐÁNH SỐ DÒNG MÃ NGUỒN


```javascript
javascript
function executeReceiveLabOrder(payload) {
1.  const { order_id, search_key, technician_dept, current_status, payment_status, order_dept } = payload || {};
2.  if (!order_id && !search_key)
3.      throw new Error("Thiếu thông tin bắt buộc (mã phiếu chỉ định hoặc từ khóa tra cứu)");
4.  const validKey = search_key ? String(search_key).trim() : "";
5.  if (validKey && (validKey.length > 30 || /[^a-zA-Z0-9_-]/.test(validKey)))
6.      throw new Error("Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)");
7.  if (!payment_status || payment_status !== "PAID")
8.      throw new Error("Chỉ định này chưa được đóng tiền tại quầy Thu ngân");
9.  if (order_dept !== technician_dept)
10.     throw new Error("Chỉ định không thuộc chuyên khoa/phòng kỹ thuật của KTV đang thao tác");
11. if (current_status && current_status !== "PENDING")
12.     throw new Error("Chỉ định không ở trạng thái chờ tiếp nhận");
13. const receivedAt = "12/10/2026 08:30";
14. const nextStatus = "PROCESSING";
15. const updatedOrder = { id: order_id, status: nextStatus, received_at: receivedAt, technician_dept };
16. labRepository.update(updatedOrder);
17. eventBus.emitEvent("LAB_ORDER_PROCESSING", { order: updatedOrder });
18. return updatedOrder;
}
```


#### 4.10.2 KIỂM THỬ DÒNG ĐIỀU KHIỂN

4.10.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2
4.10.2.2 Phân tích độ phức tạp cho C1/C2
Trên đồ thị C1/C2:
Số điểm quyết định P = 5 (tại các đỉnh 2, 5, 7, 9, 11).
Công thức McCabe: V(G)=P+1=5+1=6V(G) = P + 1 = 5 + 1 = 6V(G)=P+1=5+1=6
⇒ Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.
4.10.2.3 Thiết kế ca kiểm thử cho Độ đo C1
Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 18 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1:
Cần kích hoạt 5 nhánh throw lỗi (câu lệnh 3, 6, 8, 10, 12).
Cần đi qua khối xử lý tiếp nhận thành công (câu lệnh 13 đến 18).
Bảng thiết kế ca kiểm thử cho Độ đo C1
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 |  | { order_id: null, search_key: "" } | Lỗi: “Thiếu thông tin bắt buộc (mã phiếu chỉ định hoặc từ khóa tra cứu)” | 1, 2, 3 |
| 2 | TC_C1_02 |  | { order_id: "CLS01", search_key: "CLS@99#" } | Lỗi: “Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)” | 4, 5, 6 |
| 3 | TC_C1_03 |  | { order_id: "CLS01", payment_status: "UNPAID" } | Lỗi: “Chỉ định này chưa được đóng tiền tại quầy Thu ngân” | 7, 8 |
| 4 | TC_C1_04 |  | { order_id: "CLS01", payment_status: "PAID", order_dept: "XET_NGHIEM", technician_dept: "XQUANG" } | Lỗi: “Chỉ định không thuộc chuyên khoa/phòng kỹ thuật của KTV đang thao tác” | 9, 10 |
| 5 | TC_C1_05 |  | { order_id: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "COMPLETED" } | Lỗi: “Chỉ định không ở trạng thái chờ tiếp nhận” | 11, 12 |
| 6 | TC_C1_06 |  | { order_id: "CLS01", search_key: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "PENDING" } | Thành công: status = "PROCESSING", tiếp nhận ca CLS01 | 13, 14, 15, 16, 17, 18 |

Tỷ lệ bao phủ C1: 18/18 câu lệnh = 100%.
4.10.2.4 Thiết kế ca kiểm thử cho Độ đo C2
Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 5, 7, 9, 11 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
Bảng ma trận nhánh quyết định C2
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !order_id && !search_key | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 5 | validKey && (len > 30 \|\| regex) | TC_C2_03 (Nhảy sang Đỉnh 6) | TC_C2_04 (Đi tiếp Đỉnh 7) |
| Đỉnh 7 | !payment_status \|\| payment_status !== "PAID" | TC_C2_05 (Nhảy sang Đỉnh 8) | TC_C2_06 (Đi tiếp Đỉnh 9) |
| Đỉnh 9 | order_dept !== technician_dept | TC_C2_07 (Nhảy sang Đỉnh 10) | TC_C2_08 (Đi tiếp Đỉnh 11) |
| Đỉnh 11 | current_status && current_status !== "PENDING" | TC_C2_09 (Nhảy sang Đỉnh 12) | TC_C2_10 (Đi tiếp Đỉnh 13..18) |

Bảng tổng hợp ca kiểm thử đạt 100% C2
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { order_id: null, search_key: "" } | Lỗi: “Thiếu thông tin bắt buộc…” |
| TC_C2_02 | Đỉnh 2 (False), Đỉnh 5 (False), Đỉnh 7 (False), Đỉnh 9 (False), Đỉnh 11 (False) | { order_id: "CLS01", search_key: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "PENDING" } | Tiếp nhận thành công ca chỉ định, status = "PROCESSING" |
| TC_C2_03 | Đỉnh 5 (True) | { order_id: "CLS01", search_key: "CLS@99#" } | Lỗi: “Mã tra cứu không hợp lệ…” |
| TC_C2_05 | Đỉnh 7 (True) | { order_id: "CLS01", payment_status: "UNPAID" } | Lỗi: “Chỉ định này chưa được đóng tiền tại quầy Thu ngân” |
| TC_C2_07 | Đỉnh 9 (True) | { order_id: "CLS01", payment_status: "PAID", order_dept: "XET_NGHIEM", technician_dept: "XQUANG" } | Lỗi: “Chỉ định không thuộc chuyên khoa/phòng kỹ thuật…” |
| TC_C2_09 | Đỉnh 11 (True) | { order_id: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "COMPLETED" } | Lỗi: “Chỉ định không ở trạng thái chờ tiếp nhận” |

Tỷ lệ bao phủ C2: 10/10 nhánh quyết định = 100%.
4.10.2.5 Đồ thị dòng điều khiển cho Độ đo C3
Bảng thiết kế ca kiểm thử cho Độ đo C1:
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 |  | { order_id: null, search_key: "" } | Lỗi: “Thiếu thông tin bắt buộc (mã phiếu chỉ định hoặc từ khóa tra cứu)” | 1, 2, 3 |
| 2 | TC_C1_02 |  | { order_id: "CLS01", search_key: "CLS@99#" } | Lỗi: “Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt)” | 4, 5, 6 |
| 3 | TC_C1_03 |  | { order_id: "CLS01", payment_status: "UNPAID" } | Lỗi: “Chỉ định này chưa được đóng tiền tại quầy Thu ngân” | 7, 8 |
| 4 | TC_C1_04 |  | { order_id: "CLS01", payment_status: "PAID", order_dept: "XET_NGHIEM", technician_dept: "XQUANG" } | Lỗi: “Chỉ định không thuộc chuyên khoa/phòng kỹ thuật của KTV đang thao tác” | 9, 10 |
| 5 | TC_C1_05 |  | { order_id: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "COMPLETED" } | Lỗi: “Chỉ định không ở trạng thái chờ tiếp nhận” | 11, 12 |
| 6 | TC_C1_06 |  | { order_id: "CLS01", search_key: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "PENDING" } | Thành công: status = "PROCESSING", tiếp nhận ca CLS01 | 13, 14, 15, 16, 17, 18 |

Tỷ lệ bao phủ C1: 18/18 câu lệnh = 100%.
4.10.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3
Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | 2a: !order_id<br><br><br>2b: !search_key | order_id = null<br><br><br>search_key = "" | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 5 | 5a: validKey.length > 30<br><br><br>5b: chứa ký tự lạ | search_key = chuỗi 35 ký tự<br><br><br>search_key = "CLS@99#" | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 7 | 7a: !payment_status<br><br><br>7b: payment_status !== "PAID" | payment_status = null<br><br><br>payment_status = "UNPAID" | True / False | TC_C3_04 (True) / TC_C3_05 (False) |
| 9 | 9: order_dept !== tech_dept | order_dept = "XET_NGHIEM", tech_dept = "XQUANG" | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 11 | 11a: current_status<br><br><br>11b: status !== "PENDING" | current_status = "PROCESSING" | True / False | TC_C3_06 (True) / TC_C3_07 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | 2a = True, 2b = True | { order_id: "", search_key: "" } | Quăng lỗi: Thiếu thông tin bắt buộc |
| TC_C3_02 | 2a = False, 5a = True | { order_id: "CLS01", search_key: "12345678901234567890123456789012" } | Quăng lỗi: Mã tra cứu không hợp lệ (tối đa 30 ký tự) |
| TC_C3_03 | 5a = False, 5b = True | { order_id: "CLS01", search_key: "CLS_123@" } | Quăng lỗi: Mã tra cứu không hợp lệ (ký tự đặc biệt) |
| TC_C3_04 | 5 = False, 7b = True | { order_id: "CLS01", payment_status: "UNPAID" } | Quăng lỗi: Chỉ định này chưa được đóng tiền |
| TC_C3_05 | 7 = False, 9 = True | { order_id: "CLS01", payment_status: "PAID", order_dept: "XET_NGHIEM", technician_dept: "XQUANG" } | Quăng lỗi: Chỉ định không thuộc chuyên khoa |
| TC_C3_06 | 9 = False, 11b = True | { order_id: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "COMPLETED" } | Quăng lỗi: Chỉ định không ở trạng thái chờ tiếp nhận |
| TC_C3_07 | Tất cả điều kiện con hợp lệ | { order_id: "CLS01", search_key: "CLS01", payment_status: "PAID", order_dept: "XQUANG", technician_dept: "XQUANG", current_status: "PENDING" } | Tiếp nhận thành công ca chỉ định, status = "PROCESSING" |


#### 4.10.3 KIỂM THỬ DÒNG DỮ LIỆU

4.10.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu
Theo Định nghĩa 6 trong tài liệu kiểm thử: Đồ thị dòng dữ liệu $G = \langle N, E \rangle$ biểu diễn ,  tại các đỉnh và  tại các cạnh rẽ nhánh.
4.10.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh:
| Đỉnh i | def(i) | c-use(i) |
| --- | --- | --- |
| 1 | {order_id, search_key, technician_dept, current_status, payment_status, order_dept} | $\emptyset$ |
| 4 | {validKey} | {search_key} |
| 14 | {nextStatus} | $\emptyset$ |
| 15 | {updatedOrder} | {order_id, nextStatus, technician_dept} |
| 16, 17, 18 | $\emptyset$ | {updatedOrder} |

4.10.3.3 Bảng 2: Các điều kiện và p-use của các cạnh:
| Cạnh (i,j) | Điều kiện tại cạnh (i,j) | p-use(i,j) |
| --- | --- | --- |
| (2, 3) / (2, 4) | (!order_id && !search_key) | {order_id, search_key} |
| (5, 6) / (5, 7) | (validKey && (validKey.length > 30 \|\| regex)) | {validKey} |
| (7, 8) / (7, 9) | (!payment_status \|\| payment_status !== "PAID") | {payment_status} |
| (9, 10) / (9, 11) | (order_dept !== technician_dept) | {order_dept, technician_dept} |
| (11, 12) / (11, 13) | (current_status && current_status !== "PENDING") | {current_status} |

4.10.3.4 Đồ thị dòng dữ liệu
4.10.3.5 Bảng tổng hợp chi tiết Def-Use theo biến
Bảng tổng hợp chi tiết Def-Use theo biến:
| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng điều kiện (p-use) |
| --- | --- | --- | --- |
| order_id | N1 | N15 (Gán updatedOrder) | (N2, N3), (N2, N4) |
| search_key | N1 | N4 (Trim chuỗi validKey) | (N2, N3), (N2, N4) |
| validKey | N4 | $\emptyset$ | (N5, N6), (N5, N7) |
| nextStatus | N14 | N15 (Gán updatedOrder.status) | - |
| updatedOrder | N15 | N16 (Lưu DB), N17 (Event), N18 (Return) | - |

4.10.3.6 Phân tích bất thường dòng dữ liệu
Bất thường Loại 1 (dd): KHÔNG CÓ. Tất cả các biến trung gian (validKey, nextStatus, updatedOrder) đều được khởi tạo và định nghĩa đúng 1 lần.
Bất thường Loại 2 (ur): KHÔNG CÓ. Cơ chế fallback payload || {} và String(search_key).trim() triệt tiêu hoàn toàn nguy cơ truy cập thuộc tính trên biến undefined runtime.
Bất thường Loại 3 (du): KHÔNG CÓ. Toàn bộ các biến sau khi khởi tạo đều được tham chiếu vào nghiệp vụ lưu CSDL hoặc gửi event/return.
4.10.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi nextStatus
Chuỗi biến đổi trạng thái chuẩn mực: u -> d -> D -> r -> R (Không xuất hiện lỗi Anomaly A).
4.10.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| search_key | N1 | N4 |  | Chuẩn hóa chuỗi tìm kiếm validKey |
| nextStatus | N14 | N15 |  | Gán trạng thái PROCESSING vào order |
| updatedOrder | N15 | N16, N17, N18 |  | Lưu CSDL và trả kết quả về giao diện |

4.10.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| order_id | N1 | (N2, N3) |  | !order_id && !search_key = True |
| validKey | N4 | (N5, N6) |  | validKey lỗi định dạng = True |
| payment_status | N1 | (N7, N8) |  | payment_status !== "PAID" |
| order_dept | N1 | (N9, N10) |  | order_dept !== tech_dept |
| current_status | N1 | (N11, N12) |  | current_status !== "PENDING" |



### 4. Kiểm thử đơn vị


> **3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: TIẾP NHẬN CHỈ ĐỊNH CẬN LÂM SÀNG (UT01 – UT10)**



#### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Lớp [`ReceiveOrderValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/01_receiveOrder.validator.js), phương thức tĩnh `validateReceiveOrder(input)`.
- **Tập tin kiểm thử:** [`backend/test/khanh/validators/01_receiveOrder.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/01_receiveOrder.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    order_search_key: "CLS_123",
    selected_order_id: 1,
    payment_status: "PAID",
    order_dept: "LAB",
    technician_dept: "LAB"
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `order_search_key`: Tối đa 30 ký tự, không chứa ký tự đặc biệt (chỉ chấp nhận chữ cái, số, dấu gạch dưới, khoảng trắng). Khoảng trắng đầu/cuối được phép cắt tỉa (`trim()`). Cho phép chuỗi rỗng `""`.
  2. `selected_order_id`: Bắt buộc phải chọn một phiếu chỉ định từ hàng chờ (khác `null` và `undefined`).
  3. `payment_status`: Chỉ định phải ở trạng thái `"PAID"`. Nếu `"UNPAID"` phải từ chối tiếp nhận và yêu cầu đóng phí tại quầy Thu ngân.
  4. `order_dept` & `technician_dept`: Khoa/phòng của phiếu chỉ định phải trùng khớp tuyệt đối với phòng chuyên môn của kỹ thuật viên thao tác.


#### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 1 | **UT01** | `Test_ReceiveOrder_TC_F16_01_MaQuaDai31KyTu` | `order_search_key = "A".repeat(31)` | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 2 | **UT02** | `Test_ReceiveOrder_TC_F16_02_KyTuDacBiet` | `order_search_key = "CLS_123@"` | Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 3 | **UT03** | `Test_ReceiveOrder_TC_F16_03_KhongChonPhieu` | `order_search_key = ""; selected_order_id = null` | Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 4 | **UT04** | `Test_ReceiveOrder_TC_F16_04_ChuaThanhToan` | `order_search_key = "A".repeat(30); payment_status = "UNPAID"` | Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 5 | **UT05** | `Test_ReceiveOrder_TC_F16_05_KhacPhongChuyenMon` | `technician_dept = "PACS"` (trong khi `order_dept = "LAB"`) | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 6 | **UT06** | `Test_ReceiveOrder_TC_F16_06_DuLieuMacDinhHopLe` | `{}` (dữ liệu mặc định đầy đủ, hợp lệ) | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 7 | **UT07** | `Test_ReceiveOrder_MaTraCuuRong_HopLe` | `order_search_key = ""` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 8 | **UT08** | `Test_ReceiveOrder_MaDung30KyTu_BienHopLe` | `order_search_key = "A".repeat(30)` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 9 | **UT09** | `Test_ReceiveOrder_KhoangTrangHaiDau_CatTiaHopLe` | `order_search_key = "  CLS_123  "` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 10 | **UT10** | `Test_ReceiveOrder_ThieuThongTinHaiPhong_TuChoi` | `order_dept = undefined; technician_dept = undefined` | Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên. | `Assert.AreEqual` | **ĐẠT (PASS)** |

---


#### Mã nguồn hàm kiểm tra hợp lệ (Validator Implementation):

#### 5.1.10 TIẾP NHẬN CHỈ ĐỊNH LÂM SÀNG


```javascript
export class ReceiveOrderValidator {
static validateReceiveOrder({
order_search_key = "",
selected_order_id,
payment_status,
order_dept,
technician_dept,
} = {}) {
if (typeof order_search_key !== "string" ||
order_search_key.trim().length > 30 ||
/[^a-zA-Z0-9_-]/.test(order_search_key.trim())) {
return "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt).";
}
if (!selected_order_id || String(selected_order_id).trim() === "") {
return "Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ.";
}
if (payment_status !== "PAID") {
return "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước.";
}
if (typeof order_dept !== "string" || !order_dept.trim() ||
typeof technician_dept !== "string" || !technician_dept.trim() ||
order_dept.trim() !== technician_dept.trim()) {
return "Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.";
}
return null;
}
}
```



#### Mã nguồn ca kiểm thử đơn vị tự động (Test Implementation):

#### 5.2.10 TIẾP NHẬN CHỈ ĐỊNH LÂM SÀNG


```javascript
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { ReceiveOrderValidator } from "./01_Tiep_Nhan_Chi_Dinh.validator.js";
describe("validateReceiveOrder - Tiếp nhận chỉ định CLS", () => {
const valid = {
order_search_key: "CLS_123", selected_order_id: 1,
payment_status: "PAID", order_dept: "LAB", technician_dept: "LAB",
};
const keyError = "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt).";
test("TC_F16_01 - Mã tra cứu 31 ký tự", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_search_key: "A".repeat(31) }), keyError);
});
test("TC_F16_02 - Mã chứa ký tự đặc biệt", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_search_key: "CLS_123@" }), keyError);
});
test("TC_F16_03 - Không chọn phiếu", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_search_key: "", selected_order_id: null }),
"Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ.");
});
test("TC_F16_04 - Mã 30 ký tự, chưa thanh toán", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_search_key: "A".repeat(30), payment_status: "UNPAID" }),
"Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước.");
});
test("TC_F16_05 - Khác phòng chuyên môn", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, technician_dept: "PACS" }),
"Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.");
});
test("TC_F16_06 - Hợp lệ", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder(valid), null);
});
for (const key of ["", "A".repeat(30), "  CLS_123  "]) {
test(`Hợp lệ - Mã tra cứu ${JSON.stringify(key)}`, () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_search_key: key }), null);
});
}
test("Thiếu cả hai phòng không được coi là khớp phòng", () => {
assert.equal(ReceiveOrderValidator.validateReceiveOrder({ ...valid, order_dept: undefined, technician_dept: undefined }),
"Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.");
});
});
```


---

## Chức năng 2: Nhập kết quả xét nghiệm định lượng

### 1. Đặc tả


#### 2.11.1. Mô tả tổng quan Use Case

| Thuộc tính | Nội dung mô tả |
| --- | --- |
| Mã Use Case (Use Case ID) | UC-CANLAMSANG-17 |
| Tên Use Case (Use Case Name) | Nhập kết quả xét nghiệm |
| Người thực hiện & Ngày tạo | Lê Tuấn Khanh — 23/09/2026 |
| Tác nhân kích hoạt (Actor) | Kỹ thuật viên xét nghiệm |
| Điều kiện tiên quyết (Pre-conditions) | Phiếu chỉ định thuộc nhóm dịch vụ xét nghiệm (Sinh hóa, Huyết học, Nước tiểu,...) và đã hoàn tất phân tích mẫu bệnh phẩm trên máy móc/phòng xét nghiệm. |
| Điều kiện sau thành công (Post-conditions) | Toàn bộ giá trị chỉ số đo thực tế được lưu vào hệ thống, các cảnh báo bất thường (nếu có) được ghi nhận và hiển thị trực quan theo dải tham chiếu. |
| Kích hoạt (Trigger) | Kỹ thuật viên chọn một ca xét nghiệm đang thực hiện trong danh sách chỉ định và bấm "Nhập kết quả". |


#### 2.11.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Quy tắc kiểm tra hợp lệ | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | test_order_id | Mã phiếu chỉ định [Hidden / Read-only Field] | String | Có | -Mã phiếu xét nghiệm phải tồn tại trong cơ sở dữ liệu.<br>-Thuộc nhóm dịch vụ xét nghiệm cận lâm sàng. | "Mã phiếu chỉ định xét nghiệm không hợp lệ." |
| 2 | test_value | Giá trị đo thực tế [Numeric Input / Text Box] | Decimal / String | Có | -Tùy từng loại chỉ số: Nếu là định lượng phải là số thực dương (chấp nhận dấu chấm thập phân), nếu là định tính (dương tính/âm tính) phải chọn giá trị chuẩn.<br>-Không chứa ký tự chữ cái đối với chỉ số định lượng. | "Giá trị chỉ số phải là chữ số hợp lệ." |
| 3 | general_notes | Nhận xét tổng quát [Text Area] | String | Không | -Tối đa 500 ký tự.<br>-Dùng để ghi nhận xét, khuyến nghị bổ sung của kỹ thuật viên đối với mẫu xét nghiệm. | "Nhận xét tổng quát không được vượt quá 500 ký tự." |


#### 2.11.3. Đầu vào và đầu ra kiểm thử

Đầu vào (Inputs):
test_order_id: Mã phiếu chỉ định xét nghiệm (Tồn tại và thuộc nhóm xét nghiệm / Không tồn tại hoặc sai nhóm dịch vụ).
test_value: Giá trị đo thực tế của chỉ số (Trống / Chứa ký tự không hợp lệ hoặc số âm / Định lượng hợp lệ hoặc định tính đúng giá trị chuẩn).
general_notes: Nhận xét tổng quát của kỹ thuật viên (Để trống / Hợp lệ <= 500 ký tự / Vượt quá 500 ký tự).
Đầu ra (Expected Outputs):
A1 (Lưu kết quả thành công): Lưu toàn bộ các giá trị chỉ số vào cơ sở dữ liệu, tự động đối chiếu dải tham chiếu để gắn cờ cảnh báo (nếu bất thường) và hiển thị thông báo thành công.
A2 (Lỗi phiếu chỉ định): Chặn lưu, hiển thị thông báo lỗi: "Mã phiếu chỉ định xét nghiệm không hợp lệ."
A3 (Lỗi giá trị chỉ số): Chặn lưu, hiển thị thông báo lỗi: "Giá trị chỉ số phải là chữ số hợp lệ."
A4 (Lỗi nhận xét tổng quát): Chặn lưu, hiển thị thông báo lỗi: "Nhận xét tổng quát không được vượt quá 500 ký tự."


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Nhập kết quả xét nghiệm" sử dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm kiểm soát chặt chẽ tính toàn vẹn của dữ liệu y tế và logic cảnh báo chỉ số bất thường.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra định dạng của giá trị đo thực tế và độ dài của trường nhận xét tổng quát.**

Trường test_value (Giá trị đo thực tế - xét trường hợp chỉ số định lượng):
Miền hợp lệ: Số thực dương ( ), cho phép dấu thập phân. Giá trị biên: Giá trị dương nhỏ nhất hệ thống cho phép (VD:  - Min hợp lệ).
Miền không hợp lệ: Số âm ( ), chứa chữ cái hoặc ký tự đặc biệt, để trống.
Trường general_notes (Nhận xét tổng quát):
Miền hợp lệ: Chuỗi ký tự có độ dài từ 0 đến 500 (cho phép để trống). Giá trị biên: 0 ký tự (Min), 500 ký tự (Max).
Miền không hợp lệ: Chuỗi vượt quá 500 ký tự. Giá trị biên: 501 ký tự (Max+).

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện và hành động**
Các điều kiện (C):
C1: test_order_id (Mã phiếu chỉ định) có tồn tại và thuộc đúng nhóm dịch vụ xét nghiệm cận lâm sàng không?
C2: test_value nhập vào có đúng định dạng (không trống, là số thực dương đối với định lượng hoặc đúng giá trị chuẩn đối với định tính)?
C3: general_notes (Nhận xét) có độ dài hợp lệ (  ký tự) không?
Các hành động (A):
A1: Chặn lưu, báo lỗi: "Mã phiếu chỉ định xét nghiệm không hợp lệ."
A2: Chặn lưu, báo lỗi: "Giá trị chỉ số phải là chữ số hợp lệ."
A3: Chặn lưu, báo lỗi: "Nhận xét tổng quát không được vượt quá 500 ký tự."
A4: Lưu kết quả thành công, tự động đối chiếu dải tham chiếu để gắn cờ cảnh báo (nếu bất thường) và hiển thị thông báo thành công.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: test_order_id hợp lệ/đúng nhóm? | F | T | T | T |
| --- | --- | --- | --- | --- | --- |
|  | C2: test_value hợp lệ/không trống? | - | F | T | T |
|  | C3: general_notes  ký tự? | - | - | F | T |
| Hành động (A) | A1: Báo lỗi mã phiếu không hợp lệ | X |  |  |  |
|  | A2: Báo lỗi giá trị chỉ số không hợp lệ |  | X |  |  |
|  | A3: Báo lỗi độ dài nhận xét tổng quát |  |  | X |  |
|  | A4: Lưu thành công, đối chiếu, cảnh báo |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F17_01 | Bảng quyết định (Q1) | Chọn phiếu chỉ định test_order_id thuộc nhóm Chụp X-Quang (không phải nhóm xét nghiệm) và bấm Nhập kết quả. | Hệ thống chặn thao tác, hiển thị lỗi: "Mã phiếu chỉ định xét nghiệm không hợp lệ." |
| TC_F17_02 | Bảng quyết định (Q2) | Để trống trường test_value của một chỉ số bắt buộc và bấm Lưu. | Viền đỏ ô nhập liệu, báo lỗi: "Giá trị chỉ số phải là chữ số hợp lệ." |
| TC_F17_03 | Phân vùng TĐ (Q2) | Nhập test_value định lượng chứa ký tự chữ cái (VD: 12.5A). | Hệ thống chặn lưu, báo lỗi: "Giá trị chỉ số phải là chữ số hợp lệ." |
| TC_F17_04 | Phân vùng TĐ (Q2) | Nhập test_value định lượng là số âm (VD: -5.2). | Hệ thống chặn lưu, báo lỗi: "Giá trị chỉ số phải là chữ số hợp lệ." |
| TC_F17_05 | Giá trị biên (Q3) | Nhập general_notes = chuỗi có đúng 501 ký tự (Max+). | Hệ thống chặn lưu, báo lỗi: "Nhận xét tổng quát không được vượt quá 500 ký tự." |
| TC_F17_06 | Giá trị biên / BQ (Q4) | Các chỉ số test_value hợp lệ. Để trống general_notes (0 ký tự - Min). Bấm Lưu. | Lưu toàn bộ giá trị vào CSDL, hiển thị thông báo lưu thành công. |
| TC_F17_07 | Giá trị biên / BQ (Q4) | Các chỉ số test_value hợp lệ. Nhập general_notes đúng 500 ký tự (Max). Bấm Lưu. | Lưu thành công, giữ nguyên văn bản nhận xét. |
| TC_F17_08 | Phân vùng TĐ / BQ (Q4) | Nhập test_value hợp lệ nhưng có 1 chỉ số (VD: Glucose) có giá trị vượt dải tham chiếu bình thường. | Lưu kết quả thành công. Chỉ số Glucose tự động được gắn cờ cảnh báo bất thường (đổi màu/đánh dấu) trên giao diện. |



### 3. Kiểm thử hộp trắng


#### 4.11.1 ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
javascript
function executeSubmitLabResult(payload) {
1.  const { order_id, test_value, min_ref = 3.9, max_ref = 6.4, general_notes = "", current_status } = payload || {};
2.  if (!order_id)
3.      throw new Error("Mã phiếu xét nghiệm không được để trống");
4.  if (current_status !== "PROCESSING")
5.      throw new Error("Phiếu xét nghiệm chưa được tiếp nhận hoặc đã hoàn thành");
6.  const val = Number(test_value);
7.  if (isNaN(val) || val < 0)
8.      throw new Error("Giá trị chỉ số đo thực tế phải là số thực không âm");
9.  if (general_notes && general_notes.length > 500)
10.     throw new Error("Nhận xét tổng quát không được vượt quá 500 ký tự");
11. const isAbnormal = val < min_ref || val > max_ref;
12. const alertFlag = isAbnormal ? "WARNING" : "NORMAL";
13. const resultRecord = { order_id, test_value: val, alertFlag, notes: general_notes, status: "COMPLETED" };
14. labRepository.saveResult(resultRecord);
15. eventBus.emitEvent("LAB_RESULT_SUBMITTED", { result: resultRecord });
16. return resultRecord;
}
```


#### 4.11.2 KIỂM THỬ DÒNG ĐIỀU KHIỂN

4.11.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2
4.11.2.2 Phân tích độ phức tạp cho C1/C2
Trên đồ thị C1/C2:
Số điểm quyết định  (tại các đỉnh 2, 4, 7, 9, 11).
Công thức McCabe:
Cần tối thiểu 6 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.
4.11.2.3 Thiết kế ca kiểm thử cho Độ đo C1
Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 16 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1:
Cần kích hoạt 4 nhánh throw lỗi (câu lệnh 3, 5, 8, 10).
Cần đi qua nhánh gán WARNING (câu lệnh 12a) và NORMAL (câu lệnh 12b) cùng khối xử lý thành công (câu lệnh 13..16).
Bảng thiết kế ca kiểm thử cho Độ đo C1:
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 |  | { order_id: "" } | Lỗi: “Mã phiếu xét nghiệm không được để trống” | 1, 2, 3 |
| 2 | TC_C1_02 |  | { order_id: "XN01", current_status: "PENDING" } | Lỗi: “Phiếu xét nghiệm chưa được tiếp nhận hoặc đã hoàn thành” | 4, 5 |
| 3 | TC_C1_03 |  | { order_id: "XN01", current_status: "PROCESSING", test_value: "abc" } | Lỗi: “Giá trị chỉ số đo thực tế phải là số thực không âm” | 6, 7, 8 |
| 4 | TC_C1_04 |  | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, general_notes: "a"*501 } | Lỗi: “Nhận xét tổng quát không được vượt quá 500 ký tự” | 9, 10 |
| 5 | TC_C1_05 |  | { order_id: "XN01", current_status: "PROCESSING", test_value: 8.5, min_ref: 3.9, max_ref: 6.4 } | Thành công: alertFlag = "WARNING", lưu kết quả xét nghiệm | 11, 12a, 13, 14, 15, 16 |
| 6 | TC_C1_06 |  | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, min_ref: 3.9, max_ref: 6.4 } | Thành công: alertFlag = "NORMAL", lưu kết quả xét nghiệm | 12b, 13, 14, 15, 16 |

Tỷ lệ bao phủ C1: 16/16 câu lệnh = 100%.
4.11.2.4 Thiết kế ca kiểm thử cho Độ đo C2
Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 4, 7, 9, 11 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
Bảng ma trận nhánh quyết định C2:
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !order_id | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 4 | current_status !== "PROCESSING" | TC_C2_03 (Nhảy sang Đỉnh 5) | TC_C2_04 (Đi tiếp Đỉnh 6-7) |
| Đỉnh 7 | isNaN(val) \|\| val < 0 | TC_C2_05 (Nhảy sang Đỉnh 8) | TC_C2_06 (Đi tiếp Đỉnh 9) |
| Đỉnh 9 | general_notes && notes.length > 500 | TC_C2_07 (Nhảy sang Đỉnh 10) | TC_C2_08 (Đi tiếp Đỉnh 11) |
| Đỉnh 11 | val < min_ref \|\| val > max_ref | TC_C2_09 (Nhánh 12a: WARNING) | TC_C2_10 (Nhánh 12b: NORMAL) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { order_id: "" } | Lỗi: “Mã phiếu xét nghiệm không được để trống” |
| TC_C2_02 | Đỉnh 2 (False), Đỉnh 4 (False), Đỉnh 7 (False), Đỉnh 9 (False), Đỉnh 11 (False) | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, min_ref: 3.9, max_ref: 6.4 } | Tạo thành công kết quả NORMAL |
| TC_C2_03 | Đỉnh 4 (True) | { order_id: "XN01", current_status: "PENDING" } | Lỗi: “Phiếu xét nghiệm chưa được tiếp nhận…” |
| TC_C2_05 | Đỉnh 7 (True) | { order_id: "XN01", current_status: "PROCESSING", test_value: -2.5 } | Lỗi: “Giá trị chỉ số đo thực tế phải là số thực không âm” |
| TC_C2_07 | Đỉnh 9 (True) | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, general_notes: "a"*501 } | Lỗi: “Nhận xét tổng quát không được vượt quá 500 ký tự” |
| TC_C2_09 | Đỉnh 11 (True) | { order_id: "XN01", current_status: "PROCESSING", test_value: 8.5, min_ref: 3.9, max_ref: 6.4 } | Tạo thành công kết quả WARNING |

Tỷ lệ bao phủ C2: 10/10 nhánh quyết định = 100%.
4.11.2.5 Đồ thị dòng điều khiển cho Độ đo C3
4.11.2.6 Bảng phân tích điều kiện con và Thiết kế ca kiểm thử C3
Bảng trạng thái chân lý của các điều kiện con:
| Điểm QĐ | Điều kiện con | Biến cố kiểm tra | Trạng thái cần đạt | Ca kiểm thử phủ |
| --- | --- | --- | --- | --- |
| 2 | 2: !order_id | order_id = "" hoặc undefined | True / False | TC_C3_01 (True) / TC_C3_02 (False) |
| 4 | 4: current_status !== "PROCESSING" | status = "PENDING" vs "PROCESSING" | True / False | TC_C3_02 (True) / TC_C3_03 (False) |
| 7 | 7a: isNaN(val)<br><br><br>7b: val < 0 | test_value = "abc"<br><br><br>test_value = -2.5 | True / False | TC_C3_03 (True) / TC_C3_04 (False) |
| 9 | 9: general_notes.length > 500 | general_notes = 501 ký tự vs 10 ký tự | True / False | TC_C3_05 (True) / TC_C3_06 (False) |
| 11 | 11a: val < min_ref<br><br><br>11b: val > max_ref | val = 2.0 (Dưới ngưỡng)<br><br><br>val = 8.5 (Vượt ngưỡng) | True / False | TC_C3_06 (True) / TC_C3_07 (False) |

Bảng chi tiết bộ ca kiểm thử đạt 100% C3:
| Mã TC | Điều kiện con kích hoạt | Dữ liệu đầu vào (payload) | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C3_01 | 2 = True | { order_id: "" } | Quăng lỗi: Mã phiếu xét nghiệm không được để trống |
| TC_C3_02 | 2 = False, 4 = True | { order_id: "XN01", current_status: "PENDING" } | Quăng lỗi: Phiếu xét nghiệm chưa được tiếp nhận hoặc đã hoàn thành |
| TC_C3_03 | 4 = False, 7a = True | { order_id: "XN01", current_status: "PROCESSING", test_value: "abc" } | Quăng lỗi: Giá trị chỉ số đo thực tế phải là số thực không âm |
| TC_C3_04 | 7a = False, 7b = True | { order_id: "XN01", current_status: "PROCESSING", test_value: -3.5 } | Quăng lỗi: Giá trị chỉ số đo thực tế phải là số thực không âm |
| TC_C3_05 | 7 = False, 9 = True | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, general_notes: "a"*501 } | Quăng lỗi: Nhận xét tổng quát không được vượt quá 500 ký tự |
| TC_C3_06 | 9 = False, 11a = True | { order_id: "XN01", current_status: "PROCESSING", test_value: 2.0, min_ref: 3.9 } | Thành công: alertFlag = "WARNING" (Hạ đường huyết) |
| TC_C3_07 | 11a = False, 11b = True | { order_id: "XN01", current_status: "PROCESSING", test_value: 8.5, max_ref: 6.4 } | Thành công: alertFlag = "WARNING" (Tăng đường huyết) |
| TC_C3_08 | 11 = False (Chỉ số bình thường) | { order_id: "XN01", current_status: "PROCESSING", test_value: 5.0, min_ref: 3.9, max_ref: 6.4 } | Thành công: alertFlag = "NORMAL" |


#### 4.11.3 KIỂM THỬ DÒNG DỮ LIỆU

4.11.3.1 Cơ sở lý thuyết đồ thị dòng dữ liệu
Theo Định nghĩa 6 trong tài liệu kiểm thử: Đồ thị dòng dữ liệu $G = \langle N, E \rangle$ biểu diễn ,  tại các đỉnh và  tại các cạnh rẽ nhánh.
4.11.3.2 Bảng 1: Bảng mô tả def(i) và c-use(i) tại các đỉnh
Bảng mô tả def(i) và c-use(i) tại các đỉnh:
| Đỉnh i | def(i) | c-use(i) |
| --- | --- | --- |
| 1 | {order_id, test_value, min_ref, max_ref, general_notes, current_status} | $\emptyset$ |
| 6 | {val} | {test_value} |
| 11 | {isAbnormal} | {val, min_ref, max_ref} |
| 12 | {alertFlag} | {isAbnormal} |
| 13 | {resultRecord} | {order_id, val, alertFlag, general_notes} |
| 14, 15, 16 | $\emptyset$ | {resultRecord} |

4.11.3.3 Bảng 2: Các điều kiện và p-use của các cạnh
Bảng điều kiện và p-use của các cạnh:
| Cạnh (i,j) | Điều kiện tại cạnh (i,j) | p-use(i,j) |
| --- | --- | --- |
| (2, 3) / (2, 4) | !order_id | {order_id} |
| (4, 5) / (4, 6) | current_status !== "PROCESSING" | {current_status} |
| (7, 8) / (7, 9) | isNaN(val) \|\| val < 0 | {val} |
| (9, 10) / (9, 11) | general_notes && notes.length > 500 | {general_notes} |
| (12, 12a) / (12, 12b) | isAbnormal = True / False | {isAbnormal} |

4.11.3.4 Đồ thị dòng dữ liệu
4.11.3.5 Bảng tổng hợp chi tiết Def-Use theo biến
Bảng tổng hợp chi tiết Def-Use theo biến:
| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng điều kiện (p-use) |
| --- | --- | --- | --- |
| order_id | N1 | N13 (Gán resultRecord) | (N2, N3), (N2, N4) |
| test_value | N1 | N6 (Ép kiểu Number) | - |
| val | N6 | N11 (So sánh), N13 (Gán record) | (N7, N8), (N7, N9) |
| isAbnormal | N11 | $\emptyset$ | (N12, 12a), (N12, 12b) |
| alertFlag | N12 | N13 (Gán resultRecord) | - |
| resultRecord | N13 | N14 (Lưu DB), N15 (Event), N16 (Return) | - |

4.11.3.6 Phân tích bất thường dòng dữ liệu
Bất thường Loại 1 (dd): KHÔNG CÓ. Tất cả các biến trung gian (val, isAbnormal, alertFlag, resultRecord) đều khởi tạo 1 lần duy nhất.
Bất thường Loại 2 (ur): KHÔNG CÓ. Việc sử dụng fallback payload || {} và hàm Number(test_value) ngăn chặn hoàn toàn lỗi undefined runtime.
Bất thường Loại 3 (du): KHÔNG CÓ. Mọi biến định nghĩa đều được sử dụng tại các câu lệnh lưu và return.
4.11.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi alertFlag
Chuỗi biến đổi trạng thái chuẩn mực: u -> d -> D -> r -> R (Không xuất hiện lỗi Anomaly A).
4.11.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| test_value | N1 | N6 |  | Chuyển giá trị chuỗi thành số đo thực tế val |
| val | N6 | N11, N13 |  | Đưa chỉ số đo vào phép so sánh ngưỡng và kết quả |
| alertFlag | N12 | N13 |  | Gắn cờ cảnh báo (NORMAL/WARNING) vào kết quả |
| resultRecord | N13 | N14, N15, N16 |  | Lưu CSDL và trả về kết quả bệnh án |

4.11.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| order_id | N1 | (N2, N3) |  | !order_id = True |
| current_status | N1 | (N4, N5) |  | current_status !== "PROCESSING" |
| val | N6 | (N7, N8) |  | isNaN(val) \|\| val < 0 |
| general_notes | N1 | (N9, N10) |  | notes.length > 500 |
| isAbnormal | N11 | (N12, 12a) |  | val < min \|\| val > max (WARNING) |



### 4. Kiểm thử đơn vị


> **4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: NHẬP KẾT QUẢ XÉT NGHIỆM ĐỊNH LƯỢNG (UT11 – UT28)**



#### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Lớp [`LabResultValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.validator.js), phương thức tĩnh `validateLabResult(input)`.
- **Tập tin kiểm thử:** [`backend/test/khanh/validators/02_labResult.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.test.js)
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    order: { id: 1, type: "LAB" },
    test_value: "5.2",
    general_notes: ""
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `order`: Đối tượng chỉ định phải tồn tại, có thuộc tính `id` hợp lệ và `type === "LAB"`. Nếu `undefined`, `{}` hoặc thuộc loại `"PACS"` $\rightarrow$ Từ chối.
  2. `test_value`: Theo đặc tả y tế áp dụng cho chỉ số định lượng, giá trị phải là **số thực dương strictly ($> 0$)**.
     - Bị từ chối: Bỏ trống `""`, chứa chữ `"12.5A"`, số âm ($-5.2$), `null`, `undefined`, khoảng trắng `" "`, số $0$, vô cực `Infinity`, `NaN`, kiểu `boolean` (`true`), kiểu mảng (`[5]`), chuỗi hệ hexa (`"0x10"`).
     - Hợp lệ: Các số thực dương như $0.01$, $1$, `" 5.2 "`, `".5"`, $10$.
  3. `general_notes`: Nhận xét tổng quát không được vượt quá 500 ký tự. Cho phép nhận xét rỗng `""` hoặc đúng biên 500 ký tự.
  4. Lưu ý phạm vi: Hàm validator tập trung xác thực dữ liệu đầu vào, không đánh giá cảnh báo cờ bất thường ngoài dải tham chiếu lâm sàng (ca UT28).


#### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 11 | **UT11** | `Test_LabResult_TC_F17_01_PhieuKhongHopLeHoacSaiNhom` | Lần lượt `order = undefined; {}; {id: 1, type: "PACS"}` | Mã phiếu chỉ định xét nghiệm không hợp lệ. | `Assert.AreEqual` (vòng lặp 3 trường hợp) | **ĐẠT (PASS)** |
| 12 | **UT12** | `Test_LabResult_TC_F17_02_BoTrongGiaTri` | `test_value = ""` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 13 | **UT13** | `Test_LabResult_TC_F17_03_GiaTriLanChu` | `test_value = "12.5A"` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 14 | **UT14** | `Test_LabResult_TC_F17_04_GiaTriSoAm` | `test_value = -5.2` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 15 | **UT15** | `Test_LabResult_GiaTriNull` | `test_value = null` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 16 | **UT16** | `Test_LabResult_GiaTriUndefined` | `test_value = undefined` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 17 | **UT17** | `Test_LabResult_ChiCoKhoangTrang` | `test_value = "   "` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 18 | **UT18** | `Test_LabResult_BienKhong` | `test_value = 0` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 19 | **UT19** | `Test_LabResult_GiaTriVoCuc` | `test_value = Infinity` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 20 | **UT20** | `Test_LabResult_GiaTriNaN` | `test_value = NaN` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 21 | **UT21** | `Test_LabResult_KieuBoolean` | `test_value = true` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 22 | **UT22** | `Test_LabResult_KieuMang` | `test_value = [5]` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 23 | **UT23** | `Test_LabResult_ChuoiHe16_Hex` | `test_value = "0x10"` | Giá trị chỉ số phải là chữ số hợp lệ. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 24 | **UT24** | `Test_LabResult_TC_F17_05_NhanXetVuotQua500KyTu` | `general_notes = "a".repeat(501)` | Nhận xét tổng quát không được vượt quá 500 ký tự. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 25 | **UT25** | `Test_LabResult_TC_F17_06_NhanXetRong_HopLe` | `general_notes = ""` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 26 | **UT26** | `Test_LabResult_TC_F17_07_NhanXetDungBien500KyTu_HopLe` | `general_notes = "a".repeat(500)` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |
| 27 | **UT27** | `Test_LabResult_CacDangSoDuongHopLe` | Lần lượt `test_value = 0.01; 1; " 5.2 "; ".5"` | `null` cho từng giá trị | `Assert.IsNull` (vòng lặp 4 trường hợp) | **ĐẠT (PASS)** |
| 28 | **UT28** | `Test_LabResult_NgoaiDaiThamChieuVanHopLeDauVao` | `test_value = 10` | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |

---


#### Mã nguồn hàm kiểm tra hợp lệ (Validator Implementation):

#### 5.1.11 NHẬP KẾT QUẢ XÉT NGHIỆM


```javascript
export class LabResultValidator {
// order phải được phía gọi tra cứu từ nguồn dữ liệu tin cậy.
static validateLabResult({ order, test_value, general_notes = "" } = {}) {
if (!order?.id || order.type !== "LAB") {
return "Mã phiếu chỉ định xét nghiệm không hợp lệ.";
}
const raw = typeof test_value === "number" || typeof test_value === "string"
? String(test_value).trim() : "";
if (!/^\+?(?:\d+(?:\.\d+)?|\.\d+)$/.test(raw) ||
!Number.isFinite(Number(raw)) || Number(raw) <= 0) {
return "Giá trị chỉ số phải là chữ số hợp lệ.";
}
if (typeof general_notes !== "string" || general_notes.length > 500) {
return "Nhận xét tổng quát không được vượt quá 500 ký tự.";
}
return null;
}
}
```



#### Mã nguồn ca kiểm thử đơn vị tự động (Test Implementation):

#### 5.2.11 NHẬP KẾT QUẢ XÉT NGHIỆM


```javascript
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { LabResultValidator } from "./02_Nhap_Ket_Qua_Xet_Nghiem.validator.js";
describe("validateLabResult - Nhập kết quả xét nghiệm định lượng", () => {
const valid = { order: { id: 1, type: "LAB" }, test_value: "5.2", general_notes: "" };
test("TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm", () => {
for (const order of [undefined, {}, { id: 1, type: "PACS" }]) {
assert.equal(LabResultValidator.validateLabResult({ ...valid, order }),
"Mã phiếu chỉ định xét nghiệm không hợp lệ.");
}
});
for (const [id, value] of [
["TC_F17_02", ""], ["TC_F17_03", "12.5A"], ["TC_F17_04", -5.2],
["Bổ sung null", null], ["Bổ sung undefined", undefined], ["Bổ sung khoảng trắng", "   "],
["Biên 0", 0], ["Vô cực", Infinity], ["NaN", NaN], ["Boolean", true],
["Mảng", [5]], ["Hệ 16", "0x10"],
]) {
test(`${id} - Giá trị ${String(value)} không hợp lệ`, () => {
assert.equal(LabResultValidator.validateLabResult({ ...valid, test_value: value }),
"Giá trị chỉ số phải là chữ số hợp lệ.");
});
}
test("TC_F17_05 - Nhận xét 501 ký tự", () => {
assert.equal(LabResultValidator.validateLabResult({ ...valid, general_notes: "a".repeat(501) }),
"Nhận xét tổng quát không được vượt quá 500 ký tự.");
});
test("TC_F17_06 - Nhận xét 0 ký tự", () => {
assert.equal(LabResultValidator.validateLabResult(valid), null);
});
test("TC_F17_07 - Nhận xét 500 ký tự", () => {
assert.equal(LabResultValidator.validateLabResult({ ...valid, general_notes: "a".repeat(500) }), null);
});
test("Số dương nhỏ, số nguyên và chuỗi thập phân hợp lệ", () => {
for (const test_value of [0.01, 1, " 5.2 ", ".5"]) {
assert.equal(LabResultValidator.validateLabResult({ ...valid, test_value }), null);
}
});
test("Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào", () => {
assert.equal(LabResultValidator.validateLabResult({ ...valid, test_value: 10 }), null);
});
});
```


---

## Chức năng 3: Tải lên hình ảnh chẩn đoán và kết luận PACS

### 1. Đặc tả


#### 2.12.1. Mô tả tổng quan Use Case

| Thuộc tính | Nội dung mô tả |
| --- | --- |
| Mã Use Case (Use Case ID) | UC-CANLAMSANG-18 |
| Tên Use Case (Use Case Name) | Tải lên hình ảnh chẩn đoán và kết luận |
| Người thực hiện & Ngày tạo | Lê Tuấn Khanh — 23/09/2026 |
| Tác nhân kích hoạt (Actor) | Kỹ thuật viên chẩn đoán hình ảnh |
| Điều kiện tiên quyết (Pre-conditions) | Phiếu chỉ định thuộc nhóm chẩn đoán hình ảnh (X-quang, Siêu âm, CT/MRI,...) và bệnh nhân đã hoàn tất chụp chiếu tại phòng kỹ thuật. |
| Điều kiện sau thành công (Post-conditions) | Tệp hình ảnh y tế được tải lên và lưu trữ thành công trên máy chủ lưu trữ (PACS/Server), kèm theo nội dung mô tả giải phẫu và kết luận chẩn đoán được lưu vào hồ sơ bệnh án. |
| Kích hoạt (Trigger) | Kỹ thuật viên chọn một ca chụp chiếu đang thực hiện trên danh sách chờ và nhấn nút "Cập nhật hình ảnh & Kết luận". |


#### 2.12.2. Bảng đặc tả chi tiết các trường dữ liệu đầu vào

| STT | Tên trường | Tên hiển thị & Điều khiển | Kiểu dữ liệu | Bắt buộc | Các ràng buộc | Thông báo lỗi |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | image_files | Tệp hình ảnh chụp chiếu [File Uploader / Multi-file Picker] | File / Binary | Có | -Định dạng tệp cho phép: .jpg, .jpeg, .png, .dcm (DICOM).<br>-Dung lượng tối đa mỗi tệp không quá 25MB.<br>-Tối thiểu 01 tệp hình ảnh. | "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế." |
| 2 | image_description | Mô tả hình ảnh [Text Area] | String | Có | -Độ dài từ 10 đến 2000 ký tự.<br>-Mô tả chi tiết đặc điểm giải phẫu, vị trí tổn thương hoặc tình trạng quan sát được. | "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự)." |
| 3 | diagnostic_conclusion | Kết luận chẩn đoán [Text Area / Rich Text Editor] | String | Có | -Không được để trống.<br>-Độ dài từ 5 đến 1000 ký tự.<br>-Thể hiện kết luận chuyên môn phục vụ chỉ định của bác sĩ. | "Vui lòng nhập kết luận chẩn đoán (không quá 1000 ký tự)." |


#### 2.12.3. Đầu vào và đầu ra kiểm thử

Đầu vào (Inputs):
image_files: Tệp hình ảnh tải lên (Trống / Định dạng không hợp lệ / Dung lượng > 25MB / Hợp lệ gồm .jpg, .jpeg, .png, .dcm <= 25MB với số lượng >= 1).
image_description: Mô tả đặc điểm giải phẫu (Trống / < 10 ký tự / > 2000 ký tự / Hợp lệ từ 10 - 2000 ký tự).
diagnostic_conclusion: Kết luận chẩn đoán chuyên môn (Trống / < 5 ký tự / > 1000 ký tự / Hợp lệ từ 5 - 1000 ký tự).
Đầu ra (Expected Outputs):
A1 (Lưu thành công): Tải tệp lên máy chủ lưu trữ (PACS/Server), lưu nội dung mô tả cùng kết luận vào hồ sơ bệnh án và hiển thị thông báo thành công.
A2 (Lỗi tệp hình ảnh): Chặn lưu, hiển thị thông báo lỗi: "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế."
A3 (Lỗi mô tả hình ảnh): Chặn lưu, hiển thị thông báo lỗi: "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự)."
A4 (Lỗi kết luận chẩn đoán): Chặn lưu, hiển thị thông báo lỗi: "Vui lòng nhập kết luận chẩn đoán (không quá 1000 ký tự)."


### 2. Kiểm thử hộp đen

Việc thiết kế ca kiểm thử cho chức năng "Tải lên hình ảnh chẩn đoán và kết luận" sử dụng các kỹ thuật Phân vùng tương đương, Phân tích giá trị biên và Bảng quyết định nhằm đảm bảo kiểm soát chặt chẽ dung lượng, định dạng tệp đa phương tiện cũng như độ dài của các trường văn bản chuyên môn.

**a) Kỹ thuật Phân vùng tương đương và Phân tích giá trị biên Tập trung vào kiểm tra định dạng/dung lượng tệp và độ dài các trường nhập liệu văn bản.**

Trường image_files (Tệp hình ảnh):
Miền hợp lệ: Số lượng , dung lượng /tệp, định dạng (.jpg, .jpeg, .png, .dcm).
Giá trị biên: 1 tệp (Min số lượng), 25MB (Max dung lượng).
Miền không hợp lệ: Bỏ trống (0 tệp), dung lượng /tệp, sai định dạng (VD: .pdf, .docx).
Giá trị biên: 0 tệp (Min-), 25.1MB hoặc 26MB (Max+).
Trường image_description (Mô tả hình ảnh):
Miền hợp lệ: Chuỗi từ 10 đến 2000 ký tự. Giá trị biên: 10 ký tự (Min), 2000 ký tự (Max).
Miền không hợp lệ: Dưới 10 ký tự (hoặc để trống), vượt quá 2000 ký tự. Giá trị biên: 9 ký tự (Min-), 2001 ký tự (Max+).
Trường diagnostic_conclusion (Kết luận chẩn đoán):
Miền hợp lệ: Chuỗi từ 5 đến 1000 ký tự. Giá trị biên: 5 ký tự (Min), 1000 ký tự (Max).
Miền không hợp lệ: Dưới 5 ký tự (hoặc để trống), vượt quá 1000 ký tự. Giá trị biên: 4 ký tự (Min-), 1001 ký tự (Max+).

**b) Kỹ thuật Bảng quyết định cho luồng nghiệp vụ**

- **Bước 1: Xác định các điều kiện và hành động**
Các điều kiện (C):
C1: image_files tải lên có hợp lệ không (tối thiểu 1 tệp, đúng định dạng, )?
C2: image_description có độ dài hợp lệ (10 - 2000 ký tự) không?
C3: diagnostic_conclusion có độ dài hợp lệ (5 - 1000 ký tự) không?
Các hành động (A):
A1: Chặn lưu, báo lỗi: "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế."
A2: Chặn lưu, báo lỗi: "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự)."
A3: Chặn lưu, báo lỗi: "Vui lòng nhập kết luận chẩn đoán (không quá 1000 ký tự)."
A4: Tải tệp lên máy chủ lưu trữ (PACS/Server), lưu nội dung mô tả cùng kết luận vào hồ sơ bệnh án và hiển thị thông báo thành công.
- **Bước 2: Xây dựng Bảng quyết định**
| Điều kiện (C) | C1: Tệp hình ảnh hợp lệ? | F | T | T | T |
| --- | --- | --- | --- | --- | --- |
|  | C2: Mô tả hình ảnh hợp lệ? | - | F | T | T |
|  | C3: Kết luận chẩn đoán hợp lệ? | - | - | F | T |
| Hành động (A) | A1: Báo lỗi tệp hình ảnh | X |  |  |  |
|  | A2: Báo lỗi độ dài mô tả |  | X |  |  |
|  | A3: Báo lỗi độ dài kết luận |  |  | X |  |
|  | A4: Lưu thành công lên PACS/Server |  |  |  | X |

(Ghi chú: Ký hiệu "-" biểu thị điều kiện không xét đến vì logic đã bị chặn ở bước trước).

**c) Danh sách ca kiểm thử cụ thể**

Dựa trên việc phân tích giá trị biên và các quy tắc từ Bảng quyết định, danh sách ca kiểm thử chi tiết được thiết lập như sau:
| Mã TC | Kỹ thuật áp dụng | Kịch bản / Dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_F18_01 | Giá trị biên (Q1) | Không chọn tệp nào (0 tệp - Min-). Bấm Lưu. | Báo lỗi: "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế." |
| TC_F18_02 | Phân vùng TĐ (Q1) | Tải lên 1 tệp sai định dạng (VD: ketqua.pdf). | Báo lỗi: "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế." |
| TC_F18_03 | Giá trị biên (Q1) | Tải lên 1 tệp định dạng .dcm có dung lượng 26MB (Max+). | Báo lỗi: "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế." |
| TC_F18_04 | Giá trị biên (Q2) | Tệp hợp lệ. Nhập image_description dài 9 ký tự (Min-). | Báo lỗi: "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự)." |
| TC_F18_05 | Giá trị biên (Q2) | Tệp hợp lệ. Nhập image_description dài 2001 ký tự (Max+). | Báo lỗi: "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự)." |
| TC_F18_06 | Giá trị biên (Q3) | Tệp hợp lệ, Mô tả hợp lệ. Nhập diagnostic_conclusion dài 4 ký tự (Min-). | Báo lỗi: "Vui lòng nhập kết luận chẩn đoán (không quá 1000 ký tự)." |
| TC_F18_07 | Giá trị biên (Q3) | Tệp hợp lệ, Mô tả hợp lệ. Nhập diagnostic_conclusion dài 1001 ký tự (Max+). | Báo lỗi: "Vui lòng nhập kết luận chẩn đoán (không quá 1000 ký tự)." |
| TC_F18_08 | Giá trị biên / BQ (Q4) | Tải 1 tệp .jpg (vừa đúng 25MB). Nhập image_description đúng 10 ký tự. Nhập diagnostic_conclusion đúng 5 ký tự. Bấm Lưu. | Lưu thành công. Tệp đẩy lên PACS/Server, thông tin lưu vào bệnh án. Hiển thị thông báo thành công. |
| TC_F18_09 | Giá trị biên / BQ (Q4) | Tải nhiều tệp .png hợp lệ. Nhập image_description đúng 2000 ký tự. Nhập diagnostic_conclusion đúng 1000 ký tự. Bấm Lưu. | Lưu thành công. Tệp đẩy lên PACS/Server, thông tin lưu vào bệnh án. Hiển thị thông báo thành công. |



### 3. Kiểm thử hộp trắng


#### 4.12.1 ĐÁNH SỐ DÒNG MÃ NGUỒN CHUẨN THUẬT TOÁN


```javascript
javascript
function executeUploadPacsDiagnostic(payload) {
1.  const { order_id, file_name, file_size_mb, description, conclusion, current_status } = payload || {};
2.  if (!order_id)
3.      throw new Error("Mã chỉ định chụp chiếu không được để trống");
4.  if (current_status !== "PROCESSING")
5.      throw new Error("Phiếu chỉ định chưa ở trạng thái đang thực hiện");
6.  if (!file_name || !(/\.(jpg|jpeg|png|dcm)$/i.test(file_name)))
7.      throw new Error("Định dạng tệp hình ảnh y tế không hợp lệ (.jpg, .jpeg, .png, .dcm)");
8.  const size = Number(file_size_mb) || 0;
9.  if (size <= 0 || size > 25)
10.     throw new Error("Dung lượng tệp hình ảnh không hợp lệ (cho phép từ 0 đến 25MB)");
11. if (!description || description.length < 10 || description.length > 2000)
12.     throw new Error("Mô tả hình ảnh phải có độ dài từ 10 đến 2000 ký tự");
13. if (!conclusion || conclusion.length < 5 || conclusion.length > 1000)
14.     throw new Error("Kết luận chẩn đoán phải có độ dài từ 5 đến 1000 ký tự");
15. const pacsRecord = { order_id, file_name, file_size_mb: size, description, conclusion, status: "COMPLETED" };
16. pacsRepository.saveImage(pacsRecord);
17. eventBus.emitEvent("PACS_IMAGE_UPLOADED", { pacs: pacsRecord });
18. return pacsRecord;
}
```


#### 4.12.2 KIỂM THỬ DÒNG ĐIỀU KHIỂN

4.12.2.1 Đồ thị dòng điều khiển cho Độ đo C1 và C2
4.12.2.2 Phân tích độ phức tạp cho C1/C2
Trên đồ thị C1/C2:
Số điểm quyết định  (tại các đỉnh 2, 4, 6, 9, 11, 13).
Công thức McCabe:
Cần tối thiểu 7 đường đi cơ sở (Basis Paths) để bao phủ toàn bộ luồng rẽ nhánh của đồ thị C1/C2.
4.12.2.3 Thiết kế ca kiểm thử cho Độ đo C1
Mục tiêu C1: Thực thi qua tất cả các câu lệnh từ câu lệnh 1 đến 18 ít nhất một lần.
Tập hợp các ca kiểm thử đạt 100% C1:
Cần kích hoạt 6 nhánh throw lỗi (câu lệnh 3, 5, 7, 10, 12, 14).
Cần đi qua khối xử lý lưu ảnh PACS thành công (câu lệnh 15..18).
Bảng thiết kế ca kiểm thử cho Độ đo C1:
| TT | Mã TC | Đường đi kiểm thử | Bộ dữ liệu đầu vào (payload) | Kết quả mong đợi | Câu lệnh được phủ |
| --- | --- | --- | --- | --- | --- |
| 1 | TC_C1_01 |  | { order_id: "" } | Lỗi: “Mã chỉ định chụp chiếu không được để trống” | 1, 2, 3 |
| 2 | TC_C1_02 |  | { order_id: "PACS01", current_status: "PENDING" } | Lỗi: “Phiếu chỉ định chưa ở trạng thái đang thực hiện” | 4, 5 |
| 3 | TC_C1_03 |  | { order_id: "PACS01", current_status: "PROCESSING", file_name: "ketqua.pdf" } | Lỗi: “Định dạng tệp hình ảnh y tế không hợp lệ (.jpg, .jpeg, .png, .dcm)” | 6, 7 |
| 4 | TC_C1_04 |  | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.dcm", file_size_mb: 30 } | Lỗi: “Dung lượng tệp hình ảnh không hợp lệ (cho phép từ 0 đến 25MB)” | 8, 9, 10 |
| 5 | TC_C1_05 |  | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.jpg", file_size_mb: 5, description: "Ngan" } | Lỗi: “Mô tả hình ảnh phải có độ dài từ 10 đến 2000 ký tự” | 11, 12 |
| 6 | TC_C1_06 |  | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.jpg", file_size_mb: 5, description: "Hình ảnh tổn thương phổi thùy dưới", conclusion: "K" } | Lỗi: “Kết luận chẩn đoán phải có độ dài từ 5 đến 1000 ký tự” | 13, 14 |
| 7 | TC_C1_07 |  | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.dcm", file_size_mb: 12, description: "Hình ảnh dày dính màng phổi góc sườn hoành", conclusion: "Viêm phổi kẽ thùy dưới, theo dõi lao" } | Thành công: status = "COMPLETED", lưu trữ tệp PACS | 15, 16, 17, 18 |

Tỷ lệ bao phủ C1: 18/18 câu lệnh = 100%.
4.12.2.4 Thiết kế ca kiểm thử cho Độ đo C2
Mục tiêu C2: Mọi điểm quyết định tại các đỉnh 2, 4, 6, 9, 11, 13 đều phải có ca kiểm thử thực thi nhánh ĐÚNG (True) và nhánh SAI (False).
Bảng ma trận nhánh quyết định C2:
| Điểm quyết định | Biểu thức điều kiện | Nhánh ĐÚNG (True) | Nhánh SAI (False) |
| --- | --- | --- | --- |
| Đỉnh 2 | !order_id | TC_C2_01 (Nhảy sang Đỉnh 3) | TC_C2_02 (Đi tiếp Đỉnh 4) |
| Đỉnh 4 | current_status !== "PROCESSING" | TC_C2_03 (Nhảy sang Đỉnh 5) | TC_C2_04 (Đi tiếp Đỉnh 6) |
| Đỉnh 6 | !file_name \|\| !regex | TC_C2_05 (Nhảy sang Đỉnh 7) | TC_C2_06 (Đi tiếp Đỉnh 8-9) |
| Đỉnh 9 | size <= 0 \|\| size > 25 | TC_C2_07 (Nhảy sang Đỉnh 10) | TC_C2_08 (Đi tiếp Đỉnh 11) |
| Đỉnh 11 | !desc \|\| len < 10 \|\| len > 2000 | TC_C2_09 (Nhảy sang Đỉnh 12) | TC_C2_10 (Đi tiếp Đỉnh 13) |
| Đỉnh 13 | !conclusion \|\| len < 5 \|\| len > 1000 | TC_C2_11 (Nhảy sang Đỉnh 14) | TC_C2_12 (Đi tiếp Đỉnh 15..18) |

Bảng tổng hợp ca kiểm thử đạt 100% C2:
| Mã TC | Điểm QĐ phủ | Bộ dữ liệu đầu vào | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC_C2_01 | Đỉnh 2 (True) | { order_id: "" } | Lỗi: “Mã chỉ định chụp chiếu không được để trống” |
| TC_C2_02 | Đỉnh 2 (F), 4 (F), 6 (F), 9 (F), 11 (F), 13 (F) | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.dcm", file_size_mb: 12, description: "Hình ảnh dày dính màng phổi góc sườn hoành", conclusion: "Viêm phổi kẽ thùy dưới" } | Tải ảnh và lưu kết luận PACS thành công, status = "COMPLETED" |
| TC_C2_03 | Đỉnh 4 (True) | { order_id: "PACS01", current_status: "PENDING" } | Lỗi: “Phiếu chỉ định chưa ở trạng thái đang thực hiện” |
| TC_C2_05 | Đỉnh 6 (True) | { order_id: "PACS01", current_status: "PROCESSING", file_name: "ketqua.pdf" } | Lỗi: “Định dạng tệp hình ảnh y tế không hợp lệ…” |
| TC_C2_07 | Đỉnh 9 (True) | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.dcm", file_size_mb: 30 } | Lỗi: “Dung lượng tệp hình ảnh không hợp lệ (cho phép từ 0 đến 25MB)” |
| TC_C2_09 | Đỉnh 11 (True) | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.jpg", file_size_mb: 5, description: "Ngan" } | Lỗi: “Mô tả hình ảnh phải có độ dài từ 10 đến 2000 ký tự” |
| TC_C2_11 | Đỉnh 13 (True) | { order_id: "PACS01", current_status: "PROCESSING", file_name: "xquang.jpg", file_size_mb: 5, description: "Hình ảnh tổn thương phổi thùy dưới", conclusion: "K" } | Lỗi: “Kết luận chẩn đoán phải có độ dài từ 5 đến 1000 ký tự” |

Tỷ lệ bao phủ C2: 12/12 nhánh quyết định = 100%.
4.12.2.5 Đồ thị dòng điều khiển cho Độ đo C3
4.12.3.5 Bảng tổng hợp chi tiết Def-Use theo biến
Bảng tổng hợp chi tiết Def-Use theo biến:
| Tên biến | Điểm định nghĩa (def) | Điểm sử dụng tính toán (c-use) | Cạnh sử dụng điều kiện (p-use) |
| --- | --- | --- | --- |
| order_id | N1 | N15 (Gán pacsRecord) | (N2, N3), (N2, N4) |
| file_name | N1 | N15 (Gán pacsRecord) | (N6, N7), (N6, N8) |
| size | N8 | N15 (Gán pacsRecord) | (N9, N10), (N9, N11) |
| description | N1 | N15 (Gán pacsRecord) | (N11, N12), (N11, N13) |
| conclusion | N1 | N15 (Gán pacsRecord) | (N13, N14), (N13, N15) |
| pacsRecord | N15 | N16 (Lưu PACS), N17 (Event), N18 (Return) | - |

4.12.3.6 Phân tích bất thường dòng dữ liệu
Bất thường Loại 1 (dd): KHÔNG CÓ. Tất cả các biến trung gian (size, pacsRecord) đều khởi tạo 1 lần duy nhất.
Bất thường Loại 2 (ur): KHÔNG CÓ. Đoạn code đã dùng cơ chế fallback payload || {} và Number(file_size_mb) || 0 ngăn chặn lỗi undefined.
Bất thường Loại 3 (du): KHÔNG CÓ. Mọi biến định nghĩa đều được sử dụng tại các câu lệnh lưu và return.
4.12.3.7 Sơ đồ chuyển trạng thái U-D-R-A cho biến cốt lõi pacsRecord
Chuỗi biến đổi trạng thái chuẩn mực: u -> d -> D -> r -> R (Không xuất hiện lỗi Anomaly A).
4.12.3.8 Sinh đường đi và Ca kiểm thử ứng với Độ đo All c-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All c-use:
| Tên biến | Điểm def | Điểm c-use | Đường đi kiểm thử (def-clear path) | Mục đích kiểm tra |
| --- | --- | --- | --- | --- |
| file_size_mb | N1 | N8 |  | Ép kiểu dung lượng file sang số thực |
| size | N8 | N15 |  | Đưa dung lượng file vào bản ghi PACS |
| file_name | N1 | N15 |  | Đưa tên tệp hình ảnh vào bản ghi PACS |
| pacsRecord | N15 | N16, N17, N18 |  | Lưu server PACS, phát event và return |

4.12.3.9 Sinh đường đi và Ca kiểm thử ứng với Độ đo All p-use
Bảng sinh đường đi và ca kiểm thử ứng với Độ đo All p-use:
| Tên biến | Điểm def | Cạnh p-use tương ứng | Đường đi kiểm thử (def-clear path) | Điều kiện kích hoạt cạnh |
| --- | --- | --- | --- | --- |
| order_id | N1 | (N2, N3) |  | !order_id = True |
| current_status | N1 | (N4, N5) |  | current_status !== "PROCESSING" |
| file_name | N1 | (N6, N7) |  | Đuôi file sai quy định |
| size | N8 | (N9, N10) |  | size <= 0 \|\| size > 25MB |
| description | N1 | (N11, N12) |  | Độ dài mô tả ngoài [10, 2000] |
| conclusion | N1 | (N13, N14) |  | Độ dài kết luận ngoài [5, 1000] |



### 4. Kiểm thử đơn vị


> **5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: HÌNH ẢNH VÀ KẾT LUẬN CHẨN ĐOÁN PACS (UT29 – UT45)**



#### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử

- **Đơn vị kiểm thử:** Lớp [`PacsValidator`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.validator.js), phương thức tĩnh `validatePacs(input)`.
- **Tập tin kiểm thử:** [`backend/test/khanh/validators/03_pacs.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.test.js)
- **Hằng số quy ước:** $MB = 1024 \times 1024 = 1{,}048{,}576$ byte.
- **Bộ dữ liệu mặc định (Baseline Object):**
  ```javascript
  {
    image_files: [{ name: "phoi.jpg", size: 1024 * 1024 }],
    image_description: "a".repeat(10),
    diagnostic_conclusion: "a".repeat(5)
  }
  ```
- **Quy tắc kiểm tra tính hợp lệ dữ liệu:**
  1. `image_files`: Danh sách tệp hình ảnh y tế.
     - Phải là một mảng không rỗng (`length > 0`).
     - Định dạng tệp được phép: `.jpg`, `.jpeg`, `.png`, `.dcm` (không phân biệt hoa thường, ví dụ `.DCM` hợp lệ). Tệp `.pdf` hoặc sai định dạng bị chặn.
     - Dung lượng tệp: Phải là số dương hữu hạn, $0 < \text{size} \le 25 \times MB$ ($25$ MB). Các giá trị $0$ byte, $> 25$ MB, `NaN`, `Infinity` đều bị từ chối.
     - Kiểm tra toàn diện danh sách: Nếu có bất kỳ tệp nào trong danh sách vi phạm quy tắc, toàn bộ yêu cầu bị từ chối.
  2. `image_description`: Mô tả hình ảnh sau khi cắt tỉa khoảng trắng (`trim()`) phải có độ dài từ 10 đến 2000 ký tự ($10 \le \text{length} \le 2000$). Chuỗi chỉ chứa khoảng trắng được xem như rỗng (0 ký tự).
  3. `diagnostic_conclusion`: Kết luận chẩn đoán sau khi cắt tỉa khoảng trắng (`trim()`) phải có độ dài từ 5 đến 1000 ký tự ($5 \le \text{length} \le 1000$). Chuỗi chỉ chứa khoảng trắng bị từ chối.


#### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)


| STT | Mã Ca | Tên kiểm thử NUnit chuẩn | Dữ liệu đầu vào kiểm thử | Kết quả kỳ vọng (Expected) | Phương thức Assert NUnit | Kết quả chạy |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| 29 | **UT29** | `Test_Pacs_KhongChonTep_MangRong` | `image_files = []` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 30 | **UT30** | `Test_Pacs_ThieuDanhSachTep_Undefined` | `image_files = undefined` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 31 | **UT31** | `Test_Pacs_SaiDinhDangTepPDF` | `image_files = [{name: "phoi.pdf", size: MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 32 | **UT32** | `Test_Pacs_DungLuongVuot25MB` | `image_files = [{name: "phoi.jpg", size: 25.1 * MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 33 | **UT33** | `Test_Pacs_TepRong0Byte` | `image_files = [{name: "phoi.jpg", size: 0}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 34 | **UT34** | `Test_Pacs_DungLuongNaN` | `image_files = [{name: "phoi.jpg", size: NaN}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 35 | **UT35** | `Test_Pacs_DungLuongVoCucInfinity` | `image_files = [{name: "phoi.jpg", size: Infinity}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 36 | **UT36** | `Test_Pacs_TepThuHaiTrongDanhSachBiSai` | `image_files = [{name: "phoi.jpg", size: MB}, {name: "a.pdf", size: MB}]` | Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế. | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 37 | **UT37** | `Test_Pacs_MoTa0KyTu_Rong` | `image_description = ""` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 38 | **UT38** | `Test_Pacs_MoTa9KyTu_DuoiMin` | `image_description = "a".repeat(9)` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 39 | **UT39** | `Test_Pacs_MoTa2001KyTu_VuotMax` | `image_description = "a".repeat(2001)` | Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 40 | **UT40** | `Test_Pacs_KetLuan0KyTu_Rong` | `diagnostic_conclusion = ""` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 41 | **UT41** | `Test_Pacs_KetLuan4KyTu_DuoiMin` | `diagnostic_conclusion = "a".repeat(4)` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 42 | **UT42** | `Test_Pacs_KetLuan1001KyTu_VuotMax` | `diagnostic_conclusion = "a".repeat(1001)` | Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự). | `Assert.AreEqual` | **ĐẠT (PASS)** |
| 43 | **UT43** | `Test_Pacs_VanBanChiCoKhoangTrang_2Luot` | Lượt 1: `desc = " ".repeat(10)`<br>Lượt 2: `concl = " ".repeat(5)` | Lượt 1: Báo lỗi mô tả hình ảnh.<br>Lượt 2: Báo lỗi kết luận chẩn đoán. | `Assert.AreEqual` (kiểm tra cả 2 lượt) | **ĐẠT (PASS)** |
| 44 | **UT44** | `Test_Pacs_CacGiaTriBienHopLe_4ToHop` | Tệp `phoi.DCM` đúng $25 \times MB$; $\text{length}(desc) \in \{10, 2000\}$; $\text{length}(concl) \in \{5, 1000\}$ | `null` cho cả 4 tổ hợp biên | `Assert.IsNull` (vòng lặp 4 tổ hợp) | **ĐẠT (PASS)** |
| 45 | **UT45** | `Test_Pacs_NhieuTepDungDinhDang_HopLe` | 4 tệp: `phoi.jpg`, `phoi.jpeg`, `phoi.png`, `phoi.dcm` (mỗi tệp 1 MB) | `null` | `Assert.IsNull` | **ĐẠT (PASS)** |

---


#### Mã nguồn hàm kiểm tra hợp lệ (Validator Implementation):

#### 5.1.12 CHUẨN ĐOÁN HÌNH ẢNH VÀ KẾT LUẬN PACS


```javascript
export class PacsValidator {
// 3.12: Kiểm tra metadata từng tệp; size tính bằng byte, 1 MB = 1024² byte.
// Không thực hiện upload hoặc xác minh nội dung nhị phân của tệp.
static validatePacs({
image_files,
image_description,
diagnostic_conclusion,
} = {}) {
if (!Array.isArray(image_files) || image_files.length === 0 ||
image_files.some((file) =>
!file || typeof file.name !== "string" ||
!/\.(jpg|jpeg|png|dcm)$/i.test(file.name) ||
typeof file.size !== "number" || !Number.isFinite(file.size) ||
file.size <= 0 || file.size > 25 * 1024 * 1024)) {
return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
}
if (typeof image_description !== "string" ||
image_description.trim().length < 10 || image_description.length > 2000) {
return "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).";
}
if (typeof diagnostic_conclusion !== "string" ||
diagnostic_conclusion.trim().length < 5 || diagnostic_conclusion.length > 1000) {
return "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).";
}
return null;
}
}
```


#### 5.2 HÀM KIỂM THỬ



#### Mã nguồn ca kiểm thử đơn vị tự động (Test Implementation):

#### 5.2.12 CHUẨN ĐOÁN HÌNH ẢNH VÀ KẾT LUẬN PACS


```javascript
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { PacsValidator } from "./03_Hinh_Anh_Ket_Luan_PACS.validator.js";
describe("validatePacs - Tệp hình ảnh, mô tả và kết luận", () => {
const MB = 1024 * 1024;
const valid = {
image_files: [{ name: "phoi.jpg", size: MB }],
image_description: "a".repeat(10), diagnostic_conclusion: "a".repeat(5),
};
const fileError = "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
for (const [title, image_files] of [
["Không chọn tệp", []], ["Thiếu danh sách tệp", undefined],
["Sai định dạng", [{ name: "phoi.pdf", size: MB }]],
["Vượt 25MB", [{ name: "phoi.jpg", size: 25.1 * MB }]],
["Tệp 0 byte", [{ name: "phoi.jpg", size: 0 }]],
["Dung lượng NaN", [{ name: "phoi.jpg", size: NaN }]],
["Dung lượng vô cực", [{ name: "phoi.jpg", size: Infinity }]],
["Có tệp thứ hai sai", [...valid.image_files, { name: "a.pdf", size: MB }]],
]) {
test(title, () => {
assert.equal(PacsValidator.validatePacs({ ...valid, image_files }), fileError);
});
}
for (const length of [0, 9, 2001]) {
test(`Mô tả ${length} ký tự không hợp lệ`, () => {
assert.equal(PacsValidator.validatePacs({ ...valid, image_description: "a".repeat(length) }),
"Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).");
});
}
for (const length of [0, 4, 1001]) {
test(`Kết luận ${length} ký tự không hợp lệ`, () => {
assert.equal(PacsValidator.validatePacs({ ...valid, diagnostic_conclusion: "a".repeat(length) }),
"Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).");
});
}
test("Văn bản chỉ chứa khoảng trắng không hợp lệ", () => {
assert.equal(PacsValidator.validatePacs({ ...valid, image_description: " ".repeat(10) }),
"Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).");
assert.equal(PacsValidator.validatePacs({ ...valid, diagnostic_conclusion: " ".repeat(5) }),
"Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).");
});
test("Hợp lệ - Đúng các biên Min/Max của văn bản và 25MB/tệp", () => {
for (const image_description of ["a".repeat(10), "a".repeat(2000)]) {
for (const diagnostic_conclusion of ["a".repeat(5), "a".repeat(1000)]) {
assert.equal(PacsValidator.validatePacs({
image_files: [{ name: "phoi.DCM", size: 25 * MB }],
image_description, diagnostic_conclusion,
}), null);
}
}
});
test("Hợp lệ - Các định dạng được phép và nhiều tệp", () => {
assert.equal(PacsValidator.validatePacs({ ...valid,
image_files: ["jpg", "jpeg", "png", "dcm"].map((ext) => ({ name: `phoi.${ext}`, size: MB })),
}), null);
});
});
```


---
