/**
 * Test suite cho 01. Tiếp nhận chỉ định cận lâm sàng (UT01 -> UT10)
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { ReceiveOrderValidator } from "./01_receiveOrder.validator.js";

describe("[TestFixture] 01_TiepNhanChiDinhCLS_ReceiveOrderValidator", () => {
  // UT01: TC_F16_01 — Mã quá dài
  test("[Test] UT01: TC_F16_01 - Mã quá dài (A x 31)", () => {
    const input = { order_search_key: "A".repeat(31) };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt).",
      actual
    );
  });

  // UT02: TC_F16_02 — Ký tự đặc biệt
  test("[Test] UT02: TC_F16_02 - Ký tự đặc biệt (CLS_123@)", () => {
    const input = { order_search_key: "CLS_123@" };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Mã tra cứu không hợp lệ (tối đa 30 ký tự, không chứa ký tự đặc biệt).",
      actual
    );
  });

  // UT03: TC_F16_03 — Không chọn phiếu
  test("[Test] UT03: TC_F16_03 - Không chọn phiếu (order_search_key = '', selected_order_id = null)", () => {
    const input = { order_search_key: "", selected_order_id: null };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Vui lòng chọn một phiếu chỉ định trên danh sách hàng chờ.",
      actual
    );
  });

  // UT04: TC_F16_04 — Chưa thanh toán
  test("[Test] UT04: TC_F16_04 - Chưa thanh toán (order_search_key = 'A' x 30, payment_status = 'UNPAID')", () => {
    const input = { order_search_key: "A".repeat(30), payment_status: "UNPAID" };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Chỉ định này chưa được đóng tiền tại quầy Thu ngân. Vui lòng hướng dẫn bệnh nhân nộp phí trước.",
      actual
    );
  });

  // UT05: TC_F16_05 — Khác phòng
  test("[Test] UT05: TC_F16_05 - Khác phòng (technician_dept = 'PACS')", () => {
    const input = { technician_dept: "PACS" };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.",
      actual
    );
  });

  // UT06: TC_F16_06 — Hợp lệ
  test("[Test] UT06: TC_F16_06 - Dữ liệu mặc định hợp lệ", () => {
    const actual = ReceiveOrderValidator.validateReceiveOrder({});
    Assert.IsNull(actual);
  });

  // UT07: Mã tra cứu rỗng
  test("[Test] UT07: Mã tra cứu rỗng (order_search_key = '')", () => {
    const input = { order_search_key: "" };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.IsNull(actual);
  });

  // UT08: Mã đúng 30 ký tự
  test("[Test] UT08: Mã đúng 30 ký tự (order_search_key = 'A' x 30)", () => {
    const input = { order_search_key: "A".repeat(30) };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.IsNull(actual);
  });

  // UT09: Khoảng trắng ở hai đầu
  test("[Test] UT09: Khoảng trắng ở hai đầu (order_search_key = '  CLS_123  ')", () => {
    const input = { order_search_key: "  CLS_123  " };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.IsNull(actual);
  });

  // UT10: Thiếu thông tin hai phòng
  test("[Test] UT10: Thiếu thông tin hai phòng (order_dept = undefined, technician_dept = undefined)", () => {
    const input = { order_dept: undefined, technician_dept: undefined };
    const actual = ReceiveOrderValidator.validateReceiveOrder(input);
    Assert.AreEqual(
      "Chỉ định không thuộc phòng chuyên môn của kỹ thuật viên.",
      actual
    );
  });
});
