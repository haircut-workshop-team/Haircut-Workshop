import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const api = {
  getToken: () => {
    return localStorage.getItem("token");
  },

  getHeaders: () => {
    const token = api.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  request: async (endpoint, options = {}) => {
    try {
      const config = {
        url: `${API_URL}${endpoint}`,
        method: options.method || "GET",
        headers: {
          ...api.getHeaders(),
          ...options.headers,
        },
      };

      if (options.body) {
        if (options.body instanceof FormData) {
          config.data = options.body;
          delete config.headers["Content-Type"];
        } else {
          config.data = options.body;
        }
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      // Handle 401 errors
      if (error.response?.status === 401) {
        const isAuthEndpoint =
          endpoint === "/auth/login" || endpoint === "/auth/register";

        if (!isAuthEndpoint) {
          // Token expired on a protected route
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
      }

      // Throw error with proper message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      throw new Error(errorMessage);
    }
  },
};

export default api;
