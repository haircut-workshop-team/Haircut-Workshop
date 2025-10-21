import api from "./api";

const authService = {
  // register new user
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

  // Get currnet user
  getCurrentUser: async () => {
    const data = await api.request("/auth/me");
    return data;
  },

  // Logout user
  logout: () => localStorage.removeItem("token"),
};

export default authService;
