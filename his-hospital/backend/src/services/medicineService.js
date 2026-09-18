import { medicineRepository } from "../repositories/medicineRepository.js";
import { eventBus, EVENT_TYPES } from "../events/eventBus.js";

class MedicineService {
  getMedicines(filters = {}) {
    const { keyword, category, low_stock } = filters;
    let list = medicineRepository.findAll();

    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.medicine_name.toLowerCase().includes(kw) ||
          m.medicine_code.toLowerCase().includes(kw) ||
          (m.active_ingredient && m.active_ingredient.toLowerCase().includes(kw))
      );
    }

    if (category && category !== "ALL") {
      list = list.filter((m) => m.category === category);
    }

    if (low_stock === "true") {
      list = list.filter((m) => m.stock_quantity <= 100);
    }

    return list;
  }

  getMedicineById(idOrCode) {
    const medicine = medicineRepository.findByIdOrCode(idOrCode);
    if (!medicine) {
      const error = new Error("Không tìm thấy thuốc");
      error.statusCode = 404;
      throw error;
    }
    return medicine;
  }

  createMedicine(payload) {
    const {
      medicine_name,
      active_ingredient,
      unit = "Viên",
      unit_price,
      stock_quantity = 0,
      category = "Khác",
      expiry_date
    } = payload;

    if (!medicine_name || !medicine_name.trim()) {
      const error = new Error("Tên thuốc là bắt buộc");
      error.statusCode = 400;
      throw error;
    }

    const numPrice = Number(unit_price);
    if (unit_price === undefined || isNaN(numPrice) || numPrice <= 0) {
      const error = new Error("Đơn giá thuốc phải lớn hơn 0");
      error.statusCode = 400;
      throw error;
    }

    const numStock = Number(stock_quantity);
    if (isNaN(numStock) || numStock < 0) {
      const error = new Error("Số lượng tồn kho không được là số âm");
      error.statusCode = 400;
      throw error;
    }

    const nextId = medicineRepository.getNextId();
    const newMed = {
      id: nextId,
      medicine_code: `MED${String(nextId).padStart(3, "0")}`,
      medicine_name: medicine_name.trim(),
      active_ingredient: active_ingredient ? active_ingredient.trim() : "",
      unit,
      unit_price: numPrice,
      stock_quantity: numStock,
      category,
      expiry_date: expiry_date || "2027-12-31"
    };

    medicineRepository.create(newMed);

    eventBus.emitEvent(EVENT_TYPES.MEDICINE_ADDED, {
      medicine: newMed,
      message: `Đã thêm thuốc mới vào kho: ${newMed.medicine_name} (${newMed.stock_quantity} ${newMed.unit})`
    });

    return newMed;
  }

  updateMedicine(idOrCode, updateData) {
    const existing = medicineRepository.findByIdOrCode(idOrCode);
    if (!existing) {
      const error = new Error("Không tìm thấy thuốc");
      error.statusCode = 404;
      throw error;
    }

    const { medicine_name, active_ingredient, unit, unit_price, stock_quantity, category, expiry_date } = updateData;

    const updated = {
      ...existing,
      ...(medicine_name && { medicine_name: medicine_name.trim() }),
      ...(active_ingredient !== undefined && { active_ingredient: active_ingredient.trim() }),
      ...(unit && { unit }),
      ...(unit_price !== undefined && { unit_price: Number(unit_price) }),
      ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
      ...(category && { category }),
      ...(expiry_date && { expiry_date })
    };

    // Update in memory repository
    const all = medicineRepository.findAll();
    const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);
    if (idx !== -1) {
      all[idx] = updated;
    }

    eventBus.emitEvent(EVENT_TYPES.MEDICINE_STOCK_UPDATED, {
      medicine: updated,
      message: `Cập nhật thông tin kho thuốc: ${updated.medicine_name} (Tồn kho: ${updated.stock_quantity})`
    });

    return updated;
  }

  deleteMedicine(idOrCode) {
    const existing = medicineRepository.findByIdOrCode(idOrCode);
    if (!existing) {
      const error = new Error("Không tìm thấy thuốc");
      error.statusCode = 404;
      throw error;
    }

    const all = medicineRepository.findAll();
    const idx = all.findIndex((m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode);
    const deleted = all.splice(idx, 1)[0];

    return deleted;
  }
}

export const medicineService = new MedicineService();
