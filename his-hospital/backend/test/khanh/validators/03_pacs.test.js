/**
 * Test suite cho 03. Hình ảnh và kết luận PACS (UT29 -> UT45)
 * Áp dụng NUnit Assert Bridge và tương thích cả node:test lẫn vitest
 */

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
    // Lượt 1: image_description = " " * 10
    const input1 = { image_description: " ".repeat(10) };
    const actual1 = PacsValidator.validatePacs(input1);
    Assert.AreEqual(
      "Vui lòng nhập nội dung mô tả hình ảnh (tối thiểu 10 ký tự, tối đa 2000 ký tự).",
      actual1,
      "Thất bại ở lượt 1: image_description toàn khoảng trắng"
    );

    // Lượt 2: diagnostic_conclusion = " " * 5
    const input2 = { diagnostic_conclusion: " ".repeat(5) };
    const actual2 = PacsValidator.validatePacs(input2);
    Assert.AreEqual(
      "Vui lòng nhập kết luận chẩn đoán (tối thiểu 5 ký tự, tối đa 1000 ký tự).",
      actual2,
      "Thất bại ở lượt 2: diagnostic_conclusion toàn khoảng trắng"
    );
  });

  // UT44: Các biên hợp lệ (Tệp phoi.DCM = 25 * MB; độ dài mô tả in {10, 2000}; độ dài kết luận in {5, 1000}; chạy cả 4 tổ hợp)
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

  // UT45: Nhiều tệp đúng định dạng (4 tệp: phoi.jpg, phoi.jpeg, phoi.png, phoi.dcm; mỗi tệp 1 * MB)
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
