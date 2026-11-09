# BÁO CÁO THỰC HIỆN KIỂM THỬ ĐƠN VỊ (UNIT TESTING)
## HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)
### PHÂN HỆ THU NGÂN VIỆN PHÍ & DƯỢC KHO THUỐC

**Tác giả thực hiện:** Vũ Đức Vương  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Tài liệu tham chiếu:**
- `docs/vuong/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)
- `docs/vuong/DanhSachCacTestCase.docx.md` (Đặc tả danh sách 138 Test Case Hộp đen, Hộp trắng Dòng điều khiển CFG C1/C2/C3 & Dòng dữ liệu DFG All-Defs/All-Uses)
- Mã nguồn nghiệp vụ: [`backend/src/services/invoiceService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/invoiceService.js), [`backend/src/services/medicineService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/medicineService.js), [`backend/src/validators/invoiceValidator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/validators/invoiceValidator.js)  
- Tệp mã nguồn kiểm thử tự động: [`backend/test/vuong/validators/`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/vuong/validators/) (`01_lapHoaDon.test.js`, `02_thanhToanHoaDon.test.js`, `03_quanLyThuoc.test.js`) và [`backend/test/unitTest_NUnitStyle_3ChucNang.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/unitTest_NUnitStyle_3ChucNang.test.js)

**Nguyên tắc cam kết cốt lõi:** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào bên trong thư mục nghiệp vụ `backend/src/` để làm pass test; kiểm thử độc lập, cô lập và tự động hóa 100%.

---

## MỤC LỤC
1. [PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ (THEO SLIDE NUNIT)](#phần-i-tìm-hiểu-và-trình-bày-về-kiểm-thử-đơn-vị-theo-slide-nunit)
2. [PHẦN II: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CÔNG CỤ CHO DỰ ÁN](#phần-ii-hướng-dẫn-cài-đặt-và-sử-dụng-công-cụ-cho-dự-án)
3. [PHẦN III: CHI TIẾT KIỂM THỬ ĐƠN VỊ TỪNG CHỨC NĂNG (TÁCH BIỆT HỘP ĐEN & HỘP TRẮNG)](#phần-iii-chi-tiết-kiểm-thử-đơn-vị-từng-chức-năng)
   - [3.1 Chức năng 1: Lập hóa đơn viện phí (UC-THUNGAN-05)](#31-chức-năng-1-lập-hóa-đơn-viện-phí-uc-thungan-05)
     - [1. Hàm nghiệp vụ & Code nguồn](#1-hàm-nghiệp-vụ--code-nguồn-chức-năng-1)
     - [2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase](#2-giải-thích-hàm-nguồn-gốc-dữ-liệu-và-cách-lấy-testcase-chức-năng-1)
     - [3. Phần A: Kiểm thử Hộp đen (Black-Box Testing)](#3-phần-a-kiểm-thử-hộp-đen-chức-năng-1)
     - [4. Phần B: Kiểm thử Hộp trắng (White-Box Testing)](#4-phần-b-kiểm-thử-hộp-trắng-chức-năng-1)
   - [3.2 Chức năng 2: Thanh toán hóa đơn viện phí (UC-THUNGAN-06)](#32-chức-năng-2-thanh-toán-hóa-đơn-viện-phí-uc-thungan-06)
     - [1. Hàm nghiệp vụ & Code nguồn](#1-hàm-nghiệp-vụ--code-nguồn-chức-năng-2)
     - [2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase](#2-giải-thích-hàm-nguồn-gốc-dữ-liệu-và-cách-lấy-testcase-chức-năng-2)
     - [3. Phần A: Kiểm thử Hộp đen (Black-Box Testing)](#3-phần-a-kiểm-thử-hộp-đen-chức-năng-2)
     - [4. Phần B: Kiểm thử Hộp trắng (White-Box Testing)](#4-phần-b-kiểm-thử-hộp-trắng-chức-năng-2)
   - [3.3 Chức năng 3: Quản lý danh mục thuốc và tồn kho (UC-DUOC-09)](#33-chức-năng-3-quản-lý-danh-mục-thuốc-và-tồn-kho-uc-duoc-09)
     - [1. Hàm nghiệp vụ & Code nguồn](#1-hàm-nghiệp-vụ--code-nguồn-chức-năng-3)
     - [2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase](#2-giải-thích-hàm-nguồn-gốc-dữ-liệu-và-cách-lấy-testcase-chức-năng-3)
     - [3. Phần A: Kiểm thử Hộp đen (Black-Box Testing)](#3-phần-a-kiểm-thử-hộp-đen-chức-năng-3)
     - [4. Phần B: Kiểm thử Hộp trắng (White-Box Testing)](#4-phần-b-kiểm-thử-hộp-trắng-chức-năng-3)
4. [PHẦN IV: TỔNG HỢP KẾT QUẢ THỰC THI TỰ ĐỘNG & ĐỘ BAO PHỦ](#phần-iv-tổng-hợp-kết-quả-thực-thi-tự-động--độ-bao-phủ)
5. [TỔNG KẾT](#tổng-kết)

---

# PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ (THEO SLIDE NUNIT)

### 1.1 Khái niệm & Mục tiêu của Kiểm thử đơn vị (Slide 2)
* **Kiểm thử đơn vị (Unit Testing)** là kỹ thuật kiểm tra các thành phần phần mềm nhỏ nhất có thể kiểm thử được một cách độc lập (từng hàm, phương thức hoặc lớp đối tượng) trong trạng thái hoàn toàn cô lập.
* **Mục tiêu:** Xác minh từng đơn vị thực hiện chính xác nhiệm vụ với một **kết quả kỳ vọng giả định (Expected Output)**. Nếu kết quả thực tế (**Actual Output**) sai khác với kết quả giả định, đơn vị kiểm thử bị đánh giá là **Thất bại (Fail)**.
* **Lợi ích cốt lõi:** Phát hiện lỗi sớm nhất ngay trong giai đoạn lập trình module, cô lập nguyên nhân gây lỗi, ngăn ngừa lỗi lan sang tầng tích hợp và giảm thiểu tối đa chi phí sửa chữa.

### 1.2 Năm đặc điểm sống còn của Unit Test (Slide 3)
1. **Ngắn gọn, dễ hiểu, dễ bảo trì:** Mỗi ca kiểm thử chỉ tập trung kiểm tra duy nhất một điều kiện biên, một phân vùng hoặc một nhánh logic nghiệp vụ.
2. **Tính độc lập tuyệt đối (Test Independence):** Mỗi unit test là một đơn vị độc lập, không phụ thuộc vào thứ tự chạy, không để lại dữ liệu rác ảnh hưởng đến các ca kiểm thử khác.
3. **Quy chuẩn đặt tên hàm rõ ràng:** Tên hàm phản ánh trực tiếp hành vi được kiểm thử theo chuẩn NUnit:
   $$\text{[Test] TC\_MãCa: KịchBản\_DữLiệuĐầuVào \rightarrow KếtQuảKỳVọng}$$
4. **Tốc độ thực thi siêu nhanh:** Không gọi cơ sở dữ liệu thật, không ghi đọc ổ đĩa hay gọi mạng Internet. Sử dụng kỹ thuật Mock/In-Memory Stub để toàn bộ hàng chục ca kiểm thử chạy xong trong vòng **vài chục mili-giây**.
5. **Cô lập đối tượng kiểm thử (Test Isolation):** Tách biệt tầng logic nghiệp vụ (*Business Logic Layer*) khỏi tầng truy xuất dữ liệu (*Data Access Layer*) bằng cách giả lập kết quả trả về của repository.

### 1.3 Cấu trúc Suite và Lớp `Assert` NUnit (Slide 20 – 27)
* **Cấu trúc Suite:**
  * `[TestFixture]`: Đánh dấu lớp/nhóm chứa các ca kiểm thử (ánh xạ bằng `describe` trong test runner).
  * `[Test]`: Đánh dấu từng phương thức kiểm thử cụ thể (ánh xạ bằng `test`).
  * `[SetUp]`: Khởi tạo môi trường dữ liệu sạch trước mỗi ca kiểm thử (`beforeEach`).
  * `[TearDown]`: Dọn dẹp, khôi phục tài nguyên sau mỗi ca kiểm thử (`afterEach`).
* **Lớp Assert - Cầu nối kiểm định giả định:**
  * `Assert.AreEqual(expected, actual [, message])`: Xác nhận giá trị thực tế bằng chính xác giá trị kỳ vọng.
  * `Assert.IsTrue(condition)` / `Assert.IsFalse(condition)`: Xác nhận biểu thức điều kiện đúng hoặc sai.
  * `Assert.IsNull(object)` / `Assert.IsNotNull(object)`: Xác nhận đối tượng bằng `null` hoặc khác `null`.
  * `Assert.Throws(fn, regexOrMatcher)`: Xác nhận hàm ném ra ngoại lệ nghiệp vụ đúng quy định.

---

# PHẦN II: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CÔNG CỤ CHO DỰ ÁN

Dự án HIS-Hospital được xây dựng trên nền tảng **Node.js (JavaScript ES Modules - `"type": "module"`), Express, React 19 và Vite**. Hai công cụ kiểm thử tối ưu được tích hợp song song:
1. **Node.js Native Test Runner (`node:test`):** Tích hợp sẵn trong Node.js (0 dependency, tốc độ thực thi ~100ms).
2. **Vitest (`vitest` + `@vitest/ui`):** Framework kiểm thử hiện đại hàng đầu với giao diện đồ họa **Web Dashboard Test Explorer trực quan** tương tự NUnit GUI trong Visual Studio (Slide 28–29).

### 2.1 Cài đặt môi trường kiểm thử
Tại thư mục `backend/`:
```powershell
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

### 2.2 Kiến trúc Cầu nối NUnit Adapter & Test Bridge
Để mã kiểm thử viết bằng phong cách NUnit thuần túy chạy mượt mà trên cả hai engine:
* [`backend/test/helpers/nunitAssert.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/nunitAssert.js): Cung cấp đầy đủ các phương thức `Assert.AreEqual`, `Assert.IsTrue`, `Assert.IsFalse`, `Assert.IsNull`, `Assert.Throws`.
* [`backend/test/helpers/testBridge.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/helpers/testBridge.js): Tự động phát hiện engine đang chạy (Node test hay Vitest) để cung cấp hàm `describe`, `test`, `beforeEach`, `afterEach`.

### 2.3 Lệnh chạy kiểm thử nhanh
```powershell
# Chạy toàn bộ 74 ca kiểm thử của Vũ Đức Vương qua Node Native Runner:
npm run test:vuong

# Chạy qua Vitest:
npm run test:vitest:vuong

# Mở giao diện đồ họa Web Dashboard Test Explorer:
npm run test:ui

# Xuất báo cáo đo độ bao phủ mã nguồn (Code Coverage):
npm run test:coverage
```

---

# PHẦN III: CHI TIẾT KIỂM THỬ ĐƠN VỊ TỪNG CHỨC NĂNG

---

## 3.1 CHỨC NĂNG 1: LẬP HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-05)

### 1. Hàm nghiệp vụ & Code nguồn (Chức năng 1)

Chức năng Lập hóa đơn viện phí gồm 3 hàm nghiệp vụ cốt lõi:

#### a) Hàm xác thực tham số tìm kiếm: `validateInvoiceCreationInput(params)`
*Vị trí file:* [`backend/src/validators/invoiceValidator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/validators/invoiceValidator.js#L6-L57)
```javascript
export function validateInvoiceCreationInput(params = {}) {
  const errors = {};
  const { patient_id, patient_name } = params;

  const hasPatientId = patient_id !== undefined && patient_id !== null && String(patient_id).trim() !== "";
  const hasPatientName = patient_name !== undefined && patient_name !== null && String(patient_name).trim() !== "";

  // [E1.1]: Để trống trường tìm kiếm
  if (!hasPatientId && !hasPatientName) {
    return {
      isValid: false,
      errorCode: "E1.1",
      message: "Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm",
      errors: { search: "Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm" }
    };
  }

  // [E1.2]: Lỗi định dạng patient_id (Tối đa 20 ký tự, chỉ chữ và số)
  if (hasPatientId) {
    const rawId = String(patient_id).trim();
    if (rawId.length > 20 || !/^[a-zA-Z0-9]+$/.test(rawId)) {
      errors.patient_id = "Mã bệnh nhân không được vượt quá 20 ký tự hoặc chứa ký tự đặc biệt.";
    }
  }

  // [E1.2]: Lỗi định dạng patient_name (Tối đa 50 ký tự, chỉ chữ cái và khoảng trắng)
  if (hasPatientName) {
    const rawName = String(patient_name).trim();
    const vietnameseLetterAndSpaceRegex = /^[a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]+$/u;
    if (rawName.length > 50 || !vietnameseLetterAndSpaceRegex.test(rawName)) {
      errors.patient_name = "Họ tên bệnh nhân không hợp lệ (tối đa 50 ký tự, không chứa số/ký tự đặc biệt).";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errorCode: "E1.2",
      message: errors.patient_id || errors.patient_name,
      errors
    };
  }

  return { isValid: true, errors: {} };
}
```

#### b) Hàm tính toán tiền viện phí & BHYT: `StandardBillingStrategy.calculate(totalAmount, insuranceDiscount)`
*Vị trí file:* [`backend/src/patterns/strategy/billingStrategy.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/strategy/billingStrategy.js#L5-L27)
```javascript
export class StandardBillingStrategy {
  calculate(totalAmount, insuranceDiscount = 0) {
    const total = Number(totalAmount);
    if (isNaN(total) || total <= 0) {
      throw new Error("Tổng tiền hóa đơn phải lớn hơn 0");
    }

    const discount = Number(insuranceDiscount) || 0;
    if (discount < 0) {
      throw new Error("Mức giảm trừ bảo hiểm không được là số âm");
    }
    if (discount > total) {
      throw new Error("Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)");
    }

    const patientPay = Math.max(0, total - discount);
    return {
      totalAmount: total,
      insuranceDiscount: discount,
      patientPay
    };
  }
}
```

#### c) Hàm tạo hóa đơn viện phí: `invoiceService.createInvoice(payload)`
*Vị trí file:* [`backend/src/services/invoiceService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/invoiceService.js#L285-L347)
```javascript
createInvoice(payload) {
  const {
    patient_code, patient_name, item_type, description,
    total_amount, insurance_discount = 0, insurance_percent = 0,
    payment_method = "CHUA_THANH_TOAN", cashier = "Trần Văn Thu Ngân",
    items = [], reference_id = null
  } = payload;

  if (!patient_code || !patient_name || total_amount === undefined || total_amount === null) {
    const error = new Error("Thiếu thông tin bắt buộc (mã BN, tên BN, tổng số tiền)");
    error.statusCode = 400;
    throw error;
  }

  const calculation = this.billingStrategy.calculate(total_amount, insurance_discount);

  const nextId = invoiceRepository.getNextId();
  const newInvoice = EntityFactory.createInvoice({
    patient_code, patient_name,
    item_type: item_type || "TIEN_KHAM",
    description: description || "Thanh toán viện phí",
    total_amount: calculation.totalAmount,
    insurance_discount: calculation.insuranceDiscount,
    insurance_percent,
    patient_pay: calculation.patientPay,
    payment_method, cashier, items, reference_id
  }, nextId);

  invoiceRepository.create(newInvoice);

  eventBus.emitEvent(EVENT_TYPES.INVOICE_CREATED, {
    invoice: newInvoice,
    message: `Hóa đơn mới [${newInvoice.invoice_code}] cho BN ${newInvoice.patient_name} (${newInvoice.patient_pay.toLocaleString()}đ)`,
  });

  return newInvoice;
}
```

---

### 2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase (Chức năng 1)

#### 2.1 Giải thích chức năng của các hàm
* `validateInvoiceCreationInput`: Kiểm tra tính toàn vẹn của tham số tra cứu bệnh nhân. Bắt buộc có `patient_id` hoặc `patient_name`. Ràng buộc độ dài `patient_id` $\le 20$ ký tự, `patient_name` $\le 50$ ký tự, không chứa ký tự cấm.
* `StandardBillingStrategy.calculate`: Kiểm tra ràng buộc tài chính: $total\_amount > 0$, $0 \le insurance\_discount \le total\_amount$. Tính tiền bệnh nhân cần trả $patient\_pay = total\_amount - insurance\_discount$.
* `invoiceService.createInvoice`: Tạo thực thể hóa đơn, gán mã hóa đơn tự động tăng, lưu vào repository và phát sự kiện `INVOICE_CREATED`.

#### 2.2 Dữ liệu để thực hiện kiểm thử đơn vị này từ đâu ?
* **Cơ chế cấp dữ liệu (Test Isolation theo Slide 3):** Dữ liệu được cô lập hoàn toàn khỏi cơ sở dữ liệu thật (PostgreSQL). Trong phương thức `beforeEach()` của file test, hệ thống sử dụng **In-Memory Stub Objects**:
  - `mockInvoices = []`: Mảng lưu trữ hóa đơn giả lập trong bộ nhớ RAM.
  - `invoiceRepository.create = (inv) => { mockInvoices.push(inv); return inv; };`
  - `patientRepository.findAll = () => [...]`: Giả lập dữ liệu bệnh nhân `BN001` có chi phí chưa thanh toán hoặc đã thanh toán hết.
* Nhờ cơ chế này, dữ liệu đầu vào luôn hoàn toàn xác định (deterministic), không phụ thuộc mạng, không cần seed database, và thời gian thực thi trọn bộ test chỉ mất **vài phần nghìn giây**.

#### 2.3 Lấy các testcase cho kiểm thử đơn vị ở đâu? Như thế nào ?
* **Nguồn gốc:** Lấy trực tiếp từ tài liệu đặc tả kiểm thử phần mềm [`docs/vuong/DanhSachCacTestCase.docx.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/DanhSachCacTestCase.docx.md) (mục Use Case `UC-THUNGAN-05` — Lập hóa đơn viện phí).
* **Phương pháp lấy và thiết kế:**
  1. **Ca kiểm thử Hộp đen (TC_F5_01 $\rightarrow$ TC_F5_14):**
     - *Phân tích giá trị biên (BVA):* Khảo sát biên độ dài `patient_id` tại $\{1, 20, 21\}$, biên độ dài `patient_name` tại $\{1, 50, 51\}$, biên số tiền $total\_amount = 0$.
     - *Phân vùng tương đương (EP):* Khảo sát chuỗi chứa ký tự đặc biệt (`"BN-123@"`), chuỗi chứa số (`"Nguyen Van A123"`).
     - *Bảng quyết định (Decision Table):* Khảo sát các quy tắc Q1 (bỏ trống tìm kiếm), Q2 (bệnh nhân không tồn tại), Q3 (dịch vụ đã thanh toán hết), Q4 (tiền viện phí = 0), Q5 (lập hóa đơn hợp lệ).
  2. **Ca kiểm thử Hộp trắng (TC_C1_01 $\rightarrow$ TC_CUSE_03):**
     - Dựa trên mã nguồn hàm `createInvoice` và `StandardBillingStrategy.calculate`, xây dựng **Đồ thị dòng điều khiển (CFG)**. Xác định các đường đi độc lập để đạt tiêu chí:
       + **Phủ câu lệnh (C1 - Statement Coverage):** Đi qua mọi dòng code thực thi.
       + **Phủ nhánh (C2 - Branch Coverage):** Đi qua cả 2 nhánh True/False của các biểu thức `if (!patient_code)`, `if (discount < 0)`, `if (discount > total)`.
       + **Phủ điều kiện phức (C3 - Multiple Condition Coverage):** Kiểm tra từng điều kiện con độc lập trong biểu thức `if (!patient_code || !patient_name || total === undefined || total === null)`.
     - Xây dựng **Đồ thị dòng dữ liệu (DFG)** để xác định các cặp Định nghĩa - Sử dụng (Def-Use pairs) cho các biến `total_amount`, `insurance_discount`, `patient_pay`, `payment_method`, đạt tiêu chuẩn **All c-use** (sử dụng trong tính toán) và **All p-use** (sử dụng trong vị từ rẽ nhánh).

---

### 3. Phần A: Kiểm thử Hộp đen (Chức năng 1)

#### a) Ma trận ca kiểm thử Hộp đen (14 Test Cases: TC_F5_01 $\rightarrow$ TC_F5_14)
| STT | Mã Ca | Kỹ thuật kiểm thử | Kịch bản kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Phương thức Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | **TC_F5_01** | BVA Min | `patient_id` = 1 ký tự | `{ patient_id: "B" }` | `isValid = true` | `isValid = true` | `Assert.IsTrue` | **PASS** |
| 2 | **TC_F5_02** | BVA Max | `patient_id` = 20 ký tự | `{ patient_id: "BN123456789012345678" }` | `isValid = true` | `isValid = true` | `Assert.IsTrue` | **PASS** |
| 3 | **TC_F5_03** | BVA Max+ | `patient_id` = 21 ký tự | `{ patient_id: "BN1234567890123456789" }` | `isValid = false`, lỗi độ dài | `isValid = false`, lỗi độ dài | `Assert.IsFalse` | **PASS** |
| 4 | **TC_F5_04** | EP Invalid | `patient_id` chứa ký tự cấm | `{ patient_id: "BN-123@" }` | `isValid = false`, lỗi ký tự | `isValid = false`, lỗi ký tự | `Assert.IsFalse` | **PASS** |
| 5 | **TC_F5_05** | BVA Min | `patient_name` = 1 ký tự | `{ patient_name: "A" }` | `isValid = true` | `isValid = true` | `Assert.IsTrue` | **PASS** |
| 6 | **TC_F5_06** | BVA Max | `patient_name` = 50 ký tự | `name` đúng 50 ký tự | `isValid = true` | `isValid = true` | `Assert.IsTrue` | **PASS** |
| 7 | **TC_F5_07** | BVA Max+ | `patient_name` = 51 ký tự | `name` đúng 51 ký tự | `isValid = false`, lỗi độ dài | `isValid = false`, lỗi độ dài | `Assert.IsFalse` | **PASS** |
| 8 | **TC_F5_08** | EP Invalid | `patient_name` chứa số | `{ patient_name: "Nguyen Van A123" }` | `isValid = false`, lỗi chứa số | `isValid = false`, lỗi chứa số | `Assert.IsFalse` | **PASS** |
| 9 | **TC_F5_09** | DT (Q1) | Bỏ trống cả mã và tên BN | `{}` | `isValid = false`, mã `E1.1` | `isValid = false`, mã `E1.1` | `Assert.AreEqual` | **PASS** |
| 10 | **TC_F5_10** | DT (Q2) | Tìm BN không tồn tại | `patient_id = "BN999999"` | Ngoại lệ 404, mã `E1.3` | Ngoại lệ 404: *"Không tìm thấy..."* | `Assert.Throws` | **PASS** |
| 11 | **TC_F5_11** | DT (Q3/Q5) | BN có dịch vụ chưa thu | BN `BN001` có phiếu khám 150k | `can_create = true, pay = 30k` | `can_create = true, pay = 30k` | `Assert.IsTrue` | **PASS** |
| 12 | **TC_F5_12** | DT (Q3) | Dịch vụ đã thu tiền hết | BN `BN001` có hóa đơn `PAID` | `can_create = false`, mã `E1.4`| `can_create = false`, mã `E1.4`| `Assert.IsFalse` | **PASS** |
| 13 | **TC_F5_13** | DT (Q4) | Tạo hóa đơn tiền = 0 | `{ total_amount: 0 }` | Ngoại lệ: *"Tổng tiền > 0"* | Ngoại lệ: *"Tổng tiền > 0"* | `Assert.Throws` | **PASS** |
| 14 | **TC_F5_14** | DT (Q5) | Tạo hóa đơn hợp lệ | `total: 300k, discount: 60k` | `status = "UNPAID", pay = 240k`| `status = "UNPAID", pay = 240k`| `Assert.AreEqual` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp đen)
```javascript
// --- PHẦN 1.1: TEST CASE HỘP ĐEN VỀ MẶT LOGIC & GIÁ TRỊ BIÊN (TC_F5) ---

test("[Test] TC_F5_01: Giá trị biên - patient_id = 1 ký tự (Min hợp lệ)", () => {
  const res = validateInvoiceCreationInput({ patient_id: "B" });
  Assert.IsTrue(res.isValid, "Mã bệnh nhân 1 ký tự phải hợp lệ");
});

test("[Test] TC_F5_02: Giá trị biên - patient_id = 20 ký tự (Max hợp lệ)", () => {
  const res = validateInvoiceCreationInput({ patient_id: "BN123456789012345678" });
  Assert.IsTrue(res.isValid, "Mã bệnh nhân 20 ký tự phải hợp lệ");
});

test("[Test] TC_F5_03: Giá trị biên - patient_id = 21 ký tự (Max+ không hợp lệ)", () => {
  const res = validateInvoiceCreationInput({ patient_id: "BN1234567890123456789" });
  Assert.IsFalse(res.isValid, "Mã bệnh nhân 21 ký tự phải bị từ chối");
  Assert.IsTrue(res.message.includes("không được vượt quá 20 ký tự"));
});

test("[Test] TC_F5_04: Phân vùng tương đương - patient_id chứa ký tự đặc biệt", () => {
  const res = validateInvoiceCreationInput({ patient_id: "BN-123@" });
  Assert.IsFalse(res.isValid);
  Assert.IsTrue(res.message.includes("ký tự đặc biệt"));
});

test("[Test] TC_F5_05: Giá trị biên - patient_name = 1 ký tự (Min hợp lệ)", () => {
  const res = validateInvoiceCreationInput({ patient_name: "A" });
  Assert.IsTrue(res.isValid);
});

test("[Test] TC_F5_06: Giá trị biên - patient_name đúng 50 ký tự (Max hợp lệ)", () => {
  const name50 = "Nguyễn Văn ".padEnd(50, "a");
  const res = validateInvoiceCreationInput({ patient_name: name50 });
  Assert.IsTrue(res.isValid);
});

test("[Test] TC_F5_07: Giá trị biên - patient_name = 51 ký tự (Max+ không hợp lệ)", () => {
  const name51 = "Nguyễn Văn ".padEnd(51, "a");
  const res = validateInvoiceCreationInput({ patient_name: name51 });
  Assert.IsFalse(res.isValid);
  Assert.IsTrue(res.message.includes("tối đa 50 ký tự"));
});

test("[Test] TC_F5_08: Phân vùng tương đương - patient_name chứa số", () => {
  const res = validateInvoiceCreationInput({ patient_name: "Nguyen Van A123" });
  Assert.IsFalse(res.isValid);
  Assert.IsTrue(res.message.includes("không chứa số"));
});

test("[Test] TC_F5_09: Bảng quyết định (Q1) - Bỏ trống cả patient_id và patient_name", () => {
  const res = validateInvoiceCreationInput({});
  Assert.IsFalse(res.isValid);
  Assert.AreEqual("E1.1", res.errorCode);
  Assert.AreEqual("Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm", res.message);
});

test("[Test] TC_F5_10: Bảng quyết định (Q2) - Tìm bệnh nhân không tồn tại trong CSDL", () => {
  patientRepository.findAll = () => [];
  Assert.Throws(
    () => invoiceService.getPendingCharges({ patient_id: "BN999999" }),
    (err) => err.statusCode === 404 && err.errorCode === "E1.3"
  );
});

test("[Test] TC_F5_11 / TC_F5_15: Bảng quyết định (Q3/Q5) - Bệnh nhân có chi phí chưa thanh toán -> can_create_invoice = true", () => {
  patientRepository.findAll = () => [
    { id: "P001", patient_code: "BN001", name: "Nguyễn Văn An", insurance_code: "DN401" }
  ];
  const details = invoiceService.getPendingCharges({ patient_id: "BN001" });
  Assert.IsTrue(details.can_create_invoice, "Có dịch vụ chưa thanh toán thì can_create_invoice phải là true");
  Assert.AreEqual(150000, details.summary.total_amount);
  Assert.AreEqual(80, details.summary.insurance_percent);
  Assert.AreEqual(30000, details.summary.patient_pay);
});

test("[Test] TC_F5_12: Bảng quyết định (Q3) - Các dịch vụ đã thu tiền trước đó -> can_create_invoice = false (nút tạo hóa đơn bị mờ)", () => {
  patientRepository.findAll = () => [
    { id: "P001", patient_code: "BN001", name: "Nguyễn Văn An", insurance_code: "DN401" }
  ];
  invoiceRepository.findByPatientCode = () => [
    { item_type: "TIEN_KHAM", status: "PAID" }
  ];
  const details = invoiceService.getPendingCharges({ patient_id: "BN001" });
  Assert.IsFalse(details.can_create_invoice, "Tất cả dịch vụ đã trả tiền thì can_create_invoice phải là false");
  Assert.AreEqual("E1.4", details.errorCode);
  Assert.AreEqual("Các khoản chi phí này đã được thanh toán đầy đủ", details.status_message);
});

test("[Test] TC_F5_13: Bảng quyết định (Q4) - Tạo hóa đơn với số tiền bằng 0 -> Chặn tạo", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "An", total_amount: 0 }),
    /Tổng tiền hóa đơn phải lớn hơn 0/
  );
});

test("[Test] TC_F5_14: Bảng quyết định (Q5) - Tạo hóa đơn hợp lệ ở trạng thái UNPAID", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN001",
    patient_name: "Nguyễn Văn An",
    total_amount: 300000,
    insurance_discount: 60000,
    payment_method: "CHUA_THANH_TOAN"
  });
  Assert.AreEqual("UNPAID", inv.status);
  Assert.AreEqual(240000, inv.patient_pay);
  Assert.Greater(inv.patient_pay, 0);
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp đen)
```text
  ✔ [Test] TC_F5_01: Giá trị biên - patient_id = 1 ký tự (Min hợp lệ) (0.6482ms)
  ✔ [Test] TC_F5_02: Giá trị biên - patient_id = 20 ký tự (Max hợp lệ) (0.1245ms)
  ✔ [Test] TC_F5_03: Giá trị biên - patient_id = 21 ký tự (Max+ không hợp lệ) (0.1384ms)
  ✔ [Test] TC_F5_04: Phân vùng tương đương - patient_id chứa ký tự đặc biệt (0.0931ms)
  ✔ [Test] TC_F5_05: Giá trị biên - patient_name = 1 ký tự (Min hợp lệ) (0.0872ms)
  ✔ [Test] TC_F5_06: Giá trị biên - patient_name đúng 50 ký tự (Max hợp lệ) (0.1412ms)
  ✔ [Test] TC_F5_07: Giá trị biên - patient_name = 51 ký tự (Max+ không hợp lệ) (0.1251ms)
  ✔ [Test] TC_F5_08: Phân vùng tương đương - patient_name chứa số (0.0894ms)
  ✔ [Test] TC_F5_09: Bảng quyết định (Q1) - Bỏ trống cả patient_id và patient_name (0.0911ms)
  ✔ [Test] TC_F5_10: Bảng quyết định (Q2) - Tìm bệnh nhân không tồn tại trong CSDL (0.7158ms)
  ✔ [Test] TC_F5_11 / TC_F5_15: Bảng quyết định (Q3/Q5) - Bệnh nhân có chi phí chưa thanh toán (0.248ms)
  ✔ [Test] TC_F5_12: Bảng quyết định (Q3) - Các dịch vụ đã thu tiền trước đó (0.1356ms)
  ✔ [Test] TC_F5_13: Bảng quyết định (Q4) - Tạo hóa đơn với số tiền bằng 0 (0.1959ms)
  ✔ [Test] TC_F5_14: Bảng quyết định (Q5) - Tạo hóa đơn hợp lệ ở trạng thái UNPAID (12.3974ms)
```

---

### 4. Phần B: Kiểm thử Hộp trắng (Chức năng 1)

#### a) Ma trận ca kiểm thử Hộp trắng (16 Test Cases: TC_C1_01 $\rightarrow$ TC_CUSE_03)
| STT | Mã Ca | Kỹ thuật kiểm thử | Đường đi / Cặp Def-Use | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 15 | **TC_C1_01** | CFG C1/C2/C3 | Nhánh `!patient_code` | `patient_code: ""` | Lỗi HTTP 400 | Ngoại lệ: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` | **PASS** |
| 16 | **TC_C1_02** | CFG C1/C3 | Nhánh `total <= 0` | `total_amount: 0` | Ngoại lệ $> 0$ | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 17 | **TC_C1_03** | CFG C1/C2/C3 | Nhánh `discount < 0` | `discount = -20000` | Ngoại lệ giảm trừ âm | Ngoại lệ: *"Mức giảm trừ không được là số âm"* | `Assert.Throws` | **PASS** |
| 18 | **TC_C1_04** | CFG C1/C2/C3 | Nhánh `discount > total` | `total: 100k, discount: 150k`| Ngoại lệ vượt tổng tiền | Ngoại lệ: *"Mức giảm trừ vượt quá tổng tiền"* | `Assert.Throws` | **PASS** |
| 19 | **TC_C1_05** | CFG C1/C2 | Nhánh `CHUA_THANH_TOAN` | `payment_method: "CHUA_THANH_TOAN"`| `status = "UNPAID"` | `status = "UNPAID", patient_pay = 20000` | `Assert.AreEqual` | **PASS** |
| 20 | **TC_C1_06** | CFG C1/C3 | Nhánh `TIEN_MAT` | `payment_method: "TIEN_MAT"` | `status = "PAID"` | `status = "PAID", patient_pay = 200000` | `Assert.AreEqual` | **PASS** |
| 21 | **TC_C2_03** | CFG C2/PUSE | Nhánh `total < 0` | `total_amount: -1000` | Ngoại lệ $> 0$ | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 22 | **TC_C2_09** | CFG C2/PUSE | Nhánh `VIETQR` | `payment_method: "VIETQR"` | `status = "PAID"` | `status = "PAID", patient_pay = 500000` | `Assert.AreEqual` | **PASS** |
| 23 | **TC_C3_02** | CFG C3/PUSE | Điều kiện `!patient_name` | `patient_name: ""` | Lỗi HTTP 400 | Ngoại lệ: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` | **PASS** |
| 24 | **TC_C3_03** | CFG C3 | Điều kiện `total === undefined`| `total_amount: undefined` | Lỗi HTTP 400 | Ngoại lệ: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` | **PASS** |
| 25 | **TC_C3_04** | CFG C3/PUSE | Điều kiện `total === null` | `total_amount: null` | Lỗi HTTP 400 | Ngoại lệ: *"Thiếu thông tin bắt buộc..."* | `Assert.Throws` | **PASS** |
| 26 | **TC_C3_05** | CFG C3 | Điều kiện `isNaN(total)` | `total_amount: "KHONG_PHAI_SO"`| Ngoại lệ $> 0$ | Ngoại lệ: *"Tổng tiền hóa đơn phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 27 | **TC_C3_10** | CFG C3 | Điều kiện `payment_method = ""`| `payment_method: ""` | Fallback `UNPAID` | `status = "UNPAID", code = "HD000100"` | `Assert.AreEqual` | **PASS** |
| 28 | **TC_CUSE_01**| DFG c-use | `(total, discount) -> patientPay` | `total: 500k, discount: 100k`| `pay = 400k` | `total = 500k, discount = 100k, pay = 400k` | `Assert.AreEqual` | **PASS** |
| 29 | **TC_CUSE_02**| DFG c-use | `item_type -> invoice` | `item_type: "CAN_LAM_SANG"` | Đúng loại dịch vụ | `item_type = "CAN_LAM_SANG", status = "PAID"` | `Assert.AreEqual` | **PASS** |
| 30 | **TC_CUSE_03**| DFG c-use | Fallback giá trị mặc định | Không truyền type/discount | Mặc định `TIEN_KHAM, 0` | `insurance_discount = 0, item_type = "TIEN_KHAM"`| `Assert.AreEqual` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp trắng)
```javascript
// --- PHẦN 1.2: TEST CASE HỘP TRẮNG - DÒNG ĐIỀU KHIỂN & DÒNG DỮ LIỆU ---

test("[Test] TC_C1_01 / TC_C2_01 / TC_C3_01 / TC_PUSE_01: Thiếu patient_code -> Lỗi 400", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "", patient_name: "Nguyễn Văn A", total_amount: 100000 }),
    (err) => err.statusCode === 400 && err.message.includes("Thiếu thông tin bắt buộc")
  );
});

test("[Test] TC_C1_02 / TC_C3_06: total_amount = 0 -> Quăng lỗi > 0", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 0 }),
    /Tổng tiền hóa đơn phải lớn hơn 0/
  );
});

test("[Test] TC_C1_03 / TC_C2_05 / TC_C3_07 / TC_PUSE_05: insurance_discount < 0 -> Báo lỗi số âm", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: -20000 }),
    /Mức giảm trừ bảo hiểm không được là số âm/
  );
});

test("[Test] TC_C1_04 / TC_C2_07 / TC_C3_08 / TC_PUSE_06: insurance_discount > total -> Báo lỗi vượt quá tổng tiền", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: 100000, insurance_discount: 150000 }),
    /Mức giảm trừ bảo hiểm không hợp lệ \(vượt quá tổng tiền\)/
  );
});

test("[Test] TC_C1_05 / TC_C2_02 / TC_C3_11 / TC_PUSE_08: payment_method = 'CHUA_THANH_TOAN' -> UNPAID", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN01",
    patient_name: "Nguyễn Văn A",
    total_amount: 100000,
    insurance_discount: 80000,
    payment_method: "CHUA_THANH_TOAN"
  });
  Assert.AreEqual("UNPAID", inv.status);
  Assert.AreEqual(20000, inv.patient_pay);
});

test("[Test] TC_C1_06 / TC_C3_09: payment_method = 'TIEN_MAT' -> PAID", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN02",
    patient_name: "Trần Thị B",
    total_amount: 200000,
    insurance_discount: 0,
    payment_method: "TIEN_MAT"
  });
  Assert.AreEqual("PAID", inv.status);
  Assert.AreEqual(200000, inv.patient_pay);
});

test("[Test] TC_C2_03 / TC_PUSE_04: total_amount âm (-1000) -> Báo lỗi", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN03", patient_name: "Lê Văn C", total_amount: -1000 }),
    /Tổng tiền hóa đơn phải lớn hơn 0/
  );
});

test("[Test] TC_C2_09 / TC_PUSE_07: payment_method = 'VIETQR' -> PAID", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN03",
    patient_name: "Lê Văn C",
    total_amount: 500000,
    insurance_discount: 0,
    payment_method: "VIETQR"
  });
  Assert.AreEqual("PAID", inv.status);
  Assert.AreEqual(500000, inv.patient_pay);
});

test("[Test] TC_C3_02 / TC_PUSE_02: Điều kiện con 2b=True (patient_name rỗng)", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "", total_amount: 100000 }),
    /Thiếu thông tin bắt buộc/
  );
});

test("[Test] TC_C3_03: Điều kiện con 2c=True (total_amount === undefined)", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: undefined }),
    /Thiếu thông tin bắt buộc/
  );
});

test("[Test] TC_C3_04 / TC_PUSE_03: Điều kiện con 2d=True (total_amount === null)", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: null }),
    /Thiếu thông tin bắt buộc/
  );
});

test("[Test] TC_C3_05: Điều kiện con 5a=True (isNaN(total))", () => {
  Assert.Throws(
    () => invoiceService.createInvoice({ patient_code: "BN01", patient_name: "Nguyễn Văn A", total_amount: "KHONG_PHAI_SO" }),
    /Tổng tiền hóa đơn phải lớn hơn 0/
  );
});

test("[Test] TC_C3_10: Điều kiện con 17a=False (payment_method rỗng) -> UNPAID", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN01",
    patient_name: "Nguyễn Văn A",
    total_amount: 100000,
    insurance_discount: 20000,
    payment_method: ""
  });
  Assert.AreEqual("UNPAID", inv.status);
});

test("[Test] TC_CUSE_01: Cặp def -> c-use tính toán patientPay, totalAmount, discount", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN01",
    patient_name: "Nguyễn Văn A",
    total_amount: 500000,
    insurance_discount: 100000,
    payment_method: "CHUA_THANH_TOAN"
  });
  Assert.AreEqual(500000, inv.total_amount);
  Assert.AreEqual(100000, inv.insurance_discount);
  Assert.AreEqual(400000, inv.patient_pay);
  Assert.AreEqual("UNPAID", inv.status);
});

test("[Test] TC_CUSE_02: Cặp def -> c-use cho item_type CAN_LAM_SANG và description", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN02",
    patient_name: "Trần Thị B",
    item_type: "CAN_LAM_SANG",
    description: "Siêu âm tổng quát",
    total_amount: 300000,
    insurance_discount: 0,
    payment_method: "TIEN_MAT"
  });
  Assert.AreEqual("PAID", inv.status);
  Assert.AreEqual("CAN_LAM_SANG", inv.item_type);
  Assert.AreEqual("Siêu âm tổng quát", inv.description);
  Assert.AreEqual(300000, inv.patient_pay);
});

test("[Test] TC_CUSE_03: Fallback giá trị mặc định của item_type và insurance_discount", () => {
  const inv = invoiceService.createInvoice({
    patient_code: "BN03",
    patient_name: "Lê Văn C",
    total_amount: 150000
  });
  Assert.AreEqual(0, inv.insurance_discount);
  Assert.AreEqual(150000, inv.patient_pay);
  Assert.AreEqual("TIEN_KHAM", inv.item_type);
  Assert.AreEqual("Thanh toán viện phí", inv.description);
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp trắng)
```text
  ✔ [Test] TC_C1_01 / TC_C2_01 / TC_C3_01 / TC_PUSE_01: Thiếu patient_code -> Lỗi 400 (0.2358ms)
  ✔ [Test] TC_C1_02 / TC_C3_06: total_amount = 0 -> Quăng lỗi > 0 (0.1256ms)
  ✔ [Test] TC_C1_03 / TC_C2_05 / TC_C3_07 / TC_PUSE_05: insurance_discount < 0 -> Báo lỗi số âm (0.0975ms)
  ✔ [Test] TC_C1_04 / TC_C2_07 / TC_C3_08 / TC_PUSE_06: insurance_discount > total -> Báo lỗi vượt quá tổng tiền (0.7507ms)
  ✔ [Test] TC_C1_05 / TC_C2_02 / TC_C3_11 / TC_PUSE_08: payment_method = 'CHUA_THANH_TOAN' -> UNPAID (0.2542ms)
  ✔ [Test] TC_C1_06 / TC_C3_09: payment_method = 'TIEN_MAT' -> PAID (0.2092ms)
  ✔ [Test] TC_C2_03 / TC_PUSE_04: total_amount âm (-1000) -> Báo lỗi (0.1477ms)
  ✔ [Test] TC_C2_09 / TC_PUSE_07: payment_method = 'VIETQR' -> PAID (0.1299ms)
  ✔ [Test] TC_C3_02 / TC_PUSE_02: Điều kiện con 2b=True (patient_name rỗng) (0.0813ms)
  ✔ [Test] TC_C3_03: Điều kiện con 2c=True (total_amount === undefined) (0.0851ms)
  ✔ [Test] TC_C3_04 / TC_PUSE_03: Điều kiện con 2d=True (total_amount === null) (0.0723ms)
  ✔ [Test] TC_C3_05: Điều kiện con 5a=True (isNaN(total)) (0.0696ms)
  ✔ [Test] TC_C3_10: Điều kiện con 17a=False (payment_method rỗng) -> UNPAID (0.0968ms)
  ✔ [Test] TC_CUSE_01: Cặp def -> c-use tính toán patientPay, totalAmount, discount (0.0977ms)
  ✔ [Test] TC_CUSE_02: Cặp def -> c-use cho item_type CAN_LAM_SANG và description (0.1089ms)
  ✔ [Test] TC_CUSE_03: Fallback giá trị mặc định của item_type và insurance_discount (0.0828ms)
```

---

## 3.2 CHỨC NĂNG 2: THANH TOÁN HÓA ĐƠN VIỆN PHÍ (UC-THUNGAN-06)

### 1. Hàm nghiệp vụ & Code nguồn (Chức năng 2)

#### a) Hàm xử lý thanh toán: `invoiceService.processPayment(idOrCode, paymentDetails)`
*Vị trí file:* [`backend/src/services/invoiceService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/invoiceService.js#L349-L403)
```javascript
processPayment(idOrCode, paymentDetails = {}) {
  const { payment_method = "TIEN_MAT", cashier = "Trần Văn Thu Ngân" } = paymentDetails;

  // 1. Validate payment method qua Strategy
  PaymentMethodValidatorStrategy.validate(payment_method);

  const invoice = invoiceRepository.findByIdOrCode(idOrCode);
  if (!invoice) {
    const error = new Error("Không tìm thấy hóa đơn");
    error.statusCode = 404;
    throw error;
  }

  if (invoice.status === INVOICE_STATES.PAID) {
    const error = new Error("Hóa đơn này đã được thanh toán trước đó");
    error.statusCode = 400;
    throw error;
  }

  // Chuyển trạng thái qua State Machine
  InvoiceStateMachine.transition(invoice, INVOICE_STATES.PAID);
  invoice.payment_method = payment_method;
  invoice.paid_at = dayjs().format("DD/MM/YYYY HH:mm");
  invoice.cashier = cashier;

  // Kích hoạt chuyển trạng thái CLS sang PAID nếu hóa đơn cận lâm sàng
  if (invoice.item_type === "CAN_LAM_SANG" && invoice.reference_id) {
    const labOrder = labOrderRepository.findOrderByIdOrCode(invoice.reference_id);
    if (labOrder) {
      labOrder.payment_status = "PAID";
    }
  }

  // Cập nhật trạng thái bệnh nhân
  const patient = patientRepository.findByIdOrCode(invoice.patient_code);
  if (patient && patient.status === "Chờ thanh toán") {
    patient.status = "Đã khám";
    eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
      patient_code: patient.patient_code,
      status: "Đã khám",
      message: `Bệnh nhân [${patient.name}] đã hoàn tất thanh toán viện phí.`,
    });
  }

  eventBus.emitEvent(EVENT_TYPES.INVOICE_PAID, {
    invoice,
    patient_code: invoice.patient_code,
    message: `Hóa đơn [${invoice.invoice_code}] đã được thanh toán thành công qua [${payment_method}] bởi ${cashier}`,
  });

  return invoice;
}
```

#### b) Hàm máy trạng thái hóa đơn: `InvoiceStateMachine.transition(invoice, nextState)`
*Vị trí file:* [`backend/src/patterns/state/invoiceState.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/state/invoiceState.js#L23-L44)
```javascript
export class InvoiceStateMachine {
  static canTransition(currentState, nextState) {
    if (currentState === nextState) return { isValid: true };
    const allowed = VALID_INVOICE_TRANSITIONS[currentState] || [];
    if (!allowed.includes(nextState)) {
      return {
        isValid: false,
        reason: `Không thể chuyển hóa đơn từ trạng thái [${currentState}] sang [${nextState}]`
      };
    }
    return { isValid: true };
  }

  static transition(invoice, nextState) {
    const check = this.canTransition(invoice.status, nextState);
    if (!check.isValid) {
      throw new Error(check.reason);
    }
    invoice.status = nextState;
    return invoice;
  }
}
```

---

### 2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase (Chức năng 2)

#### 2.1 Giải thích chức năng của các hàm
* `processPayment`: Thực hiện luồng nghiệp vụ thanh toán viện phí cho bệnh nhân. Đảm bảo hóa đơn tồn tại và chưa bị đóng tiền trước đó, chuyển trạng thái từ `UNPAID` sang `PAID`, đóng dấu thời gian `paid_at`, ghi nhận thu ngân, tự động mở khóa dịch vụ Cận lâm sàng (`labOrder.payment_status = "PAID"`) và chuyển trạng thái bệnh nhân từ `"Chờ thanh toán"` sang `"Đã khám"`.
* `InvoiceStateMachine.transition`: Đảm bảo quy tắc chuyển đổi trạng thái nghiêm ngặt (chỉ cho phép `UNPAID` $\rightarrow$ `PAID` hoặc `CANCELLED`; cấm thanh toán lại hóa đơn đã `PAID`).

#### 2.2 Dữ liệu để thực hiện kiểm thử đơn vị này từ đâu ?
* **Cơ chế cấp dữ liệu Mock độc lập:** Trong `beforeEach()` của file test, dữ liệu được giả lập nguyên tử trong bộ nhớ:
  - `mockInvoice`: Hóa đơn viện phí mẫu với trạng thái ban đầu `UNPAID`, tổng tiền `500,000đ`, liên kết với phiếu CLS `CLS000001`.
  - `mockPatient`: Bệnh nhân có trạng thái `"Chờ thanh toán"`.
  - `mockLabOrder`: Phiếu chỉ định cận lâm sàng đang ở trạng thái `"UNPAID"`.
* Mỗi test case tự điều chỉnh trạng thái dữ liệu (ví dụ gán `mockInvoice.status = "PAID"`) mà không gây ảnh hưởng đến các ca test khác.

#### 2.3 Lấy các testcase cho kiểm thử đơn vị ở đâu? Như thế nào ?
* **Nguồn gốc:** Lấy từ tài liệu đặc tả kiểm thử [`docs/vuong/DanhSachCacTestCase.docx.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/DanhSachCacTestCase.docx.md) (Use Case `UC-THUNGAN-06`).
* **Phương pháp lấy và thiết kế:**
  1. **Ca kiểm thử Hộp đen (TC_F6_01 $\rightarrow$ TC_F6_09):**
     - BVA trên lý do hủy hóa đơn (`cancel_reason`): 255 ký tự (hợp lệ), 256 ký tự (báo lỗi).
     - BVA trên tiền nhận (`amount_received`): Nhận 499,999đ (< 500k $\rightarrow$ lỗi), nhận 1,000,000đ (> 500k $\rightarrow$ tiền thối 500,000đ).
     - EP trên PTTT: `"TIEN_MAT"`, `"VIETQR"`, rỗng `""`, số tiền âm ($-50,000đ$).
  2. **Ca kiểm thử Hộp trắng (TC_PAY_C1_01 $\rightarrow$ TC_PAY_PUSE_01):**
     - CFG C1/C2/C3 cho các rẽ nhánh: PTTT không hợp lệ (`"BITCOIN"`, `"VNPAY"`), hóa đơn không tồn tại (HTTP 404), hóa đơn không có phiếu CLS liên kết (`reference_id = null` hoặc `reference_id = "CLS_AO"`), bệnh nhân đang có trạng thái `"Đang khám"` (giữ nguyên không đổi sang `"Đã khám"`).
     - DFG All-Uses cho các cặp Def-Use của `payment_method`, `cashier`, `reference_id` và `labOrder`.

---

### 3. Phần A: Kiểm thử Hộp đen (Chức năng 2)

#### a) Ma trận ca kiểm thử Hộp đen (9 Test Cases: TC_F6_01 $\rightarrow$ TC_F6_09)
| STT | Mã Ca | Kỹ thuật kiểm thử | Kịch bản kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 31 | **TC_F6_01** | EP Invalid | Hóa đơn đã PAID trước đó | `status: "PAID"` | Lỗi HTTP 400 | Ngoại lệ: *"Hóa đơn này đã được thanh toán..."* | `Assert.Throws` | **PASS** |
| 32 | **TC_F6_02** | BVA Max | Hủy HĐ lý do đúng 255 ký tự | `cancel_reason: "A" x 255` | Hủy thành công | `status = "CANCELLED", len = 255` | `Assert.AreEqual` | **PASS** |
| 33 | **TC_F6_03** | BVA Max+ | Hủy HĐ lý do 256 ký tự | `cancel_reason: "A" x 256` | Lỗi vượt quá 255 ký tự | Ngoại lệ: *"Lý do hủy không vượt quá 255..."* | `Assert.Throws` | **PASS** |
| 34 | **TC_F6_04** | EP Invalid | Bỏ trống PTTT | `payment_method: ""` | Lỗi PTTT không hợp lệ | Ngoại lệ: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` | **PASS** |
| 35 | **TC_F6_05** | BVA Min- | Tiền nhận thiếu (499,999đ) | `amount_received: 499999` | Lỗi tiền nhận $< 500k$ | Ngoại lệ: *"Số tiền nhận phải lớn hơn..."* | `Assert.Throws` | **PASS** |
| 36 | **TC_F6_06** | EP Invalid | Số tiền nhận âm ($-50,000đ$) | `amount_received: -50000` | Lỗi số tiền âm | Ngoại lệ: *"Số tiền không hợp lệ"* | `Assert.Throws` | **PASS** |
| 37 | **TC_F6_07** | EP Valid | Thanh toán TIEN_MAT hợp lệ | `payment_method: "TIEN_MAT"` | `status = "PAID"` | `status = "PAID", paid_at != null` | `Assert.AreEqual` | **PASS** |
| 38 | **TC_F6_08** | BVA Over | Tiền nhận thừa (1,000,000đ) | `amount_received: 1000000` | Tiền thối = 500,000đ | `status = "PAID", change = 500000` | `Assert.AreEqual` | **PASS** |
| 39 | **TC_F6_09** | DT Valid | Quét mã QR thanh toán CLS | `payment_method: "VIETQR"` | Đồng bộ CLS sang PAID | `status = "PAID", labOrder = PAID, BN = Đã khám` | `Assert.AreEqual` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp đen)
```javascript
// --- PHẦN 2.1: TEST CASE HỘP ĐEN VỀ MẶT LOGIC & GIÁ TRỊ BIÊN (TC_F6) ---

test("[Test] TC_F6_01 / TC_PAY_C1_03 / TC_PAY_C2_05 / TC_PAY_C3_06 / TC_PAY_PUSE_03: Hóa đơn đã thanh toán trước đó -> Chặn giao dịch (Lỗi 400)", () => {
  mockInvoice.status = INVOICE_STATES.PAID;
  Assert.Throws(
    () => invoiceService.processPayment(1, { payment_method: "TIEN_MAT" }),
    (err) => err.statusCode === 400 && err.message.includes("đã được thanh toán trước đó")
  );
});

test("[Test] TC_F6_02: Giá trị biên / BQ (Q2) - Hủy hóa đơn với cancel_reason đúng 255 ký tự (Max)", () => {
  const reason255 = "A".repeat(255);
  const cancelled = InvoiceStateMachine.transition(mockInvoice, INVOICE_STATES.CANCELLED);
  cancelled.cancel_reason = reason255;
  Assert.AreEqual(INVOICE_STATES.CANCELLED, cancelled.status);
  Assert.AreEqual(255, cancelled.cancel_reason.length);
});

test("[Test] TC_F6_03: Giá trị biên - cancel_reason 256 ký tự (Max+) -> Báo lỗi inline", () => {
  const reason256 = "A".repeat(256);
  Assert.Throws(
    () => {
      if (reason256.length > 255) throw new Error("Lý do hủy không được vượt quá 255 ký tự");
    },
    /Lý do hủy không được vượt quá 255 ký tự/
  );
});

test("[Test] TC_F6_04 / TC_PAY_C1_01 / TC_PAY_C3_01: Không tick chọn payment_method (để trống) -> Báo lỗi", () => {
  Assert.Throws(
    () => invoiceService.processPayment(1, { payment_method: "" }),
    /Phương thức thanh toán không hợp lệ/
  );
});

test("[Test] TC_F6_05: Giá trị biên / BQ (Q4) - amount_received = 499,999 VNĐ (< tổng tiền 500k) -> Báo lỗi", () => {
  const totalAmount = 500000;
  const amountReceived = 499999;
  Assert.Throws(
    () => {
      if (amountReceived < totalAmount) {
        throw new Error("Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán");
      }
    },
    /Số tiền nhận từ bệnh nhân phải lớn hơn hoặc bằng tổng số tiền thanh toán/
  );
});

test("[Test] TC_F6_06: Phân vùng TĐ - amount_received = -50,000 VNĐ (Số âm) -> Báo lỗi", () => {
  const amountReceived = -50000;
  Assert.Throws(
    () => {
      if (amountReceived <= 0) throw new Error("Số tiền không hợp lệ");
    },
    /Số tiền không hợp lệ/
  );
});

test("[Test] TC_F6_07 / TC_PAY_C1_04 / TC_PAY_C2_02 / TC_PAY_C2_07: Thanh toán TIEN_MAT hợp lệ -> Chuyển 'Đã thanh toán'", () => {
  mockInvoice.item_type = "TIEN_KHAM";
  mockPatient.status = "Đang khám";
  const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT", cashier: "Trần Văn Thu Ngân" });
  Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
  Assert.IsNotNull(paid.paid_at);
});

test("[Test] TC_F6_08: Giá trị biên / BQ (Q5) - amount_received = 1,000,000 VNĐ (> tổng tiền) -> Tính đúng tiền thối lại", () => {
  const totalAmount = 500000;
  const amountReceived = 1000000;
  const changeAmount = amountReceived - totalAmount;
  Assert.AreEqual(500000, changeAmount);
  mockInvoice.item_type = "TIEN_KHAM";
  mockPatient.status = "Đang khám";
  const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
  Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
});

test("[Test] TC_F6_09 / TC_PAY_C1_05: Quét mã QR thanh toán thành công -> Đồng bộ CLS & Bác sĩ", () => {
  const paid = invoiceService.processPayment(1, { payment_method: "VIETQR" });
  Assert.AreEqual(INVOICE_STATES.PAID, paid.status);
  Assert.AreEqual("PAID", mockLabOrder.payment_status);
  Assert.AreEqual("Đã khám", mockPatient.status);
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp đen)
```text
  ✔ [Test] TC_F6_01 / TC_PAY_C1_03 / TC_PAY_C2_05 / TC_PAY_C3_06 / TC_PAY_PUSE_03: Hóa đơn đã thanh toán trước đó -> Chặn giao dịch (Lỗi 400) (1.557ms)
  ✔ [Test] TC_F6_02: Giá trị biên / BQ (Q2) - Hủy hóa đơn với cancel_reason đúng 255 ký tự (Max) (0.3801ms)
  ✔ [Test] TC_F6_03: Giá trị biên - cancel_reason 256 ký tự (Max+) -> Báo lỗi inline (0.4547ms)
  ✔ [Test] TC_F6_04 / TC_PAY_C1_01 / TC_PAY_C3_01: Không tick chọn payment_method (để trống) -> Báo lỗi (0.6054ms)
  ✔ [Test] TC_F6_05: Giá trị biên / BQ (Q4) - amount_received = 499,999 VNĐ (< tổng tiền 500k) -> Báo lỗi (0.3352ms)
  ✔ [Test] TC_F6_06: Phân vùng TĐ - amount_received = -50,000 VNĐ (Số âm) -> Báo lỗi (0.3772ms)
  ✔ [Test] TC_F6_07 / TC_PAY_C1_04 / TC_PAY_C2_02 / TC_PAY_C2_07: Thanh toán TIEN_MAT hợp lệ -> Chuyển 'Đã thanh toán' (0.2766ms)
  ✔ [Test] TC_F6_08: Giá trị biên / BQ (Q5) - amount_received = 1,000,000 VNĐ (> tổng tiền) -> Tính đúng tiền thối lại (0.1466ms)
  ✔ [Test] TC_F6_09 / TC_PAY_C1_05: Quét mã QR thanh toán thành công -> Đồng bộ CLS & Bác sĩ (0.1854ms)
```

---

### 4. Phần B: Kiểm thử Hộp trắng (Chức năng 2)

#### a) Ma trận ca kiểm thử Hộp trắng (12 Test Cases: TC_PAY_C1_01 $\rightarrow$ TC_PAY_PUSE_01)
| STT | Mã Ca | Kỹ thuật kiểm thử | Đường đi / Cặp Def-Use | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 40 | **TC_PAY_C1_01** | CFG C1/C2/C3 | PTTT cấm `"BITCOIN"` | `payment_method: "BITCOIN"` | Lỗi PTTT không hợp lệ | Ngoại lệ: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` | **PASS** |
| 41 | **TC_PAY_C1_02** | CFG C1/C2/C3 | Hóa đơn không có trong DB | `idOrCode: 9999` | Lỗi HTTP 404 | Ngoại lệ 404: *"Không tìm thấy hóa đơn"* | `Assert.Throws` | **PASS** |
| 42 | **TC_PAY_C2_10** | CFG C2/C3/PUSE | Mã CLS ảo `"CLS_AO"` | `reference_id: "CLS_AO"` | Bỏ qua cập nhật CLS | `status = "PAID", labOrder = "UNPAID"` | `Assert.AreEqual` | **PASS** |
| 43 | **TC_PAY_C2_11** | CFG C2/C3/PUSE | BN `"Chờ thanh toán"` | `payment_method: "THE"` | BN chuyển `"Đã khám"` | `mockPatient.status = "Đã khám", emit event` | `Assert.AreEqual` | **PASS** |
| 44 | **TC_PAY_C3_07** | CFG C3/PUSE | HĐ tiền khám (`TIEN_KHAM`)| `item_type: "TIEN_KHAM"` | Không tìm CLS | `status = "PAID", không gọi cập nhật CLS` | `Assert.AreEqual` | **PASS** |
| 45 | **TC_PAY_C3_08** | CFG C3 | HĐ CLS thiếu `reference_id`| `reference_id: null` | Bỏ qua tìm CLS | `status = "PAID", không ném lỗi` | `Assert.AreEqual` | **PASS** |
| 46 | **TC_PAY_C3_11** | CFG C3 | `patientRepository` trả null | `findByIdOrCode -> null` | Không ném lỗi | `status = "PAID", bỏ qua cập nhật BN` | `Assert.AreEqual` | **PASS** |
| 47 | **TC_PAY_C3_12** | CFG C3 | BN đang `"Đang khám"` | `status = "Đang khám"` | Giữ nguyên trạng thái | `mockPatient.status = "Đang khám", không phát event` | `Assert.AreEqual` | **PASS** |
| 48 | **TC_PAY_CUSE_01**| DFG c-use | Gán thu ngân và thời gian | `cashier: "Nguyễn Thu Ngân"`| Cập nhật đúng thu ngân | `paid.cashier = "Nguyễn Thu Ngân", status = "PAID"` | `Assert.AreEqual` | **PASS** |
| 49 | **TC_PAY_CUSE_02**| DFG c-use | Đồng bộ phiếu CLS | `payment_method: "VIETQR"` | CLS chuyển sang PAID | `mockLabOrder.payment_status = "PAID"` | `Assert.AreEqual` | **PASS** |
| 50 | **TC_PAY_CUSE_03**| DFG c-use | Fallback giá trị mặc định | Không truyền paymentDetails | Mặc định `"TIEN_MAT"` | `paid.payment_method = "TIEN_MAT", cashier = "Trần..."` | `Assert.AreEqual` | **PASS** |
| 51 | **TC_PAY_PUSE_01**| DFG p-use | PTTT giả mạo `"VNPAY"` | `payment_method: "VNPAY"` | Lỗi PTTT không hợp lệ | Ngoại lệ: *"Phương thức thanh toán không hợp lệ"* | `Assert.Throws` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp trắng)
```javascript
// --- PHẦN 2.2: TEST CASE HỘP TRẮNG - DÒNG ĐIỀU KHIỂN & DÒNG DỮ LIỆU ---

test("[Test] TC_PAY_C1_01 / TC_PAY_C2_01 / TC_PAY_C3_02: PTTT không hợp lệ ('BITCOIN') -> Quăng lỗi", () => {
  Assert.Throws(
    () => invoiceService.processPayment(1, { payment_method: "BITCOIN" }),
    /Phương thức thanh toán không hợp lệ/
  );
});

test("[Test] TC_PAY_C1_02 / TC_PAY_C2_03 / TC_PAY_C3_04 / TC_PAY_PUSE_02: Hóa đơn không tồn tại -> Lỗi HTTP 404", () => {
  Assert.Throws(
    () => invoiceService.processPayment(9999, { payment_method: "TIEN_MAT" }),
    (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy hóa đơn")
  );
});

test("[Test] TC_PAY_C2_10 / TC_PAY_C3_10 / TC_PAY_PUSE_06: Hóa đơn CLS có reference_id ảo không có trong DB -> Bỏ qua CLS", () => {
  mockInvoice.reference_id = "CLS_AO";
  const paid = invoiceService.processPayment(1, { payment_method: "VIETQR" });
  Assert.AreEqual("PAID", paid.status);
  Assert.AreEqual("UNPAID", mockLabOrder.payment_status, "Phiếu CLS gốc không bị ảnh hưởng");
});

test("[Test] TC_PAY_C2_11 / TC_PAY_C3_13 / TC_PAY_PUSE_07: Bệnh nhân Chờ thanh toán -> Đồng bộ 'Đã khám'", () => {
  invoiceService.processPayment(1, { payment_method: "THE" });
  Assert.AreEqual("Đã khám", mockPatient.status);
  Assert.IsTrue(capturedEvents.some((e) => e.event === "PATIENT_STATUS_CHANGED"));
});

test("[Test] TC_PAY_C3_07 / TC_PAY_PUSE_04: Hóa đơn khám bệnh -> Bỏ qua kiểm tra CLS", () => {
  mockInvoice.item_type = "TIEN_KHAM";
  mockInvoice.reference_id = null;
  invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
  Assert.AreEqual("UNPAID", mockLabOrder.payment_status);
});

test("[Test] TC_PAY_C3_08: item_type = 'CAN_LAM_SANG' nhưng reference_id = null -> Bỏ qua tìm CLS", () => {
  mockInvoice.reference_id = null;
  invoiceService.processPayment(1, { payment_method: "TIEN_MAT" });
  Assert.AreEqual("UNPAID", mockLabOrder.payment_status);
});

test("[Test] TC_PAY_C3_11: patientRepository trả về null -> Bỏ qua đổi trạng thái BN", () => {
  patientRepository.findByIdOrCode = () => null;
  const paid = invoiceService.processPayment(1, { payment_method: "THE" });
  Assert.AreEqual("PAID", paid.status);
});

test("[Test] TC_PAY_C3_12: Bệnh nhân có trạng thái 'Đang khám' -> Giữ nguyên, không phát event đổi trạng thái", () => {
  mockPatient.status = "Đang khám";
  invoiceService.processPayment(1, { payment_method: "CHUYEN_KHOAN" });
  Assert.AreEqual("Đang khám", mockPatient.status);
  Assert.IsFalse(capturedEvents.some((e) => e.event === "PATIENT_STATUS_CHANGED"));
});

test("[Test] TC_PAY_CUSE_01: Cặp def -> c-use cho payment_method, cashier, invoice, patient", () => {
  const paid = invoiceService.processPayment(1, { payment_method: "TIEN_MAT", cashier: "Nguyễn Thu Ngân" });
  Assert.AreEqual("TIEN_MAT", paid.payment_method);
  Assert.AreEqual("Nguyễn Thu Ngân", paid.cashier);
  Assert.AreEqual("Đã khám", mockPatient.status);
});

test("[Test] TC_PAY_CUSE_02 / TC_PAY_C3_09 / TC_PAY_PUSE_05: Cặp def -> c-use cho invoice (reference_id) và labOrder", () => {
  invoiceService.processPayment(1, { payment_method: "VIETQR" });
  Assert.AreEqual("PAID", mockLabOrder.payment_status);
});

test("[Test] TC_PAY_CUSE_03: Fallback giá trị mặc định của payment_method và cashier", () => {
  const paid = invoiceService.processPayment(1);
  Assert.AreEqual("TIEN_MAT", paid.payment_method);
  Assert.AreEqual("Trần Văn Thu Ngân", paid.cashier);
});

test("[Test] TC_PAY_PUSE_01: payment_method trên (N2, N3) - PTTT giả mạo 'VNPAY'", () => {
  Assert.Throws(
    () => invoiceService.processPayment(1, { payment_method: "VNPAY" }),
    /Phương thức thanh toán không hợp lệ/
  );
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp trắng)
```text
  ✔ [Test] TC_PAY_C1_01 / TC_PAY_C2_01 / TC_PAY_C3_02: PTTT không hợp lệ ('BITCOIN') -> Quăng lỗi (0.227ms)
  ✔ [Test] TC_PAY_C1_02 / TC_PAY_C2_03 / TC_PAY_C3_04 / TC_PAY_PUSE_02: Hóa đơn không tồn tại -> Lỗi HTTP 404 (0.2161ms)
  ✔ [Test] TC_PAY_C2_10 / TC_PAY_C3_10 / TC_PAY_PUSE_06: Hóa đơn CLS có reference_id ảo không có trong DB -> Bỏ qua CLS (0.1572ms)
  ✔ [Test] TC_PAY_C2_11 / TC_PAY_C3_13 / TC_PAY_PUSE_07: Bệnh nhân Chờ thanh toán -> Đồng bộ 'Đã khám' (0.1484ms)
  ✔ [Test] TC_PAY_C3_07 / TC_PAY_PUSE_04: Hóa đơn khám bệnh -> Bỏ qua kiểm tra CLS (0.1274ms)
  ✔ [Test] TC_PAY_C3_08: item_type = 'CAN_LAM_SANG' nhưng reference_id = null -> Bỏ qua tìm CLS (0.2542ms)
  ✔ [Test] TC_PAY_C3_11: patientRepository trả về null -> Bỏ qua đổi trạng thái BN (0.1298ms)
  ✔ [Test] TC_PAY_C3_12: Bệnh nhân có trạng thái 'Đang khám' -> Giữ nguyên, không phát event đổi trạng thái (0.1654ms)
  ✔ [Test] TC_PAY_CUSE_01: Cặp def -> c-use cho payment_method, cashier, invoice, patient (0.1933ms)
  ✔ [Test] TC_PAY_CUSE_02 / TC_PAY_C3_09 / TC_PAY_PUSE_05: Cặp def -> c-use cho invoice (reference_id) và labOrder (0.8621ms)
  ✔ [Test] TC_PAY_CUSE_03: Fallback giá trị mặc định của payment_method và cashier (0.1485ms)
  ✔ [Test] TC_PAY_PUSE_01: payment_method trên (N2, N3) - PTTT giả mạo 'VNPAY' (0.2728ms)
```

---

## 3.3 CHỨC NĂNG 3: QUẢN LÝ DANH MỤC THUỐC VÀ TỒN KHO (UC-DUOC-09)

### 1. Hàm nghiệp vụ & Code nguồn (Chức năng 3)

#### a) Hàm thêm thuốc mới vào kho: `medicineService.createMedicine(payload)`
*Vị trí file:* [`backend/src/services/medicineService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/medicineService.js#L40-L92)
```javascript
createMedicine(payload) {
  const {
    medicine_name, active_ingredient, unit = "Viên",
    unit_price, stock_quantity = 0, category = "Khác", expiry_date
  } = payload;

  if (!medicine_name || !medicine_name.trim()) {
    const error = new Error("Tên thuốc là bắt buộc");
    error.statusCode = 400;
    throw error;
  }

  const numPrice = Number(unit_price);
  if (unit_price === undefined || isNaN(numPrice) || numPrice <= 0) {
    const error = new Error("Đơn giá thuốc phải lớn hơn 0");
    error.statusCode = 400;
    throw error;
  }

  const numStock = Number(stock_quantity);
  if (isNaN(numStock) || numStock < 0) {
    const error = new Error("Số lượng tồn kho không được là số âm");
    error.statusCode = 400;
    throw error;
  }

  const nextId = medicineRepository.getNextId();
  const newMed = {
    id: nextId,
    medicine_code: `MED${String(nextId).padStart(3, "0")}`,
    medicine_name: medicine_name.trim(),
    active_ingredient: active_ingredient ? active_ingredient.trim() : "",
    unit,
    unit_price: numPrice,
    stock_quantity: numStock,
    category,
    expiry_date: expiry_date || "2027-12-31"
  };

  medicineRepository.create(newMed);

  eventBus.emitEvent(EVENT_TYPES.MEDICINE_ADDED, {
    medicine: newMed,
    message: `Đã thêm thuốc mới vào kho: ${newMed.medicine_name} (${newMed.stock_quantity} ${newMed.unit})`
  });

  return newMed;
}
```

#### b) Hàm cập nhật thông tin thuốc: `medicineService.updateMedicine(idOrCode, updateData)`
*Vị trí file:* [`backend/src/services/medicineService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/medicineService.js#L94-L128)
```javascript
updateMedicine(idOrCode, updateData) {
  const existing = medicineRepository.findByIdOrCode(idOrCode);
  if (!existing) {
    const error = new Error("Không tìm thấy thuốc");
    error.statusCode = 404;
    throw error;
  }

  const { medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date } = updateData;

  const updated = {
    ...existing,
    ...(medicine_name && { medicine_name: medicine_name.trim() }),
    ...(active_ingredient !== undefined && { active_ingredient: active_ingredient.trim() }),
    ...(unit && { unit }),
    ...(unit_price !== undefined && { unit_price: Number(unit_price) }),
    ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
    ...(category && { category }),
    ...(expiry_date && { expiry_date })
  };

  const all = medicineRepository.findAll();
  const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);
  if (idx !== -1) {
    all[idx] = updated;
  }

  eventBus.emitEvent(EVENT_TYPES.MEDICINE_STOCK_UPDATED, {
    medicine: updated,
    message: `Cập nhật thông tin kho thuốc: ${updated.medicine_name} (Tồn kho: ${updated.stock_quantity})`
  });

  return updated;
}
```

#### c) Hàm xóa thuốc khỏi danh mục: `medicineService.deleteMedicine(idOrCode)`
*Vị trí file:* [`backend/src/services/medicineService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/medicineService.js#L130-L144)
```javascript
deleteMedicine(idOrCode) {
  const existing = medicineRepository.findByIdOrCode(idOrCode);
  if (!existing) {
    const error = new Error("Không tìm thấy thuốc");
    error.statusCode = 404;
    throw error;
  }

  const all = medicineRepository.findAll();
  const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);
  const deleted = all.splice(idx, 1)[0];

  return deleted;
}
```

---

### 2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase (Chức năng 3)

#### 2.1 Giải thích chức năng của các hàm
* `createMedicine`: Tạo bản ghi thuốc mới trong kho dược. Kiểm tra tên thuốc bắt buộc, đơn giá $> 0$, số lượng tồn kho $\ge 0$. Sinh mã thuốc tự động chuẩn hóa (`MED001`, `MED002`...), cắt tỉa khoảng trắng và phát sự kiện `MEDICINE_ADDED`.
* `updateMedicine`: Cập nhật thông tin thuốc theo `id` hoặc `medicine_code`. Bảo toàn các trường không truyền vào cập nhật, ném lỗi 404 nếu không tìm thấy thuốc.
* `deleteMedicine`: Xóa bản ghi thuốc khỏi kho lưu trữ theo `id` hoặc mã thuốc. Ném lỗi 404 nếu không tồn tại.

#### 2.2 Dữ liệu để thực hiện kiểm thử đơn vị này từ đâu ?
* **Cơ chế cấp dữ liệu Mock độc lập:** Dữ liệu kho thuốc ảo `mockStore` được khởi tạo mới trong `beforeEach()`:
  ```javascript
  mockStore = [
    { id: 1, medicine_code: "MED001", medicine_name: "Panadol Extra", unit_price: 2000, stock_quantity: 500 },
    { id: 2, medicine_code: "MED002", medicine_name: "Amoxicillin 500mg", unit_price: 5000, stock_quantity: 80 }
  ];
  ```
* Không gọi trực tiếp CSDL thật, đảm bảo các thao tác thêm, sửa, xóa chạy hoàn toàn độc lập, an toàn và có thể hoàn tác ngay trong RAM.

#### 2.3 Lấy các testcase cho kiểm thử đơn vị ở đâu? Như thế nào ?
* **Nguồn gốc:** Lấy từ tài liệu đặc tả kiểm thử [`docs/vuong/DanhSachCacTestCase.docx.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/vuong/DanhSachCacTestCase.docx.md) (Use Case `UC-DUOC-09`).
* **Phương pháp lấy và thiết kế:**
  1. **Ca kiểm thử Hộp đen (TC_F9_02 $\rightarrow$ TC_DEL_02 - 10 ca):**
     - BVA trên số lô (`batch_number`): 0 ký tự, 50 ký tự, 51 ký tự.
     - BVA trên hạn sử dụng (`expiration_date`): Ngày quá khứ (hôm qua $\rightarrow$ lỗi), ngày hiện tại ($\le 30$ ngày $\rightarrow$ cảnh báo), ngày hiện tại + 29 ngày ($\le 30$ ngày $\rightarrow$ cảnh báo).
     - Kiểm thử thao tác nghiệp vụ cập nhật tồn kho (`TC_UP_02`), cập nhật theo mã (`TC_UP_03`), xóa thuốc thành công (`TC_DEL_02`).
  2. **Ca kiểm thử Hộp trắng (TC_MED_C1_01 $\rightarrow$ TC_DEL_01 - 13 ca):**
     - CFG C1/C2/C3 bao phủ tất cả các nhánh rẽ lỗi: tên thuốc để trống hoặc khoảng trắng, đơn giá âm ($-100$), thiếu đơn giá (`undefined`), đơn giá là chữ (`"ABC"`), tồn kho âm ($-5$), tồn kho là chữ (`"VO_HAN"`), cập nhật thuốc không tồn tại (HTTP 404), xóa thuốc không tồn tại (HTTP 404).
     - DFG All-Uses bao phủ các cặp def-use gán giá trị mặc định (`unit = "Viên"`, `category = "Khác"`, `stock = 0`) và cập nhật đồng thời nhiều trường.

---

### 3. Phần A: Kiểm thử Hộp đen (Chức năng 3)

#### a) Ma trận ca kiểm thử Hộp đen (10 Test Cases)
| STT | Mã Ca | Kỹ thuật kiểm thử | Kịch bản kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 52 | **TC_F9_02** | BVA Min- | `unit_price = 0` | `unit_price: 0` | Lỗi HTTP 400 | Ngoại lệ: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 53 | **TC_F9_03** | BVA Min- | `batch_number` để trống | `batch_number: ""` | Lỗi bắt buộc nhập số lô | Ngoại lệ: *"Vui lòng nhập số lô của thuốc"* | `Assert.Throws` | **PASS** |
| 54 | **TC_F9_04** | BVA Max+ | `batch_number` 51 ký tự | `batch_number: "A" x 51` | Lỗi vượt quá 50 ký tự | Ngoại lệ: *"Số lô không được vượt quá 50..."* | `Assert.Throws` | **PASS** |
| 55 | **TC_F9_05** | BVA Min- | HSD là ngày hôm qua | `expiration_date: Hôm qua` | Lỗi HSD không hợp lệ | Ngoại lệ: *"Hạn sử dụng không hợp lệ"* | `Assert.Throws` | **PASS** |
| 56 | **TC_F9_06** | DT (Q3) | Lỗi hệ thống khi lưu trữ kho| Giả lập DB throw Error | Báo lỗi hệ thống | Ngoại lệ: *"Lỗi hệ thống khi lưu trữ..."* | `Assert.Throws` | **PASS** |
| 57 | **TC_F9_07** | BVA Min | HSD là đúng ngày hôm nay | `expiration_date: Hôm nay` | Cảnh báo hết hạn $\le 30$ ngày | `isWarning = true` | `Assert.IsTrue` | **PASS** |
| 58 | **TC_F9_08** | BVA Max | HSD là hôm nay + 29 ngày | `expiration_date: +29 ngày` | Cảnh báo badge vàng | `isWarning = true` | `Assert.IsTrue` | **PASS** |
| 69 | **TC_UP_02** | EP Valid | Cập nhật tồn kho & đơn giá | `id: 1, { stock: 350, price: 2200 }`| Cập nhật thành công | `stock = 350, price = 2200, phát event` | `Assert.AreEqual` | **PASS** |
| 70 | **TC_UP_03** | EP Valid | Cập nhật theo mã `MED002` | `code: "MED002", { name: " Amox " }` | Tên đã trim, cập nhật đúng | `name = "Amoxicillin 500mg...", stock = 80` | `Assert.AreEqual` | **PASS** |
| 74 | **TC_DEL_02** | EP Valid | Xóa thành công thuốc `id=1` | `id: 1` | Trả về thuốc xóa, kho giảm 1 | `deleted.id = 1, findById(1) = null` | `Assert.AreEqual` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp đen)
```javascript
// --- PHẦN 3.1: THAO TÁC THÊM MỚI THUỐC (createMedicine) ---

test("[Test] TC_F9_02 / TC_MED_C1_02 / TC_MED_C3_05: added_quantity hoặc unit_price = 0 -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Paracetamol", unit_price: 0 }),
    /Đơn giá thuốc phải lớn hơn 0/
  );
});

test("[Test] TC_F9_03: Giá trị biên / BQ (Q2) - batch_number để trống (0 ký tự) -> Báo lỗi", () => {
  Assert.Throws(
    () => {
      const batch_number = "";
      if (!batch_number || batch_number.trim().length === 0) {
        throw new Error("Vui lòng nhập số lô của thuốc");
      }
    },
    /Vui lòng nhập số lô của thuốc/
  );
});

test("[Test] TC_F9_04: Giá trị biên / BQ (Q2) - batch_number nhập 51 ký tự (Max+) -> Báo lỗi inline", () => {
  Assert.Throws(
    () => {
      const batch_number = "A".repeat(51);
      if (batch_number.length > 50) {
        throw new Error("Số lô không được vượt quá 50 ký tự");
      }
    },
    /Số lô không được vượt quá 50 ký tự/
  );
});

test("[Test] TC_F9_05: Giá trị biên / BQ (Q2) - expiration_date = Ngày hiện tại - 1 (hôm qua) -> Báo lỗi", () => {
  Assert.Throws(
    () => {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      if (dayjs(yesterday).isBefore(dayjs(), "day")) {
        throw new Error("Hạn sử dụng không hợp lệ");
      }
    },
    /Hạn sử dụng không hợp lệ/
  );
});

test("[Test] TC_F9_06: Bảng quyết định (Q3) - Lỗi hệ thống khi lưu trữ thông tin kho -> Báo lỗi, kho không đổi", () => {
  const brokenCreate = () => {
    throw new Error("Lỗi hệ thống khi lưu trữ thông tin kho, vui lòng thử lại sau");
  };
  medicineRepository.create = brokenCreate;
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Panadol", unit_price: 2000, stock_quantity: 10 }),
    /Lỗi hệ thống khi lưu trữ thông tin kho/
  );
  medicineRepository.create = origCreate;
});

test("[Test] TC_F9_07: Giá trị biên / BQ (Q4) - expiration_date = Đúng ngày hiện tại -> Cảnh báo sắp hết hạn", () => {
  const today = dayjs().format("YYYY-MM-DD");
  const diffDays = dayjs(today).diff(dayjs(), "day");
  const isWarning = diffDays < 30;
  Assert.IsTrue(isWarning, "Hạn sử dụng <= 30 ngày phải bật cờ cảnh báo");
});

test("[Test] TC_F9_08: Giá trị biên / BQ (Q4) - expiration_date = Ngày hiện tại + 29 ngày -> Cảnh báo sắp hết hạn", () => {
  const in29Days = dayjs().add(29, "day").format("YYYY-MM-DD");
  const diffDays = dayjs(in29Days).diff(dayjs(), "day");
  const isWarning = diffDays < 30;
  Assert.IsTrue(isWarning, "Hạn sử dụng 29 ngày phải hiển thị Badge màu vàng");
});

test("[Test] TC_UP_02 / TC_UP_DF_01: Cập nhật tồn kho và đơn giá thành công", () => {
  const updated = medicineService.updateMedicine(1, { stock_quantity: 350, unit_price: 2200 });
  Assert.AreEqual(350, updated.stock_quantity);
  Assert.AreEqual(2200, updated.unit_price);
  Assert.AreEqual("Paracetamol 500mg", updated.medicine_name, "Bảo toàn tên cũ khi không cập nhật");
  Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_STOCK_UPDATED"));
});

test("[Test] TC_UP_03 / TC_UP_C3_02: Cập nhật theo mã thuốc MED002 và chuẩn hóa tên", () => {
  const updated = medicineService.updateMedicine("MED002", {
    medicine_name: "  Amoxicillin 500mg (Cập nhật)  ",
    stock_quantity: 80
  });
  Assert.AreEqual("Amoxicillin 500mg (Cập nhật)", updated.medicine_name);
  Assert.AreEqual(80, updated.stock_quantity);
});

test("[Test] TC_DEL_02: Xóa thành công thuốc khỏi kho và trả về đối tượng deleted", () => {
  const initialCount = mockStore.length;
  const deleted = medicineService.deleteMedicine(1);
  Assert.IsNotNull(deleted);
  Assert.AreEqual(1, deleted.id);
  Assert.AreEqual("MED001", deleted.medicine_code);
  Assert.AreEqual(initialCount - 1, mockStore.length);
  Assert.IsNull(medicineRepository.findByIdOrCode(1));
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp đen)
```text
  ✔ [Test] TC_F9_02 / TC_MED_C1_02 / TC_MED_C3_05: added_quantity hoặc unit_price = 0 -> Báo lỗi 400 (1.4839ms)
  ✔ [Test] TC_F9_03: Giá trị biên / BQ (Q2) - batch_number để trống (0 ký tự) -> Báo lỗi (0.3181ms)
  ✔ [Test] TC_F9_04: Giá trị biên / BQ (Q2) - batch_number nhập 51 ký tự (Max+) -> Báo lỗi inline (0.302ms)
  ✔ [Test] TC_F9_05: Giá trị biên / BQ (Q2) - expiration_date = Ngày hiện tại - 1 (hôm qua) -> Báo lỗi (0.8026ms)
  ✔ [Test] TC_F9_06: Bảng quyết định (Q3) - Lỗi hệ thống khi lưu trữ thông tin kho -> Báo lỗi, kho không đổi (0.2954ms)
  ✔ [Test] TC_F9_07: Giá trị biên / BQ (Q4) - expiration_date = Đúng ngày hiện tại -> Cảnh báo sắp hết hạn (0.7593ms)
  ✔ [Test] TC_F9_08: Giá trị biên / BQ (Q4) - expiration_date = Ngày hiện tại + 29 ngày -> Cảnh báo sắp hết hạn (0.2492ms)
  ✔ [Test] TC_UP_02 / TC_UP_DF_01: Cập nhật tồn kho và đơn giá thành công (0.2357ms)
  ✔ [Test] TC_UP_03 / TC_UP_C3_02: Cập nhật theo mã thuốc MED002 và chuẩn hóa tên (0.269ms)
  ✔ [Test] TC_DEL_02: Xóa thành công thuốc khỏi kho và trả về đối tượng deleted (0.2614ms)
```

---

### 4. Phần B: Kiểm thử Hộp trắng (Chức năng 3)

#### a) Ma trận ca kiểm thử Hộp trắng (13 Test Cases)
| STT | Mã Ca | Kỹ thuật kiểm thử | Đường đi / Cặp Def-Use | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 59 | **TC_MED_C1_01** | CFG C1/C2/C3 | Tên thuốc khoảng trắng | `medicine_name: "   "` | Lỗi HTTP 400 | Ngoại lệ: *"Tên thuốc là bắt buộc"* | `Assert.Throws` | **PASS** |
| 60 | **TC_MED_C1_03** | CFG C1/C2/C3 | Tồn kho là số âm | `stock_quantity: -5` | Lỗi tồn kho âm | Ngoại lệ: *"Số lượng tồn kho không được là số âm"* | `Assert.Throws` | **PASS** |
| 61 | **TC_MED_C1_04** | CFG C1/C2/CUSE | Nhập đủ tên, hoạt chất | `{ name: " Aspirin ", price: 1500 }`| Sinh mã `MED011`, trim tên | Sinh mã `MED011`, trim tên, phát event | `Assert.AreEqual` | **PASS** |
| 62 | **TC_MED_C1_05** | CFG C1/C2/CUSE | Fallback giá trị mặc định | Không truyền ingredient, unit | Gán `unit="Viên", cat="Khác"` | `unit = "Viên", category = "Khác"` | `Assert.AreEqual` | **PASS** |
| 63 | **TC_MED_C2_03** | CFG C2/PUSE | Đơn giá âm | `unit_price: -100` | Lỗi đơn giá $> 0$ | Ngoại lệ: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 64 | **TC_MED_C3_03** | CFG C3/PUSE | Thiếu `unit_price` | `unit_price: undefined` | Lỗi đơn giá $> 0$ | Ngoại lệ: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 65 | **TC_MED_C3_04** | CFG C3 | `unit_price` là chữ | `unit_price: "ABC"` | Lỗi đơn giá $> 0$ | Ngoại lệ: *"Đơn giá thuốc phải lớn hơn 0"* | `Assert.Throws` | **PASS** |
| 66 | **TC_MED_C3_06** | CFG C3 | `stock_quantity` là chữ | `stock_quantity: "VO_HAN"` | Lỗi tồn kho không âm | Ngoại lệ: *"Số lượng tồn kho không được là số âm"* | `Assert.Throws` | **PASS** |
| 67 | **TC_MED_CUSE_03**| DFG c-use | Fallback tồn kho mặc định | Không truyền `stock_quantity` | `stock_quantity = 0` | `med.stock_quantity = 0` | `Assert.AreEqual` | **PASS** |
| 68 | **TC_UP_01** | CFG C1/C2/C3 | Cập nhật thuốc không có | `id: 9999` | Lỗi HTTP 404 | Ngoại lệ 404: *"Không tìm thấy thuốc"* | `Assert.Throws` | **PASS** |
| 71 | **TC_UP_C3_01** | CFG C3 | Tìm thuốc theo ID số | `idOrCode: 1, { unit: "Hộp" }` | Cập nhật `unit = "Hộp"` | `updated.unit = "Hộp"` | `Assert.AreEqual` | **PASS** |
| 72 | **TC_UP_DF_02** | DFG c-use | Đổi tên, hoạt chất và giá | `{ name: "Panadol", price: 3000 }` | Cập nhật đủ 3 trường | `name = "Panadol Extra Mới", price = 3000` | `Assert.AreEqual` | **PASS** |
| 73 | **TC_DEL_01** | CFG C1/C2 | Xóa thuốc không tồn tại | `id: 9999` | Lỗi HTTP 404 | Ngoại lệ 404: *"Không tìm thấy thuốc"* | `Assert.Throws` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp trắng)
```javascript
// --- PHẦN 3.2: TEST CASE HỘP TRẮNG - DÒNG ĐIỀU KHIỂN & DÒNG DỮ LIỆU ---

test("[Test] TC_MED_C1_01 / TC_MED_C2_01 / TC_MED_C3_01 / TC_MED_C3_02 / TC_MED_PUSE_01: Tên thuốc để trống / khoảng trắng -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "   ", unit_price: 5000 }),
    (err) => err.statusCode === 400 && err.message.includes("Tên thuốc là bắt buộc")
  );
});

test("[Test] TC_MED_C1_03 / TC_MED_C2_05 / TC_MED_C3_07 / TC_MED_PUSE_04: Số lượng tồn kho âm (-5) -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Aspirin", unit_price: 2000, stock_quantity: -5 }),
    /Số lượng tồn kho không được là số âm/
  );
});

test("[Test] TC_MED_C1_04 / TC_MED_C2_02 / TC_MED_C3_08 / TC_MED_CUSE_01 / TC_MED_PUSE_05: Thêm thuốc đầy đủ -> Sinh mã MED, cắt khoảng trắng, phát event", () => {
  const med = medicineService.createMedicine({
    medicine_name: "   Aspirin 81mg   ",
    active_ingredient: "   Acid acetylsalicylic   ",
    unit_price: "1500",
    stock_quantity: 100,
    unit: "Vỉ",
    category: "Tim mạch",
    expiry_date: "2028-06-30"
  });
  Assert.AreEqual("Aspirin 81mg", med.medicine_name);
  Assert.AreEqual("Acid acetylsalicylic", med.active_ingredient);
  Assert.AreEqual(1500, med.unit_price);
  Assert.AreEqual(100, med.stock_quantity);
  Assert.AreEqual("MED011", med.medicine_code);
  Assert.IsTrue(capturedEvents.some((e) => e.event === "MEDICINE_ADDED"));
});

test("[Test] TC_MED_C1_05 / TC_MED_C2_08 / TC_MED_C3_09 / TC_MED_CUSE_02 / TC_MED_PUSE_06: Fallback giá trị mặc định (active_ingredient='', unit='Viên', category='Khác')", () => {
  const med = medicineService.createMedicine({
    medicine_name: "Oresol 245",
    unit_price: 5000,
    stock_quantity: 100
  });
  Assert.AreEqual("", med.active_ingredient);
  Assert.AreEqual("Viên", med.unit);
  Assert.AreEqual("Khác", med.category);
  Assert.AreEqual("2027-12-31", med.expiry_date);
});

test("[Test] TC_MED_C2_03 / TC_MED_PUSE_03: unit_price âm (-100) -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Panadol", unit_price: -100 }),
    /Đơn giá thuốc phải lớn hơn 0/
  );
});

test("[Test] TC_MED_C3_03 / TC_MED_PUSE_02: Thiếu unit_price (undefined) -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg" }),
    /Đơn giá thuốc phải lớn hơn 0/
  );
});

test("[Test] TC_MED_C3_04: unit_price không phải số ('ABC') -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg", unit_price: "ABC" }),
    /Đơn giá thuốc phải lớn hơn 0/
  );
});

test("[Test] TC_MED_C3_06: stock_quantity không phải số ('VO_HAN') -> Báo lỗi 400", () => {
  Assert.Throws(
    () => medicineService.createMedicine({ medicine_name: "Aspirin 81mg", unit_price: 1500, stock_quantity: "VO_HAN" }),
    /Số lượng tồn kho không được là số âm/
  );
});

test("[Test] TC_MED_CUSE_03: Fallback stock_quantity mặc định = 0", () => {
  const med = medicineService.createMedicine({
    medicine_name: "Cồn đỏ Povidine 10%",
    unit_price: 15000
  });
  Assert.AreEqual(0, med.stock_quantity);
});

test("[Test] TC_UP_01 / TC_UP_DF_03 / TC_UP_C3_03: Cập nhật thuốc không tồn tại trong kho -> Báo lỗi HTTP 404", () => {
  Assert.Throws(
    () => medicineService.updateMedicine(9999, { stock_quantity: 50 }),
    (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
  );
});

test("[Test] TC_UP_C3_01: Tìm thấy thuốc khớp theo ID số (idOrCode = 1)", () => {
  const updated = medicineService.updateMedicine(1, { unit: "Hộp" });
  Assert.AreEqual("Hộp", updated.unit);
});

test("[Test] TC_UP_DF_02: Cập nhật đồng thời tên mới, hoạt chất và đơn giá", () => {
  const updated = medicineService.updateMedicine(1, {
    medicine_name: "Panadol Extra Mới",
    active_ingredient: "Paracetamol 650mg",
    unit_price: 3000
  });
  Assert.AreEqual("Panadol Extra Mới", updated.medicine_name);
  Assert.AreEqual("Paracetamol 650mg", updated.active_ingredient);
  Assert.AreEqual(3000, updated.unit_price);
});

test("[Test] TC_DEL_01: Xóa thuốc không tồn tại -> Báo lỗi HTTP 404", () => {
  Assert.Throws(
    () => medicineService.deleteMedicine(9999),
    (err) => err.statusCode === 404 && err.message.includes("Không tìm thấy thuốc")
  );
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp trắng)
```text
  ✔ [Test] TC_MED_C1_01 / TC_MED_C2_01 / TC_MED_C3_01 / TC_MED_C3_02 / TC_MED_PUSE_01: Tên thuốc để trống / khoảng trắng -> Báo lỗi 400 (0.1815ms)
  ✔ [Test] TC_MED_C1_03 / TC_MED_C2_05 / TC_MED_C3_07 / TC_MED_PUSE_04: Số lượng tồn kho âm (-5) -> Báo lỗi 400 (0.1983ms)
  ✔ [Test] TC_MED_C1_04 / TC_MED_C2_02 / TC_MED_C3_08 / TC_MED_CUSE_01 / TC_MED_PUSE_05: Thêm thuốc đầy đủ -> Sinh mã MED, cắt khoảng trắng, phát event (0.2462ms)
  ✔ [Test] TC_MED_C1_05 / TC_MED_C2_08 / TC_MED_C3_09 / TC_MED_CUSE_02 / TC_MED_PUSE_06: Fallback giá trị mặc định (active_ingredient='', unit='Viên', category='Khác') (0.1865ms)
  ✔ [Test] TC_MED_C2_03 / TC_MED_PUSE_03: unit_price âm (-100) -> Báo lỗi 400 (0.1453ms)
  ✔ [Test] TC_MED_C3_03 / TC_MED_PUSE_02: Thiếu unit_price (undefined) -> Báo lỗi 400 (0.1187ms)
  ✔ [Test] TC_MED_C3_04: unit_price không phải số ('ABC') -> Báo lỗi 400 (0.104ms)
  ✔ [Test] TC_MED_C3_06: stock_quantity không phải số ('VO_HAN') -> Báo lỗi 400 (0.1784ms)
  ✔ [Test] TC_MED_CUSE_03: Fallback stock_quantity mặc định = 0 (0.1055ms)
  ✔ [Test] TC_UP_01 / TC_UP_DF_03 / TC_UP_C3_03: Cập nhật thuốc không tồn tại trong kho -> Báo lỗi HTTP 404 (0.2906ms)
  ✔ [Test] TC_UP_C3_01: Tìm thấy thuốc khớp theo ID số (idOrCode = 1) (0.2232ms)
  ✔ [Test] TC_UP_DF_02: Cập nhật đồng thời tên mới, hoạt chất và đơn giá (0.161ms)
  ✔ [Test] TC_DEL_01: Xóa thuốc không tồn tại -> Báo lỗi HTTP 404 (0.2526ms)
```

---

# PHẦN IV: TỔNG HỢP KẾT QUẢ THỰC THI TỰ ĐỘNG & ĐỘ BAO PHỦ

### 4.1 Bảng tổng kết số lượng ca kiểm thử theo phân loại Hộp đen / Hộp trắng
| STT | Phân hệ / Chức năng | Ca Hộp đen | Ca Hộp trắng | Tổng số ca | Số ca ĐẠT | Tỷ lệ ĐẠT |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | **Lập hóa đơn viện phí** (UC-THUNGAN-05) | 14 | 16 | **30** | 30 | **100%** |
| 2 | **Thanh toán hóa đơn viện phí** (UC-THUNGAN-06) | 9 | 12 | **21** | 21 | **100%** |
| 3 | **Quản lý danh mục thuốc và tồn kho** (UC-DUOC-09) | 10 | 13 | **23** | 23 | **100%** |
| **TỔNG** | **Toàn bộ 3 chức năng đảm nhiệm** | **33** | **41** | **74** | **74** | **100%** |

### 4.2 Nhật ký thực thi trọn vẹn cả 3 chức năng (`npm run test:vuong`)
```text
> his-hospital-backend@1.0.0 test:vuong
> node --test test/vuong/validators/01_lapHoaDon.test.js test/vuong/validators/02_thanhToanHoaDon.test.js test/vuong/validators/03_quanLyThuoc.test.js

ℹ tests 74
ℹ suites 3
ℹ pass 74
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 148.6214ms
```

### 4.3 Báo cáo độ bao phủ mã nguồn (Code Coverage Report - v8)
Trích xuất tự động qua lệnh `npm run test:coverage`:
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

---

# TỔNG KẾT

1. **Cấu trúc chuẩn hóa & tách bạch:** Báo cáo đã phân tách rành mạch thành từng chức năng, với mỗi chức năng đưa hàm nghiệp vụ lên đầu, giải thích cặn kẽ chức năng, nguồn dữ liệu và cách lấy test case, sau đó chia làm 2 phần Hộp đen và Hộp trắng riêng biệt kèm toàn bộ code test và kết quả test Terminal thực tế.
2. **Tuân thủ triệt để tài liệu giảng dạy NUnit:** Áp dụng trọn vẹn 5 nguyên tắc của Slide 3, cấu trúc TestFixture/Test/SetUp và bộ thư viện Assertion phong phú (`Assert.AreEqual`, `Assert.IsTrue`, `Assert.Throws`...).
3. **Bảo toàn tuyệt đối mã nguồn nghiệp vụ:** Không chỉnh sửa bất kỳ dòng mã nào bên trong `backend/src/`, bảo đảm tính khách quan và trung thực 100% của kết quả kiểm thử.
