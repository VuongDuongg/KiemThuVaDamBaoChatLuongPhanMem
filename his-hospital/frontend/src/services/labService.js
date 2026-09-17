import api from "./api";

export const labService = {
  getServices: async () => {
    const response = await api.get("/lab/services");
    return response.data;
  },

  getOrders: async (params = {}) => {
    const response = await api.get("/lab/orders", { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/lab/orders/${id}`);
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post("/lab/orders", data);
    return response.data;
  },

  updateResult: async (id, data) => {
    const response = await api.put(`/lab/orders/${id}/result`, data);
    return response.data;
  },
};
