/**
 * Bộ chuyển đổi mô phỏng Lớp Assert của NUnit Framework (theo bài giảng của ThS. Nguyễn Thị Phương Dung)
 * Tài liệu tham chiếu: "Kiểm thử đơn vị - sd NUnit.pdf" (Slide 23 - 26)
 * 
 * Lớp Assert đóng vai trò là chiếc cầu nối giữa mã chương trình cần kiểm thử và NUnit.
 * Cung cấp đầy đủ các phương thức xác nhận giả định:
 * - Assert.AreEqual(expected, actual [, message])
 * - Assert.Less(x, y [, message])
 * - Assert.Greater(x, y [, message])
 * - Assert.LessOrEqual(x, y [, message])
 * - Assert.GreaterOrEqual(x, y [, message])
 * - Assert.IsNull(object [, message])
 * - Assert.IsNotNull(object [, message])
 * - Assert.IsTrue(condition [, message])
 * - Assert.IsFalse(condition [, message])
 * - Assert.Throws(action [, errorMatcher, message])
 */

import assert from "node:assert/strict";

export class Assert {
  /**
   * Xác nhận giá trị thực tế (actual) bằng với giá trị kỳ vọng (expected).
   * Slide 24: expected là giá trị kỳ vọng; actual là giá trị thực; message là thông điệp hiển thị nếu thất bại.
   */
  static AreEqual(expected, actual, message) {
    assert.strictEqual(actual, expected, message);
  }

  /**
   * Xác nhận x < y
   * Slide 24: Assert.Less(x, y)
   */
  static Less(x, y, message) {
    assert.ok(x < y, message || `Xác nhận thất bại: kỳ vọng ${x} < ${y}`);
  }

  /**
   * Xác nhận x > y
   * Slide 24: Assert.Greater(x, y)
   */
  static Greater(x, y, message) {
    assert.ok(x > y, message || `Xác nhận thất bại: kỳ vọng ${x} > ${y}`);
  }

  /**
   * Xác nhận x <= y
   * Slide 25: Assert.LessOrEqual(x, y)
   */
  static LessOrEqual(x, y, message) {
    assert.ok(x <= y, message || `Xác nhận thất bại: kỳ vọng ${x} <= ${y}`);
  }

  /**
   * Xác nhận x >= y
   * Slide 25: Assert.GreaterOrEqual(x, y)
   */
  static GreaterOrEqual(x, y, message) {
    assert.ok(x >= y, message || `Xác nhận thất bại: kỳ vọng ${x} >= ${y}`);
  }

  /**
   * Xác nhận một đối tượng là null hoặc undefined, ngược lại kiểm thử thất bại.
   * Slide 25: Assert.IsNull(object [, message])
   */
  static IsNull(obj, message) {
    assert.ok(obj === null || obj === undefined, message || `Xác nhận thất bại: kỳ vọng đối tượng là null nhưng nhận được ${obj}`);
  }

  /**
   * Xác nhận một đối tượng khác null (và khác undefined), ngược lại kiểm thử thất bại.
   * Slide 25: Assert.IsNotNull(object [, message])
   */
  static IsNotNull(obj, message) {
    assert.ok(obj !== null && obj !== undefined, message || `Xác nhận thất bại: kỳ vọng đối tượng khác null`);
  }

  /**
   * Xác nhận điều kiện đã cho là đúng (true), ngược lại kiểm thử thất bại.
   * Slide 26: Assert.IsTrue(bool condition [, message])
   */
  static IsTrue(condition, message) {
    assert.strictEqual(Boolean(condition), true, message || `Xác nhận thất bại: kỳ vọng điều kiện là true`);
  }

  /**
   * Xác nhận điều kiện đã cho là sai (false), ngược lại kiểm thử thất bại.
   * Slide 26: Assert.IsFalse(bool condition [, message])
   */
  static IsFalse(condition, message) {
    assert.strictEqual(Boolean(condition), false, message || `Xác nhận thất bại: kỳ vọng điều kiện là false`);
  }

  /**
   * Xác nhận khi thực thi khối lệnh thì phát sinh ngoại lệ (Exception) theo đúng dự kiến.
   */
  static Throws(fn, errorMatcher, message) {
    assert.throws(fn, errorMatcher, message);
  }
}
