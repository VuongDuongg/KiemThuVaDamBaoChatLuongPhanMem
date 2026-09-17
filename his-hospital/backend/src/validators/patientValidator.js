/**
 * Validator cho chức năng Tìm kiếm và Lọc thông tin bệnh nhân
 * Bám sát theo Đặc tả yêu cầu & Bộ kiểm thử hộp đen (EP & BVA)
 */

// Hàm kiểm tra ngày hợp lệ theo lịch (DD/MM/YYYY)
export function parseAndValidateDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;

  const parts = dateStr.trim().split("/");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;

  const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > daysInMonth[month - 1]) return null;

  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function validatePatientSearchParams(params = {}) {
  const errors = {};

  const {
    name,
    identity_card_number,
    phone,
    patient_code,
    from_date,
    to_date
  } = params;

  // 1. Kiểm tra Họ và tên
  if (name !== undefined && name !== null && name !== "") {
    // Nếu chỉ toàn khoảng trắng
    if (name.trim().length === 0) {
      errors.name = "Từ khóa tìm kiếm không hợp lệ";
    } else {
      const rawName = name;
      const trimmedName = name.trim();

      // Kiểm tra chứa số
      if (/\d/.test(trimmedName)) {
        errors.name = "Họ tên không được chứa chữ số";
      }
      // Kiểm tra chứa ký tự đặc biệt (cho phép chữ cái tiếng Việt, Latin và khoảng trắng)
      else if (/[^a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/u.test(trimmedName)) {
        errors.name = "Họ tên không được chứa ký tự đặc biệt";
      }
      // Kiểm tra độ dài biên dưới
      else if (trimmedName.length < 2) {
        errors.name = "Họ tên phải có độ dài từ 2 đến 50 ký tự";
      }
      // Kiểm tra độ dài biên trên
      else if (trimmedName.length > 50) {
        errors.name = "Họ tên không được vượt quá 50 ký tự";
      }
    }
  }

  // 2. Kiểm tra Số CCCD
  if (identity_card_number !== undefined && identity_card_number !== null && identity_card_number !== "") {
    const cccd = identity_card_number.trim();
    if (/\D/.test(cccd)) {
      errors.identity_card_number = "Số CCCD chỉ được nhập ký tự số";
    } else if (cccd.length !== 12) {
      errors.identity_card_number = "Số CCCD phải gồm đúng 12 chữ số";
    }
  }

  // 3. Kiểm tra Số điện thoại
  if (phone !== undefined && phone !== null && phone !== "") {
    const p = phone.trim();
    if (/\D/.test(p)) {
      errors.phone = "Số điện thoại chỉ được chứa ký tự số";
    } else if (!p.startsWith("0")) {
      errors.phone = "Số điện thoại phải bắt đầu bằng chữ số 0";
    } else if (p.length !== 10) {
      errors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    } else {
      const validPrefixes = ["03", "05", "07", "08", "09"];
      const prefix = p.substring(0, 2);
      if (!validPrefixes.includes(prefix)) {
        errors.phone = "Đầu số điện thoại không hợp lệ (hỗ trợ: 03, 05, 07, 08, 09)";
      }
    }
  }

  // 4. Kiểm tra Mã bệnh nhân
  if (patient_code !== undefined && patient_code !== null && patient_code !== "") {
    const pc = patient_code.trim().toUpperCase();
    if (!/^BN\d{6}$/.test(pc)) {
      errors.patient_code = "Mã bệnh nhân phải có định dạng BNxxxxxx (VD: BN000123)";
    }
  }

  // 5. Kiểm tra Khoảng ngày (Từ ngày - Đến ngày)
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let parsedFromDate = null;
  let parsedToDate = null;

  if (from_date !== undefined && from_date !== null && from_date !== "") {
    parsedFromDate = parseAndValidateDate(from_date);
    if (!parsedFromDate) {
      errors.from_date = "Ngày tháng không hợp lệ (định dạng DD/MM/YYYY)";
    } else if (parsedFromDate > now) {
      errors.from_date = "Thời gian tìm kiếm không được vượt quá ngày hiện tại";
    }
  }

  if (to_date !== undefined && to_date !== null && to_date !== "") {
    parsedToDate = parseAndValidateDate(to_date);
    if (!parsedToDate) {
      errors.to_date = "Ngày tháng không hợp lệ (định dạng DD/MM/YYYY)";
    } else if (parsedToDate > now) {
      errors.to_date = "Thời gian tìm kiếm không được vượt quá ngày hiện tại";
    }
  }

  // Ràng buộc Từ ngày <= Đến ngày
  if (parsedFromDate && parsedToDate) {
    if (parsedFromDate > parsedToDate) {
      errors.date_range = "Từ ngày không được lớn hơn Đến ngày";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
