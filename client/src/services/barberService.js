import api from "./api";

const barberService = {
  // Get all barbers (PUBLIC - for booking page)
  // Used by: Booking page, Admin barber management
  getAllBarbers: async () => {
    const data = await api.request("/barber/list");
    return data.data || [];
  },

  // Get all barbers (ADMIN - for admin management page)
  getAllBarbersAdmin: async () => {
    const data = await api.request("/admin/barbers");
    return data.data || [];
  },

  // Get single barber by ID (ADMIN)
  getBarberById: async (id) => {
    const data = await api.request(`/admin/barbers/${id}`);
    return data.data;
  },

  // Create new barber (ADMIN)
  createBarber: async (barberData) => {
    const data = await api.request("/admin/barbers", {
      method: "POST",
      body: barberData,
    });
    return data;
  },

  // Update barber (ADMIN)
  updateBarber: async (id, barberData) => {
    const data = await api.request(`/admin/barbers/${id}`, {
      method: "PUT",
      body: barberData,
    });
    return data;
  },

  // Delete barber (ADMIN)
  deleteBarber: async (id) => {
    const data = await api.request(`/admin/barbers/${id}`, {
      method: "DELETE",
    });
    return data;
  },

  // Get barber dashboard (BARBER)
  getDashboard: async () => {
    const data = await api.request("/barber/dashboard");
    return data;
  },

  // Update appointment status (BARBER)
  updateStatus: async (appointmentId, status) => {
    const data = await api.request(
      `/barber/appointments/${appointmentId}/status`,
      {
        method: "PUT",
        body: { status },
      }
    );
    return data;
  },

  // Get barber schedule (BARBER)
  getSchedule: async () => {
    const data = await api.request("/barber/schedule");
    return data;
  },

  // Update barber schedule (BARBER)
  updateSchedule: async (scheduleObj) => {
    const data = await api.request("/barber/schedule", {
      method: "POST",
      body: scheduleObj,
    });
    return data;
  },

  // Get all appointments for the logged-in barber (BARBER)
  getAllAppointments: async () => {
    const data = await api.request("/barber/appointments");
    return data;
  },
};

export default barberService;
