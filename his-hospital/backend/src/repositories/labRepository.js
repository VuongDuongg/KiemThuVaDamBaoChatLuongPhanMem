import { globalData } from "../data/seedData.js";

class LabRepository {
  findServices() {
    return [...globalData.labServices];
  }

  findServiceByCode(serviceCode) {
    return globalData.labServices.find((s) => s.service_code === serviceCode);
  }

  findOrders() {
    return [...globalData.labOrders];
  }

  findOrderByIdOrCode(idOrCode) {
    return globalData.labOrders.find(
      (o) => String(o.id) === String(idOrCode) || o.order_code === idOrCode
    );
  }

  createOrder(orderEntity) {
    globalData.labOrders.unshift(orderEntity);
    return orderEntity;
  }

  updateOrder(idOrCode, updateFields) {
    const index = globalData.labOrders.findIndex(
      (o) => String(o.id) === String(idOrCode) || o.order_code === idOrCode
    );
    if (index === -1) return null;

    globalData.labOrders[index] = {
      ...globalData.labOrders[index],
      ...updateFields
    };
    return globalData.labOrders[index];
  }

  getNextId() {
    return globalData.labOrders.length + 1;
  }
}

export const labRepository = new LabRepository();
