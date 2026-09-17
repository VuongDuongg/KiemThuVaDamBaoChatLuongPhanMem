import api from "./api";

export const patientService = {
  getAll: async () => {
    const response = await api.get("/patients");
    return response.data;
  },

  search: async (params = {}) => {
    const response = await api.get("/patients/search", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/patients", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};
