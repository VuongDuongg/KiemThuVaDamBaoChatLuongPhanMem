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

describe("BỘ KIỂM THỬ HỘP ĐEN - THÀNH VIÊN 4: CẬN LÂM SÀNG & PACS (10 TEST CASES)", () => {
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

  test("TC01 [EP]: Lấy danh mục dịch vụ cận lâm sàng -> Trả về danh sách dịch vụ Lab và PACS", async () => {
    const res = await request("GET", "/api/lab/services");
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.data.length >= 6);
  });

  test("TC02 [EP]: Lấy danh sách hàng đợi chỉ định cận lâm sàng -> Mã 200", async () => {
    const res = await request("GET", "/api/lab/orders");
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  test("TC03 [EP]: Tạo chỉ định cận lâm sàng hợp lệ -> Sinh phiếu chỉ định và hóa đơn thu tiền", async () => {
    const res = await request("POST", "/api/lab/orders", {
      patient_code: "BN000003",
      patient_name: "Lê Hoàng Long",
      doctor: "BS. Lê Thị Dung",
      service_code: "CLS_XQUANG_PHOI",
      consultation_id: 2
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.data.service_code, "CLS_XQUANG_PHOI");
    assert.equal(res.body.data.status, "PENDING");
  });

  test("TC04 [EP]: Tạo chỉ định với mã dịch vụ không tồn tại -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/lab/orders", {
      patient_code: "BN000003",
      service_code: "CLS_KHONG_TON_TAI_XYZ"
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /không tồn tại/);
  });

  test("TC05 [EP]: KTV tiếp nhận bắt đầu thực hiện ca chỉ định -> Chuyển trạng thái sang PROCESSING", async () => {
    const res = await request("POST", "/api/lab/orders/3/start", {
      technician: "KTV. Đặng Quốc Việt"
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.status, "PROCESSING");
    assert.equal(res.body.data.technician, "KTV. Đặng Quốc Việt");
  });

  test("TC06 [EP]: Tiếp nhận ca chỉ định không tồn tại (ID 99999) -> Báo lỗi 404", async () => {
    const res = await request("POST", "/api/lab/orders/99999/start", {});
    assert.equal(res.statusCode, 404);
  });

  test("TC07 [EP]: Nhập kết quả và hoàn tất ca chỉ định -> Chuyển trạng thái COMPLETED và đồng bộ về EMR", async () => {
    const res = await request("POST", "/api/lab/orders/2/results", {
      results: {
        conclusion: "Các chỉ số huyết học trong giới hạn ổn định, không có bất thường."
      }
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.status, "PENDING_APPROVAL");
    const approved = await request("POST", "/api/lab/orders/2/approve", {
      approved_by: "BS. Phụ trách xét nghiệm"
    });
    assert.equal(approved.statusCode, 200);
    assert.equal(approved.body.data.status, "COMPLETED");
  });

  test("TC08 [EP]: Nhập kết quả rỗng (không có chỉ số và không có kết luận) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/lab/orders/2/results", {});
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Vui lòng nhập kết quả/);
  });

  test("TC09 [EP]: Lọc danh sách chỉ định theo loại dịch vụ PACS -> Chỉ trả về các dịch vụ hình ảnh", async () => {
    const res = await request("GET", "/api/lab/orders?type=PACS");
    assert.equal(res.statusCode, 200);
    const allPacs = res.body.data.every((o) => o.type === "PACS");
    assert.ok(allPacs);
  });

  test("TC10 [EP]: Lọc danh sách chỉ định theo trạng thái COMPLETED -> Chỉ trả về các ca đã hoàn tất", async () => {
    const res = await request("GET", "/api/lab/orders?status=COMPLETED");
    assert.equal(res.statusCode, 200);
    const allCompleted = res.body.data.every((o) => o.status === "COMPLETED");
    assert.ok(allCompleted);
  });
});
