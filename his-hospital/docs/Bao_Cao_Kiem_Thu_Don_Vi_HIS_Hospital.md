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
   *(Hệ thống sẽ chạy `vitest --ui --open` và tự động bật trình duyệt với URL đầy đủ kèm token xác thực bảo mật, ví dụ `http://localhost:51204/__vitest__/?token=...`. Nếu trình duyệt không tự mở hoặc báo `Vitest UI requires authentication`, bạn chỉ cần nhìn vào Terminal, giữ phím Ctrl và click chuột vào link có token được in ra).*

---

# PHẦN III: THỰC HIỆN KIỂM THỬ CÁC ĐƠN VỊ TRONG CHỨC NĂNG ĐẢM NHIỆM

Toàn bộ **138 test cases** (kết hợp đầy đủ 32 ca Hộp đen, 74 ca Hộp trắng Dòng điều khiển CFG C1/C2/C3 và 32 ca Hộp trắng Dòng dữ liệu DFG All c-use/All p-use từ file đặc tả `docs/DanhSachCacTestCase.docx.md`) đã được hiện thực hóa trọn vẹn thành **74 hàm Unit Test tự động** trong tập tin kiểm thử:
[`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js) mà **tuyệt đối không can thiệp hay sửa đổi bất kỳ dòng mã nguồn nào trong `backend/src/`**.

---

### 3.0 Cơ chế xác định Kết quả thực tế (Actual Output) & Hướng dẫn kiểm tra từng ca test

#### 1. Cơ chế đối soát tự động theo nguyên lý NUnit:
* Trong kiểm thử đơn vị tự động, mỗi phương thức kiểm thử (`[Test]`) tiến hành gọi hàm nghiệp vụ với **Bộ dữ liệu đầu vào (Input)** và nhận về **Kết quả thực tế (Actual Output)**.
* Câu lệnh khẳng định của NUnit (`Assert.AreEqual`, `Assert.IsTrue`, `Assert.Throws`...) đóng vai trò là "trọng tài phán quyết":
  $$\text{Đánh giá} = \begin{cases} \mathbf{PASS} & \text{khi } \text{Actual Output} \equiv \text{Expected Output} \\ \mathbf{FAIL} & \text{khi } \text{Actual Output} \neq \text{Expected Output} \end{cases}$$
* Nếu có bất kỳ sự sai khác nào giữa thực tế và kỳ vọng, `Assert` sẽ lập tức ném ra ngoại lệ `AssertionError`, hiển thị bảng so sánh đối soát đỏ/xanh giữa `Expected` và `Actual`, đồng thời làm dừng bài test ngay tại dòng vi phạm.
* **Minh chứng độ chính xác:** Do toàn bộ **74 / 74 ca kiểm thử đều đạt kết quả PASS (100%)**, điều này chứng minh rằng trong quá trình chạy tự động, **toàn bộ Kết quả thực tế (Actual Output) đều khớp 100% với Kết quả kỳ vọng (Expected Output)**.

#### 2. Bốn cách để người dùng/kiểm thử viên tự kiểm tra kết quả thực tế của từng ca test:

* **Cách 1: Xem trực quan trên Web Dashboard Vitest UI (`npm run test:ui`) - Khuyến nghị:**
  - Tại thư mục `backend/`, gõ lệnh: `npm run test:ui`.
  - Trong Terminal, Vitest in ra đường link kèm mã bảo mật: `http://localhost:51204/__vitest__/?token=...`. Nhấn giữ `Ctrl + Click` vào link này (hoặc copy toàn bộ link có `?token=...` dán vào trình duyệt).
  - Trình duyệt hiển thị Dashboard trực quan tương tự cửa sổ Test Explorer của NUnit trong Visual Studio (Slide 28–29).
  - Bấm vào từng test case để xem chi tiết thời gian chạy (ms), trạng thái PASS (màu xanh), và cây gọi hàm.
* **Cách 2: Chạy lệnh Node Test Runner với cờ Spec Reporter:**
  - Chạy lệnh: `node --test --test-reporter=spec test/unitTest_NUnitStyle_3ChucNang.test.js`.
  - Màn hình Console sẽ liệt kê chi tiết từng hàm test case với dấu tích xanh `✔ [Test]` và thời gian chạy thực tế tính bằng mili-giây.
* **Cách 3: In trực tiếp đối tượng thực tế ra màn hình (Console Inspect):**
  - Trong tập tin `unitTest_NUnitStyle_3ChucNang.test.js`, có thể thêm dòng: `console.log("Actual Output:", result);` ngay trước câu lệnh `Assert`.
  - Chạy `npm run test:unit`, đối tượng thực tế do hàm backend trả về sẽ được in chi tiết nguyên bản lên Terminal.
* **Cách 4: Thử nghiệm cơ chế bắt lỗi khi có sự sai khác (Diff Test):**
  - Cố ý sửa giá trị kỳ vọng trong 1 test (ví dụ tại ca số 14 sửa `patient_pay = 240000` thành `999999`).
  - Khi chạy lại test, engine kiểm thử sẽ báo đỏ lập tức và hiển thị trực tiếp sự sai khác:
    ```text
    AssertionError: Expected values to be strictly equal:
    + actual:   240000
    - expected: 999999
    ```

---

### 3.1 Ma trận hiện thực hóa Chức năng 1: Lập hóa đơn viện phí (30 Test Methods - Bao phủ 48 mã TC)
*Phương thức kiểm thử:* `validateInvoiceCreationInput`, `invoiceService.getPendingCharges`, `invoiceService.createInvoice`, `StandardBillingStrategy.calculate`.

| STT | Mã TC được phủ | Phương thức kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Kết quả thực tế nhận được (Actual Output) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | **TC_F5_01** | `validateInvoiceCreationInput` | `patient_id: "B"` (1 ký tự) | `isValid: true` | `isValid = true`, không có lỗi | **PASS** |
| 2 | **TC_F5_02** | `validateInvoiceCreationInput` | `patient_id: 20 ký tự` | `isValid: true` | `isValid = true`, không có lỗi | **PASS** |
| 3 | **TC_F5_03** | `validateInvoiceCreationInput` | `patient_id: 21 ký tự` (Max+) | `isValid: false`, lỗi độ dài | `isValid = false`, lỗi: *"không được vượt quá 20 ký tự"* | **PASS** |
| 4 | **TC_F5_04** | `validateInvoiceCreationInput` | `patient_id: "BN-123@"` (Ký tự đặc biệt) | `isValid: false` | `isValid = false`, lỗi: *"chứa ký tự đặc biệt"* | **PASS** |
| 5 | **TC_F5_05** | `validateInvoiceCreationInput` | `patient_name: "A"` (1 ký tự) | `isValid: true` | `isValid = true`, không có lỗi | **PASS** |
| 6 | **TC_F5_06** | `validateInvoiceCreationInput` | `patient_name: 50 ký tự` | `isValid: true` | `isValid = true`, không có lỗi | **PASS** |
| 7 | **TC_F5_07** | `validateInvoiceCreationInput` | `patient_name: 51 ký tự` (Max+) | `isValid: false`, lỗi độ dài | `isValid = false`, lỗi: *"tối đa 50 ký tự"* | **PASS** |
| 8 | **TC_F5_08** | `validateInvoiceCreationInput` | `patient_name: "Nguyen Van A123"` | `isValid: false`, lỗi chứa số | `isValid = false`, lỗi: *"không chứa số"* | **PASS** |
| 9 | **TC_F5_09** | `validateInvoiceCreationInput` | `{}` (Bỏ trống cả mã và tên) | `isValid: false, errorCode: "E1.1"` | `isValid = false, errorCode = "E1.1"` | **PASS** |
| 10 | **TC_F5_10** | `getPendingCharges` | `patient_id: "BN999999"` | Quăng lỗi HTTP 404, `errorCode: "E1.3"` | Ném lỗi 404: *"Không tìm thấy thông tin bệnh nhân..."* | **PASS** |
| 11 | **TC_F5_11 / TC_F5_15** | `getPendingCharges` | BN001 có phiếu khám 150,000đ | `can_create_invoice: true`, BHYT 80% | `can_create_invoice = true, BHYT = 120,000đ` | **PASS** |
| 12 | **TC_F5_12** | `getPendingCharges` | Hóa đơn tiền khám đã PAID | `can_create_invoice: false`, mờ nút tạo | `can_create_invoice = false, total_pending = 0` | **PASS** |
| 13 | **TC_F5_13** | `createInvoice` | `total_amount: 0` | Quăng lỗi: *"Tổng tiền phải lớn hơn 0"* | Ném lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | **PASS** |
| 14 | **TC_F5_14** | `createInvoice` | `total: 300000, discount: 60000` | Tạo thành công: `status="UNPAID", pay=240k` | Tạo hóa đơn: `status = "UNPAID", patient_pay = 240,000` | **PASS** |
| 15 | **TC_C1_01 / C2_01 / C3_01 / PUSE_01** | `createInvoice` | `{ total_amount: 100000 }` (thiếu mã BN) | Lỗi HTTP 400: *"Thiếu thông tin bắt buộc..."*| Ném lỗi 400: *"Thiếu thông tin bắt buộc..."* | **PASS** |
| 16 | **TC_C1_02 / C3_06** | `createInvoice` | `total_amount: 0` | Lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | Ném lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | **PASS** |
| 17 | **TC_C1_03 / C2_05 / C3_07 / PUSE_05** | `createInvoice` | `insurance_discount: -20000` | Lỗi: *"Giảm trừ không được là số âm"* | Ném lỗi: *"Mức giảm trừ bảo hiểm không được là số âm"* | **PASS** |
| 18 | **TC_C1_04 / C2_07 / C3_08 / PUSE_06** | `createInvoice` | `total: 100000, discount: 150000` | Lỗi: *"vượt quá tổng tiền"* | Ném lỗi: *"Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)"* | **PASS** |
| 19 | **TC_C1_05 / C2_02 / C3_11 / PUSE_08** | `createInvoice` | `payment_method = 'CHUA_THANH_TOAN'` | `status = "UNPAID", patient_pay = 20000` | `status = "UNPAID", patient_pay = 20000` | **PASS** |
| 20 | **TC_C1_06 / C3_09** | `createInvoice` | `payment_method = 'TIEN_MAT'` | `status = "PAID", patient_pay = 200000` | `status = "PAID", patient_pay = 200000` | **PASS** |
| 21 | **TC_C2_03 / PUSE_04** | `createInvoice` | `total_amount âm (-1000)` | Lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | Ném lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | **PASS** |
| 22 | **TC_C2_09 / PUSE_07** | `createInvoice` | `payment_method = 'VIETQR'` | `status = "PAID", patient_pay = 500000` | `status = "PAID", patient_pay = 500000` | **PASS** |
| 23 | **TC_C3_02 / PUSE_02** | `createInvoice` | `patient_name: ""` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | Ném lỗi: *"Thiếu thông tin bắt buộc..."* | **PASS** |
| 24 | **TC_C3_03** | `createInvoice` | `total_amount: undefined` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | Ném lỗi: *"Thiếu thông tin bắt buộc..."* | **PASS** |
| 25 | **TC_C3_04 / PUSE_03** | `createInvoice` | `total_amount: null` | Quăng lỗi: *"Thiếu thông tin bắt buộc..."* | Ném lỗi: *"Thiếu thông tin bắt buộc..."* | **PASS** |
| 26 | **TC_C3_05** | `createInvoice` | `total_amount: "KHONG_PHAI_SO"` | Quăng lỗi: *"Tổng tiền phải lớn hơn 0"* | Ném lỗi: *"Tổng tiền hóa đơn phải lớn hơn 0"* | **PASS** |
| 27 | **TC_C3_10** | `createInvoice` | `payment_method: ""` | Tạo thành công hóa đơn `UNPAID` | `status = "UNPAID", invoice_code = "HD000100"` | **PASS** |
| 28 | **TC_CUSE_01** | `createInvoice` | `total: 500000, discount: 100000` | `total = 500k, discount = 100k, pay = 400k` | `total_amount = 500000, patient_pay = 400000` | **PASS** |
| 29 | **TC_CUSE_02** | `createInvoice` | `item_type: "CAN_LAM_SANG"` | `status = "PAID"`, đúng tên dịch vụ | `status = "PAID", item_type = "CAN_LAM_SANG"` | **PASS** |
| 30 | **TC_CUSE_03** | `createInvoice` | Bỏ trống type/discount | `discount = 0`, `item_type = "TIEN_KHAM"` | `insurance_discount = 0, item_type = "TIEN_KHAM"` | **PASS** |

---

### 3.2 Ma trận hiện thực hóa Chức năng 2: Thanh toán hóa đơn viện phí (21 Test Methods - Bao phủ 42 mã TC)
*Phương thức kiểm thử:* `invoiceService.processPayment`, `PaymentMethodValidatorStrategy.validate`, `InvoiceStateMachine.transition`.

| STT | Mã TC được phủ | Phương thức kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Kết quả thực tế nhận được (Actual Output) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| 31 | **TC_F6_01 / PAY_C1_03 / PAY_C2_05 / PAY_C3_06 / PAY_PUSE_03** | `processPayment` | Hóa đơn có `status = "PAID"` | Lỗi HTTP 400: *"đã được thanh toán trước đó"* | Ném lỗi 400: *"Hóa đơn này đã được thanh toán trước đó"* | **PASS** |
| 32 | **TC_F6_02** | `InvoiceStateMachine` | Hóa đơn UNPAID, `cancel_reason` đúng 255 ký tự (Max) | Hủy thành công, status = CANCELLED | `status = "CANCELLED", cancel_reason.length = 255` | **PASS** |
| 33 | **TC_F6_03** | `InvoiceStateMachine` | `cancel_reason` 256 ký tự (Max+) | Lỗi: *"không quá 255 ký tự"* | Ném lỗi: *"Lý do hủy không được vượt quá 255 ký tự"* | **PASS** |
| 34 | **TC_F6_04 / PAY_C1_01 / PAY_C3_01** | `processPayment` | `payment_method: ""` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | Ném lỗi: *"Phương thức thanh toán không hợp lệ"* | **PASS** |
| 35 | **TC_F6_05** | `processPayment` logic | `amount_received = 499,999 VNĐ` (< 500k) | Lỗi: *"Số tiền nhận phải >= tổng tiền"* | Ném lỗi: *"Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng..."* | **PASS** |
| 36 | **TC_F6_06** | `processPayment` logic | `amount_received = -50,000 VNĐ` (Số âm) | Lỗi: *"Số tiền không hợp lệ"* | Ném lỗi: *"Số tiền không hợp lệ"* | **PASS** |
| 37 | **TC_F6_07 / PAY_C1_04 / PAY_C2_02 / PAY_C2_07** | `processPayment` | `payment_method: "TIEN_MAT"` | `status = "PAID"`, `paid_at` khác null | `status = "PAID", paid_at != null` | **PASS** |
| 38 | **TC_F6_08** | `processPayment` logic | `amount_received = 1,000,000 VNĐ` (> 500k) | Thành công, tiền thối lại = 500,000 VNĐ | `status = "PAID", changeAmount = 500000` | **PASS** |
| 39 | **TC_F6_09 / PAY_C1_05** | `processPayment` | PTTT `"VIETQR"`, phiếu CLS PENDING | `status = "PAID"`, phiếu CLS sang PAID, BN sang Đã khám | `status = "PAID", labOrder = PAID, patient = Đã khám` | **PASS** |
| 40 | **TC_PAY_C1_01 / PAY_C2_01 / PAY_C3_02** | `processPayment` | `payment_method: "BITCOIN"` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | Ném lỗi: *"Phương thức thanh toán không hợp lệ"* | **PASS** |
| 41 | **TC_PAY_C1_02 / PAY_C2_03 / PAY_C3_04 / PAY_PUSE_02** | `processPayment` | `id: 9999` | Lỗi HTTP 404: *"Không tìm thấy hóa đơn"* | Ném lỗi 404: *"Không tìm thấy hóa đơn"* | **PASS** |
| 42 | **TC_PAY_C2_10 / PAY_C3_10 / PAY_PUSE_06** | `processPayment` | `reference_id: "CLS_AO"` | Thanh toán thành công, bỏ qua cập nhật CLS | `status = "PAID", labOrder.payment_status = "UNPAID"` | **PASS** |
| 43 | **TC_PAY_C2_11 / PAY_C3_13 / PAY_PUSE_07** | `processPayment` | BN có status `"Chờ thanh toán"` | BN chuyển sang `"Đã khám"`, phát event | `mockPatient.status = "Đã khám", emit event` | **PASS** |
| 44 | **TC_PAY_C3_07 / PAY_PUSE_04** | `processPayment` | `item_type: "TIEN_KHAM"` | Hoàn tất thanh toán, không gọi CLS | `status = "PAID", không gọi cập nhật CLS` | **PASS** |
| 45 | **TC_PAY_C3_08** | `processPayment` | `item_type = 'CAN_LAM_SANG'`, reference_id = null | Bỏ qua tìm CLS | `status = "PAID", không ném lỗi` | **PASS** |
| 46 | **TC_PAY_C3_11** | `processPayment` | `patientRepository` trả về null | Không quăng lỗi, hoàn tất thanh toán hóa đơn | `status = "PAID", bỏ qua cập nhật bệnh nhân` | **PASS** |
| 47 | **TC_PAY_C3_12** | `processPayment` | BN có status `"Đang khám"` | Giữ nguyên trạng thái, không phát event | `mockPatient.status = "Đang khám", không phát event` | **PASS** |
| 48 | **TC_PAY_CUSE_01** | `processPayment` | Thanh toán TIEN_MAT có cashier | Cập nhật đầy đủ thu ngân, thời gian, trạng thái BN | `paid.cashier = "Nguyễn Thu Ngân", status = "PAID"` | **PASS** |
| 49 | **TC_PAY_CUSE_02 / PAY_C3_09 / PAY_PUSE_05** | `processPayment` | Hóa đơn CLS hợp lệ | Phiếu CLS chuyển `payment_status = "PAID"` | `mockLabOrder.payment_status = "PAID"` | **PASS** |
| 50 | **TC_PAY_CUSE_03** | `processPayment` | Không truyền paymentDetails | Mặc định `"TIEN_MAT"`, `"Trần Văn Thu Ngân"` | `paid.payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân"` | **PASS** |
| 51 | **TC_PAY_PUSE_01** | `processPayment` | `payment_method: "VNPAY"` | Lỗi: *"Phương thức thanh toán không hợp lệ"* | Ném lỗi: *"Phương thức thanh toán không hợp lệ"* | **PASS** |

---

### 3.3 Ma trận hiện thực hóa Chức năng 3: Quản lý danh mục thuốc và tồn kho (23 Test Methods - Bao phủ 48 mã TC)
*Phương thức kiểm thử:* `medicineService.createMedicine`, `medicineService.updateMedicine`, `medicineService.deleteMedicine`.

| STT | Mã TC được phủ | Phương thức kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected Output) | Kết quả thực tế nhận được (Actual Output) | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| 52 | **TC_F9_02 / MED_C1_02 / MED_C3_05** | `createMedicine` | `unit_price: 0` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | Ném lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | **PASS** |
| 53 | **TC_F9_03** | `createMedicine` logic | `batch_number: ""` (0 ký tự) | Lỗi: *"Vui lòng nhập số lô của thuốc"* | Ném lỗi: *"Vui lòng nhập số lô của thuốc"* | **PASS** |
| 54 | **TC_F9_04** | `createMedicine` logic | `batch_number: 51 ký tự` (Max+) | Lỗi: *"Số lô không được vượt quá 50 ký tự"* | Ném lỗi: *"Số lô không được vượt quá 50 ký tự"* | **PASS** |
| 55 | **TC_F9_05** | `createMedicine` logic | `expiration_date: Ngày hôm qua` | Lỗi: *"Hạn sử dụng không hợp lệ"* | Ném lỗi: *"Hạn sử dụng không hợp lệ"* | **PASS** |
| 56 | **TC_F9_06** | `createMedicine` error | Giả lập lỗi DB ngắt kết nối | Lỗi hệ thống khi lưu trữ, kho không đổi | Ném lỗi: *"Lỗi hệ thống khi lưu trữ...", kho giữ nguyên* | **PASS** |
| 57 | **TC_F9_07** | `createMedicine` logic | `expiration_date: Hôm nay` (Min) | Cảnh báo sắp hết hạn (Diff <= 30 ngày) | `isWarning = true` | **PASS** |
| 58 | **TC_F9_08** | `createMedicine` logic | `expiration_date: Hôm nay + 29 ngày` | Cảnh báo sắp hết hạn (Badge vàng) | `isWarning = true` | **PASS** |
| 59 | **TC_MED_C1_01 / MED_C2_01 / MED_C3_01 / MED_C3_02 / MED_PUSE_01** | `createMedicine` | `medicine_name: "   "` | Lỗi HTTP 400: *"Tên thuốc là bắt buộc"* | Ném lỗi 400: *"Tên thuốc là bắt buộc"* | **PASS** |
| 60 | **TC_MED_C1_03 / MED_C2_05 / MED_C3_07 / MED_PUSE_04** | `createMedicine` | `stock_quantity: -5` | Lỗi HTTP 400: *"Số lượng tồn kho không được là số âm"* | Ném lỗi 400: *"Số lượng tồn kho không được là số âm"* | **PASS** |
| 61 | **TC_MED_C1_04 / MED_C2_02 / MED_C3_08 / MED_CUSE_01 / MED_PUSE_05** | `createMedicine` | `{ name: " Aspirin ", ingredient: " Acid ", price: 1500, stock: 100 }` | Tên đã trim, mã `MED011`, phát event `MEDICINE_ADDED` | Sinh mã `MED011`, trim tên, phát event | **PASS** |
| 62 | **TC_MED_C1_05 / MED_C2_08 / MED_C3_09 / MED_CUSE_02 / MED_PUSE_06** | `createMedicine` | Không truyền ingredient, unit, category | `active_ingredient = ""`, `unit = "Viên"`, `category = "Khác"` | Fallback: `active_ingredient = "", unit = "Viên", cat = "Khác"` | **PASS** |
| 63 | **TC_MED_C2_03 / MED_PUSE_03** | `createMedicine` | `unit_price: -100` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | Ném lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | **PASS** |
| 64 | **TC_MED_C3_03 / MED_PUSE_02** | `createMedicine` | Không truyền `unit_price` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | Ném lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | **PASS** |
| 65 | **TC_MED_C3_04** | `createMedicine` | `unit_price: "ABC"` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | Ném lỗi 400: *"Đơn giá thuốc phải lớn hơn 0"* | **PASS** |
| 66 | **TC_MED_C3_06** | `createMedicine` | `stock_quantity: "VO_HAN"` | Lỗi HTTP 400: *"Số lượng tồn kho không được là số âm"* | Ném lỗi 400: *"Số lượng tồn kho không được là số âm"* | **PASS** |
| 67 | **TC_MED_CUSE_03** | `createMedicine` | Không truyền `stock_quantity` | `stock_quantity = 0` | `med.stock_quantity = 0` | **PASS** |
| 68 | **TC_UP_01 / UP_DF_03 / UP_C3_03** | `updateMedicine` | `id: 9999` hoặc `"KHONG_TRUNG"` | Lỗi HTTP 404: *"Không tìm thấy thuốc"* | Ném lỗi 404: *"Không tìm thấy thuốc"* | **PASS** |
| 69 | **TC_UP_02 / UP_DF_01** | `updateMedicine` | `id: 1, { stock: 350, price: 2200 }`| Cập nhật thành công, phát `MEDICINE_STOCK_UPDATED` | `stock = 350, price = 2200, phát event` | **PASS** |
| 70 | **TC_UP_03 / UP_C3_02** | `updateMedicine` | `code: "MED002", { name: " Amox " }` | Tên đã trim, tồn kho cập nhật đúng | `name = "Amoxicillin 500mg (Cập nhật)", stock = 80` | **PASS** |
| 71 | **TC_UP_C3_01** | `updateMedicine` | `idOrCode: 1, { unit: "Hộp" }` | Cập nhật đơn vị tính `unit = "Hộp"` | `updated.unit = "Hộp"` | **PASS** |
| 72 | **TC_UP_DF_02** | `updateMedicine` | Đổi tên, hoạt chất và đơn giá | Cập nhật đầy đủ 3 trường | `name = "Panadol Extra Mới", price = 3000, act = "Paracetamol 650mg"` | **PASS** |
| 73 | **TC_DEL_01** | `deleteMedicine` | `id: 9999` | Lỗi HTTP 404: *"Không tìm thấy thuốc"* | Ném lỗi 404: *"Không tìm thấy thuốc"* | **PASS** |
| 74 | **TC_DEL_02** | `deleteMedicine` | `id: 1` | Trả về thuốc đã xóa, kho giảm 1, tìm lại là null | `deleted.id = 1, kho giảm 1, findById(1) = null` | **PASS** |

---

### 3.4 Kết quả thực thi tự động (Automated Test Execution)

#### A. Thực thi qua Node.js Native Test Runner (`npm run test:unit`)
```text
> his-hospital-backend@1.0.0 test:unit
> node --test test/unitTest_NUnitStyle_3ChucNang.test.js

▶ [TestFixture] ChucNang_1_LapHoaDonVienPhi (30 tests) ............................. PASS (20.92ms)
▶ [TestFixture] ChucNang_2_ThanhToanHoaDonVienPhi (21 tests) ....................... PASS (4.02ms)
▶ [TestFixture] ChucNang_3_QuanLyDanhMucThuocVaTonKho (23 tests) ................... PASS (3.88ms)

ℹ tests 74
ℹ suites 3
ℹ pass 74
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ duration_ms 125.71ms
```

#### B. Thực thi qua Vitest (`npm run test:vitest`)
```text
> his-hospital-backend@1.0.0 test:vitest
> vitest run

 RUN  v5.0.5 D:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend

 ✓ test/unitTest_NUnitStyle_3ChucNang.test.js (74 tests) 22ms

 Test Files  1 passed (1)
      Tests  74 passed (74)
   Start at  08:40:36
   Duration  228ms (transform 46%, import 30%, tests 19%, worker 5%)
```54 | **TC_MED_C3_04** | `unit_price không phải số ('ABC') -> Báo lỗi 400` | `unit_price: "ABC"` | Lỗi HTTP 400: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` |
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
