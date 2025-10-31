import api from "./api";

const dashboardService = {
  // Get dashboard statistics (services, bookings, revenue, barbers)
  getDashboardStats: async () => {
    const data = await api.request("/admin/dashboard/stats");
    return data;
  },

  // Get recent activities (bookings, reviews)
  getRecentActivities: async () => {
    const data = await api.request("/admin/dashboard/activities");
    return data;
  },
};

export default dashboardService;
