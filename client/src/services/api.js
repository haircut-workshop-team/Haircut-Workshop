// This file will handle all API calls and token management.
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = {
  // Helper function to get token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Helper function to create headers
  getHeaders: () => {
    const token = api.getToken();

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // Generic request function
  request: async (endpoint, options = {}) => {
    try {
      const response = await axios({
        url: `${API_URL}${endpoint}`,
        method: options.method || "GET",
        headers: {
          ...api.getHeaders(),
          ...options.headers,
        },
        data: options.body,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  },
};

export default api;
