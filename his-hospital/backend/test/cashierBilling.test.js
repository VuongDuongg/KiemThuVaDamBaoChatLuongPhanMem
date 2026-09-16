import test, { describe, before, after } from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";
import http from "node:http";

let server;
let baseUrl = "";

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${baseUrl}${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let rawData = "";
      res.on("data", (chunk) => (rawData += chunk));
      res.on("end", () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(rawData) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: rawData });
        }
      });
    });

    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

describe("BỘ KIỂM THỬ HỘP ĐEN - THÀNH VIÊN 2: THU NGÂN & DƯỢC (10 TEST CASES)", () => {
  before(() => {
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test("TC01 [EP]: Lấy danh sách hóa đơn mặc định -> Trả về danh sách và mã 200", async () => {
    const res = await request("GET", "/api/invoices");
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test("TC02 [EP]: Lập hóa đơn hợp lệ (Tổng tiền 200.000, Giảm trừ 40.000) -> Thành công, Thực thu 160.000", async () => {
    const res = await request("POST", "/api/invoices", {
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      item_type: "TIEN_KHAM",
      description: "Khám bệnh",
      total_amount: 200000,
      insurance_discount: 40000
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.data.patient_pay, 160000);
    assert.equal(res.body.data.status, "UNPAID");
  });

  test("TC03 [BVA]: Lập hóa đơn với tổng số tiền = 0 -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/invoices", {
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      item_type: "TIEN_KHAM",
      total_amount: 0
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /phải lớn hơn 0/);
  });

  test("TC04 [BVA]: Giảm trừ bảo hiểm vượt quá tổng tiền hóa đơn -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/invoices", {
      patient_code: "BN000001",
      patient_name: "Nguyễn Văn An",
      item_type: "TIEN_KHAM",
      total_amount: 100000,
      insurance_discount: 150000
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /không hợp lệ/);
  });

  test("TC05 [EP]: Thanh toán hóa đơn bằng phương thức hợp lệ (VIETQR) -> Trạng thái chuyển PAID", async () => {
    const res = await request("POST", "/api/invoices/3/pay", {
      payment_method: "VIETQR"
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.status, "PAID");
    assert.equal(res.body.data.payment_method, "VIETQR");
  });

  test("TC06 [EP]: Thanh toán bằng phương thức không hợp lệ (VÍ BITCOIN) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/invoices/4/pay", {
      payment_method: "BITCOIN"
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Phương thức thanh toán không hợp lệ/);
  });

  test("TC07 [EP]: Thanh toán lại hóa đơn đã thanh toán trước đó -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/invoices/1/pay", {
      payment_method: "TIEN_MAT"
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /đã được thanh toán/);
  });

  test("TC08 [EP]: Tra cứu danh mục thuốc trong kho -> Trả về danh sách thuốc", async () => {
    const res = await request("GET", "/api/medicines");
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.data.length > 0);
  });

  test("TC09 [BVA]: Thêm thuốc vào kho với số lượng tồn âm (-5) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/medicines", {
      medicine_name: "Thuốc Test",
      unit: "Viên",
      unit_price: 5000,
      stock_quantity: -5
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /không được là số âm/);
  });

  test("TC10 [BVA]: Thêm thuốc vào kho với đơn giá = 0 -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/medicines", {
      medicine_name: "Thuốc Test 2",
      unit: "Viên",
      unit_price: 0,
      stock_quantity: 100
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /phải lớn hơn 0/);
  });
});
