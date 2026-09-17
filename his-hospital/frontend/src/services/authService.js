import api from "./api";

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getDefaultRouteForRole: (role) => {
    const r = role ? role.toUpperCase() : "";
    switch (r) {
      case "RECEPTIONIST":
        return "/reception";
      case "CASHIER":
        return "/cashier";
      case "DOCTOR":
        return "/doctor";
      case "LAB_TECH":
        return "/lab";
      case "ADMIN":
        return "/reception";
      default:
        return "/login";
    }
  },

  isRoleAllowed: (userRole, allowedRoles = []) => {
    if (!userRole) return false;
    const r = userRole.toUpperCase();
    if (r === "ADMIN") return true; // Admin có quyền truy cập tất cả
    return allowedRoles.map((role) => role.toUpperCase()).includes(r);
  },
};
