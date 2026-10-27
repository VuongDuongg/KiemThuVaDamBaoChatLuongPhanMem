/**
 * Validator cho Chức năng Đăng ký hồ sơ bệnh nhân mới (1.1)
 * Tác giả đặc tả: Nguyễn Hồng Thái
 * Tương ứng các ca UT01 -> UT10 trong docs/thai/testcasenta_md.md
 */

export class PatientRegistrationValidator {
  static VALID_GENDERS = new Set(["MALE", "FEMALE", "OTHER"]);

  /**
   * Xác thực thông tin đăng ký hồ sơ bệnh nhân mới
   * Dữ liệu mặc định:
   * {
   *   full_name: "Nguyen Van A",
   *   dob: "1990-05-15",
   *   gender: "MALE",
   *   phone: "0912345678",
   *   cccd: "001090012345",
   *   address: "123 Le Loi, Hanoi"
   * }
   * 
   * @param {Object} input - Dữ liệu bệnh nhân mới
   * @returns {string|null} - Trả về null nếu hợp lệ, chuỗi thông báo lỗi nếu không hợp lệ
   */
  static validateCreatePatient(input = {}) {
    const defaultData = {
      full_name: "Nguyen Van A",
      dob: "1990-05-15",
      gender: "MALE",
      phone: "0912345678",
      cccd: "001090012345",
      address: "123 Le Loi, Hanoi"
    };

    const data = { ...defaultData, ...input };

    // 1. Kiểm tra Họ và tên (full_name)
    // Không được để trống, tối đa 100 ký tự, không chứa ký tự đặc biệt hoặc số
    if (
      !data.full_name ||
      typeof data.full_name !== "string" ||
      data.full_name.trim().length === 0 ||
      data.full_name.trim().length > 100
    ) {
      return "Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số).";
    }

    const trimmedName = data.full_name.trim();
    // Chấp nhận chữ cái tiếng Việt và khoảng trắng, không chứa số hay ký tự đặc biệt
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/u;
    if (!nameRegex.test(trimmedName)) {
      return "Họ và tên bệnh nhân không được để trống (tối đa 100 ký tự, không chứa ký tự đặc biệt/số).";
    }

    // 2. Kiểm tra Ngày sinh (dob)
    // Phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại
    if (!data.dob || typeof data.dob !== "string") {
      return "Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại).";
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.dob)) {
      return "Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại).";
    }

    const parsedDate = new Date(data.dob);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại).";
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (data.dob > todayStr) {
      return "Ngày sinh không hợp lệ (phải theo định dạng YYYY-MM-DD và nhỏ hơn hoặc bằng ngày hiện tại).";
    }

    // 3. Kiểm tra Giới tính (gender)
    // Chỉ chấp nhận MALE, FEMALE, OTHER
    if (!data.gender || !PatientRegistrationValidator.VALID_GENDERS.has(data.gender)) {
      return "Giới tính không hợp lệ (chỉ chấp nhận MALE, FEMALE, OTHER).";
    }

    // 4. Kiểm tra Số điện thoại (phone)
    // Phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam (03, 05, 07, 08, 09)
    if (!data.phone || typeof data.phone !== "string") {
      return "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam).";
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(data.phone.trim())) {
      return "Số điện thoại không hợp lệ (phải gồm 10 chữ số, bắt đầu bằng đầu số hợp lệ tại Việt Nam).";
    }

    // 5. Kiểm tra CCCD / Định danh cá nhân (cccd)
    // Phải đúng 12 chữ số
    if (!data.cccd || typeof data.cccd !== "string") {
      return "Số CCCD/Định danh cá nhân phải đúng 12 chữ số.";
    }

    const cccdRegex = /^\d{12}$/;
    if (!cccdRegex.test(data.cccd.trim())) {
      return "Số CCCD/Định danh cá nhân phải đúng 12 chữ số.";
    }

    return null;
  }
}
