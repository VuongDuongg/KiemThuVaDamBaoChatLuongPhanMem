# Tổng hợp test case kiểm thử đơn vị — Nguyễn Hồng Thái

Ngày xác minh: 26/10/2026. Phạm vi: ba file unit test validate đã tạo cho chức năng 1.1–1.3. Tổng cộng **45 ca: 45 đạt, 0 không đạt, 0 bỏ qua**.

Mỗi dòng tương ứng một `test()` khi chạy. Một số ca có nhiều bộ dữ liệu hoặc nhiều phép so sánh; các biến thể đều được ghi trong bảng. Mã UT01–UT45 là số thứ tự tổng hợp, giữ mã TC_F01/TC_F02/TC_F03 sẵn có trong tên ca.

Các ca kiểm tra trực tiếp hàm validate, không kiểm tra thao tác giao diện, lưu CSDL, in phiếu khám hoặc kết nối bảng hiển thị điện tử. `null` nghĩa là đầu vào hợp lệ; chuỗi thông báo nghĩa là đầu vào bị từ chối.

## 01. Đăng ký hồ sơ bệnh nhân mới (Chức năng 1.1)

Hàm: `PatientRegistrationValidator.validateCreatePatient`. Các trường không ghi trong bảng giữ dữ liệu mặc định sau:

```javascript
{ full_name: "Nguyen Van A", dob: "1990-05-15", gender: "MALE",
  phone: "0912345678", cccd: "001090012345", address: "123 Le Loi, Hanoi" }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT01 | TC_F01_01 — Họ tên rỗng | full_name = "" | Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số). | Đạt |
| UT02 | TC_F01_02 — Họ tên chứa số/KĐB | full_name = "Nguyen Van A123@" | Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số). | Đạt |
| UT03 | TC_F01_03 — Ngày sinh ở tương lai | dob = "2030-01-01" | Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại). | Đạt |
| UT04 | TC_F01_04 — SĐT sai định dạng | phone = "091234" | Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam). | Đạt |
| UT05 | TC_F01_05 — CCCD sai độ dài | cccd = "12345" | Số CCCD/Định danh cá nhân phải đúng 12 chữ số. | Đạt |
| UT06 | TC_F01_06 — Hợp lệ | Dữ liệu mặc định | null | Đạt |
| UT07 | SĐT chứa ký tự chữ | phone = "091234567a" | Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam). | Đạt |
| UT08 | CCCD chứa ký tự chữ | cccd = "00109001234a" | Số CCCD/Định danh cá nhân phải đúng 12 chữ số. | Đạt |
| UT09 | Khoảng trắng ở hai đầu họ tên | full_name = "  Nguyen Van A  " | null | Đạt |
| UT10 | Giới tính không hợp lệ | gender = "UNKNOWN" | Giới tính không hợp lệ (chỉ chấp nhận MALE, FEMALE, OTHER). | Đạt |

## 02. Đăng ký khám và cấp số thứ tự (Chức năng 1.2)

Hàm: `ClinicAppointmentValidator.validateCreateAppointment`. Dữ liệu mặc định:

```javascript
{ patient_id: 101, clinic_id: 5, insurance_type: "NONE",
  insurance_code: "", reason: "Kham suc khoe dinh ky" }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT11 | TC_F02_01 — Bệnh nhân không tồn tại | patient_id = null | Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống. | Đạt |
| UT12 | TC_F02_02 — Chưa chọn phòng khám | clinic_id = undefined | Vui lòng chọn phòng khám chuyên khoa. | Đạt |
| UT13 | TC_F02_03 — BHYT đúng chuẩn | insurance_type = "BHYT"; insurance_code = "DN4010123456789" | null | Đạt |
| UT14 | TC_F02_04 — Mã BHYT sai độ dài | insurance_type = "BHYT"; insurance_code = "DN123" | Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số). | Đạt |
| UT15 | Thiếu mã BHYT khi chọn BHYT | insurance_type = "BHYT"; insurance_code = "" | Vui lòng nhập mã thẻ BHYT khi đăng ký đối tượng Bảo hiểm y tế. | Đạt |
| UT16 | Mã BHYT có ký tự đặc biệt | insurance_type = "BHYT"; insurance_code = "DN401012345678@" | Mã thẻ BHYT không hợp lệ (phải bao gồm đúng 15 ký tự chữ và số). | Đạt |
| UT17 | Lý do khám quá ngắn | reason = "Kham" | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | Đạt |
| UT18 | Lý do khám rỗng | reason = "" | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | Đạt |
| UT19 | Lý do khám vượt 500 ký tự | reason = "a" × 501 | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | Đạt |
| UT20 | Lý do khám đúng 500 ký tự | reason = "a" × 500 | null | Đạt |
| UT21 | Lý do khám chỉ chứa khoảng trắng | reason = "     " | Vui lòng nhập lý do khám bệnh (tối thiểu 5 ký tự, tối đa 500 ký tự). | Đạt |
| UT22 | Loại bảo hiểm không hợp lệ | insurance_type = "INVALID" | Loại đối tượng KCB không hợp lệ (chỉ chấp nhận NONE, BHYT, SERVICE). | Đạt |
| UT23 | ID phòng khám âm | clinic_id = -1 | Vui lòng chọn phòng khám chuyên khoa. | Đạt |
| UT24 | ID bệnh nhân là chuỗi chữ | patient_id = "ABC" | Mã bệnh nhân không được để trống hoặc không tồn tại trên hệ thống. | Đạt |
| UT25 | TC_F02_05 — Nhận xét/Lý do khám biên 5 ký tự | reason = "12345" | null | Đạt |
| UT26 | BHYT có khoảng trắng thừa | insurance_type = "BHYT"; insurance_code = " DN4010123456789 " | null | Đạt |
| UT27 | Đăng ký dịch vụ không thẻ BHYT | insurance_type = "SERVICE"; insurance_code = "" | null | Đạt |
| UT28 | ID phòng khám không phải số | clinic_id = "NO_ID" | Vui lòng chọn phòng khám chuyên khoa. | Đạt |

## 03. Điều phối và gọi số khám (Chức năng 1.3)

Hàm: `QueueDispatchValidator.validateQueueDispatch`. Dữ liệu mặc định:

```javascript
{ clinic_id: 5, current_ticket_number: 10,
  action: "CALL_NEXT", target_room_id: 102 }
```

| STT | Tên ca kiểm thử | Dữ liệu đầu vào thay đổi | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|---|
| UT29 | Không chọn phòng điều phối | clinic_id = null | Thông tin phòng khám điều phối không hợp lệ. | Đạt |
| UT30 | Số thứ tự hiện tại âm | current_ticket_number = -5 | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | Đạt |
| UT31 | Hành động không thuộc danh mục | action = "JUMP_QUEUE" | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | Đạt |
| UT32 | Chuyển phòng nhưng thiếu room_id | action = "TRANSFER"; target_room_id = null | Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân. | Đạt |
| UT33 | Chuyển phòng sang chính phòng cũ | action = "TRANSFER"; target_room_id = 5 | Phòng khám đích phải khác với phòng khám hiện tại. | Đạt |
| UT34 | Số thứ tự không phải là số | current_ticket_number = "ABC" | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | Đạt |
| UT35 | Số thứ tự bằng 0 | current_ticket_number = 0 | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | Đạt |
| UT36 | Số thứ tự là số thực | current_ticket_number = 10.5 | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | Đạt |
| UT37 | Hành động gọi lại hợp lệ | action = "RECALL" | null | Đạt |
| UT38 | Hành động bỏ qua hợp lệ | action = "SKIP" | null | Đạt |
| UT39 | Chuyển phòng hợp lệ | action = "TRANSFER"; target_room_id = 103 | null | Đạt |
| UT40 | Hành động rỗng | action = "" | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | Đạt |
| UT41 | Phòng đích là chuỗi không hợp lệ | action = "TRANSFER"; target_room_id = "ROOM_A" | Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân. | Đạt |
| UT42 | Thiếu hành động (undefined) | action = undefined | Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER). | Đạt |
| UT43 | Điều phối khi số thứ tự là Infinity | current_ticket_number = Infinity | Số thứ tự gọi khám phải là số nguyên dương hợp lệ. | Đạt |
| UT44 | Các biên số thứ tự hợp lệ | current_ticket_number ∈ {1, 9999} | null cho các trường hợp | Đạt |
| UT45 | Truyền tham số phòng khám hợp lệ kiểu chuỗi số | clinic_id = "5"; target_room_id = "102" | null | Đạt |


Các file nguồn nằm tại `his-hospital/backend/test/thai/validators/`, gồm ba cặp file `.validator.js` và `.test.js` đánh số 01, 02, 03.