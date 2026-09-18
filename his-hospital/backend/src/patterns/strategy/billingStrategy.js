/**
 * Strategy Pattern: Chiến lược tính toán viện phí & bảo hiểm y tế
 */

export class StandardBillingStrategy {
  calculate(totalAmount, insuranceDiscount = 0) {
    const total = Number(totalAmount);
    if (isNaN(total) || total <= 0) {
      throw new Error("Tổng tiền hóa đơn phải lớn hơn 0");
    }

    const discount = Number(insuranceDiscount) || 0;
    if (discount < 0) {
      throw new Error("Mức giảm trừ bảo hiểm không được là số âm");
    }
    if (discount > total) {
      throw new Error("Mức giảm trừ bảo hiểm không hợp lệ (vượt quá tổng tiền)");
    }

    const patientPay = Math.max(0, total - discount);
    return {
      totalAmount: total,
      insuranceDiscount: discount,
      patientPay
    };
  }
}

export class InsuranceCoverageStrategy {
  constructor(coveragePercentage = 0.8) {
    this.coveragePercentage = coveragePercentage; // Mặc định BHYT thanh toán 80%
  }

  calculate(totalAmount) {
    const total = Number(totalAmount);
    if (isNaN(total) || total <= 0) {
      throw new Error("Tổng tiền hóa đơn phải lớn hơn 0");
    }
    const discount = Math.round(total * this.coveragePercentage);
    const patientPay = total - discount;
    return {
      totalAmount: total,
      insuranceDiscount: discount,
      patientPay
    };
  }
}

export class PaymentMethodValidatorStrategy {
  static VALID_METHODS = ["TIEN_MAT", "VIETQR", "THE", "CHUYEN_KHOAN"];

  static validate(method) {
    if (!method || !this.VALID_METHODS.includes(method)) {
      throw new Error("Phương thức thanh toán không hợp lệ (hỗ trợ: TIEN_MAT, VIETQR, THE, CHUYEN_KHOAN)");
    }
    return true;
  }
}
