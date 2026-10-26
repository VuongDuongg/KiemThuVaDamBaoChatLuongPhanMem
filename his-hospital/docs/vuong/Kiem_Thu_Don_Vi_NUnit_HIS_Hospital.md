# BÁO CÁO ÁP DỤNG KIỂM THỬ ĐƠN VỊ (UNIT TESTING) THEO CHUẨN NUNIT
## HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)

**Tài liệu tham chiếu:** `docs/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Phạm vi áp dụng:** Thực hiện kiểm thử đơn vị cho 3 chức năng nghiệp vụ trọng tâm:
1. **Lập hóa đơn viện phí** (`createInvoice` kết hợp quy tắc `StandardBillingStrategy.calculate`)
2. **Thanh toán hóa đơn viện phí** (`processPayment` kết hợp `PaymentMethodValidatorStrategy` và `InvoiceStateMachine`)
3. **Quản lý danh mục thuốc và tồn kho dược** (Trọn bộ CRUD: `createMedicine`, `updateMedicine`, `deleteMedicine` trong `MedicineService`)

---

## MỤC LỤC
1. [TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT](#1-tóm-tắt-nội-dung-và-nguyên-tắc-cốt-lõi-từ-tài-liệu-slide-nunit)
2. [ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN](#2-ánh-xạ-phương-pháp-luận-từ-nunit-sang-môi-trường-dự-án)
3. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ](#3-kiểm-thử-đơn-vị-chức-năng-1-lập-hóa-đơn-viện-phí)
4. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ](#4-kiểm-thử-đơn-vị-chức-năng-2-thanh-toán-hóa-đơn-viện-phí)
5. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO](#5-kiểm-thử-đơn-vị-chức-năng-3-quản-lý-danh-mục-thuốc-và-tồn-kho)
6. [HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG](#6-hướng-dẫn-thực-thi--kết-quả-kiểm-thử-tự-động)
7. [TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG](#7-tổng-kết--đánh-giá-mức-độ-đáp-ứng)

---

## 1. TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT

Qua nghiên cứu 29 slide bài giảng **"Kiểm thử và đảm bảo chất lượng phần mềm - Sử dụng công cụ kiểm thử đơn vị"** của ThS. Nguyễn Thị Phương Dung, các kiến thức và nguyên tắc kỹ thuật chuẩn mực được đúc kết như sau:

### 1.1 Bản chất của kiểm thử đơn vị (Slide 2)
- Kiểm thử đơn vị (Unit Testing) là phương pháp kiểm thử phần mềm trên từng module nhỏ nhất của chương trình.
- Trong lập trình hướng đối tượng, đơn vị kiểm thử là các phương thức/hàm (methods) hoặc lớp (classes).
- Một đơn vị kiểm thử được dùng để kiểm tra một đơn vị công việc với một **kết quả giả định (expected result)**.
- Nếu kết quả thực tế (**actual result**) khác với kết quả giả định thì đơn vị kiểm thử **thất bại (Fail)**.

### 1.2 Năm đặc điểm sống còn của Unit Test (Slide 3)
1. **Ngắn gọn, dễ hiểu, dễ đọc:** Code kiểm thử phải xúc tích, tập trung vào duy nhất một hành vi nghiệp vụ.
2. **Tính độc lập tuyệt đối:** Mỗi unit test là một đơn vị riêng biệt, không phụ thuộc vào thứ tự chạy hay kết quả của unit test khác.
3. **Quy chuẩn đặt tên hàm rõ ràng:** Tên phương thức kiểm thử cũng chính là tên ca kiểm thử (Unit Test), phải nói rõ test cái gì theo cú pháp:
   $$\text{Test\_<Tên\_Hàm>\_<Điều\_Kiện/Kịch\_Bản>\_<Kết\_Quả\_Mong\_Đợi>}\quad (\text{hoặc ví dụ trong slide: } \text{Test\_A\_Do\_B})$$
   Tên hàm kiểm thử có thể dài nhưng bắt buộc phải tường minh mục đích.
4. **Tốc độ thực thi siêu nhanh:** Unit test được chạy thường xuyên mỗi lần build mã nguồn. Do đó **phải loại bỏ hoặc hạn chế tối đa các tác vụ tốn thời gian như gọi I/O, truy vấn database thật, kết nối network**.
5. **Cô lập đối tượng kiểm thử (Test Isolation):** Unit test cho lớp nghiệp vụ (Business Class) thì chỉ kiểm tra chính Business Class đó, **không được đụng tới các lớp móc nối (DataAccess Class, Database, Web Service)** mà phải sử dụng Mock/Fake/In-Memory Stub.

### 1.3 Cấu trúc Suite và Lớp `Assert` (Slide 20 – 27)
- **Thuộc tính đánh dấu:**
  - `[TestFixture]`: Đánh dấu lớp chứa các ca kiểm thử.
  - `[Test]`: Đánh dấu một phương thức kiểm thử cụ thể.
  - `[SetUp]` / `[TearDown]`: Chuẩn bị dữ liệu sạch trước mỗi test và dọn dẹp sau mỗi test.
- **Lớp `Assert` - Cầu nối kiểm định giả định:**
  - `Assert.AreEqual(expected, actual [, message])`: Xác nhận giá trị thực tế bằng giá trị kỳ vọng.
  - `Assert.Less(x, y)`: Xác nhận $x < y$.
  - `Assert.Greater(x, y)`: Xác nhận $x > y$.
  - `Assert.LessOrEqual(x, y)`: Xác nhận $x \le y$.
  - `Assert.GreaterOrEqual(x, y)`: Xác nhận $x \ge y$.
  - `Assert.IsNull(object [, message])`: Xác nhận đối tượng là `null`.
  - `Assert.IsNotNull(object [, message])`: Xác nhận đối tượng khác `null`.
  - `Assert.IsTrue(condition [, message])`: Xác nhận điều kiện logic là `true`.
  - `Assert.IsFalse(condition [, message])`: Xác nhận điều kiện logic là `false`.
  - `Assert.Throws(action)`: Xác nhận hành động làm phát sinh ngoại lệ đúng dự kiến.

---

## 2. ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN

Hệ thống HIS-Hospital được xây dựng trên nền tảng **Node.js (ES Modules)** ở backend. Để giữ vững bản chất của dự án mà vẫn áp dụng **100% kiến thức và cách làm từ tài liệu NUnit**, chúng tôi thiết lập cấu trúc kiểm thử như sau:

| Khái niệm trong Slide NUnit (.NET) | Công cụ tương đương áp dụng cho HIS-Hospital (Node.js) | Vị trí trong dự án |
| :--- | :--- | :--- |
| **Test Runner & Engine** | **Node.js Native Test Runner** (`node:test`) | Tích hợp sẵn trong Node.js LTS, tốc độ cực cao (< 150ms). |
| **`[TestFixture]`** | `describe("[TestFixture] TenChucNang", ...)` | Phân tách suite kiểm thử cho từng chức năng. |
| **`[Test]`** | `test("[Test] Test_A_Do_B", ...)` | Phương thức kiểm thử cho từng ca kiểm thử. |
| **`[SetUp]`** | `beforeEach(() => { ... })` | Khởi tạo lại trạng thái sạch, cô lập mock repository trước mỗi test. |
| **`[TearDown]`** | `afterEach(() => { ... })` | Hoàn trả trạng thái các hàm gốc, tránh rò rỉ dữ liệu. |
| **Lớp `Assert` NUnit** (Slide 23-26) | **Lớp `Assert` NUnit Adapter** (`Assert.AreEqual`, `Assert.Less`, `Assert.Greater`, `Assert.IsNull`, `Assert.IsTrue`, `Assert.Throws`,...) | [`backend/test/helpers/nunitAssert.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/nunitAssert.js) |
| **Cách ly DataAccess** (Slide 3) | **In-Memory Mock Repositories** | Giả lập `invoiceRepository`, `medicineRepository`, `patientRepository`. |

### Lớp Chuyển Đổi NUnit Assert (`backend/test/helpers/nunitAssert.js`):
```javascript
import assert from "node:assert/strict";

export class Assert {
  static AreEqual(expected, actual, message) {
    assert.strictEqual(actual, expected, message);
  }
  static Less(x, y, message) {
    assert.ok(x < y, message || `Kỳ vọng ${x} < ${y}`);
  }
  static Greater(x, y, message) {
    assert.ok(x > y, message || `Kỳ vọng ${x} > ${y}`);
  }
  static LessOrEqual(x, y, message) {
    assert.ok(x <= y, message || `Kỳ vọng ${x} <= ${y}`);
  }
  static GreaterOrEqual(x, y, message) {
    assert.ok(x >= y, message || `Kỳ vọng ${x} >= ${y}`);
  }
  static IsNull(obj, message) {
    assert.ok(obj === null || obj === undefined, message || `Kỳ vọng null`);
  }
  static IsNotNull(obj, message) {
    assert.ok(obj !== null && obj !== undefined, message || `Kỳ vọng not null`);
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

## 3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ

### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Phương thức `invoiceService.createInvoice(payload)` và `StandardBillingStrategy.calculate(totalAmount, insuranceDiscount)`.
- **Tập tin kiểm thử:** [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js#L35-L167)
- **Quy tắc nghiệp vụ kiểm thử:**
  1. Thiếu thông tin bắt buộc (`patient_code`, `patient_name`, `total_amount`) $\rightarrow$ Ném lỗi HTTP 400.
  2. Tổng tiền phải là số hợp lệ và $> 0$. Nếu $\le 0$ hoặc `NaN` $\rightarrow$ Ném lỗi.
  3. Mức giảm trừ BHYT không được âm ($< 0$) và không được vượt quá tổng tiền ($> total$).
  4. Số tiền bệnh nhân phải nộp: $\text{patientPay} = \max(0, \text{total} - \text{discount})$.
  5. Phương thức thanh toán `"CHUA_THANH_TOAN"` gán trạng thái `"UNPAID"`. Phương thức `"TIEN_MAT"` gán `"PAID"`.

### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ

### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
- **Đơn vị kiểm thử:** Phương thức `invoiceService.processPayment(idOrCode, paymentDetails)`, `PaymentMethodValidatorStrategy.validate`, và `InvoiceStateMachine.transition`.
- **Tập tin kiểm thử:** [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js#L170-L290)
- **Quy tắc nghiệp vụ kiểm thử:**
  1. Phương thức thanh toán phải thuộc danh sách hợp lệ: `["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"]`. Nếu không $\rightarrow$ Ném lỗi ngoại lệ.
  2. Hóa đơn không tồn tại $\rightarrow$ Báo lỗi 404.
  3. Hóa đơn đã ở trạng thái `PAID` $\rightarrow$ Báo lỗi 400 (không thanh toán lặp).
  4. Chuyển trạng thái an toàn: `UNPAID` $\rightarrow$ `PAID`, gán thời gian `paid_at`, thu ngân `cashier`.
  5. Đồng bộ hóa trạng thái phiếu cận lâm sàng (`labOrder.payment_status = "PAID"`).
  6. Đồng bộ hóa trạng thái bệnh nhân: Bệnh nhân `Chờ thanh toán` $\rightarrow$ `Đã khám`.

### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO

### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
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

### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 6. HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

### 6.1 Lệnh thực thi kiểm thử
Trong thư mục `backend/`:

1. **Chạy chuyên biệt bộ Kiểm thử đơn vị NUnit Style (35 test cases):**
   ```powershell
   npm run test:unit
   ```

2. **Chạy toàn bộ Test Suite của dự án (105 test cases: Black-Box + Unit Tests):**
   ```powershell
   npm test
   ```

### 6.2 Kết quả thực thi thực tế từ terminal
```text
> his-hospital-backend@1.0.0 test:unit
> node --test test/unitTest_NUnitStyle_3ChucNang.test.js

▶ [TestFixture] ChucNang_LapHoaDonVienPhi
  ✔ [Test] Test_CreateInvoice_ThieuMaBenhNhan_NemNgoaiLe400 (1.1583ms)
  ✔ [Test] Test_CreateInvoice_ThieuTenBenhNhan_NemNgoaiLe400 (0.2643ms)
  ✔ [Test] Test_CreateInvoice_TongTienNull_NemNgoaiLe400 (0.2285ms)
  ✔ [Test] Test_CreateInvoice_TongTienKhongPhaiSo_NemNgoaiLe (0.2917ms)
  ✔ [Test] Test_CreateInvoice_TongTienBangKhong_NemNgoaiLe (0.1703ms)
  ✔ [Test] Test_CreateInvoice_TongTienAm_NemNgoaiLe (0.1939ms)
  ✔ [Test] Test_CreateInvoice_GiamTruBHYTAm_NemNgoaiLe (0.1295ms)
  ✔ [Test] Test_CreateInvoice_GiamTruBHYTVuotQuaTongTien_NemNgoaiLe (0.1059ms)
  ✔ [Test] Test_CreateInvoice_ChuaThanhToan_TrangThaiUNPAID_ThanhCong (12.6235ms)
  ✔ [Test] Test_CreateInvoice_ThanhToanNgay_TrangThaiPAID_ThanhCong (0.308ms)
  ✔ [Test] Test_StandardBillingStrategy_ChiTraToanBo_PatientPayBangKhong (0.1902ms)
  ✔ [Test] Test_CreateInvoice_GiaTriMacDinh_ThanhCong (0.1957ms)
✔ [TestFixture] ChucNang_LapHoaDonVienPhi (16.8555ms)

▶ [TestFixture] ChucNang_ThanhToanHoaDonVienPhi
  ✔ [Test] Test_ProcessPayment_PhuongThucThanhToanRong_NemNgoaiLe (0.3975ms)
  ✔ [Test] Test_ProcessPayment_PhuongThucKhongHoTro_NemNgoaiLe (0.5377ms)
  ✔ [Test] Test_ProcessPayment_HoaDonKhongTonTai_NemNgoaiLe404 (0.1274ms)
  ✔ [Test] Test_ProcessPayment_HoaDonDaThanhToanTruocDo_NemNgoaiLe400 (0.087ms)
  ✔ [Test] Test_ProcessPayment_ThanhToanTienMat_TrangThaiChuyenSangPAID_ThanhCong (0.2195ms)
  ✔ [Test] Test_ProcessPayment_ThanhToanVietQR_PhatSuKienThanhToan (0.2716ms)
  ✔ [Test] Test_ProcessPayment_HoaDonCanLamSang_DongBoTrangThaiLabOrderSangPAID (0.1598ms)
  ✔ [Test] Test_ProcessPayment_BenhNhanDangChoThanhToan_DongBoSangDaKham (0.2385ms)
  ✔ [Test] Test_InvoiceStateMachine_CanTransition_UNPAID_Sang_PAID_TraVeTrue (0.1435ms)
  ✔ [Test] Test_InvoiceStateMachine_CanTransition_PAID_Sang_CANCELLED_TraVeFalse (0.1059ms)
  ✔ [Test] Test_PaymentMethodValidatorStrategy_CacPhuongThucHopLe (0.0784ms)
✔ [TestFixture] ChucNang_ThanhToanHoaDonVienPhi (2.6026ms)

▶ [TestFixture] ChucNang_QuanLyDanhMucThuocVaTonKho
  ✔ [Test] Test_CreateMedicine_TenThuocRong_NemNgoaiLe400 (0.5128ms)
  ✔ [Test] Test_CreateMedicine_DonGiaUndefined_NemNgoaiLe400 (0.1054ms)
  ✔ [Test] Test_CreateMedicine_DonGiaBangKhong_NemNgoaiLe400 (0.0736ms)
  ✔ [Test] Test_CreateMedicine_DonGiaAm_NemNgoaiLe400 (0.0784ms)
  ✔ [Test] Test_CreateMedicine_SoLuongTonKhoAm_NemNgoaiLe400 (0.1235ms)
  ✔ [Test] Test_CreateMedicine_DuLieuHopLe_ThemThanhCong_SinhMaMEDChuan (0.1601ms)
  ✔ [Test] Test_CreateMedicine_GiaTriMacDinh_DonViVien_DanhMucKhac (0.0815ms)
  ✔ [Test] Test_UpdateMedicine_MaThuocKhongTonTai_NemNgoaiLe404 (0.16ms)
  ✔ [Test] Test_UpdateMedicine_CapNhatTonKhoVaDonGia_ThanhCong (0.0924ms)
  ✔ [Test] Test_UpdateMedicine_CapNhatTheoMa_CatKhoangTrangThanhCong (0.0781ms)
  ✔ [Test] Test_DeleteMedicine_MaThuocKhongTonTai_NemNgoaiLe404 (0.1098ms)
  ✔ [Test] Test_DeleteMedicine_ThuocTonTai_XoaKhoiDanhSachThanhCong (0.0987ms)
✔ [TestFixture] ChucNang_QuanLyDanhMucThuocVaTonKho (1.8672ms)

ℹ tests 35
ℹ suites 3
ℹ pass 35
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 108.3875
```

---

## 7. TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG

1. **Tuân thủ toàn diện các quy tắc trong tài liệu "Kiểm thử đơn vị - sd NUnit.pdf":**
   - **Đặc điểm Unit Test:** Đã thiết kế 35 ca kiểm thử ngắn gọn, cô lập tuyệt đối với cơ sở dữ liệu và I/O, thời gian chạy toàn bộ 35 tests chỉ mất **108ms**.
   - **Quy chuẩn đặt tên phương thức:** Đạt 100% định dạng `Test_<TênHàm>_<ĐiềuKiện/KịchBản>_<KếtQuảMongĐợi>` hoặc `Test_A_Do_B` theo đúng khuyến nghị của Slide 3.
   - **Tổ chức Test Suite:** 3 nhóm kiểm thử đại diện cho 3 Test Fixture tương ứng 3 chức năng.
   - **Bộ Assertion NUnit đầy đủ:** Áp dụng trọn vẹn cả 10 phương thức của lớp `Assert` được giảng dạy: `AreEqual`, `Less`, `Greater`, `LessOrEqual`, `GreaterOrEqual`, `IsNull`, `IsNotNull`, `IsTrue`, `IsFalse`, `Throws`.
2. **Đảm bảo tính tương thích và thực tiễn:**
   - Sử dụng công cụ kiểm thử chuẩn của môi trường dự án Node.js (`node:test`) giúp không làm xáo trộn kiến trúc mã nguồn.
   - Toàn bộ 105 test cases trong hệ thống đều chạy thành công 100%, đem lại độ tin cậy và chất lượng cao cho phần mềm y tế HIS-Hospital.
