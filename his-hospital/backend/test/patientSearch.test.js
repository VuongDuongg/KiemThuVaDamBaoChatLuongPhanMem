import test, { describe, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import http from "node:http";

let server;
let baseUrl = "";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${baseUrl}${path}`;
    const req = http.get(fullUrl, (res) => {
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: rawData });
        }
      });
    });
    req.on("error", reject);
  });
}

describe("BỘ KIỂM THỬ HỘP ĐEN - TÌM KIẾM VÀ LỌC BỆNH NHÂN (25 TEST CASES)", () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // --- Nhóm 1: Kiểm thử Họ và tên (EP & BVA) ---
  test("TC01 [EP]: Tìm kiếm để trống toàn bộ -> Trả về danh sách mặc định hôm nay", async () => {
    const res = await makeRequest("/api/patients/search");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });

  test("TC02 [EP]: Tìm theo Họ tên hợp lệ ('Nguyễn Văn An')", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("Nguyễn Văn An"));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.some((p) => p.name === "Nguyễn Văn An"));
  });

  test("TC03 [BVA]: Họ tên tại biên dưới (2 ký tự: 'An')", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("An"));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length > 0);
  });

  test("TC04 [BVA]: Họ tên dưới biên dưới (1 ký tự: 'A') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?name=A");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.name, "Họ tên phải có độ dài từ 2 đến 50 ký tự");
  });

  test("TC05 [BVA]: Họ tên tại biên trên (50 ký tự)", async () => {
    const name50 = "Nguyễn Thị Phương Thảo Lê Hoàng Mai Lan Đỗ Cúc Hoa"; // 50 ký tự
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent(name50));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
  });

  test("TC06 [BVA]: Họ tên vượt biên trên (51 ký tự) -> Báo lỗi", async () => {
    const name51 = "A".repeat(51);
    const res = await makeRequest("/api/patients/search?name=" + name51);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.name, "Họ tên không được vượt quá 50 ký tự");
  });

  test("TC07 [EP]: Họ tên chứa số ('Trần Văn 2') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("Trần Văn 2"));
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.name, "Họ tên không được chứa chữ số");
  });

  test("TC08 [EP]: Họ tên chứa ký tự đặc biệt ('Lê@Khanh!') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("Lê@Khanh!"));
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.name, "Họ tên không được chứa ký tự đặc biệt");
  });

  test("TC09 [EP]: Họ tên chỉ gồm khoảng trắng -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("   "));
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.name, "Từ khóa tìm kiếm không hợp lệ");
  });

  // --- Nhóm 2: Kiểm thử Số CCCD (EP & BVA) ---
  test("TC10 [BVA]: Tìm theo CCCD đúng 12 số ('001203001234')", async () => {
    const res = await makeRequest("/api/patients/search?identity_card_number=001203001234");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.total, 1);
    assert.equal(res.body.data[0].identity_card_number, "001203001234");
  });

  test("TC11 [BVA]: CCCD thiếu số (11 số: '00120300123') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?identity_card_number=00120300123");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.identity_card_number, "Số CCCD phải gồm đúng 12 chữ số");
  });

  test("TC12 [BVA]: CCCD thừa số (13 số: '0012030012345') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?identity_card_number=0012030012345");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.identity_card_number, "Số CCCD phải gồm đúng 12 chữ số");
  });

  test("TC13 [EP]: CCCD chứa chữ cái ('00120300123a') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?identity_card_number=00120300123a");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.identity_card_number, "Số CCCD chỉ được nhập ký tự số");
  });

  // --- Nhóm 3: Kiểm thử Số điện thoại (EP & BVA) ---
  test("TC14 [EP]: SĐT hợp lệ 10 số đầu 09 ('0987654321')", async () => {
    const res = await makeRequest("/api/patients/search?phone=0987654321");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.total, 1);
    assert.equal(res.body.data[0].phone, "0987654321");
  });

  test("TC15 [BVA]: SĐT thiếu chữ số (9 số: '098765432') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?phone=098765432");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.phone, "Số điện thoại phải gồm đúng 10 chữ số");
  });

  test("TC16 [EP]: SĐT sai đầu số mạng ('0123456789') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?phone=0123456789");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.phone, "Đầu số điện thoại không hợp lệ (hỗ trợ: 03, 05, 07, 08, 09)");
  });

  test("TC17 [EP]: SĐT không bắt đầu bằng số 0 ('9876543210') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?phone=9876543210");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.phone, "Số điện thoại phải bắt đầu bằng chữ số 0");
  });

  // --- Nhóm 4: Kiểm thử Mã bệnh nhân (EP) ---
  test("TC18 [EP]: Mã bệnh nhân đúng định dạng ('BN000001')", async () => {
    const res = await makeRequest("/api/patients/search?patient_code=BN000001");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.total, 1);
    assert.equal(res.body.data[0].patient_code, "BN000001");
  });

  test("TC19 [EP]: Mã bệnh nhân sai tiền tố hoặc độ dài ('AB000001') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?patient_code=AB000001");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.patient_code, "Mã bệnh nhân phải có định dạng BNxxxxxx (VD: BN000123)");
  });

  // --- Nhóm 5: Kiểm thử Thời gian (EP & BVA) ---
  test("TC20 [EP]: Từ ngày lớn hơn Đến ngày -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?from_date=20/01/2024&to_date=15/01/2024");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.date_range, "Từ ngày không được lớn hơn Đến ngày");
  });

  test("TC21 [BVA]: Đến ngày vượt quá ngày hiện tại -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?to_date=01/01/2099");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.to_date, "Thời gian tìm kiếm không được vượt quá ngày hiện tại");
  });

  test("TC22 [EP]: Nhập ngày không có trên lịch ('31/02/2026') -> Báo lỗi", async () => {
    const res = await makeRequest("/api/patients/search?from_date=31/02/2026");
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.errors.from_date, "Ngày tháng không hợp lệ (định dạng DD/MM/YYYY)");
  });

  // --- Nhóm 6: Kết hợp tiêu chí & Xử lý không tìm thấy (EP) ---
  test("TC23 [EP]: Kết hợp nhiều tiêu chí hợp lệ (Họ tên 'An' + Khoa 'Khoa Nội' + Trạng thái 'Chờ khám')", async () => {
    const path = `/api/patients/search?name=${encodeURIComponent("An")}&department=${encodeURIComponent("Khoa Nội")}&status=${encodeURIComponent("Chờ khám")}`;
    const res = await makeRequest(path);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.every((p) => p.name.includes("An") && p.department === "Khoa Nội" && p.status === "Chờ khám"));
  });

  test("TC24 [EP]: Tìm kiếm không có dữ liệu ('Không Tồn Tại Xyz') -> Trả về danh sách rỗng", async () => {
    const res = await makeRequest("/api/patients/search?name=" + encodeURIComponent("Không Tồn Tại Xyz"));
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.total, 0);
    assert.deepEqual(res.body.data, []);
  });

  test("TC25 [EP]: Đặt lại bộ lọc (Reset) -> Tải lại danh sách bệnh nhân ban đầu", async () => {
    const res = await makeRequest("/api/patients/search");
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.data.length > 0);
  });
});
