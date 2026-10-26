import api from "./api";

export const consultationService = {
  getAll: async (params = {}) => {
    const response = await api.get("/consultations", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/consultations", data);
    return response.data;
  },

  prescribe: async (id, data) => {
    const response = await api.post(`/consultations/${id}/prescribe`, data);
    return response.data;
  },
};
