import api from "./api";

export const invoiceService = {
  getAll: async (params = {}) => {
    const response = await api.get("/invoices", { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/invoices/stats");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/invoices", data);
    return response.data;
  },

  getPendingCharges: async (params = {}) => {
    const response = await api.get("/invoices/pending-charges", { params });
    return response.data;
  },

  pay: async (id, data = {}) => {
    const response = await api.post(`/invoices/${id}/pay`, data);
    return response.data;
  },
};
