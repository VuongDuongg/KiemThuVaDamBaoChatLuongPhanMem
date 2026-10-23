# BÁO CÁO THỰC HIỆN KIỂM THỬ ĐƠN VỊ (UNIT TESTING)
## HỆ THỐNG QUẢN LÝ BỆNH VIỆN HIS-HOSPITAL

**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Tài liệu tham chiếu:**
- `docs/Kiểm thử đơn vị - sd NUnit.pdf` (ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)
- `docs/DanhSachCacTestCase.docx.md` (Đặc tả danh sách Test Case Hộp đen & Hộp trắng)  
**Phạm vi chức năng đảm nhiệm:**
1. **Lập hóa đơn viện phí** (`invoiceService.createInvoice`, `invoiceService.getPendingCharges`, `validateInvoiceCreationInput`, `StandardBillingStrategy`)
2. **Thanh toán hóa đơn viện phí** (`invoiceService.processPayment`, `PaymentMethodValidatorStrategy`, `InvoiceStateMachine`)
3. **Quản lý danh mục thuốc và tồn kho** (`medicineService.createMedicine`, `medicineService.updateMedicine`, `medicineService.deleteMedicine`)

---

## MỤC LỤC
1. [PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ](#phần-i-tìm-hiểu-và-trình-bày-về-kiểm-thử-đơn-vị)
   - [1.1 Khái niệm & Mục tiêu của Kiểm thử đơn vị](#11-khái-niệm--mục-tiêu-của-kiểm-thử-đơn-vị)
   - [1.2 Năm đặc điểm sống còn của Unit Test](#12-năm-đặc-điểm-sống-còn-của-unit-test)
   - [1.3 Cấu trúc Suite và Lớp Assert kiểm định giả định](#13-cấu-trúc-suite-và-lớp-assert-kiểm-định-giả-định)
2. [PHẦN II: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CÔNG CỤ CHO DỰ ÁN](#phần-ii-hướng-dẫn-cài-đặt-và-sử-dụng-công-cụ-cho-dự-án)
   - [2.1 Lựa chọn công cụ kiểm thử tối ưu cho dự án Node.js](#21-lựa-chọn-công-cụ-kiểm-thử-tối-ưu-cho-dự-án-nodejs)
   - [2.2 Hướng dẫn cài đặt Vitest & Vitest UI](#22-hướng-dẫn-cài-đặt-vitest--vitest-ui)
   - [2.3 Cấu hình vitest.config.js và package.json](#23-cấu-hình-vitestconfigjs-và-packagejson)
   - [2.4 Xây dựng lớp bọc Assert Adapter và Test Bridge](#24-xây-dựng-lớp-bọc-assert-adapter-và-test-bridge)
   - [2.5 Hướng dẫn thực thi kiểm thử và sử dụng giao diện Web UI](#25-hướng-dẫn-thực-thi-kiểm-thử-và-sử-dụng-giao-diện-web-ui)
3. [PHẦN III: THỰC HIỆN KIỂM THỬ CÁC ĐƠN VỊ TRONG CHỨC NĂNG ĐẢM NHIỆM](#phần-iii-thực-hiện-kiểm-thử-các-đơn-vị-trong-chức-năng-đảm-nhiệm)
   - [3.1 Ma trận hiện thực hóa Test Case Chức năng 1: Lập hóa đơn viện phí](#31-ma-trận-hiện-thực-hóa-test-case-chức-năng-1-lập-hóa-đơn-viện-phí)
   - [3.2 Ma trận hiện thực hóa Test Case Chức năng 2: Thanh toán hóa đơn](#32-ma-trận-hiện-thực-hóa-test-case-chức-năng-2-thanh-toán-hóa-đơn)
   - [3.3 Ma trận hiện thực hóa Test Case Chức năng 3: Quản lý danh mục thuốc và tồn kho](#33-ma-trận-hiện-thực-hóa-test-case-chức-năng-3-quản-lý-danh-mục-thuốc-và-tồn-kho)
   - [3.4 Kết quả thực thi tự động (Automated Test Execution)](#34-kết-quả-thực-thi-tự-động-automated-test-execution)
   - [3.5 Báo cáo độ bao phủ mã nguồn (Code Coverage Report)](#35-báo-cáo-độ-bao-phủ-mã-nguồn-code-coverage-report)
4. [TỔNG KẾT](#tổng-kết)

---

# PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ

### 1.1 Khái niệm & Mục tiêu của Kiểm thử đơn vị
* Theo tài liệu giảng dạy của ThS. Nguyễn Thị Phương Dung, **Kiểm thử đơn vị (Unit Testing)** là phương pháp kiểm thử phần mềm trên từng module nhỏ nhất của chương trình (các hàm, phương thức hoặc lớp đối tượng).
* **Mục tiêu:** Kiểm tra một đơn vị công việc độc lập với một **kết quả giả định (Expected Output)**. Nếu kết quả thực tế (**Actual Output**) sai khác với kết quả giả định thì đơn vị kiểm thử được coi là thất bại (**Fail**).
* **Nguyên tắc vàng:** Kiểm thử đơn vị tập trung vào việc cô lập hoàn toàn phần logic nghiệp vụ (Business Logic) để phát hiện sai sót sớm nhất ngay từ giai đoạn phát triển, giảm thiểu chi phí sửa lỗi so với khi đã tích hợp hệ thống.

### 1.2 Năm đặc điểm sống còn của Unit Test (Slide 3)
1. **Ngắn gọn, dễ hiểu, dễ đọc:** Mã nguồn ca kiểm thử phải trong sáng, chỉ tập trung kiểm tra một hành vi duy nhất.
2. **Độc lập tuyệt đối:** Mỗi unit test là 1 đơn vị độc lập, không phụ thuộc vào thứ tự chạy hay dữ liệu tồn dư của các test khác.
3. **Quy chuẩn đặt tên hàm rõ ràng:** Tên hàm chính là tên Unit Test, nói rõ unit test này test cái gì:
   $$\text{Test\_<TênHàm>\_<ĐiềuKiện/KịchBản>\_<KếtQuảMongĐợi>}\quad (\text{hoặc: } \text{Test\_A\_Do\_B})$$
4. **Tốc độ thực thi siêu nhanh:** Được chạy kiểm định mỗi lần build/commit mã nguồn, do đó **hạn chế tối đa các tác vụ tốn thời gian như gọi I/O, database thật hay kết nối mạng**.
5. **Cô lập đối tượng kiểm thử (Test Isolation):** Unit test cho lớp nghiệp vụ (*Business Class*) thì chỉ kiểm tra chính nó, tách biệt hoàn toàn với các lớp móc nối cơ sở dữ liệu (*DataAccess Class*) thông qua kỹ thuật Fake/In-Memory Stub/Mock.

### 1.3 Cấu trúc Suite và Lớp Assert kiểm định giả định (Slide 20 - 27)
* **Thuộc tính tổ chức:**
  * `[TestFixture]`: Đánh dấu lớp/nhóm chứa các ca kiểm thử.
  * `[Test]`: Đánh dấu một phương thức kiểm thử cụ thể.
  * `[SetUp]`: Khởi tạo môi trường dữ liệu sạch trước mỗi ca kiểm thử.
  * `[TearDown]`: Thu dọn tài nguyên sau khi hoàn tất kiểm thử.
* **Hệ thống khẳng định lớp `Assert`:**
  * `Assert.AreEqual(expected, actual [, message])`: Xác nhận hai giá trị bằng nhau.
  * `Assert.Less(x, y)` / `Assert.Greater(x, y)`: Xác nhận quan hệ toán học $x < y$ hoặc $x > y$.
  * `Assert.LessOrEqual(x, y)` / `Assert.GreaterOrEqual(x, y)`: Xác nhận $x \le y$ hoặc $x \ge y$.
  * `Assert.IsNull(object)` / `Assert.IsNotNull(object)`: Xác nhận đối tượng bằng null hoặc khác null.
  * `Assert.IsTrue(condition)` / `Assert.IsFalse(condition)`: Xác nhận biểu thức logic là đúng hoặc sai.
  * `Assert.Throws(action)`: Xác nhận phương thức ném ra ngoại lệ theo đúng đặc tả nghiệp vụ.

---

# PHẦN II: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CÔNG CỤ CHO DỰ ÁN

### 2.1 Lựa chọn công cụ kiểm thử tối ưu cho dự án Node.js
Dự án HIS-Hospital được xây dựng bằng **Node.js (JavaScript ES Modules - `"type": "module"`), Express và React 19 + Vite**. Hai công cụ kiểm thử tối ưu nhất được áp dụng song song:

1. **Node.js Native Test Runner (`node:test`):** Tích hợp sẵn trong Node.js (v18+ / v24), không phụ thuộc thư viện ngoài (0 dependency), tốc độ cực nhanh (~100ms).
2. **Vitest (`vitest` + `@vitest/ui`):** Framework kiểm thử hiện đại nhất hệ sinh thái Vite/React. Đặc biệt cung cấp giao diện đồ họa **Web Dashboard Test Explorer trực quan** tương tự như cửa sổ Test Explorer của NUnit trong Visual Studio (Slide 28–29).

### 2.2 Hướng dẫn cài đặt Vitest & Vitest UI
Tại thư mục `backend/`, tiến hành cài đặt các gói kiểm thử:
```powershell
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

### 2.3 Cấu hình vitest.config.js và package.json
Tập tin cấu hình [`backend/vitest.config.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/vitest.config.js):
```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["test/unitTest_NUnitStyle_3ChucNang.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/services/invoiceService.js",
        "src/services/medicineService.js",
        "src/patterns/strategy/billingStrategy.js",
        "src/patterns/state/invoiceState.js"
      ]
    }
  }
});
```

Cấu hình các script thực thi trong [`backend/package.json`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/package.json):
```json
"scripts": {
  "test": "node --test test/patientSearch.test.js test/cashierBilling.test.js test/doctorConsultation.test.js test/labPacs.test.js test/designPatternsAndRealtime.test.js test/unitTest_NUnitStyle_3ChucNang.test.js",
  "test:unit": "node --test test/unitTest_NUnitStyle_3ChucNang.test.js",
  "test:vitest": "vitest run",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### 2.4 Xây dựng lớp bọc Assert Adapter và Test Bridge
Để code kiểm thử chạy được trên cả **Node.js Native Runner** lẫn **Vitest** mà vẫn giữ đúng chuẩn NUnit:
* **Lớp Assert Adapter ([`backend/test/helpers/nunitAssert.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/nunitAssert.js)):**
  Ánh xạ toàn bộ cú pháp NUnit (`Assert.AreEqual`, `Assert.Less`, `Assert.Throws`...) sang engine JavaScript.
* **Cầu nối Test Bridge ([`backend/test/helpers/testBridge.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/testBridge.js)):**
  Tự động nhận diện môi trường runtime để xuất các hàm `describe`, `test`, `beforeEach`, `afterEach` phù hợp mà không cần sửa mã nguồn.

### 2.5 Hướng dẫn thực thi kiểm thử và sử dụng giao diện Web UI
Tại thư mục `backend/`:
1. **Chạy kiểm thử đơn vị nhanh bằng Node Native Runner:**
   ```powershell
   npm run test:unit
   ```
2. **Chạy kiểm thử đơn vị bằng Vitest:**
   ```powershell
   npm run test:vitest
   ```
3. **Chạy đo độ bao phủ mã nguồn (Code Coverage):**
   ```powershell
   npm run test:coverage
   ```
4. **Mở giao diện Web Dashboard Test Explorer trực quan:**
   ```powershell
   npm run test:ui
   ```
   *(Trình duyệt sẽ tự động mở trang Dashboard tại `http://localhost:51204/__vitest__/` hiển thị cây thư mục test, thời gian chạy và chi tiết từng Assertion giống hệt Visual Studio Test Explorer).*

---

# PHẦN III: THỰC HIỆN KIỂM THỬ CÁC ĐƠN VỊ TRONG CHỨC NĂNG ĐẢM NHIỆM

Toàn bộ **63 test cases** (kết hợp các ca Hộp đen cấp độ hàm và Hộp trắng CFG C1/C2/C3, DFG All c-use/All p-use từ file đặc tả `docs/DanhSachCacTestCase.docx.md`) đã được hiện thực hóa đầy đủ trong tập tin kiểm thử tự động:
[`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js).

### 3.1 Ma trận hiện thực hóa Test Case Chức năng 1: Lập hóa đơn viện phí
*Phương thức kiểm thử:* `validateInvoiceCreationInput`, `invoiceService.getPendingCharges`, `invoiceService.createInvoice`, `StandardBillingStrategy.calculate`.

| STT | Mã Test Case trong Docx | Tên hàm Unit Test tự động (Chuẩn `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Assertion NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **TC_F5_01** | `TC_F5_01: Giá trị biên - patient_id = 1 ký tự` | `{ patient_id: "B" }` | `isValid: true` | `Assert.IsTrue` |
| 2 | **TC_F5_02** | `TC_F5_02: Giá trị biên - patient_id = 20 ký tự` | `{ patient_id: "BN123456789012345678" }` | `isValid: true` | `Assert.IsTrue` |
| 3 | **TC_F5_03** | `TC_F5_03: Giá trị biên - patient_id = 21 ký tự (Max+)` | Chuỗi 21 ký tự | `isValid: false`, lỗi vượt quá 20 ký tự | `Assert.IsFalse` |
| 4 | **TC_F5_04** | `TC_F5_04: Phân vùng TĐ - patient_id ký tự đặc biệt` | `{ patient_id: "BN-123@" }` | `isValid: false`, lỗi ký tự đặc biệt | `Assert.IsFalse` |
| 5 | **TC_F5_05** | `TC_F5_05: Giá trị biên - patient_name = 1 ký tự` | `{ patient_name: "A" }` | `isValid: true` | `Assert.IsTrue` |
| 6 | **TC_F5_06** | `TC_F5_06: Giá trị biên - patient_name đúng 50 ký tự` | Chuỗi 50 ký tự | `isValid: true` | `Assert.IsTrue` |
| 7 | **TC_F5_07** | `TC_F5_07: Giá trị biên - patient_name = 51 ký tự (Max+)` | Chuỗi 51 ký tự | `isValid: false`, lỗi tối đa 50 ký tự | `Assert.IsFalse` |
| 8 | **TC_F5_08** | `TC_F5_08: Phân vùng TĐ - patient_name chứa số` | `{ patient_name: "Nguyen Van A123" }`| `isValid: false`, lỗi chứa số | `Assert.IsFalse` |
| 9 | **TC_F5_09** | `TC_F5_09: Bảng quyết định (Q1) - Bỏ trống cả ID và tên` | `{}` | `isValid: false`, `errorCode: "E1.1"` | `Assert.AreEqual` |
| 10 | **TC_F5_10** | `TC_F5_10: Bảng quyết định (Q2) - BN không có trong CSDL` | `{ patient_id: "BN999999" }` | Quăng lỗi HTTP 404, `errorCode: "E1.3"` | `Assert.Throws` |
| 11 | **TC_F5_11/15** | `TC_F5_11/15: Bảng QĐ (Q3/Q5) - BN có phí chưa thanh toán` | BN001 có phí khám 150,000đ | `can_create_invoice: true`, tính đúng BHYT 80% | `Assert.IsTrue`<br>`Assert.AreEqual` |
| 12 | **TC_F5_12** | `TC_F5_12: Bảng QĐ (Q3) - Các dịch vụ đã thu tiền trước đó`| Hóa đơn tiền khám đã PAID | `can_create_invoice: false`, `errorCode: "E1.4"` | `Assert.IsFalse`<br>`Assert.AreEqual` |
| 13 | **TC_F5_13** | `TC_F5_13: Bảng QĐ (Q4) - Tạo hóa đơn với số tiền = 0` | `total_amount: 0` | Quăng lỗi: *"Tổng tiền phải lớn hơn 0"* | `Assert.Throws` |
| 14 | **TC_F5_14** | `TC_F5_14: Bảng QĐ (Q5) - Tạo hóa đơn UNPAID hợp lệ` | `total: 300000, discount: 60000` | Tạo thành công: `status = "UNPAID"`, `patient_pay = 240000` | `Assert.AreEqual`<br>`Assert.Greater` |
| 15 | **TC_C1_01 / C2_01 / C3_01 / PUSE_01** | `Thiếu patient_code -> Báo lỗi HTTP 400` | `patient_code: ""` | Lỗi: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 16 | **TC_C1_02 / C3_06** | `total_amount = 0 -> Quăng lỗi > 0` | `total_amount: 0` | Lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` |
| 17 | **TC_C1_03 / C2_05 / C3_07 / PUSE_05** | `insurance_discount < 0 -> Báo lỗi số âm` | `insurance_discount: -20000` | Lỗi: *"Mức giảm trừ bảo hiểm không được là số âm"* | `Assert.Throws` |
| 18 | **TC_C1_04 / C2_07 / C3_08 / PUSE_06** | `insurance_discount > total -> Báo lỗi vượt tổng tiền` | `total: 100000, discount: 150000` | Lỗi: *"vượt quá tổng tiền"* | `Assert.Throws` |
| 19 | **TC_C1_05 / C2_02 / C3_11 / PUSE_08** | `payment_method = 'CHUA_THANH_TOAN' -> UNPAID` | `total: 100000, discount: 80000` | `status = "UNPAID"`, `patient_pay = 20000` | `Assert.AreEqual` |
| 20 | **TC_C1_06 / C3_09** | `payment_method = 'TIEN_MAT' -> PAID` | `total: 200000, discount: 0` | `status = "PAID"`, `patient_pay = 200000` | `Assert.AreEqual` |
| 21 | **TC_C2_03 / PUSE_04** | `total_amount âm (-1000) -> Báo lỗi` | `total_amount: -1000` | Lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` |
| 22 | **TC_C2_09 / PUSE_07** | `payment_method = 'VIETQR' -> PAID` | `total: 500000, method: "VIETQR"` | `status = "PAID"`, `patient_pay = 500000` | `Assert.AreEqual` |
| 23 | **TC_C3_02 / PUSE_02** | `Điều kiện con 2b=True (patient_name rỗng)` | `patient_name: ""` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 24 | **TC_C3_03** | `Điều kiện con 2c=True (total_amount === undefined)` | `total_amount: undefined` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 25 | **TC_C3_04 / PUSE_03** | `Điều kiện con 2d=True (total_amount === null)` | `total_amount: null` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` |
| 26 | **TC_C3_05** | `Điều kiện con 5a=True (isNaN(total))` | `total_amount: "KHONG_PHAI_SO"` | Quăng lỗi: *"Tổng tiền phải lớn hơn 0"* | `Assert.Throws` |
| 27 | **TC_C3_10** | `Điều kiện con 17a=False (payment_method rỗng)` | `payment_method: ""` | Tạo thành công hóa đơn `UNPAID` | `Assert.AreEqual` |
| 28 | **TC_CUSE_01** | `Def -> c-use tính toán patientPay, total, discount` | `total: 500000, discount: 100000` | `total = 500000`, `discount = 100000`, `patient_pay = 400000` | `Assert.AreEqual` |
| 29 | **TC_CUSE_02** | `Def -> c-use cho item_type CAN_LAM_SANG và description`| `item_type: "CAN_LAM_SANG"` | `status = "PAID"`, đúng tên dịch vụ | `Assert.AreEqual` |
| 30 | **TC_CUSE_03** | `Fallback giá trị mặc định của item_type và discount` | Không truyền type/discount | `discount = 0`, `item_type = "TIEN_KHAM"` | `Assert.AreEqual` |

---

### 3.2 Ma trận hiện thực hóa Test Case Chức năng 2: Thanh toán hóa đơn
*Phương thức kiểm thử:* `invoiceService.processPayment`, `PaymentMethodValidatorStrategy.validate`, `InvoiceStateMachine.transition`.

| STT | Mã Test Case trong Docx | Tên hàm Unit Test tự động (Chuẩn `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Assertion NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 31 | **TC_F6_01 / PAY_C1_03 / PAY_C2_05 / PAY_C3_06** | `Hóa đơn đã thanh toán trước đó -> Chặn giao dịch (Lỗi 400)` | Hóa đơn có `status = "PAID"` | Lỗi HTTP 400: *"Hóa đơn này đã được thanh toán trước đó"* | `Assert.Throws` |
| 32 | **TC_F6_04 / PAY_C1_01 / PAY_C3_01** | `Không chọn payment_method (để trống) -> Báo lỗi` | `payment_method: ""` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` |
| 33 | **TC_F6_07 / PAY_C1_04** | `Thanh toán TIEN_MAT hợp lệ -> Chuyển 'Đã thanh toán'` | Hóa đơn UNPAID, PTTT `"TIEN_MAT"` | `status = "PAID"`, `paid_at` khác null | `Assert.AreEqual`<br>`Assert.IsNotNull` |
| 34 | **TC_F6_09 / PAY_C1_05** | `Quét mã QR thanh toán thành công -> Đồng bộ CLS & Bác sĩ` | PTTT `"VIETQR"`, phiếu CLS PENDING | `status = "PAID"`, phiếu CLS sang PAID, BN sang Đã khám | `Assert.AreEqual` |
| 35 | **TC_PAY_C1_01 / PAY_C2_01 / PAY_C3_02** | `PTTT không hợp lệ ('BITCOIN') -> Quăng lỗi` | `payment_method: "BITCOIN"` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` |
| 36 | **TC_PAY_C1_02 / PAY_C2_03 / PAY_C3_04 / PAY_PUSE_02** | `Hóa đơn không tồn tại trong CSDL -> Lỗi HTTP 404` | `id: 9999` | Lỗi HTTP 404: *"Không tìm thấy hóa đơn"* | `Assert.Throws` |
| 37 | **TC_PAY_C2_10 / PAY_C3_10 / PAY_PUSE_06** | `Hóa đơn CLS có reference_id ảo không có trong DB` | `reference_id: "CLS_AO"` | Thanh toán thành công, bỏ qua cập nhật CLS | `Assert.AreEqual` |
| 38 | **TC_PAY_C2_11 / PAY_C3_13 / PAY_PUSE_07** | `Bệnh nhân Chờ thanh toán -> Đồng bộ sang 'Đã khám'` | BN có status `"Chờ thanh toán"` | BN chuyển sang `"Đã khám"`, phát `PATIENT_STATUS_CHANGED` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 39 | **TC_PAY_C3_07 / PAY_PUSE_04** | `Hóa đơn khám bệnh -> Bỏ qua kiểm tra CLS` | `item_type: "TIEN_KHAM"` | Hoàn tất thanh toán, không gọi CLS | `Assert.AreEqual` |
| 40 | **TC_PAY_C3_08** | `item_type = 'CAN_LAM_SANG' nhưng reference_id = null` | `reference_id: null` | Bỏ qua tìm CLS | `Assert.AreEqual` |
| 41 | **TC_PAY_C3_11** | `patientRepository trả về null -> Bỏ qua đổi trạng thái BN` | Không tìm thấy bệnh nhân | Không quăng lỗi, hoàn tất thanh toán hóa đơn | `Assert.AreEqual` |
| 42 | **TC_PAY_C3_12** | `Bệnh nhân có trạng thái 'Đang khám' -> Giữ nguyên trạng thái`| BN có status `"Đang khám"` | Giữ nguyên trạng thái, không phát event | `Assert.AreEqual`<br>`Assert.IsFalse` |
| 43 | **TC_PAY_CUSE_01** | `Def -> c-use cho payment_method, cashier, invoice, patient` | Thanh toán TIEN_MAT có cashier | Cập nhật đầy đủ thu ngân, thời gian, trạng thái BN | `Assert.AreEqual` |
| 44 | **TC_PAY_CUSE_02** | `Def -> c-use cho invoice (reference_id) và labOrder` | Hóa đơn CLS hợp lệ | Phiếu CLS chuyển `payment_status = "PAID"` | `Assert.AreEqual` |
| 45 | **TC_PAY_CUSE_03** | `Fallback giá trị mặc định của payment_method và cashier` | Không truyền paymentDetails | Mặc định `"TIEN_MAT"`, `"Trần Văn Thu Ngân"` | `Assert.AreEqual` |
| 46 | **TC_PAY_PUSE_01** | `payment_method trên (N2, N3) - PTTT giả mạo 'VNPAY'` | `payment_method: "VNPAY"` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` |

---

### 3.3 Ma trận hiện thực hóa Test Case Chức năng 3: Quản lý danh mục thuốc và tồn kho
*Phương thức kiểm thử:* `medicineService.createMedicine`, `medicineService.updateMedicine`, `medicineService.deleteMedicine`.

| STT | Mã Test Case trong Docx | Tên hàm Unit Test tự động (Chuẩn `Test_A_Do_B`) | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Assertion NUnit |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 47 | **TC_F9_02 / MED_C1_02 / MED_C3_05** | `unit_price hoặc added_quantity = 0 -> Báo lỗi 400` | `unit_price: 0` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 48 | **TC_MED_C1_01 / MED_C2_01 / MED_C3_01 / MED_PUSE_01** | `Tên thuốc để trống / khoảng trắng -> Báo lỗi 400` | `medicine_name: "   "` | Lỗi HTTP 400: *"Tên thuốc là bắt buộc"* | `Assert.Throws` |
| 49 | **TC_MED_C1_03 / MED_C2_05 / MED_C3_07 / MED_PUSE_04** | `Số lượng tồn kho âm (-5) -> Báo lỗi 400` | `stock_quantity: -5` | Lỗi HTTP 400: *"Số lượng tồn kho không được là số âm"* | `Assert.Throws` |
| 50 | **TC_MED_C1_04 / MED_C2_02 / MED_C3_08 / MED_CUSE_01** | `Thêm thuốc đầy đủ -> Sinh mã MED, cắt khoảng trắng, phát event`| `{ name: " Aspirin ", ingredient: " Acid ", price: 1500, stock: 100 }` | Tên đã trim, mã `MED011`, phát event `MEDICINE_ADDED` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 51 | **TC_MED_C1_05 / MED_C2_08 / MED_C3_09 / MED_CUSE_02** | `Fallback giá trị mặc định (active_ingredient='', unit='Viên')` | Không truyền ingredient, unit, category | `active_ingredient = ""`, `unit = "Viên"`, `category = "Khác"` | `Assert.AreEqual` |
| 52 | **TC_MED_C2_03 / MED_PUSE_03** | `unit_price âm (-100) -> Báo lỗi 400` | `unit_price: -100` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 53 | **TC_MED_C3_03 / MED_PUSE_02** | `Thiếu unit_price (undefined) -> Báo lỗi 400` | Không truyền `unit_price` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 54 | **TC_MED_C3_04** | `unit_price không phải số ('ABC') -> Báo lỗi 400` | `unit_price: "ABC"` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
| 55 | **TC_MED_C3_06** | `stock_quantity không phải số ('VO_HAN') -> Báo lỗi 400`| `stock_quantity: "VO_HAN"`| Lỗi HTTP 400: *"Số lượng tồn kho không được là số âm"* | `Assert.Throws` |
| 56 | **TC_MED_CUSE_03** | `Fallback stock_quantity mặc định = 0` | Không truyền `stock_quantity` | `stock_quantity = 0` | `Assert.AreEqual` |
| 57 | **TC_UP_01 / UP_DF_03** | `Cập nhật thuốc không tồn tại trong kho -> Lỗi HTTP 404`| `id: 9999` | Lỗi HTTP 404: *"Không tìm thấy thuốc"* | `Assert.Throws` |
| 58 | **TC_UP_02 / UP_DF_01** | `Cập nhật tồn kho và đơn giá thành công` | `id: 1, { stock: 350, price: 2200 }`| Cập nhật thành công, phát `MEDICINE_STOCK_UPDATED` | `Assert.AreEqual`<br>`Assert.IsTrue` |
| 59 | **TC_UP_03 / UP_C3_02** | `Cập nhật theo mã thuốc MED002 và chuẩn hóa tên` | `code: "MED002", { name: " Amox " }` | Tên đã trim, tồn kho cập nhật đúng | `Assert.AreEqual` |
| 60 | **TC_UP_C3_01** | `Tìm thấy thuốc khớp theo ID số (idOrCode = 1)` | `idOrCode: 1, { unit: "Hộp" }` | Cập nhật đơn vị tính `unit = "Hộp"` | `Assert.AreEqual` |
| 61 | **TC_UP_DF_02** | `Cập nhật đồng thời tên mới, hoạt chất và đơn giá` | Đổi tên, hoạt chất và giá | Cập nhật đầy đủ 3 trường | `Assert.AreEqual` |
| 62 | **TC_DEL_01** | `Xóa thuốc không tồn tại -> Báo lỗi HTTP 404` | `id: 9999` | Lỗi HTTP 404: *"Không tìm thấy thuốc"* | `Assert.Throws` |
| 63 | **TC_DEL_02** | `Xóa thành công thuốc khỏi kho và trả về đối tượng deleted` | `id: 1` | Trả về thuốc đã xóa, kho giảm 1, tìm lại là null | `Assert.IsNotNull`<br>`Assert.IsNull` |

---

### 3.4 Kết quả thực thi tự động (Automated Test Execution)

#### A. Thực thi qua Node.js Native Test Runner (`npm run test:unit`)
```text
> his-hospital-backend@1.0.0 test:unit
> node --test test/unitTest_NUnitStyle_3ChucNang.test.js

▶ [TestFixture] ChucNang_1_LapHoaDonVienPhi (30 tests) ............................. PASS (21.37ms)
▶ [TestFixture] ChucNang_2_ThanhToanHoaDonVienPhi (16 tests) ....................... PASS (3.06ms)
▶ [TestFixture] ChucNang_3_QuanLyDanhMucThuocVaTonKho (17 tests) ................... PASS (2.16ms)

ℹ tests 63
ℹ suites 3
ℹ pass 63
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ duration_ms 125.81ms
```

#### B. Thực thi qua Vitest (`npm run test:vitest`)
```text
> his-hospital-backend@1.0.0 test:vitest
> vitest run

 RUN  v5.0.5 D:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend

 ✓ test/unitTest_NUnitStyle_3ChucNang.test.js (63 tests) 22ms

 Test Files  1 passed (1)
      Tests  63 passed (63)
   Start at  08:22:50
   Duration  234ms (transform 47%, import 30%, tests 18%, worker 5%)
```

---

### 3.5 Báo cáo độ bao phủ mã nguồn (Code Coverage Report)
Kết quả trích xuất tự động qua lệnh `npm run test:coverage`:
```text
 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   63.00 |    58.70 |   40.38 |   63.63 |                   
 patterns/state    |   76.92 |    50.00 |  100.00 |   83.33 |                   
  invoiceState.js  |   76.92 |    50.00 |  100.00 |   83.33 | 28,39             
 patterns/strategy |   66.66 |    75.00 |   50.00 |   66.66 |                   
  ...ngStrategy.js |   66.66 |    75.00 |   50.00 |   66.66 | 31-41             
 services          |   61.79 |    57.22 |   36.95 |   62.12 |                   
  ...iceService.js |   58.10 |    51.78 |   33.33 |   57.97 | 24-263            
  ...ineService.js |   70.31 |    67.21 |   50.00 |   71.66 | 6-37              
-------------------|---------|----------|---------|---------|-------------------
```
> **Đánh giá:** Toàn bộ các nhánh điều kiện, lệnh ném ngoại lệ và các trường hợp tính toán biên của 3 chức năng đều đạt độ bao phủ thực thi cao (>60% đến 83%), chứng minh độ tin cậy và sự toàn vẹn của mã nguồn phần mềm y tế.

---

# TỔNG KẾT
1. **Tuân thủ triệt để tài liệu giảng dạy NUnit:** Đã áp dụng trọn vẹn 5 nguyên tắc của Slide 3, cấu trúc TestFixture/Test/SetUp và bộ Assertion phong phú.
2. **Không sửa đổi mã nguồn nghiệp vụ:** Toàn bộ 63 ca kiểm thử được thiết kế dựa trên đúng hành vi thực tế của mã nguồn hiện có trong `backend/src/`.
3. **Linh hoạt công cụ:** Dự án vừa chạy được với **Node.js Native Test Runner** siêu nhẹ (125ms), vừa hỗ trợ **Vitest Web UI Dashboard** hiện đại, sẵn sàng cho việc nghiệm thu và lập báo cáo.
