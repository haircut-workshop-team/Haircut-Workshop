import api from "./api";

const appointmentService = {
  // Create new appointment
  createAppointment: async (appointmentData) => {
    const response = await api.request("/appointments", {
      method: "POST",
      body: appointmentData,
    });
    return response.data;
  },

  // Get customer's own appointments
  getMyAppointments: async () => {
    const response = await api.request("/appointments/my", {
      method: "GET",
    });
    return response.data;
  },

  // Cancel/delete appointment
  deleteAppointment: async (id) => {
    const response = await api.request(`/appointments/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },
};

export default appointmentService;
