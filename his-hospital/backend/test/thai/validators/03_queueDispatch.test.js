/**
 * Test suite cho 03. Điều phối và gọi số khám (UT29 -> UT45)
 * Tác giả: Nguyễn Hồng Thái
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

import { test, describe } from "../../helpers/testBridge.js";
import { Assert } from "../../helpers/nunitAssert.js";
import { QueueDispatchValidator } from "./03_queueDispatch.validator.js";

describe("[TestFixture] 03_DieuPhoiVaGoiSoKham_QueueDispatchValidator", () => {
  // UT29: Không chọn phòng điều phối
  test("[Test] UT29: Không chọn phòng điều phối (clinic_id = null)", () => {
    const input = { clinic_id: null };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Thông tin phòng khám điều phối không hợp lệ.",
      actual
    );
  });

  // UT30: Số thứ tự hiện tại âm
  test("[Test] UT30: Số thứ tự hiện tại âm (current_ticket_number = -5)", () => {
    const input = { current_ticket_number: -5 };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.",
      actual
    );
  });

  // UT31: Hành động không thuộc danh mục
  test("[Test] UT31: Hành động không thuộc danh mục (action = 'JUMP_QUEUE')", () => {
    const input = { action: "JUMP_QUEUE" };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER).",
      actual
    );
  });

  // UT32: Chuyển phòng nhưng thiếu room_id
  test("[Test] UT32: Chuyển phòng nhưng thiếu room_id (action = 'TRANSFER', target_room_id = null)", () => {
    const input = {
      action: "TRANSFER",
      target_room_id: null
    };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân.",
      actual
    );
  });

  // UT33: Chuyển phòng sang chính phòng cũ
  test("[Test] UT33: Chuyển phòng sang chính phòng cũ (action = 'TRANSFER', target_room_id = 5)", () => {
    const input = {
      action: "TRANSFER",
      target_room_id: 5 // Mặc định clinic_id = 5
    };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Phòng khám đích phải khác với phòng khám hiện tại.",
      actual
    );
  });

  // UT34: Số thứ tự không phải là số
  test("[Test] UT34: Số thứ tự không phải là số (current_ticket_number = 'ABC')", () => {
    const input = { current_ticket_number: "ABC" };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.",
      actual
    );
  });

  // UT35: Số thứ tự bằng 0
  test("[Test] UT35: Số thứ tự bằng 0 (current_ticket_number = 0)", () => {
    const input = { current_ticket_number: 0 };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.",
      actual
    );
  });

  // UT36: Số thứ tự là số thực
  test("[Test] UT36: Số thứ tự là số thực (current_ticket_number = 10.5)", () => {
    const input = { current_ticket_number: 10.5 };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.",
      actual
    );
  });

  // UT37: Hành động gọi lại hợp lệ
  test("[Test] UT37: Hành động gọi lại hợp lệ (action = 'RECALL')", () => {
    const input = { action: "RECALL" };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.IsNull(actual);
  });

  // UT38: Hành động bỏ qua hợp lệ
  test("[Test] UT38: Hành động bỏ qua hợp lệ (action = 'SKIP')", () => {
    const input = { action: "SKIP" };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.IsNull(actual);
  });

  // UT39: Chuyển phòng hợp lệ
  test("[Test] UT39: Chuyển phòng hợp lệ (action = 'TRANSFER', target_room_id = 103)", () => {
    const input = {
      action: "TRANSFER",
      target_room_id: 103
    };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.IsNull(actual);
  });

  // UT40: Hành động rỗng
  test("[Test] UT40: Hành động rỗng (action = '')", () => {
    const input = { action: "" };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER).",
      actual
    );
  });

  // UT41: Phòng đích là chuỗi không hợp lệ
  test("[Test] UT41: Phòng đích là chuỗi không hợp lệ (action = 'TRANSFER', target_room_id = 'ROOM_A')", () => {
    const input = {
      action: "TRANSFER",
      target_room_id: "ROOM_A"
    };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Vui lòng chọn phòng khám đích khi thực hiện chuyển tiếp bệnh nhân.",
      actual
    );
  });

  // UT42: Thiếu hành động (undefined)
  test("[Test] UT42: Thiếu hành động (action = undefined)", () => {
    const input = { action: undefined };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Hành động điều phối không hợp lệ (chấp nhận: CALL_NEXT, RECALL, SKIP, TRANSFER).",
      actual
    );
  });

  // UT43: Điều phối khi số thứ tự là Infinity
  test("[Test] UT43: Điều phối khi số thứ tự là Infinity (current_ticket_number = Infinity)", () => {
    const input = { current_ticket_number: Infinity };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.AreEqual(
      "Số thứ tự gọi khám phải là số nguyên dương hợp lệ.",
      actual
    );
  });

  // UT44: Các biên số thứ tự hợp lệ
  test("[Test] UT44: Các biên số thứ tự hợp lệ (current_ticket_number in {1, 9999})", () => {
    Assert.IsNull(QueueDispatchValidator.validateQueueDispatch({ current_ticket_number: 1 }));
    Assert.IsNull(QueueDispatchValidator.validateQueueDispatch({ current_ticket_number: 9999 }));
  });

  // UT45: Truyền tham số phòng khám hợp lệ kiểu chuỗi số
  test("[Test] UT45: Truyền tham số phòng khám hợp lệ kiểu chuỗi số (clinic_id = '5', target_room_id = '102')", () => {
    const input = {
      clinic_id: "5",
      target_room_id: "102"
    };
    const actual = QueueDispatchValidator.validateQueueDispatch(input);
    Assert.IsNull(actual);
  });
});
