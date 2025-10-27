import api from "./api";

const barberService = {
  // Get all barbers
  getAllBarbers: async () => {
    const data = await api.request("/admin/barbers");
    return data.data;
  },

  // Get single barber by ID
  getBarberById: async (id) => {
    const data = await api.request(`/admin/barbers/${id}`);
    return data.data;
  },

  // Create new barber
  createBarber: async (barberData) => {
    const data = await api.request("/admin/barbers", {
      method: "POST",
      body: barberData,
    });
    return data;
  },

  // Update barber
  updateBarber: async (id, barberData) => {
    const data = await api.request(`/admin/barbers/${id}`, {
      method: "PUT",
      body: barberData,
    });
    return data;
  },

  // Delete barber
  deleteBarber: async (id) => {
    const data = await api.request(`/admin/barbers/${id}`, {
      method: "DELETE",
    });
    return data;
  },
};

export default barberService;
