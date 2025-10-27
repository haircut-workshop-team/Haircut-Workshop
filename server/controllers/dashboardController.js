const adminModel = require("../models/adminModel");

//Admin Only - Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalServices: await adminModel.getTotalServices(),
      totalAppointments: await adminModel.getTotalAppointments(),
      totalRevenue: await adminModel.getTotalRevenue(),
      totalBarbers: await adminModel.getTotalBarbers(),
    };

    const recentBookings = await adminModel.getRecentBookings(5);
    const monthlyRevenue = await adminModel.getMonthlyRevenue(6);
    const statusBreakdown = await adminModel.getStatusBreakdown();

    res.json({
      success: true,
      data: {
        stats,
        recentBookings,
        monthlyRevenue,
        statusBreakdown,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Admin Only - Get Recent Activities
const getRecentActivities = async (req, res) => {
  try {
    const activities = await adminModel.getRecentActivities(7, 10);

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Recent activities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivities,
};
