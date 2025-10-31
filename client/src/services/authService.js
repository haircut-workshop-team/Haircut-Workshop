import api from "./api";

const authService = {
  // Register new user
  register: async (userData) => {
    const data = await api.request("/auth/register", {
      method: "POST",
      body: userData,
    });
    return data;
  },

  // Login user
  login: async (email, password) => {
    const data = await api.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    return data;
  },

  // Get current user
  getCurrentUser: async () => {
    const data = await api.request("/auth/me");
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Request password reset
  forgotPassword: async (email) => {
    const data = await api.request("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
    return data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const data = await api.request("/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    });
    return data;
  },
};

export default authService;
