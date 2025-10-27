import api from "./api";

const serviceService = {
  // ============================================
  // Public Endpoints (used by customers too)
  // ============================================
  // Get all services
  getAllServices: async () => {
    const response = await api.request("/services");
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await api.request(`/services/${id}`);
    return response.data;
  },

  // ============================================
  // Admin Endpoints (require admin authentication)
  // ============================================
  // Get service statistics
  getServiceStats: async () => {
    const response = await api.request("/admin/services/stats");
    return response.data;
  },

  // create new service
  createService: async (serviceData) => {
    const response = await api.request("/admin/services", {
      method: "POST",
      body: serviceData,
    });
    return response.data;
  },

  // updating service
  updateService: async (id, serviceData) => {
    const response = await api.request(`/admin/services/${id}`, {
      method: "PUT",
      body: serviceData,
    });
    return response.data;
  },

  // delete service
  deleteService: async (id) => {
    const response = await api.request(`/admin/services/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },
};

export default serviceService;
