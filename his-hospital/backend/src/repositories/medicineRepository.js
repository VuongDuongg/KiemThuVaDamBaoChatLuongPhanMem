import { globalData } from "../data/seedData.js";

class MedicineRepository {
  findAll() {
    return [...globalData.medicines];
  }

  findByIdOrCode(idOrCode) {
    return globalData.medicines.find(
      (m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode
    );
  }

  create(medicineEntity) {
    globalData.medicines.unshift(medicineEntity);
    return medicineEntity;
  }

  updateStock(idOrCode, quantityChange) {
    const med = globalData.medicines.find(
      (m) => String(m.id) === String(idOrCode) || m.medicine_code === idOrCode
    );
    if (!med) return null;

    med.stock_quantity += quantityChange;
    return med;
  }

  getNextId() {
    return globalData.medicines.length + 1;
  }
}

export const medicineRepository = new MedicineRepository();
