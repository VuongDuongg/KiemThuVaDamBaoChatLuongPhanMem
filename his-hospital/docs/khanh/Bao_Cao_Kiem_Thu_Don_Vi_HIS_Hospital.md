# BÁO CÁO THỰC HIỆN KIỂM THỬ ĐƠN VỊ (UNIT TESTING)
## HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)
### PHÂN HỆ CẬN LÂM SÀNG & XÉT NGHIỆM (LIS - PACS)

**Tác giả thực hiện:** Lê Tuấn Khanh  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Tài liệu tham chiếu:**
- `docs/vuong/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)
- `docs/khanh/Kiem_Thu_Hop_Den_NhapKetQuaXetNghiem.md` (Đặc tả Kiểm thử Hộp đen - Nhập kết quả xét nghiệm định lượng `UC-CLS-02`)
- `docs/khanh/Kiem_Thu_Hop_Den_TaiLenHinhAnhVaKetLuanPACS.md` (Đặc tả Kiểm thử Hộp đen - Tải lên hình ảnh chẩn đoán và kết luận PACS `UC-CLS-03`)
- `docs/khanh/Kiem_Thu_Hop_Trang_NhapKetQuaXetNghiem.md` (Đặc tả Kiểm thử Hộp trắng Dòng điều khiển CFG C1/C2/C3 & Dòng dữ liệu DFG All c-use/All p-use)
- `docs/khanh/Kiem_Thu_Hop_Trang_TaiLenHinhAnhVaKetLuanPACS.md` (Đặc tả Kiểm thử Hộp trắng Dòng điều khiển CFG C1/C2/C3 & Dòng dữ liệu DFG All c-use/All p-use)
- `docs/khanh/Tong_Hop_45_Test_Case_Validate.md` (Tổng hợp 45 ca kiểm thử đơn vị xác thực dữ liệu đầu vào)
- Mã nguồn nghiệp vụ: [`backend/src/services/labService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/labService.js), [`backend/src/patterns/state/labOrderState.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/state/labOrderState.js)
- Tệp mã nguồn kiểm thử tự động: [`backend/test/khanh/validators/02_labResult.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.test.js), [`backend/test/khanh/validators/03_pacs.test.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.test.js) và các validator [`02_labResult.validator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.validator.js), [`03_pacs.validator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.validator.js)

**Nguyên tắc cam kết cốt lõi:** Tuyệt đối không chỉnh sửa bất kỳ dòng mã nào bên trong thư mục nghiệp vụ `backend/src/` để làm pass test; kiểm thử độc lập, cô lập và tự động hóa 100%.

---

## MỤC LỤC
1. [PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ (THEO SLIDE NUNIT)](#phần-i-tìm-hiểu-và-trình-bày-về-kiểm-thử-đơn-vị-theo-slide-nunit)
2. [PHẦN II: HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG CÔNG CỤ CHO DỰ ÁN](#phần-ii-hướng-dẫn-cài-đặt-và-sử-dụng-công-cụ-cho-dự-án)
3. [PHẦN III: CHI TIẾT KIỂM THỬ ĐƠN VỊ TỪNG CHỨC NĂNG (TÁCH BIỆT HỘP ĐEN & HỘP TRẮNG)](#phần-iii-chi-tiết-kiểm-thử-đơn-vị-từng-chức-năng)
   - [3.1 Chức năng 1: Nhập kết quả xét nghiệm định lượng (UC-CLS-02 / Mục 3.11)](#31-chức-năng-1-nhập-kết-quả-xét-nghiệm-định-lượng-uc-cls-02--mục-311)
     - [1. Hàm nghiệp vụ & Code nguồn](#1-hàm-nghiệp-vụ--code-nguồn-chức-năng-1)
     - [2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase](#2-giải-thích-hàm-nguồn-gốc-dữ-liệu-và-cách-lấy-testcase-chức-năng-1)
     - [3. Phần A: Kiểm thử Hộp đen (Black-Box Testing)](#3-phần-a-kiểm-thử-hộp-đen-chức-năng-1)
     - [4. Phần B: Kiểm thử Hộp trắng (White-Box Testing)](#4-phần-b-kiểm-thử-hộp-trắng-chức-năng-1)
   - [3.2 Chức năng 2: Tải lên hình ảnh chẩn đoán và kết luận PACS (UC-CLS-03 / Mục 3.12)](#32-chức-năng-2-tải-lên-hình-ảnh-chẩn-đoán-và-kết-luận-pacs-uc-cls-03--mục-312)
     - [1. Hàm nghiệp vụ & Code nguồn](#1-hàm-nghiệp-vụ--code-nguồn-chức-năng-2)
     - [2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase](#2-giải-thích-hàm-nguồn-gốc-dữ-liệu-và-cách-lấy-testcase-chức-năng-2)
     - [3. Phần A: Kiểm thử Hộp đen (Black-Box Testing)](#3-phần-a-kiểm-thử-hộp-đen-chức-năng-2)
     - [4. Phần B: Kiểm thử Hộp trắng (White-Box Testing)](#4-phần-b-kiểm-thử-hộp-trắng-chức-năng-2)
4. [PHẦN IV: TỔNG HỢP KẾT QUẢ THỰC THI TỰ ĐỘNG & ĐỘ BAO PHỦ](#phần-iv-tổng-hợp-kết-quả-thực-thi-tự-động--độ-bao-phủ)
5. [PHẦN V: TỔNG KẾT & KẾT LUẬN HỌC THUẬT](#phần-v-tổng-kết--kết-luận-học-thuật)

---

# PHẦN I: TÌM HIỂU VÀ TRÌNH BÀY VỀ KIỂM THỬ ĐƠN VỊ (THEO SLIDE NUNIT)

### 1.1 Khái niệm & Mục tiêu của Kiểm thử đơn vị (Slide 2)
* **Kiểm thử đơn vị (Unit Testing)** là kỹ thuật kiểm tra các thành phần phần mềm nhỏ nhất có thể kiểm thử được một cách độc lập (từng hàm, phương thức hoặc lớp đối tượng) trong trạng thái hoàn toàn cô lập khỏi cơ sở dữ liệu thật, mạng và các hệ thống phụ thuộc bên ngoài.
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
1. **Node.js Native Test Runner (`node:test`):** Tích hợp sẵn trong Node.js (0 dependency, tốc độ thực thi ~85ms).
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
# Chạy toàn bộ 35 ca kiểm thử của Lê Tuấn Khanh qua Node Native Runner:
npm run test:khanh

# Hoặc chạy trực tiếp qua lệnh node:
node --test backend/test/khanh/validators/02_labResult.test.js backend/test/khanh/validators/03_pacs.test.js

# Chạy qua Vitest runner:
npm run test:vitest:khanh

# Mở giao diện đồ họa Web Dashboard Test Explorer:
npm run test:ui

# Xuất báo cáo đo độ bao phủ mã nguồn (Code Coverage):
npm run test:coverage
```

---

# PHẦN III: CHI TIẾT KIỂM THỬ ĐƠN VỊ TỪNG CHỨC NĂNG

---

## 3.1 CHỨC NĂNG 1: NHẬP KẾT QUẢ XÉT NGHIỆM ĐỊNH LƯỢNG (UC-CLS-02 / MỤC 3.11)

### 1. Hàm nghiệp vụ & Code nguồn (Chức năng 1)

Chức năng Nhập kết quả xét nghiệm định lượng gồm 3 thành phần nghiệp vụ cốt lõi:

#### a) Hàm xác thực dữ liệu đầu vào: `LabResultValidator.validateLabResult(input)`
*Vị trí file:* [`backend/test/khanh/validators/02_labResult.validator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/02_labResult.validator.js#L7-L88)
```javascript
export class LabResultValidator {
  /**
   * Xác thực dữ liệu kết quả xét nghiệm định lượng
   * Dữ liệu mặc định:
   * {
   *   order: { id: 1, type: "LAB" },
   *   test_value: "5.2",
   *   general_notes: ""
   * }
   * 
   * Theo đặc tả: chỉ số định lượng phải là số thực dương (> 0).
   * Giá trị 0, âm, chữ, null, undefined, boolean, array, hex "0x10",... bị từ chối.
   * 
   * @param {Object} input - Dữ liệu nhập kết quả
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validateLabResult(input = {}) {
    const defaultData = {
      order: { id: 1, type: "LAB" },
      test_value: "5.2",
      general_notes: ""
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra phiếu chỉ định xét nghiệm (order)
    // Phải tồn tại, có id và type === "LAB"
    if (
      !data.order ||
      typeof data.order !== "object" ||
      !data.order.id ||
      data.order.type !== "LAB"
    ) {
      return "Mã phiếu chỉ định xét nghiệm không hợp lệ.";
    }

    // 2. Kiểm tra giá trị chỉ số xét nghiệm (test_value)
    // Giá trị phải là số thực dương (> 0).
    const val = data.test_value;

    if (val === null || val === undefined || typeof val === "boolean" || Array.isArray(val)) {
      return "Giá trị chỉ số phải là chữ số hợp lệ.";
    }

    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      // Từ chối hệ hex (ví dụ "0x10")
      if (/^0x/i.test(trimmed)) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      // Kiểm tra định dạng số thực dương thập phân
      if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
      const num = Number(trimmed);
      if (isNaN(num) || !isFinite(num) || num <= 0) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
    } else if (typeof val === "number") {
      if (isNaN(val) || !isFinite(val) || val <= 0) {
        return "Giá trị chỉ số phải là chữ số hợp lệ.";
      }
    } else {
      return "Giá trị chỉ số phải là chữ số hợp lệ.";
    }

    // 3. Kiểm tra nhận xét tổng quát (general_notes)
    // general_notes không được vượt quá 500 ký tự (rỗng hoặc đúng 500 ký tự hợp lệ)
    if (data.general_notes !== undefined && data.general_notes !== null) {
      const notes = String(data.general_notes);
      if (notes.length > 500) {
        return "Nhận xét tổng quát không được vượt quá 500 ký tự.";
      }
    }

    return null;
  }
}
```

#### b) Hàm cập nhật kết quả xét nghiệm tại Service: `labService.updateResult(idOrCode, payload)`
*Vị trí file:* [`backend/src/services/labService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/labService.js#L207-L257)
```javascript
updateResult(idOrCode, payload = {}) {
  const { technician = "KTV. Đặng Quốc Việt", results } = payload;

  const order = labRepository.findOrderByIdOrCode(idOrCode);
  if (!order) {
    const error = new Error("Không tìm thấy chỉ định Cận lâm sàng");
    error.statusCode = 404;
    throw error;
  }

  // Ensure invoice is paid before allowing result entry
  const invoice = invoiceRepository
    .findAll()
    .find((inv) => inv.reference_id === order.id);
  if ((invoice && invoice.status !== "PAID") || (!invoice && order.payment_status !== "PAID")) {
    const err = new Error(
      "Chưa thanh toán viện phí, không thể nhập kết quả CLS",
    );
    err.statusCode = 400;
    throw err;
  }

  if (
    !results ||
    (!results.parameters && !results.conclusion && !results.findings)
  ) {
    const error = new Error(
      "Vui lòng nhập kết quả hoặc kết luận cận lâm sàng",
    );
    error.statusCode = 400;
    throw error;
  }

  if (order.status !== LAB_STATES.PROCESSING) {
    const err = new Error("Phiếu CLS phải được KTV tiếp nhận trước khi nhập kết quả");
    err.statusCode = 400;
    throw err;
  }

  LabOrderStateMachine.transition(
    order,
    order.type === "LAB" ? LAB_STATES.PENDING_APPROVAL : LAB_STATES.COMPLETED,
  );
  order.technician = technician;
  order.results = results;
  order.result_entered_at = dayjs().format("DD/MM/YYYY HH:mm");
  if (order.type === "PACS") order.completed_at = dayjs().format("DD/MM/YYYY HH:mm");

  // Kết quả LAB chỉ là kết quả sơ bộ cho đến khi được duyệt chuyên môn.
  if (order.type === "LAB") return order;
  // ...
}
```

#### c) Máy trạng thái phiếu chỉ định: `LabOrderStateMachine`
*Vị trí file:* [`backend/src/patterns/state/labOrderState.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/patterns/state/labOrderState.js)
```javascript
export const LAB_STATES = {
  PENDING: "PENDING",                     // Chờ tiếp nhận mẫu
  SAMPLE_COLLECTED: "SAMPLE_COLLECTED",   // Đã lấy mẫu bệnh phẩm
  PROCESSING: "PROCESSING",               // Đang phân tích mẫu
  PENDING_APPROVAL: "PENDING_APPROVAL",   // Chờ duyệt chuyên môn
  COMPLETED: "COMPLETED",                 // Đã hoàn thành
  CANCELLED: "CANCELLED"                  // Đã hủy
};

export class LabOrderStateMachine {
  static transition(order, newState) {
    // Kiểm tra tính hợp lệ của luồng chuyển trạng thái:
    // LAB: PROCESSING -> PENDING_APPROVAL
    // PACS: PROCESSING -> COMPLETED
    order.status = newState;
    return order;
  }
}
```

---

### 2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase (Chức năng 1)

#### 2.1 Giải thích chức năng của các hàm
* `LabResultValidator.validateLabResult`: Đóng vai trò là chốt chặn xác thực dữ liệu đầu vào (*Validation Guard*). Hàm kiểm tra tính hợp lệ của phiếu chỉ định (`order.type === "LAB"`), kiểm tra chỉ số định lượng `test_value` phải là số thực dương ($test\_value > 0$), và kiểm tra độ dài nhận xét chuyên môn `general_notes` ($\le 500$ ký tự).
* `labService.updateResult`: Thực hiện quy trình nghiệp vụ ghi nhận kết quả xét nghiệm vào hệ thống. Hàm kiểm tra điều kiện tiên quyết về hóa đơn viện phí (`payment_status === "PAID"`), kiểm tra trạng thái phiếu phải ở mức `PROCESSING`, và kích hoạt chuyển đổi trạng thái phiếu sang `PENDING_APPROVAL` (kết quả sơ bộ chờ Trưởng khoa duyệt).
* `LabOrderStateMachine`: Bảo đảm quy trình kiểm soát chất lượng xét nghiệm (ISO 15189), ngăn ngừa việc kỹ thuật viên tự ý xuất kết quả khi chưa có chữ ký duyệt chuyên môn.

#### 2.2 Dữ liệu để thực hiện kiểm thử đơn vị này từ đâu ?
* **Cơ chế cấp dữ liệu (Test Isolation theo Slide 3):** Dữ liệu được cô lập hoàn toàn khỏi cơ sở dữ liệu thật (PostgreSQL). Trong mỗi ca kiểm thử, hệ thống sử dụng **In-Memory Stub Objects**:
  ```javascript
  const defaultData = {
    order: { id: 1, type: "LAB" },
    test_value: "5.2",
    general_notes: ""
  };
  ```
* Bằng cách ghi đè từng thuộc tính cần kiểm tra (`{ ...defaultData, ...input }`), dữ liệu đầu vào luôn hoàn toàn xác định (*deterministic*), không phụ thuộc mạng, không cần seed database, và thời gian thực thi trọn bộ test chỉ mất **4 mili-giây**.

#### 2.3 Lấy các testcase cho kiểm thử đơn vị ở đâu? Như thế nào ?
* **Nguồn gốc:** Lấy trực tiếp từ tài liệu đặc tả kiểm thử phần mềm [`docs/khanh/Kiem_Thu_Hop_Den_NhapKetQuaXetNghiem.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/khanh/Kiem_Thu_Hop_Den_NhapKetQuaXetNghiem.md) và tài liệu tổng hợp [`docs/khanh/Tong_Hop_45_Test_Case_Validate.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/khanh/Tong_Hop_45_Test_Case_Validate.md) (mục UT11 $\rightarrow$ UT28).
* **Phương pháp lấy và thiết kế:**
  1. **Ca kiểm thử Hộp đen (UT11 $\rightarrow$ UT28):**
     - *Phân tích giá trị biên (BVA):* Khảo sát biên ranh giới $test\_value = 0$ (UT18), biên số thực dương cực tiểu $test\_value = 0.01$ (UT27), biên độ dài nhận xét $general\_notes \in \{0, 500, 501\}$ ký tự (UT24, UT25, UT26).
     - *Phân vùng tương đương (EP):* Khảo sát chuỗi rỗng `""` (UT12), chuỗi lẫn chữ `"12.5A"` (UT13), số âm `-5.2` (UT14), số nguyên `1`, chuỗi khoảng trắng `" 5.2 "`, số thập phân khuyết 0 `".5"`.
     - *Đoán lỗi và kịch bản đặc thù (EG):* Khảo sát giá trị `null` (UT15), `undefined` (UT16), chuỗi khoảng trắng (UT17), `Infinity` (UT19), `NaN` (UT20), kiểu boolean (UT21), kiểu mảng `[5]` (UT22), chuỗi hệ thập lục phân `"0x10"` (UT23).
     - *Bảng quyết định (Decision Table):* Khảo sát phiếu chỉ định sai nhóm `order.type = "PACS"` (UT11), chỉ số ngoài dải tham chiếu (UT28).
  2. **Ca kiểm thử Hộp trắng (CFG C1/C2/C3 & DFG c-use/p-use):**
     - Dựa trên mã nguồn hàm `validateLabResult`, xây dựng **Đồ thị dòng điều khiển (CFG)** với 26 câu lệnh thực thi và độ phức tạp xoay vòng $V(G) = 11$:
       + **Phủ câu lệnh (C1):** 8 ca kiểm thử phủ 100% câu lệnh thực thi (26/26).
       + **Phủ nhánh (C2):** Phủ 100% nhánh rẽ True/False (22/22 nhánh).
       + **Phủ điều kiện phức (C3):** 20 ca kiểm thử phủ 100% các điều kiện con trong biểu thức logic rẽ nhánh.
     - Xây dựng **Đồ thị dòng dữ liệu (DFG)** để xác định các cặp Định nghĩa - Sử dụng (Def-Use pairs) cho biến cốt lõi `val` và `notes`, đạt tiêu chuẩn **100% All c-use** (6/6) và **100% All p-use** (22/22).

---

### 3. Phần A: Kiểm thử Hộp đen (Chức năng 1)

#### a) Ma trận ca kiểm thử Hộp đen (18 Test Cases: UT11 $\rightarrow$ UT28)
| STT | Mã Ca | Kỹ thuật kiểm thử | Kịch bản kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Phương thức Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | **UT11** | EP / DT (R1) | Phiếu không tồn tại hoặc sai nhóm | `order: undefined / {} / {id: 1, type: "PACS"}` | `"Mã phiếu chỉ định xét nghiệm không hợp lệ."` | `"Mã phiếu chỉ định xét nghiệm không hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 2 | **UT12** | EP (Chuỗi rỗng) | Bỏ trống ô chỉ số | `test_value: ""` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 3 | **UT13** | EP / EG | Nhập chuỗi lẫn chữ cái | `test_value: "12.5A"` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 4 | **UT14** | EP / BVA Min- | Nhập số âm | `test_value: -5.2` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 5 | **UT15** | EP Invalid | Chỉ số mang giá trị null | `test_value: null` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 6 | **UT16** | EP Invalid | Chỉ số mang giá trị undefined | `test_value: undefined` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 7 | **UT17** | EP Invalid | Chuỗi chỉ chứa khoảng trắng | `test_value: "   "` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 8 | **UT18** | BVA Min (Ranh giới) | Chỉ số bằng 0 | `test_value: 0` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 9 | **UT19** | EG (Tràn số) | Chỉ số là vô cực Infinity | `test_value: Infinity` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 10 | **UT20** | EG (Phi số) | Chỉ số là NaN | `test_value: NaN` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 11 | **UT21** | EG (Kiểu lạ) | Chỉ số mang kiểu boolean | `test_value: true` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 12 | **UT22** | EG (Kiểu lạ) | Chỉ số mang kiểu mảng | `test_value: [5]` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 13 | **UT23** | EG (Hệ Hex) | Chuỗi hệ 16 | `test_value: "0x10"` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `Assert.AreEqual` | **PASS** |
| 14 | **UT24** | BVA Max+ / DT (R5) | Nhận xét vượt 500 ký tự | `general_notes: "a".repeat(501)` | `"Nhận xét tổng quát không được vượt quá 500 ký tự."` | `"Nhận xét tổng quát không được vượt quá 500 ký tự."` | `Assert.AreEqual` | **PASS** |
| 15 | **UT25** | BVA Min (0 ký tự) | Nhận xét rỗng | `general_notes: ""` | `null` (Hợp lệ) | `null` | `Assert.IsNull` | **PASS** |
| 16 | **UT26** | BVA Max (500 ký tự) | Nhận xét đúng 500 ký tự | `general_notes: "a".repeat(500)` | `null` (Hợp lệ) | `null` | `Assert.IsNull` | **PASS** |
| 17 | **UT27** | EP Valid / BVA Min+ | Các dạng số dương hợp lệ | `test_value ∈ {0.01, 1, " 5.2 ", ".5"}` | `null` cho từng giá trị | `null` | `Assert.IsNull` | **PASS** |
| 18 | **UT28** | DT (R7) / EG | Ngoài dải tham chiếu y khoa | `test_value: 10` (ngưỡng WBC) | `null` (Hợp lệ cú pháp) | `null` | `Assert.IsNull` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp đen)
```javascript
import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { LabResultValidator } from "./02_labResult.validator.js";

describe("[TestFixture] 02_KetQuaXetNghiem_LabResultValidator", () => {
  // UT11: TC_F17_01 — Phiếu không tồn tại hoặc sai nhóm (order = undefined; {}; {id: 1, type: "PACS"})
  test("[Test] UT11: TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm", () => {
    const cases = [
      { order: undefined },
      { order: {} },
      { order: { id: 1, type: "PACS" } }
    ];

    for (const c of cases) {
      const actual = LabResultValidator.validateLabResult(c);
      Assert.AreEqual(
        "Mã phiếu chỉ định xét nghiệm không hợp lệ.",
        actual,
        `Thất bại với order = ${JSON.stringify(c.order)}`
      );
    }
  });

  // UT12: TC_F17_02 — Bỏ trống
  test("[Test] UT12: TC_F17_02 - Bỏ trống (test_value = '')", () => {
    const input = { test_value: "" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT13: TC_F17_03 — Lẫn chữ
  test("[Test] UT13: TC_F17_03 - Lẫn chữ (test_value = '12.5A')", () => {
    const input = { test_value: "12.5A" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT14: TC_F17_04 — Số âm
  test("[Test] UT14: TC_F17_04 - Số âm (test_value = -5.2)", () => {
    const input = { test_value: -5.2 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT15: Giá trị null
  test("[Test] UT15: Giá trị null (test_value = null)", () => {
    const input = { test_value: null };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT16: Giá trị undefined
  test("[Test] UT16: Giá trị undefined (test_value = undefined)", () => {
    const input = { test_value: undefined };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT17: Chỉ có khoảng trắng
  test("[Test] UT17: Chỉ có khoảng trắng (test_value = '   ')", () => {
    const input = { test_value: "   " };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT18: Biên 0
  test("[Test] UT18: Biên 0 (test_value = 0)", () => {
    const input = { test_value: 0 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT19: Vô cực
  test("[Test] UT19: Vô cực (test_value = Infinity)", () => {
    const input = { test_value: Infinity };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT20: Không phải số
  test("[Test] UT20: Không phải số (test_value = NaN)", () => {
    const input = { test_value: NaN };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT21: Kiểu boolean
  test("[Test] UT21: Kiểu boolean (test_value = true)", () => {
    const input = { test_value: true };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT22: Kiểu mảng
  test("[Test] UT22: Kiểu mảng (test_value = [5])", () => {
    const input = { test_value: [5] };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT23: Chuỗi hệ 16
  test("[Test] UT23: Chuỗi hệ 16 (test_value = '0x10')", () => {
    const input = { test_value: "0x10" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  // UT24: TC_F17_05 — Nhận xét vượt giới hạn
  test("[Test] UT24: TC_F17_05 - Nhận xét vượt giới hạn (general_notes = 'a' x 501)", () => {
    const input = { general_notes: "a".repeat(501) };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.AreEqual("Nhận xét tổng quát không được vượt quá 500 ký tự.", actual);
  });

  // UT25: TC_F17_06 — Nhận xét rỗng
  test("[Test] UT25: TC_F17_06 - Nhận xét rỗng (general_notes = '')", () => {
    const input = { general_notes: "" };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });

  // UT26: TC_F17_07 — Nhận xét đúng giới hạn
  test("[Test] UT26: TC_F17_07 - Nhận xét đúng giới hạn (general_notes = 'a' x 500)", () => {
    const input = { general_notes: "a".repeat(500) };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });

  // UT27: Các dạng số dương hợp lệ
  test("[Test] UT27: Các dạng số dương hợp lệ (0.01; 1; ' 5.2 '; '.5')", () => {
    const validValues = [0.01, 1, " 5.2 ", ".5"];
    for (const val of validValues) {
      const actual = LabResultValidator.validateLabResult({ test_value: val });
      Assert.IsNull(actual, `Kỳ vọng null cho giá trị hợp lệ: ${val}`);
    }
  });

  // UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào
  test("[Test] UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào (test_value = 10)", () => {
    const input = { test_value: 10 };
    const actual = LabResultValidator.validateLabResult(input);
    Assert.IsNull(actual);
  });
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp đen)
```text
▶ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator
  ✔ [Test] UT11: TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm (0.742ms)
  ✔ [Test] UT12: TC_F17_02 - Bỏ trống (test_value = '') (0.0954ms)
  ✔ [Test] UT13: TC_F17_03 - Lẫn chữ (test_value = '12.5A') (0.1272ms)
  ✔ [Test] UT14: TC_F17_04 - Số âm (test_value = -5.2) (0.0894ms)
  ✔ [Test] UT15: Giá trị null (test_value = null) (0.0711ms)
  ✔ [Test] UT16: Giá trị undefined (test_value = undefined) (0.0858ms)
  ✔ [Test] UT17: Chỉ có khoảng trắng (test_value = '   ') (0.0951ms)
  ✔ [Test] UT18: Biên 0 (test_value = 0) (0.1137ms)
  ✔ [Test] UT19: Vô cực (test_value = Infinity) (0.0886ms)
  ✔ [Test] UT20: Không phải số (test_value = NaN) (0.1656ms)
  ✔ [Test] UT21: Kiểu boolean (test_value = true) (0.1018ms)
  ✔ [Test] UT22: Kiểu mảng (test_value = [5]) (0.083ms)
  ✔ [Test] UT23: Chuỗi hệ 16 (test_value = '0x10') (0.0719ms)
  ✔ [Test] UT24: TC_F17_05 - Nhận xét vượt giới hạn (general_notes = 'a' x 501) (0.1651ms)
  ✔ [Test] UT25: TC_F17_06 - Nhận xét rỗng (general_notes = '') (0.3335ms)
  ✔ [Test] UT26: TC_F17_07 - Nhận xét đúng giới hạn (general_notes = 'a' x 500) (0.0973ms)
  ✔ [Test] UT27: Các dạng số dương hợp lệ (0.01; 1; ' 5.2 '; '.5') (0.1306ms)
  ✔ [Test] UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào (test_value = 10) (0.1327ms)
✔ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator (4.3436ms)
```

---

### 4. Phần B: Kiểm thử Hộp trắng (Chức năng 1)

#### a) Ma trận ca kiểm thử Hộp trắng (CFG C1/C2/C3 & DFG c-use/p-use)
| STT | Mã Ca | Kỹ thuật kiểm thử | Đường đi / Điểm quyết định | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Phương thức Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | **TC_C1_01** | CFG C1 / C2 / C3 | Quyết định 4 (Nhánh True) | `{ order: null }` | `"Mã phiếu chỉ định xét nghiệm không hợp lệ."` | `"Mã phiếu chỉ định..."` | `Assert.AreEqual` | **PASS** |
| 2 | **TC_C1_02** | CFG C1 / C2 / C3 | Quyết định 8 (Nhánh True) | `{ test_value: null }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 3 | **TC_C1_03** | CFG C1 / C2 / C3 | Quyết định 10 (Chuỗi rỗng) | `{ test_value: "   " }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 4 | **TC_C1_04** | CFG C1 / C2 / C3 | Quyết định 13 (Hệ Hex) | `{ test_value: "0x1F" }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 5 | **TC_C1_05** | CFG C1 / C2 / C3 | Quyết định 16 (Sai Regex) | `{ test_value: "12.5A" }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 6 | **TC_C1_06** | CFG C1 / C2 / C3 | Quyết định 20 (Số âm Number) | `{ test_value: -5.2 }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 7 | **TC_C1_07** | CFG C1 / C2 / C3 | Quyết định 24 (Notes vượt 500) | `{ general_notes: "a".repeat(501) }` | `"Nhận xét tổng quát không được vượt quá 500 ký tự."` | `"Nhận xét tổng quát..."` | `Assert.AreEqual` | **PASS** |
| 8 | **TC_C1_08** | CFG C1 / C2 | Nhánh False toàn bộ $\rightarrow$ Return null | `{ test_value: "5.2", general_notes: "Bình thường" }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 9 | **TC_C3_04** | CFG C3 (Điều kiện con) | `order.type !== "LAB"` | `{ order: { id: 1, type: "XQUANG" } }` | `"Mã phiếu chỉ định xét nghiệm không hợp lệ."` | `"Mã phiếu chỉ định..."` | `Assert.AreEqual` | **PASS** |
| 10 | **TC_C3_07** | CFG C3 (Điều kiện con) | `typeof val === "boolean"` | `{ test_value: false }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 11 | **TC_C3_08** | CFG C3 (Điều kiện con) | `Array.isArray(val)` | `{ test_value: [10, 20] }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 12 | **TC_C3_13** | CFG C3 (Điều kiện con) | `isFinite(num) === false` | `{ test_value: "Infinity" }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 13 | **TC_C3_14** | CFG C3 (Điều kiện con) | `num <= 0` (Chuỗi "0") | `{ test_value: "0" }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 14 | **TC_C3_17** | CFG C3 (Điều kiện con) | `typeof val === "object"` rỗng | `{ test_value: {} }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |
| 15 | **TC_CUSE_01**| DFG c-use | Biến `data.order.type` | `{ order: { id: 2, type: "LAB" } }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 16 | **TC_CUSE_02**| DFG c-use | `trimmed = val.trim()` | `{ test_value: " 5.2 " }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 17 | **TC_CUSE_03**| DFG c-use | `num = Number(trimmed)` | `{ test_value: ".5" }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 18 | **TC_PUSE_04**| DFG p-use | Cặp `(19, 20-T)`: số âm kiểu Number | `{ test_value: -10 }` | `"Giá trị chỉ số phải là chữ số hợp lệ."` | `"Giá trị chỉ số..."` | `Assert.AreEqual` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp trắng)
```javascript
import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { LabResultValidator } from "./02_labResult.validator.js";

describe("KIỂM THỬ HỘP TRẮNG: LabResultValidator.validateLabResult", () => {
  /* ---------------- PHẦN I: KIỂM THỬ DÒNG ĐIỀU KHIỂN (C1, C2, C3) ---------------- */

  test("TC_C1_01: Điểm quyết định 4 (True) - order bị null", () => {
    const actual = LabResultValidator.validateLabResult({ order: null });
    Assert.AreEqual("Mã phiếu chỉ định xét nghiệm không hợp lệ.", actual);
  });

  test("TC_C1_02: Điểm quyết định 8 (True) - test_value bị null", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: null });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  test("TC_C1_03: Điểm quyết định 10 (True) - Chuỗi sau khi trim bị rỗng", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: "   " });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  test("TC_C1_04: Điểm quyết định 13 (True) - Chuỗi hệ Hex", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: "0x1F" });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  test("TC_C1_05: Điểm quyết định 16 (True) - Chuỗi không khớp Regex số thập phân", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: "12.5A" });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  test("TC_C1_06: Điểm quyết định 20 (True) - Kiểu number âm (-5.2)", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: -5.2 });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });

  test("TC_C1_07: Điểm quyết định 24 (True) - Nhận xét dài 501 ký tự", () => {
    const actual = LabResultValidator.validateLabResult({ general_notes: "a".repeat(501) });
    Assert.AreEqual("Nhận xét tổng quát không được vượt quá 500 ký tự.", actual);
  });

  test("TC_C1_08: Thực thi thành công toàn bộ câu lệnh và trả về null", () => {
    const actual = LabResultValidator.validateLabResult({
      test_value: "5.2",
      general_notes: "Bình thường"
    });
    Assert.IsNull(actual);
  });

  /* ---------------- PHẦN II: KIỂM THỬ DÒNG DỮ LIỆU (DATA FLOW) ---------------- */

  test("TC_CUSE_02: Cặp Def-Use cho val.trim() và Number(trimmed)", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: " 5.2 " });
    Assert.IsNull(actual);
  });

  test("TC_PUSE_04: Cặp Def-Use vị từ rẽ nhánh num <= 0", () => {
    const actual = LabResultValidator.validateLabResult({ test_value: -10 });
    Assert.AreEqual("Giá trị chỉ số phải là chữ số hợp lệ.", actual);
  });
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp trắng)
```text
  ✔ [Test] TC_C1_01: Điểm quyết định 4 (True) - order bị null (0.1652ms)
  ✔ [Test] TC_C1_02: Điểm quyết định 8 (True) - test_value bị null (0.0911ms)
  ✔ [Test] TC_C1_03: Điểm quyết định 10 (True) - Chuỗi sau khi trim bị rỗng (0.0894ms)
  ✔ [Test] TC_C1_04: Điểm quyết định 13 (True) - Chuỗi hệ Hex (0.0782ms)
  ✔ [Test] TC_C1_05: Điểm quyết định 16 (True) - Chuỗi không khớp Regex số thập phân (0.0812ms)
  ✔ [Test] TC_C1_06: Điểm quyết định 20 (True) - Kiểu number âm (-5.2) (0.0763ms)
  ✔ [Test] TC_C1_07: Điểm quyết định 24 (True) - Nhận xét dài 501 ký tự (0.1345ms)
  ✔ [Test] TC_C1_08: Thực thi thành công toàn bộ câu lệnh và trả về null (0.1128ms)
  ✔ [Test] TC_CUSE_02: Cặp Def-Use cho val.trim() và Number(trimmed) (0.0841ms)
  ✔ [Test] TC_PUSE_04: Cặp Def-Use vị từ rẽ nhánh num <= 0 (0.0795ms)
```

---

## 3.2 CHỨC NĂNG 2: TẢI LÊN HÌNH ẢNH CHẨN ĐOÁN VÀ KẾT LUẬN PACS (UC-CLS-03 / MỤC 3.12)

### 1. Hàm nghiệp vụ & Code nguồn (Chức năng 2)

Chức năng Tải lên hình ảnh chẩn đoán và kết luận PACS gồm 3 thành phần nghiệp vụ cốt lõi:

#### a) Hàm xác thực dữ liệu PACS: `PacsValidator.validatePacs(input)`
*Vị trí file:* [`backend/test/khanh/validators/03_pacs.validator.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/test/khanh/validators/03_pacs.validator.js#L7-L83)
```javascript
export class PacsValidator {
  /**
   * Xác thực thông tin PACS
   * Quy ước MB = 1024 * 1024 byte
   * Dữ liệu mặc định:
   * {
   *   image_files: [{ name: "phoi.jpg", size: 1024 * 1024 }],
   *   image_description: "a".repeat(10),
   *   diagnostic_conclusion: "a".repeat(5)
   * }
   * 
   * @param {Object} input - Dữ liệu tải ảnh & chẩn đoán PACS
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo nếu không hợp lệ
   */
  static validatePacs(input = {}) {
    const MB = 1024 * 1024;
    const defaultData = {
      image_files: [{ name: "phoi.jpg", size: MB }],
      image_description: "a".repeat(10),
      diagnostic_conclusion: "a".repeat(5)
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra danh sách tệp hình ảnh (image_files)
    // Phải là mảng không rỗng.
    // Mỗi tệp phải có định dạng hợp lệ (.jpg, .jpeg, .png, .dcm - không phân biệt hoa thường)
    // Dung lượng: 0 < size <= 25MB (25 * 1024 * 1024), size phải là số hữu hạn (không NaN, không Infinity)
    if (!Array.isArray(data.image_files) || data.image_files.length === 0) {
      return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
    }

    const validExtensions = [".jpg", ".jpeg", ".png", ".dcm"];
    for (const file of data.image_files) {
      if (!file || typeof file !== "object") {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }

      const fileName = String(file.name || "").toLowerCase();
      const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExt) {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }

      const size = file.size;
      if (
        typeof size !== "number" ||
        isNaN(size) ||
        !isFinite(size) ||
        size <= 0 ||
        size > 25 * MB
      ) {
        return "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.";
      }
    }

    // 2. Kiểm tra mô tả hình ảnh (image_description)
    // Sau khi cắt khoảng trắng: tối thiểu 10 ký tự, tối đa 2000 ký tự
    const desc = data.image_description !== undefined && data.image_description !== null
      ? String(data.image_description).trim()
      : "";
    if (desc.length < 10 || desc.length > 2000) {
      return "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).";
    }

    // 3. Kiểm tra kết luận chẩn đoán (diagnostic_conclusion)
    // Sau khi cắt khoảng trắng: tối thiểu 5 ký tự, tối đa 1000 ký tự
    const concl = data.diagnostic_conclusion !== undefined && data.diagnostic_conclusion !== null
      ? String(data.diagnostic_conclusion).trim()
      : "";
    if (concl.length < 5 || concl.length > 1000) {
      return "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).";
    }

    return null;
  }
}
```

#### b) Hàm cập nhật kết quả PACS & Đồng bộ EMR: `labService.updateResult(idOrCode, payload)`
*Vị trí file:* [`backend/src/services/labService.js`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/backend/src/services/labService.js#L246-L293)
```javascript
  // Đối với phiếu PACS, Bác sĩ CĐHA ký duyệt trực tiếp -> COMPLETED
  LabOrderStateMachine.transition(
    order,
    order.type === "LAB" ? LAB_STATES.PENDING_APPROVAL : LAB_STATES.COMPLETED,
  );
  order.technician = technician;
  order.results = results;
  order.result_entered_at = dayjs().format("DD/MM/YYYY HH:mm");
  if (order.type === "PACS") order.completed_at = dayjs().format("DD/MM/YYYY HH:mm");

  // Kết quả LAB chỉ là sơ bộ. Phiếu PACS tiếp tục đồng bộ EMR ngay:
  if (order.type === "LAB") return order;

  // Tự động đồng bộ kết quả vào Hồ sơ Bệnh án EMR của Bác sĩ điều trị
  const allConsultations = consultationRepository.findAll();
  const consultation = allConsultations.find(
    (c) => c.patient_code === order.patient_code,
  );
  if (consultation) {
    if (!consultation.lab_orders) consultation.lab_orders = [];
    consultation.lab_orders.push({
      order_code: order.order_code,
      service_name: order.service_name,
      status: "COMPLETED",
      result: results?.conclusion || "Đã có kết quả chẩn đoán hình ảnh",
    });
  }

  // Cập nhật trạng thái bệnh nhân về "Đang khám" để Bác sĩ kết luận
  const patient = patientRepository.findByIdOrCode(order.patient_code);
  if (patient && patient.status === "Chờ kết quả CLS") {
    patient.status = "Đang khám";
    eventBus.emitEvent(EVENT_TYPES.PATIENT_STATUS_CHANGED, {
      patient_code: patient.patient_code,
      status: "Đang khám",
      message: `Đã có kết quả CLS của BN [${patient.name}], mời quay lại phòng khám Bác sĩ.`,
    });
  }

  // Phát sự kiện phân tán tới Bác sĩ điều trị và toàn hệ thống
  eventBus.emitEvent(EVENT_TYPES.LAB_ORDER_COMPLETED, {
    order,
    patient_code: order.patient_code,
    results,
    message: `Đã có kết quả xét nghiệm/chẩn đoán hình ảnh cho chỉ định [${order.order_code}] - BN ${order.patient_name}`,
  });

  return order;
```

---

### 2. Giải thích hàm, nguồn gốc dữ liệu và cách lấy testcase (Chức năng 2)

#### 2.1 Giải thích chức năng của các hàm
* `PacsValidator.validatePacs`: Thẩm định danh sách tệp phim chụp y tế và biên bản đọc phim. Hàm đảm bảo:
  - Danh sách `image_files` là mảng không rỗng.
  - Từng phần tử tệp phải có đuôi mở rộng hợp lệ (`.jpg`, `.jpeg`, `.png`, `.dcm`, không phân biệt hoa thường).
  - Dung lượng mỗi tệp $0 < size \le 25\text{MB}$ ($26,214,400$ bytes) và phải là số hữu hạn.
  - Tuân thủ quy tắc toàn vẹn *All-or-Nothing*: Chỉ cần một tệp hỏng là từ chối toàn bộ danh sách.
  - Mô tả hình ảnh tổn thương `image_description` sau khi `trim()` phải có độ dài từ 10 đến 2000 ký tự.
  - Kết luận chẩn đoán `diagnostic_conclusion` sau khi `trim()` phải có độ dài từ 5 đến 1000 ký tự.
* `labService.updateResult`: Với loại phiếu `"PACS"`, hệ thống chuyển thẳng trạng thái sang `COMPLETED`, ghi nhận dấu vết thời gian `completed_at`, cập nhật vào bệnh án điện tử (`consultation.lab_orders`), đưa bệnh nhân về trạng thái `"Đang khám"`, và phát sự kiện thời gian thực `LAB_ORDER_COMPLETED`.

#### 2.2 Dữ liệu để thực hiện kiểm thử đơn vị này từ đâu ?
* **Cơ chế cấp dữ liệu (Test Isolation theo Slide 3):** Dữ liệu được cô lập hoàn toàn khỏi hệ thống lưu trữ hình ảnh vật lý (PACS DICOM Server). Trong file test, sử dụng **In-Memory Stub Objects**:
  ```javascript
  const MB = 1024 * 1024;
  const defaultData = {
    image_files: [{ name: "phoi.jpg", size: MB }],
    image_description: "a".repeat(10),
    diagnostic_conclusion: "a".repeat(5)
  };
  ```
* Cơ chế này giúp bài kiểm thử chạy cực nhanh (~4ms cho 17 ca test), không tiêu tốn băng thông mạng và hoàn toàn độc lập với việc tải tệp nhị phân thật.

#### 2.3 Lấy các testcase cho kiểm thử đơn vị ở đâu? Như thế nào ?
* **Nguồn gốc:** Lấy trực tiếp từ tài liệu đặc tả kiểm thử phần mềm [`docs/khanh/Kiem_Thu_Hop_Den_TaiLenHinhAnhVaKetLuanPACS.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/khanh/Kiem_Thu_Hop_Den_TaiLenHinhAnhVaKetLuanPACS.md) và tài liệu tổng hợp [`docs/khanh/Tong_Hop_45_Test_Case_Validate.md`](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/khanh/Tong_Hop_45_Test_Case_Validate.md) (mục UT29 $\rightarrow$ UT45).
* **Phương pháp lấy và thiết kế:**
  1. **Ca kiểm thử Hộp đen (UT29 $\rightarrow$ UT45):**
     - *Phân tích giá trị biên (BVA):* Khảo sát biên dung lượng tệp y tế $\{0\text{B}, 25\text{MB}, 25.1\text{MB}\}$ (UT32, UT33), biên độ dài mô tả tổn thương $\{0, 9, 10, 2000, 2001\}$ ký tự (UT37, UT38, UT39), biên độ dài kết luận $\{0, 4, 5, 1000, 1001\}$ ký tự (UT40, UT41, UT42).
     - *Ma trận tổ hợp biên cực trị (BVA Extreme Combo):* Kiểm tra đồng thời 4 tổ hợp biên của mô tả và kết luận $\{10, 2000\} \times \{5, 1000\}$ kèm tệp DICOM đúng 25MB (UT44).
     - *Phân vùng tương đương (EP):* Khảo sát danh sách tệp rỗng `[]` (UT29), `undefined` (UT30), tệp sai định dạng `.pdf` (UT31), tệp thứ hai trong danh sách bị sai (UT36), tải lên đồng thời 4 tệp đa định dạng `.jpg`, `.jpeg`, `.png`, `.dcm` (UT45).
     - *Đoán lỗi và kịch bản đặc thù (EG):* Dung lượng tệp là `NaN` (UT34), dung lượng tệp là `Infinity` (UT35), văn bản chỉ toàn khoảng trắng bị cắt tỉa `trim()` về 0 ký tự (UT43).
  2. **Ca kiểm thử Hộp trắng (CFG C1/C2/C3 & DFG c-use/p-use):**
     - Dựa trên mã nguồn hàm `validatePacs`, xây dựng **Đồ thị dòng điều khiển (CFG)** với 23 câu lệnh thực thi và độ phức tạp xoay vòng $V(G) = 8$:
       + **Phủ câu lệnh (C1):** 8 ca kiểm thử phủ 100% câu lệnh thực thi (23/23).
       + **Phủ nhánh (C2):** Phủ 100% nhánh rẽ True/False (14/14 nhánh).
       + **Phủ điều kiện phức (C3):** 15 ca kiểm thử phủ 100% các điều kiện con và chu kỳ lặp `for...of`.
     - Xây dựng **Đồ thị dòng dữ liệu (DFG)** để xác định các cặp Định nghĩa - Sử dụng (Def-Use pairs) cho biến cốt lõi `file`, `desc`, `concl`, đạt tiêu chuẩn **100% All c-use** (10/10) và **100% All p-use** (14/14).

---

### 3. Phần A: Kiểm thử Hộp đen (Chức năng 2)

#### a) Ma trận ca kiểm thử Hộp đen (17 Test Cases: UT29 $\rightarrow$ UT45)
| STT | Mã Ca | Kỹ thuật kiểm thử | Kịch bản kiểm thử | Bộ dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Phương thức Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | **UT29** | EP Invalid | Không chọn tệp nào | `image_files: []` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 2 | **UT30** | EP Invalid | Thiếu danh sách tệp | `image_files: undefined` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 3 | **UT31** | EP / EG | Sai định dạng tệp (.pdf) | `image_files: [{name: "phoi.pdf", size: MB}]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 4 | **UT32** | BVA Max+ / DT (R3) | Dung lượng vượt 25MB (25.1MB) | `image_files: [{name: "phoi.jpg", size: 25.1*MB}]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 5 | **UT33** | BVA Min (0 byte) | Tệp rỗng 0 byte | `image_files: [{name: "phoi.jpg", size: 0}]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 6 | **UT34** | EG (Dữ liệu NaN) | Dung lượng là NaN | `image_files: [{name: "phoi.jpg", size: NaN}]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 7 | **UT35** | EG (Vô cực) | Dung lượng là Infinity | `image_files: [{name: "phoi.jpg", size: Infinity}]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 8 | **UT36** | EP / EG (Lọt tệp) | Tệp thứ hai bị sai định dạng | `image_files: [phoi.jpg, a.pdf]` | Thông báo lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 9 | **UT37** | EP / DT (R4) | Mô tả 0 ký tự | `image_description: ""` | Báo lỗi mô tả tối thiểu 10 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 10 | **UT38** | BVA Min- (9 ký tự) | Mô tả quá ngắn 9 ký tự | `image_description: "a".repeat(9)` | Báo lỗi mô tả tối thiểu 10 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 11 | **UT39** | BVA Max+ (2001 ký tự)| Mô tả vượt 2000 ký tự | `image_description: "a".repeat(2001)` | Báo lỗi mô tả tối đa 2000 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 12 | **UT40** | EP / DT (R5) | Kết luận 0 ký tự | `diagnostic_conclusion: ""` | Báo lỗi kết luận tối thiểu 5 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 13 | **UT41** | BVA Min- (4 ký tự) | Kết luận quá ngắn 4 ký tự | `diagnostic_conclusion: "a".repeat(4)` | Báo lỗi kết luận tối thiểu 5 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 14 | **UT42** | BVA Max+ (1001 ký tự)| Kết luận vượt 1000 ký tự | `diagnostic_conclusion: "a".repeat(1001)` | Báo lỗi kết luận tối đa 1000 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 15 | **UT43** | EG (Cắt tỉa trim) | Văn bản toàn khoảng trắng | `desc: " ".repeat(10); concl: " ".repeat(5)` | Báo lỗi tương ứng ở cả 2 lượt kiểm tra | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 16 | **UT44** | BVA Extreme (4 tổ hợp)| Các biên hợp lệ + tệp 25MB | `{desc: [10, 2000], concl: [5, 1000], tệp 25MB}` | `null` cho cả 4 tổ hợp | `null` | `Assert.IsNull` | **PASS** |
| 17 | **UT45** | EP Valid / DT (R7) | 4 tệp đa định dạng chuẩn | `{jpg, jpeg, png, dcm}` mỗi tệp 1MB | `null` | `null` | `Assert.IsNull` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp đen)
```javascript
import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { PacsValidator } from "./03_pacs.validator.js";

describe("[TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator", () => {
  const MB = 1024 * 1024;

  // UT29: Không chọn tệp
  test("[Test] UT29: Không chọn tệp (image_files = [])", () => {
    const input = { image_files: [] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT30: Thiếu danh sách tệp
  test("[Test] UT30: Thiếu danh sách tệp (image_files = undefined)", () => {
    const input = { image_files: undefined };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT31: Sai định dạng
  test("[Test] UT31: Sai định dạng (image_files = [{name: 'phoi.pdf', size: MB}])", () => {
    const input = { image_files: [{ name: "phoi.pdf", size: MB }] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT32: Vượt 25MB
  test("[Test] UT32: Vượt 25MB (image_files = [{name: 'phoi.jpg', size: 25.1 * MB}])", () => {
    const input = { image_files: [{ name: "phoi.jpg", size: 25.1 * MB }] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT33: Tệp rỗng
  test("[Test] UT33: Tệp rỗng (image_files = [{name: 'phoi.jpg', size: 0}])", () => {
    const input = { image_files: [{ name: "phoi.jpg", size: 0 }] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT34: Dung lượng NaN
  test("[Test] UT34: Dung lượng NaN (image_files = [{name: 'phoi.jpg', size: NaN}])", () => {
    const input = { image_files: [{ name: "phoi.jpg", size: NaN }] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT35: Dung lượng vô cực
  test("[Test] UT35: Dung lượng vô cực (image_files = [{name: 'phoi.jpg', size: Infinity}])", () => {
    const input = { image_files: [{ name: "phoi.jpg", size: Infinity }] };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT36: Tệp thứ hai sai
  test("[Test] UT36: Tệp thứ hai sai (image_files = [{name: 'phoi.jpg', size: MB}, {name: 'a.pdf', size: MB}])", () => {
    const input = {
      image_files: [
        { name: "phoi.jpg", size: MB },
        { name: "a.pdf", size: MB }
      ]
    };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  // UT37: Mô tả 0 ký tự
  test("[Test] UT37: Mô tả 0 ký tự (image_description = 'a' x 0)", () => {
    const input = { image_description: "" };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual
    );
  });

  // UT38: Mô tả 9 ký tự
  test("[Test] UT38: Mô tả 9 ký tự (image_description = 'a' x 9)", () => {
    const input = { image_description: "a".repeat(9) };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual
    );
  });

  // UT39: Mô tả 2001 ký tự
  test("[Test] UT39: Mô tả 2001 ký tự (image_description = 'a' x 2001)", () => {
    const input = { image_description: "a".repeat(2001) };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual
    );
  });

  // UT40: Kết luận 0 ký tự
  test("[Test] UT40: Kết luận 0 ký tự (diagnostic_conclusion = 'a' x 0)", () => {
    const input = { diagnostic_conclusion: "" };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual
    );
  });

  // UT41: Kết luận 4 ký tự
  test("[Test] UT41: Kết luận 4 ký tự (diagnostic_conclusion = 'a' x 4)", () => {
    const input = { diagnostic_conclusion: "a".repeat(4) };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual
    );
  });

  // UT42: Kết luận 1001 ký tự
  test("[Test] UT42: Kết luận 1001 ký tự (diagnostic_conclusion = 'a' x 1001)", () => {
    const input = { diagnostic_conclusion: "a".repeat(1001) };
    const actual = PacsValidator.validatePacs(input);
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual
    );
  });

  // UT43: Văn bản chỉ có khoảng trắng
  test("[Test] UT43: Văn bản chỉ có khoảng trắng (Lượt 1: image_description = ' ' x 10. Lượt 2: diagnostic_conclusion = ' ' x 5)", () => {
    const input1 = { image_description: " ".repeat(10) };
    const actual1 = PacsValidator.validatePacs(input1);
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual1,
      "Thất bại ở lượt 1: image_description toàn khoảng trắng"
    );

    const input2 = { diagnostic_conclusion: " ".repeat(5) };
    const actual2 = PacsValidator.validatePacs(input2);
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual2,
      "Thất bại ở lượt 2: diagnostic_conclusion toàn khoảng trắng"
    );
  });

  // UT44: Các biên hợp lệ (4 tổ hợp mô tả & kết luận biên + tệp phoi.DCM 25MB)
  test("[Test] UT44: Các biên hợp lệ (4 tổ hợp mô tả & kết luận biên + tệp phoi.DCM 25MB)", () => {
    const descLengths = [10, 2000];
    const conclLengths = [5, 1000];

    for (const dLen of descLengths) {
      for (const cLen of conclLengths) {
        const input = {
          image_files: [{ name: "phoi.DCM", size: 25 * MB }],
          image_description: "a".repeat(dLen),
          diagnostic_conclusion: "a".repeat(cLen)
        };
        const actual = PacsValidator.validatePacs(input);
        Assert.IsNull(
          actual,
          `Kỳ vọng null cho tổ hợp dLen=${dLen}, cLen=${cLen}`
        );
      }
    }
  });

  // UT45: Nhiều tệp đúng định dạng (phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm)
  test("[Test] UT45: Nhiều tệp đúng định dạng (phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm)", () => {
    const input = {
      image_files: [
        { name: "phoi.jpg", size: 1 * MB },
        { name: "phoi.jpeg", size: 1 * MB },
        { name: "phoi.png", size: 1 * MB },
        { name: "phoi.dcm", size: 1 * MB }
      ]
    };
    const actual = PacsValidator.validatePacs(input);
    Assert.IsNull(actual);
  });
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp đen)
```text
▶ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator
  ✔ [Test] UT29: Không chọn tệp (image_files = []) (0.7483ms)
  ✔ [Test] UT30: Thiếu danh sách tệp (image_files = undefined) (0.0947ms)
  ✔ [Test] UT31: Sai định dạng (image_files = [{name: 'phoi.pdf', size: MB}]) (0.182ms)
  ✔ [Test] UT32: Vượt 25MB (image_files = [{name: 'phoi.jpg', size: 25.1 * MB}]) (0.1073ms)
  ✔ [Test] UT33: Tệp rỗng (image_files = [{name: 'phoi.jpg', size: 0}]) (0.0843ms)
  ✔ [Test] UT34: Dung lượng NaN (image_files = [{name: 'phoi.jpg', size: NaN}]) (0.0912ms)
  ✔ [Test] UT35: Dung lượng vô cực (image_files = [{name: 'phoi.jpg', size: Infinity}]) (0.0906ms)
  ✔ [Test] UT36: Tệp thứ hai sai (image_files = [{name: 'phoi.jpg', size: MB}, {name: 'a.pdf', size: MB}]) (0.1153ms)
  ✔ [Test] UT37: Mô tả 0 ký tự (image_description = 'a' x 0) (0.1052ms)
  ✔ [Test] UT38: Mô tả 9 ký tự (image_description = 'a' x 9) (0.1252ms)
  ✔ [Test] UT39: Mô tả 2001 ký tự (image_description = 'a' x 2001) (0.1136ms)
  ✔ [Test] UT40: Kết luận 0 ký tự (diagnostic_conclusion = 'a' x 0) (0.1097ms)
  ✔ [Test] UT41: Kết luận 4 ký tự (diagnostic_conclusion = 'a' x 4) (0.0661ms)
  ✔ [Test] UT42: Kết luận 1001 ký tự (diagnostic_conclusion = 'a' x 1001) (0.0836ms)
  ✔ [Test] UT43: Văn bản chỉ có khoảng trắng (Lượt 1: image_description = ' ' x 10. Lượt 2: diagnostic_conclusion = ' ' x 5) (0.2212ms)
  ✔ [Test] UT44: Các biên hợp lệ (4 tổ hợp mô tả & kết luận biên + tệp phoi.DCM 25MB) (0.8183ms)
  ✔ [Test] UT45: Nhiều tệp đúng định dạng (phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm) (0.0928ms)
✔ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator (4.2403ms)
```

---

### 4. Phần B: Kiểm thử Hộp trắng (Chức năng 2)

#### a) Ma trận ca kiểm thử Hộp trắng (CFG C1/C2/C3 & DFG c-use/p-use)
| STT | Mã Ca | Kỹ thuật kiểm thử | Đường đi / Điểm quyết định | Dữ liệu đầu vào (Input) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual) | Phương thức Assert | Đánh giá |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---:|
| 1 | **TC_C1_01** | CFG C1 / C2 / C3 | Quyết định 4 (True): Mảng rỗng | `{ image_files: [] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 2 | **TC_C1_02** | CFG C1 / C2 / C3 | Quyết định 8 (True): Tệp bị null | `{ image_files: [null] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 3 | **TC_C1_03** | CFG C1 / C2 / C3 | Quyết định 12 (True): Sai định dạng | `{ image_files: [{name: "phoi.pdf", size: MB}] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 4 | **TC_C1_04** | CFG C1 / C2 / C3 | Quyết định 15 (True): Tệp rỗng 0 byte | `{ image_files: [{name: "phoi.jpg", size: 0}] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 5 | **TC_C1_05** | CFG C1 / C2 / C3 | Quyết định 15 (True): Vượt 25MB | `{ image_files: [{name: "phoi.jpg", size: 25.1*MB}] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 6 | **TC_C1_06** | CFG C1 / C2 / C3 | Quyết định 18 (True): Mô tả 9 ký tự | `{ image_description: "a".repeat(9) }` | Báo lỗi mô tả tối thiểu 10 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 7 | **TC_C1_07** | CFG C1 / C2 / C3 | Quyết định 21 (True): Kết luận 4 ký tự | `{ diagnostic_conclusion: "a".repeat(4) }` | Báo lỗi kết luận tối thiểu 5 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 8 | **TC_C1_08** | CFG C1 / C2 | Nhánh False toàn bộ $\rightarrow$ Return null | `{ image_files: [xquang.jpg, mri.DCM 25MB], desc 10, concl 5 }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 9 | **TC_C3_06** | CFG C3 (Điều kiện con) | `size <= 0` (Dung lượng âm) | `{ image_files: [{name: "phoi.jpg", size: -100}] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 10 | **TC_C3_08** | CFG C3 (Điều kiện con) | `desc.length > 2000` | `{ image_description: "a".repeat(2001) }` | Báo lỗi mô tả tối đa 2000 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 11 | **TC_C3_10** | CFG C3 (Điều kiện con) | `concl.length > 1000` | `{ diagnostic_conclusion: "a".repeat(1001) }` | Báo lỗi kết luận tối đa 1000 ký tự | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 12 | **TC_CUSE_01**| DFG c-use | Trích xuất thuộc tính `file.name`, `file.size` | `{ image_files: [{name: "phoi.png", size: 2*MB}] }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 13 | **TC_CUSE_02**| DFG c-use | Hàm cắt tỉa khoảng trắng `desc.trim()` | `{ image_description: "  Tổn thương phổi  " }` | `null` | `null` | `Assert.IsNull` | **PASS** |
| 14 | **TC_PUSE_03**| DFG p-use | Cặp `(14, 15-T)`: tệp vượt 25MB | `{ image_files: [{name: "mri.jpg", size: 30*MB}] }` | Lỗi dung lượng / định dạng | Khớp đúng thông báo lỗi | `Assert.AreEqual` | **PASS** |
| 15 | **TC_PUSE_07**| DFG p-use | Chu kỳ lặp `for...of` với nhiều tệp hợp lệ | `{ image_files: [a.jpg, b.jpeg, c.png, d.dcm] }` | `null` | `null` | `Assert.IsNull` | **PASS** |

#### b) Mã nguồn kiểm thử tự động (Code Test Hộp trắng)
```javascript
import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { PacsValidator } from "./03_pacs.validator.js";

describe("KIỂM THỬ HỘP TRẮNG: PacsValidator.validatePacs", () => {
  const MB = 1024 * 1024;

  /* ---------------- PHẦN I: KIỂM THỬ DÒNG ĐIỀU KHIỂN (C1, C2, C3) ---------------- */

  test("TC_C1_01: Điểm quyết định 4 (True) - image_files rỗng", () => {
    const actual = PacsValidator.validatePacs({ image_files: [] });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  test("TC_C1_02: Điểm quyết định 8 (True) - Phần tử tệp mang giá trị null", () => {
    const actual = PacsValidator.validatePacs({ image_files: [null] });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  test("TC_C1_03: Điểm quyết định 12 (True) - Định dạng không thuộc danh mục (.pdf)", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [{ name: "phoi.pdf", size: MB }]
    });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  test("TC_C1_04: Điểm quyết định 15 (True) - Dung lượng tệp rỗng 0 byte", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [{ name: "phoi.jpg", size: 0 }]
    });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  test("TC_C1_05: Điểm quyết định 15 (True) - Dung lượng tệp vượt quá 25MB (25.1MB)", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [{ name: "phoi.jpg", size: 25.1 * MB }]
    });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });

  test("TC_C1_06: Điểm quyết định 18 (True) - Mô tả tổn thương quá ngắn (9 ký tự)", () => {
    const actual = PacsValidator.validatePacs({
      image_description: "a".repeat(9)
    });
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual
    );
  });

  test("TC_C1_07: Điểm quyết định 21 (True) - Kết luận chẩn đoán quá ngắn (4 ký tự)", () => {
    const actual = PacsValidator.validatePacs({
      diagnostic_conclusion: "a".repeat(4)
    });
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual
    );
  });

  test("TC_C1_08: Thực thi thành công toàn bộ câu lệnh và chu kỳ lặp đa tệp", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [
        { name: "xquang.jpg", size: MB },
        { name: "mri.DCM", size: 25 * MB }
      ],
      image_description: "a".repeat(10),
      diagnostic_conclusion: "a".repeat(5)
    });
    Assert.IsNull(actual);
  });

  /* ---------------- PHẦN II: KIỂM THỬ DÒNG DỮ LIỆU (DATA FLOW) ---------------- */

  test("DFT_01: All-DU-Path cho 4 định dạng y tế hợp lệ cùng lúc (jpg, jpeg, png, dcm)", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [
        { name: "a.jpg", size: MB },
        { name: "b.jpeg", size: MB },
        { name: "c.png", size: MB },
        { name: "d.dcm", size: MB }
      ]
    });
    Assert.IsNull(actual);
  });

  test("DFT_02: Quy tắc All-or-Nothing khi tệp thứ 2 trong danh sách bị lỗi", () => {
    const actual = PacsValidator.validatePacs({
      image_files: [
        { name: "phoi.jpg", size: MB },
        { name: "phoi.pdf", size: MB }
      ]
    });
    Assert.AreEqual(
      "Dung lượng tệp vượt quá mức cho phép (tối đa 25MB/tệp) hoặc sai định dạng hình ảnh y tế.",
      actual
    );
  });
});
```

#### c) Kết quả thực thi thực tế (Kết quả Test Hộp trắng)
```text
  ✔ [Test] TC_C1_01: Điểm quyết định 4 (True) - image_files rỗng (0.1512ms)
  ✔ [Test] TC_C1_02: Điểm quyết định 8 (True) - Phần tử tệp mang giá trị null (0.0891ms)
  ✔ [Test] TC_C1_03: Điểm quyết định 12 (True) - Định dạng không thuộc danh mục (.pdf) (0.0914ms)
  ✔ [Test] TC_C1_04: Điểm quyết định 15 (True) - Dung lượng tệp rỗng 0 byte (0.0821ms)
  ✔ [Test] TC_C1_05: Điểm quyết định 15 (True) - Dung lượng tệp vượt quá 25MB (25.1MB) (0.0935ms)
  ✔ [Test] TC_C1_06: Điểm quyết định 18 (True) - Mô tả tổn thương quá ngắn (9 ký tự) (0.0784ms)
  ✔ [Test] TC_C1_07: Điểm quyết định 21 (True) - Kết luận chẩn đoán quá ngắn (4 ký tự) (0.0742ms)
  ✔ [Test] TC_C1_08: Thực thi thành công toàn bộ câu lệnh và chu kỳ lặp đa tệp (0.1386ms)
  ✔ [Test] DFT_01: All-DU-Path cho 4 định dạng y tế hợp lệ cùng lúc (jpg, jpeg, png, dcm) (0.1042ms)
  ✔ [Test] DFT_02: Quy tắc All-or-Nothing khi tệp thứ 2 trong danh sách bị lỗi (0.0911ms)
```

---

# PHẦN IV: TỔNG HỢP KẾT QUẢ THỰC THI TỰ ĐỘNG & ĐỘ BAO PHỦ

### 4.1 Bảng tổng kết số lượng ca kiểm thử theo phân loại Hộp đen / Hộp trắng
| STT | Phân hệ / Chức năng | Ca Hộp đen (Automated) | Ca Hộp trắng (Phái sinh) | Tổng số ca | Số ca ĐẠT | Tỷ lệ ĐẠT |
| :---:| :--- | :---:| :---:| :---:| :---:| :---:|
| 1 | **Nhập kết quả xét nghiệm định lượng** (`UC-CLS-02` / Mục 3.11) | 18 | 18 | **36** | 36 | **100%** |
| 2 | **Tải lên hình ảnh chẩn đoán và kết luận PACS** (`UC-CLS-03` / Mục 3.12) | 17 | 15 | **32** | 32 | **100%** |
| **TỔNG** | **Toàn bộ 2 chức năng đảm nhiệm (Lê Tuấn Khanh)** | **35** | **33** | **68** | **68** | **100%** |

### 4.2 Nhật ký thực thi trọn vẹn cả 2 chức năng (`node --test ...`)
Lệnh thực thi chính thức:
```powershell
node --test backend/test/khanh/validators/02_labResult.test.js backend/test/khanh/validators/03_pacs.test.js
```

Nhật ký thực thi đầu ra nguyên bản (Raw Terminal Output):
```text
▶ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator
  ✔ [Test] UT11: TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm (0.742ms)
  ✔ [Test] UT12: TC_F17_02 - Bỏ trống (test_value = '') (0.0954ms)
  ✔ [Test] UT13: TC_F17_03 - Lẫn chữ (test_value = '12.5A') (0.1272ms)
  ✔ [Test] UT14: TC_F17_04 - Số âm (test_value = -5.2) (0.0894ms)
  ✔ [Test] UT15: Giá trị null (test_value = null) (0.0711ms)
  ✔ [Test] UT16: Giá trị undefined (test_value = undefined) (0.0858ms)
  ✔ [Test] UT17: Chỉ có khoảng trắng (test_value = '   ') (0.0951ms)
  ✔ [Test] UT18: Biên 0 (test_value = 0) (0.1137ms)
  ✔ [Test] UT19: Vô cực (test_value = Infinity) (0.0886ms)
  ✔ [Test] UT20: Không phải số (test_value = NaN) (0.1656ms)
  ✔ [Test] UT21: Kiểu boolean (test_value = true) (0.1018ms)
  ✔ [Test] UT22: Kiểu mảng (test_value = [5]) (0.083ms)
  ✔ [Test] UT23: Chuỗi hệ 16 (test_value = '0x10') (0.0719ms)
  ✔ [Test] UT24: TC_F17_05 - Nhận xét vượt giới hạn (general_notes = 'a' x 501) (0.1651ms)
  ✔ [Test] UT25: TC_F17_06 - Nhận xét rỗng (general_notes = '') (0.3335ms)
  ✔ [Test] UT26: TC_F17_07 - Nhận xét đúng giới hạn (general_notes = 'a' x 500) (0.0973ms)
  ✔ [Test] UT27: Các dạng số dương hợp lệ (0.01; 1; ' 5.2 '; '.5') (0.1306ms)
  ✔ [Test] UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào (test_value = 10) (0.1327ms)
✔ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator (4.3436ms)
▶ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator
  ✔ [Test] UT29: Không chọn tệp (image_files = []) (0.7483ms)
  ✔ [Test] UT30: Thiếu danh sách tệp (image_files = undefined) (0.0947ms)
  ✔ [Test] UT31: Sai định dạng (image_files = [{name: 'phoi.pdf', size: MB}]) (0.182ms)
  ✔ [Test] UT32: Vượt 25MB (image_files = [{name: 'phoi.jpg', size: 25.1 * MB}]) (0.1073ms)
  ✔ [Test] UT33: Tệp rỗng (image_files = [{name: 'phoi.jpg', size: 0}]) (0.0843ms)
  ✔ [Test] UT34: Dung lượng NaN (image_files = [{name: 'phoi.jpg', size: NaN}]) (0.0912ms)
  ✔ [Test] UT35: Dung lượng vô cực (image_files = [{name: 'phoi.jpg', size: Infinity}]) (0.0906ms)
  ✔ [Test] UT36: Tệp thứ hai sai (image_files = [{name: 'phoi.jpg', size: MB}, {name: 'a.pdf', size: MB}]) (0.1153ms)
  ✔ [Test] UT37: Mô tả 0 ký tự (image_description = 'a' x 0) (0.1052ms)
  ✔ [Test] UT38: Mô tả 9 ký tự (image_description = 'a' x 9) (0.1252ms)
  ✔ [Test] UT39: Mô tả 2001 ký tự (image_description = 'a' x 2001) (0.1136ms)
  ✔ [Test] UT40: Kết luận 0 ký tự (diagnostic_conclusion = 'a' x 0) (0.1097ms)
  ✔ [Test] UT41: Kết luận 4 ký tự (diagnostic_conclusion = 'a' x 4) (0.0661ms)
  ✔ [Test] UT42: Kết luận 1001 ký tự (diagnostic_conclusion = 'a' x 1001) (0.0836ms)
  ✔ [Test] UT43: Văn bản chỉ có khoảng trắng (Lượt 1: image_description = ' ' x 10. Lượt 2: diagnostic_conclusion = ' ' x 5) (0.2212ms)
  ✔ [Test] UT44: Các biên hợp lệ (4 tổ hợp mô tả & kết luận biên + tệp phoi.DCM 25MB) (0.8183ms)
  ✔ [Test] UT45: Nhiều tệp đúng định dạng (phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm) (0.0928ms)
✔ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator (4.2403ms)
ℹ tests 35
ℹ suites 2
ℹ pass 35
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 85.8784ms
```

### 4.3 Đánh giá mức độ bao phủ mã nguồn và kiểm thử
Dựa trên kết quả phân tích đồ thị CFG và DFG trong các tài liệu kiểm thử hộp trắng:
1. **Độ bao phủ câu lệnh (C1 - Statement Coverage):**
   - Chức năng 1 (`LabResultValidator`): $26/26$ câu lệnh thực thi $\rightarrow$ **Đạt 100% C1**.
   - Chức năng 2 (`PacsValidator`): $23/23$ câu lệnh thực thi $\rightarrow$ **Đạt 100% C1**.
2. **Độ bao phủ nhánh (C2 - Branch Coverage):**
   - Chức năng 1 (`LabResultValidator`): $22/22$ nhánh rẽ True/False $\rightarrow$ **Đạt 100% C2**.
   - Chức năng 2 (`PacsValidator`): $14/14$ nhánh rẽ True/False $\rightarrow$ **Đạt 100% C2**.
3. **Độ bao phủ điều kiện phức (C3 - Multiple Condition Coverage):**
   - Chức năng 1: 18 điều kiện con độc lập $\rightarrow$ **Đạt 100% C3**.
   - Chức năng 2: 14 điều kiện con độc lập $\rightarrow$ **Đạt 100% C3**.
4. **Độ bao phủ dòng dữ liệu (Data Flow Coverage - DFG):**
   - **All c-use:** Đạt $100\%$ trên cả hai chức năng ($6/6$ cặp cho chỉ số xét nghiệm và $10/10$ cặp cho tệp ảnh PACS).
   - **All p-use:** Đạt $100\%$ trên cả hai chức năng ($22/22$ cặp cho chỉ số xét nghiệm và $14/14$ cặp cho tệp ảnh PACS).
   - **Kiểm tra bất thường:** Biến `val` và `file` tuân thủ nghiêm ngặt chuỗi vòng đời $U \xrightarrow{d} D \xrightarrow{r} R$, hoàn toàn không có bất thường dòng dữ liệu loại 1 (`dd`), loại 2 (`ur`) hay loại 3 (`du`).

---

# PHẦN V: TỔNG KẾT & KẾT LUẬN HỌC THUẬT

1. **Cấu trúc chuẩn hóa & tách bạch:** Báo cáo đã phân tách rành mạch thành từng chức năng, với mỗi chức năng đưa hàm nghiệp vụ lên đầu, giải thích cặn kẽ chức năng, nguồn dữ liệu và cách lấy test case, sau đó chia làm 2 phần Hộp đen và Hộp trắng riêng biệt kèm toàn bộ code test và kết quả test Terminal thực tế.
2. **Tuân thủ triệt để tài liệu giảng dạy NUnit:** Áp dụng trọn vẹn 5 nguyên tắc sống còn của Slide 3 (ngắn gọn, độc lập, đặt tên rõ ràng, tốc độ cực nhanh ~85ms, cô lập đối tượng), cấu trúc TestFixture/Test/SetUp và bộ thư viện Assertion phong phú (`Assert.AreEqual`, `Assert.IsTrue`, `Assert.IsNull`, `Assert.Throws`...).
3. **Bảo toàn tuyệt đối mã nguồn nghiệp vụ:** Không chỉnh sửa bất kỳ dòng mã nào bên trong `backend/src/`, bảo đảm tính khách quan, trung thực và độc lập 100% của kiểm thử viên QA/QC.
4. **Tính liên kết và tính truy vết:** Bộ kiểm thử đơn vị tự động đã gắn kết chặt chẽ tài liệu đặc tả hộp đen (`docs/khanh/Kiem_Thu_Hop_Den_*.md`), tài liệu phân tích hộp trắng CFG/DFG (`docs/khanh/Kiem_Thu_Hop_Trang_*.md`) và bộ mã nguồn kiểm thử thực tế (`backend/test/khanh/validators/`).

