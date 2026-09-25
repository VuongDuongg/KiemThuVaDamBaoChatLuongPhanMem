/**
 * Validator cho Use Case UC-THUNGAN-05: Lập hóa đơn viện phí
 * Bảng 3.1.2: Bảng đặc tả chi tiết các trường dữ liệu đầu vào & Ngoại lệ E1.1, E1.2
 */

export function validateInvoiceCreationInput(params = {}) {
  const errors = {};
  const { patient_id, patient_name } = params;

  const hasPatientId = patient_id !== undefined && patient_id !== null && String(patient_id).trim() !== "";
  const hasPatientName = patient_name !== undefined && patient_name !== null && String(patient_name).trim() !== "";

  // [E1.1]: Để trống trường tìm kiếm: Người dùng nhấn tìm kiếm nhưng không nhập patient_id hoặc patient_name
  if (!hasPatientId && !hasPatientName) {
    return {
      isValid: false,
      errorCode: "E1.1",
      message: "Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm",
      errors: {
        search: "Vui lòng nhập Mã bệnh nhân hoặc Họ tên để tìm kiếm"
      }
    };
  }

  // [E1.2]: Lỗi định dạng dữ liệu đầu vào
  // 1. patient_id: Tối đa 20 ký tự. Chỉ chứa chữ cái và số, không chứa ký tự đặc biệt.
  if (hasPatientId) {
    const rawId = String(patient_id).trim();
    if (rawId.length > 20 || !/^[a-zA-Z0-9]+$/.test(rawId)) {
      errors.patient_id = "Mã bệnh nhân không được vượt quá 20 ký tự hoặc chứa ký tự đặc biệt.";
    }
  }

  // 2. patient_name: Tối đa 50 ký tự. Chỉ chứa chữ cái và khoảng trắng.
  if (hasPatientName) {
    const rawName = String(patient_name).trim();
    // Chấp nhận chữ cái Latin, tiếng Việt có dấu và khoảng trắng
    const vietnameseLetterAndSpaceRegex = /^[a-zA-Z\sàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]+$/u;
    if (rawName.length > 50 || !vietnameseLetterAndSpaceRegex.test(rawName)) {
      errors.patient_name = "Họ tên bệnh nhân không hợp lệ (tối đa 50 ký tự, không chứa số/ký tự đặc biệt).";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errorCode: "E1.2",
      message: errors.patient_id || errors.patient_name,
      errors
    };
  }

  return {
    isValid: true,
    errors: {}
  };
}
