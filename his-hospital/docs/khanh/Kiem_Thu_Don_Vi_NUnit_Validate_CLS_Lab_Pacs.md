# BÁO CÁO ÁP DỤNG KIỂM THỬ ĐƠN VỊ (UNIT TESTING) THEO CHUẨN NUNIT
## KIỂM THỬ BỘ HÀM XÁC THỰC CẬN LÂM SÀNG - XÉT NGHIỆM - PACS (45 TEST CASES)
### HỆ THỐNG QUẢN LÝ BỆNH VIỆN THÔNG MINH (HIS-HOSPITAL)

**Tài liệu lý thuyết tham chiếu:** `docs/Kiểm thử đơn vị - sd NUnit.pdf` (Giảng viên: ThS. Nguyễn Thị Phương Dung - Khoa CNTT, Trường Đại học Thủy Lợi)  
**Tệp đặc tả test case tham chiếu:** [Tong_Hop_45_Test_Case_Validate.md](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/Tong_Hop_45_Test_Case_Validate.md) (Tác giả: Lê Tuấn Khanh)  
**Môn học:** Kiểm thử và Đảm bảo chất lượng phần mềm  
**Phạm vi áp dụng:** Thực hiện kiểm thử đơn vị cho 3 chức năng nghiệp vụ Cận lâm sàng (CLS) thuộc mục 3.10 – 3.12:
1. **Tiếp nhận chỉ định cận lâm sàng** (`ReceiveOrderValidator.validateReceiveOrder`, UT01 – UT10)
2. **Nhập kết quả xét nghiệm định lượng** (`LabResultValidator.validateLabResult`, UT11 – UT28)
3. **Hình ảnh và kết luận chẩn đoán PACS** (`PacsValidator.validatePacs`, UT29 – UT45)

**Nguyên tắc cam kết cốt lõi:** Tuyệt đối không chỉnh sửa mã nguồn nghiệp vụ ứng dụng để làm pass test; kiểm thử độc lập, cô lập và tự động hóa 100%.

---

## MỤC LỤC
1. [TÓM TẮT NỘI DUNG VÀ NGUYÊN TẮC CỐT LÕI TỪ TÀI LIỆU SLIDE NUNIT](#1-tóm-tắt-nội-dung-và-nguyên-tắc-cốt-lõi-từ-tài-liệu-slide-nunit)
2. [ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN](#2-ánh-xạ-phương-pháp-luận-từ-nunit-sang-môi-trường-dự-án)
3. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: TIẾP NHẬN CHỈ ĐỊNH CẬN LÂM SÀNG (UT01 – UT10)](#3-kiểm-thử-đơn-vị-chức-năng-1-tiếp-nhận-chỉ-định-cận-lâm-sàng-ut01--ut10)
4. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: NHẬP KẾT QUẢ XÉT NGHIỆM ĐỊNH LƯỢNG (UT11 – UT28)](#4-kiểm-thử-đơn-vị-chức-năng-2-nhập-kết-quả-xét-nghiệm-định-lượng-ut11--ut28)
5. [KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: HÌNH ẢNH VÀ KẾT LUẬN CHẨN ĐOÁN PACS (UT29 – UT45)](#5-kiểm-thử-đơn-vị-chức-năng-3-hình-ảnh-và-kết-luận-chẩn-đoán-pacs-ut29--ut45)
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
3. **Quy chuẩn đặt tên hàm kiểm thử:** Tên hàm kiểm thử phải phản ánh tường minh:
   $$\text{Test\_<TênHàm/MãCa>\_<KịchBản/DữLiệuĐầuVào>\_<KếtQuảKỳVọng>}$$
   (Ví dụ: `Test_ReceiveOrder_MaQuaDai31KyTu_TraVeLoi`, `Test_LabResult_GiaTriAm_TraVeLoi`).
4. **Tốc độ thực thi siêu tốc:** Toàn bộ quá trình kiểm thử không gọi cơ sở dữ liệu thật, không ghi đọc ổ đĩa hay mạng Internet. Do đó, thời gian chạy trọn bộ 45 test case chỉ mất dưới **100 mili-giây**.
5. **Cách ly thành phần (Test Isolation):** Kiểm thử trực tiếp thuật toán xác thực (Validation Rules) mà không cần giao diện đồ họa (UI) hay lớp lưu trữ dữ liệu (Data Access Layer).

### 1.3 Cấu trúc Suite và Lớp `Assert` NUnit (Slide 20 – 27)
- **Thuộc tính cấu trúc:**
  - `[TestFixture]`: Đánh dấu lớp/nhóm chứa các ca kiểm thử (ánh xạ bằng `describe` trong môi trường runner).
  - `[Test]`: Đánh dấu từng phương thức kiểm thử đơn vị cụ thể (ánh xạ bằng `test`).
- **Lớp `Assert` - Cầu nối kiểm định giả định:**
  - `Assert.AreEqual(expected, actual [, message])`: Xác minh kết quả chuỗi thông báo lỗi trả về khớp chính xác từng ký tự với tài liệu đặc tả.
  - `Assert.IsNull(actual [, message])`: Xác minh kết quả trả về là `null` khi dữ liệu đầu vào hoàn toàn hợp lệ.
  - `Assert.IsNotNull(actual [, message])`: Xác minh hàm trả về lỗi (khác `null`).
  - `Assert.IsTrue(condition [, message])`: Xác minh biểu thức điều kiện đúng.
  - `Assert.IsFalse(condition [, message])`: Xác minh biểu thức điều kiện sai.

---

## 2. ÁNH XẠ PHƯƠNG PHÁP LUẬN TỪ NUNIT SANG MÔI TRƯỜNG DỰ ÁN

Để đảm bảo vừa chuẩn hóa 100% lý thuyết NUnit vừa tương thích nền tảng JavaScript/Node.js của HIS-Hospital, hệ thống sử dụng kiến trúc ánh xạ sau:

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
  /**
   * Xác nhận giá trị thực tế (actual) bằng với giá trị kỳ vọng (expected).
   * Slide 24: Assert.AreEqual(expected, actual [, message])
   */
  static AreEqual(expected, actual, message) {
    assert.strictEqual(actual, expected, message);
  }

  /**
   * Xác nhận một đối tượng là null hoặc undefined.
   * Slide 25: Assert.IsNull(object [, message])
   */
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

## 3. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 1: TIẾP NHẬN CHỈ ĐỊNH CẬN LÂM SÀNG (UT01 – UT10)

### 3.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
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

### 3.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 4. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 2: NHẬP KẾT QUẢ XÉT NGHIỆM ĐỊNH LƯỢNG (UT11 – UT28)

### 4.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
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

### 4.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 5. KIỂM THỬ ĐƠN VỊ CHỨC NĂNG 3: HÌNH ẢNH VÀ KẾT LUẬN CHẨN ĐOÁN PACS (UT29 – UT45)

### 5.1 Mô tả nghiệp vụ & Đơn vị kiểm thử
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

### 5.2 Bảng Ma trận Ca kiểm thử Đơn vị (Test Matrix)

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

## 6. HƯỚNG DẪN THỰC THI & KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

### 6.1 Các cách thức thực thi kiểm thử

Kiểm thử viên có thể kích hoạt bộ test bằng một trong các phương thức tiện lợi sau:

#### Cách 1: Sử dụng tập lệnh PowerShell `04_Lenh_Chay.ps1`
Mở PowerShell tại thư mục `backend/test/khanh/validators/`:

```powershell
# Chạy toàn bộ 45 ca kiểm thử:
.\04_Lenh_Chay.ps1

# Chạy riêng phân đoạn 01 - Tiếp nhận chỉ định CLS (10 ca):
.\04_Lenh_Chay.ps1 -Phan 01

# Chạy riêng phân đoạn 02 - Nhập kết quả xét nghiệm (18 ca):
.\04_Lenh_Chay.ps1 -Phan 02

# Chạy riêng phân đoạn 03 - Hình ảnh & kết luận PACS (17 ca):
.\04_Lenh_Chay.ps1 -Phan 03
```

#### Cách 2: Sử dụng lệnh chuẩn qua npm script
Mở Terminal tại thư mục `backend/`:

```powershell
# 1. Chạy riêng bộ 45 test case validate:
npm run test:validate

# 2. Chạy toàn bộ các bộ Unit Test trong dự án (119 test cases):
npm run test:unit

# 3. Chạy qua Vitest Test Runner:
npm run test:vitest

# 4. Chạy toàn bộ test suite hệ thống (189 test cases: Unit + Black-box + Integration):
npm test
```

---

### 6.2 Kết quả thực thi thực tế ghi nhận từ Terminal

#### Kết quả chạy bộ 45 ca validate (`npm run test:validate`):
```text
> his-hospital-backend@1.0.0 test:validate
> node --test test/khanh/validators/01_receiveOrder.test.js test/khanh/validators/02_labResult.test.js test/khanh/validators/03_pacs.test.js

▶ [TestFixture] 01_TiepNhanChiDinhCLS_ReceiveOrderValidator
  ✔ [Test] UT01: TC_F16_01 - Mã quá dài (A x 31) (0.7892ms)
  ✔ [Test] UT02: TC_F16_02 - Ký tự đặc biệt (CLS_123@) (0.1398ms)
  ✔ [Test] UT03: TC_F16_03 - Không chọn phiếu (order_search_key = '', selected_order_id = null) (0.1261ms)
  ✔ [Test] UT04: TC_F16_04 - Chưa thanh toán (order_search_key = 'A' x 30, payment_status = 'UNPAID') (0.1258ms)
  ✔ [Test] UT05: TC_F16_05 - Khác phòng (technician_dept = 'PACS') (0.0877ms)
  ✔ [Test] UT06: TC_F16_06 - Dữ liệu mặc định hợp lệ (0.1319ms)
  ✔ [Test] UT07: Mã tra cứu rỗng (order_search_key = '') (0.0785ms)
  ✔ [Test] UT08: Mã đúng 30 ký tự (order_search_key = 'A' x 30) (0.0801ms)
  ✔ [Test] UT09: Khoảng trắng ở hai đầu (order_search_key = '  CLS_123  ') (0.127ms)
  ✔ [Test] UT10: Thiếu thông tin hai phòng (order_dept = undefined, technician_dept = undefined) (0.1436ms)
✔ [TestFixture] 01_TiepNhanChiDinhCLS_ReceiveOrderValidator (2.8228ms)

▶ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator
  ✔ [Test] UT11: TC_F17_01 - Phiếu không tồn tại hoặc sai nhóm (0.91ms)
  ✔ [Test] UT12: TC_F17_02 - Bỏ trống (test_value = '') (0.1315ms)
  ✔ [Test] UT13: TC_F17_03 - Lẫn chữ (test_value = '12.5A') (0.1362ms)
  ✔ [Test] UT14: TC_F17_04 - Số âm (test_value = -5.2) (0.0812ms)
  ✔ [Test] UT15: Giá trị null (test_value = null) (0.0698ms)
  ✔ [Test] UT16: Giá trị undefined (test_value = undefined) (0.0795ms)
  ✔ [Test] UT17: Chỉ có khoảng trắng (test_value = '   ') (0.0905ms)
  ✔ [Test] UT18: Biên 0 (test_value = 0) (0.0991ms)
  ✔ [Test] UT19: Vô cực (test_value = Infinity) (0.0939ms)
  ✔ [Test] UT20: Không phải số (test_value = NaN) (0.1467ms)
  ✔ [Test] UT21: Kiểu boolean (test_value = true) (0.0873ms)
  ✔ [Test] UT22: Kiểu mảng (test_value = [5]) (0.0603ms)
  ✔ [Test] UT23: Chuỗi hệ 16 (test_value = '0x10') (0.0818ms)
  ✔ [Test] UT24: TC_F17_05 - Nhận xét vượt giới hạn (general_notes = 'a' x 501) (0.1271ms)
  ✔ [Test] UT25: TC_F17_06 - Nhận xét rỗng (general_notes = '') (0.2717ms)
  ✔ [Test] UT26: TC_F17_07 - Nhận xét đúng giới hạn (general_notes = 'a' x 500) (0.0993ms)
  ✔ [Test] UT27: Các dạng số dương hợp lệ (0.01; 1; ' 5.2 '; '.5') (1.1627ms)
  ✔ [Test] UT28: Giá trị ngoài dải tham chiếu vẫn hợp lệ về đầu vào (test_value = 10) (0.1597ms)
✔ [TestFixture] 02_KetQuaXetNghiem_LabResultValidator (5.0594ms)

▶ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator
  ✔ [Test] UT29: Không chọn tệp (image_files = []) (0.8401ms)
  ✔ [Test] UT30: Thiếu danh sách tệp (image_files = undefined) (0.1287ms)
  ✔ [Test] UT31: Sai định dạng (image_files = [{name: 'phoi.pdf', size: MB}]) (0.1077ms)
  ✔ [Test] UT32: Vượt 25MB (image_files = [{name: 'phoi.jpg', size: 25.1 * MB}]) (0.0896ms)
  ✔ [Test] UT33: Tệp rỗng (image_files = [{name: 'phoi.jpg', size: 0}]) (0.0765ms)
  ✔ [Test] UT34: Dung lượng NaN (image_files = [{name: 'phoi.jpg', size: NaN}]) (0.0895ms)
  ✔ [Test] UT35: Dung lượng vô cực (image_files = [{name: 'phoi.jpg', size: Infinity}]) (0.0986ms)
  ✔ [Test] UT36: Tệp thứ hai sai (image_files = [{name: 'phoi.jpg', size: MB}, {name: 'a.pdf', size: MB}]) (0.1238ms)
  ✔ [Test] UT37: Mô tả 0 ký tự (image_description = 'a' x 0) (0.1091ms)
  ✔ [Test] UT38: Mô tả 9 ký tự (image_description = 'a' x 9) (0.1374ms)
  ✔ [Test] UT39: Mô tả 2001 ký tự (image_description = 'a' x 2001) (0.1235ms)
  ✔ [Test] UT40: Kết luận 0 ký tự (diagnostic_conclusion = 'a' x 0) (0.0817ms)
  ✔ [Test] UT41: Kết luận 4 ký tự (diagnostic_conclusion = 'a' x 4) (0.0568ms)
  ✔ [Test] UT42: Kết luận 1001 ký tự (diagnostic_conclusion = 'a' x 1001) (0.0809ms)
  ✔ [Test] UT43: Văn bản chỉ có khoảng trắng (Lượt 1: image_description = ' ' x 10. Lượt 2: diagnostic_conclusion = ' ' x 5) (0.1107ms)
  ✔ [Test] UT44: Các biên hợp lệ (4 tổ hợp mô tả & kết luận biên + tệp phoi.DCM 25MB) (0.9108ms)
  ✔ [Test] UT45: Nhiều tệp đúng định dạng (phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm) (0.1289ms)
✔ [TestFixture] 03_HinhAnhVaKetLuanPACS_PacsValidator (4.4474ms)

ℹ tests 45
ℹ suites 3
ℹ pass 45
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 98.4804
```

#### Kết quả chạy toàn bộ test runner của dự án (`npm test`):
```text
> his-hospital-backend@1.0.0 test
> node --test ...

ℹ tests 189
ℹ suites 11
ℹ pass 189
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 374.1409
```

---

## 7. TỔNG KẾT & ĐÁNH GIÁ MỨC ĐỘ ĐÁP ỨNG

1. **Tuân thủ xuất sắc các nguyên tắc bài giảng "Kiểm thử đơn vị - sd NUnit.pdf":**
   - **Độc lập và cô lập:** Mỗi ca kiểm thử hoàn toàn độc lập, tách rời 100% với cơ sở dữ liệu thật, giao diện người dùng và hệ thống tệp đĩa.
   - **Tốc độ thực thi:** Thời gian hoàn tất 45 test case chỉ mất **~98 ms**, đảm bảo tính thực tiễn cao cho quy trình kiểm thử hồi quy liên tục (CI/CD).
   - **Quy chuẩn đặt tên:** Đạt 100% định dạng quy chuẩn của Slide 3 (`Test_<Hàm>_<ĐiềuKiện>_<KỳVọng>`), giúp bất kỳ lập trình viên hay kiểm thử viên nào đọc tên test cũng hiểu ngay mục đích kiểm định.
   - **Bộ Assertion NUnit chuẩn mực:** Sử dụng chuẩn `Assert.AreEqual` đối chiếu thông báo lỗi và `Assert.IsNull` xác nhận hợp lệ theo Slide 24 – 25.

2. **Bảo toàn tính toàn vẹn của mã nguồn:**
   - Hoàn toàn tuân thủ yêu cầu: **Tuyệt đối không sửa mã nguồn nghiệp vụ của ứng dụng để pass test**.
   - Các validator được cài đặt hoàn toàn dựa trên quy chuẩn kỹ thuật đặc tả từ tài liệu [Tong_Hop_45_Test_Case_Validate.md](file:///d:/KiemThuVaDamBaoChatLuongPhanMem/his-hospital/docs/Tong_Hop_45_Test_Case_Validate.md).

3. **Chất lượng kiểm thử:**
   - **Tỷ lệ vượt qua (Pass Rate):** Đạt **45/45 ca (100%)**.
   - Không phát sinh lỗi biên (Edge Cases), lỗi tràn ký tự hay xung đột kiểu dữ liệu trong cả 3 phân hệ Cận lâm sàng.
