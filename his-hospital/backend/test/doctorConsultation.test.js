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

describe("BỘ KIỂM THỬ HỘP ĐEN - THÀNH VIÊN 3: BÁC SĨ & BỆNH ÁN EMR (10 TEST CASES)", () => {
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

  test("TC01 [EP]: Lấy danh sách hồ sơ bệnh án EMR -> Mã 200", async () => {
    const res = await request("GET", "/api/consultations");
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.data));
  });

  test("TC02 [EP]: Bác sĩ lưu hồ sơ khám bệnh hợp lệ (Đầy đủ sinh hiệu, ICD-10) -> Tạo thành công", async () => {
    const res = await request("POST", "/api/consultations", {
      patient_code: "BN000004",
      patient_name: "Phạm Thị Dung",
      doctor: "BS. Hoàng Thu Trang",
      department: "Khoa Sản",
      vitals: { blood_pressure: "110/70", pulse: 75, temperature: 36.6, spo2: 99 },
      symptoms: "Khám thai định kỳ 24 tuần, thai máy tốt",
      icd10_code: "Z34.0",
      icd10_name: "Giám sát thai nghén bình thường"
    });
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.data.icd10_code, "Z34.0");
  });

  test("TC03 [EP]: Thiếu triệu chứng hoặc mã ICD-10 khi lưu bệnh án -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations", {
      patient_code: "BN000005",
      patient_name: "Vũ Minh Quân",
      vitals: { blood_pressure: "120/80" }
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Vui lòng nhập đầy đủ/);
  });

  test("TC04 [BVA]: Thân nhiệt dưới ngưỡng sinh lý (<34.0°C: 32.5°C) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations", {
      patient_code: "BN000005",
      symptoms: "Hạ thân nhiệt",
      icd10_code: "T68",
      vitals: { temperature: 32.5 }
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Thân nhiệt không hợp lệ/);
  });

  test("TC05 [BVA]: Thân nhiệt vượt ngưỡng sinh lý (>43.0°C: 44.2°C) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations", {
      patient_code: "BN000005",
      symptoms: "Sốt cực cao",
      icd10_code: "R50.9",
      vitals: { temperature: 44.2 }
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /Thân nhiệt không hợp lệ/);
  });

  test("TC06 [BVA]: Chỉ số SpO2 vượt quá 100% (105%) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations", {
      patient_code: "BN000005",
      symptoms: "Khó thở",
      icd10_code: "R06.0",
      vitals: { spo2: 105 }
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /SpO2 phải từ 50% đến 100%/);
  });

  test("TC07 [EP]: Kê đơn thuốc hợp lệ với thuốc có sẵn trong kho -> Hoàn tất kê đơn và sinh hóa đơn tiền thuốc", async () => {
    const res = await request("POST", "/api/consultations/1/prescribe", {
      items: [
        { medicine_code: "MED001", medicine_name: "Paracetamol 500mg", quantity: 5, dosage: "Uống 1 viên khi sốt" }
      ]
    });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.status, "COMPLETED");
  });

  test("TC08 [EP]: Kê đơn thuốc rỗng (không có loại thuốc nào) -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations/1/prescribe", {
      items: []
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /phải có ít nhất một loại thuốc/);
  });

  test("TC09 [BVA]: Kê đơn thuốc với số lượng bằng 0 -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations/1/prescribe", {
      items: [
        { medicine_code: "MED001", quantity: 0, dosage: "Uống 1 viên" }
      ]
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /phải là số nguyên dương/);
  });

  test("TC10 [BVA]: Kê số lượng thuốc vượt quá số lượng tồn kho -> Báo lỗi 400", async () => {
    const res = await request("POST", "/api/consultations/1/prescribe", {
      items: [
        { medicine_code: "MED005", quantity: 9999, dosage: "Uống 1 chai" }
      ]
    });
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /trong kho không đủ/);
  });
});
