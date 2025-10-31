import api from "./api";

const customerService = {
  // Get all appointments for the logged-in customer
  getAppointments: async () => {
    return await api.request("/appointments/my", {
      method: "GET",
    });
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    return await api.request(`/appointments/${appointmentId}`, {
      method: "DELETE",
    });
  },
};

export default customerService;
