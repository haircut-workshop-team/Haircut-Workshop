import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../../services/dashboardService";
import { formatDate, formatTime, formatCurrency } from "../../utils/formatters";
import { getStatusBadgeClass, getActivityIcon } from "../../utils/helpers";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch dashboard stats using the service
      const statsData = await dashboardService.getDashboardStats();

      // Fetch recent activities using the service
      const activitiesData = await dashboardService.getRecentActivities();

      setStats(statsData.data.stats);
      setRecentBookings(statsData.data.recentBookings);
      setMonthlyRevenue(statsData.data.monthlyRevenue);
      setActivities(activitiesData.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.message || "Failed to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button
          className="btn btn-secondary"
          onClick={fetchDashboardData}
          style={{ marginTop: "1rem" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate("/admin/services");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Manage Services
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-services">
          <div className="stat-icon">💈</div>
          <div className="stat-content">
            <h3>{stats?.totalServices || 0}</h3>
            <p>Active Services</p>
          </div>
        </div>

        <div className="stat-card stat-bookings">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats?.totalAppointments || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.totalRevenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card stat-barbers">
          <div className="stat-icon">✂️</div>
          <div className="stat-content">
            <h3>{stats?.totalBarbers || 0}</h3>
            <p>Active Barbers</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Bookings */}
        <div className="dashboard-card recent-bookings">
          <div className="card-header">
            <h2>Recent Bookings</h2>
            <button
              className="btn-link"
              onClick={() => alert("View all bookings - Coming soon!")}
            >
              View All →
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Barber</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="customer-info">
                          <strong>{booking.customer_name}</strong>
                          <span className="customer-email">
                            {booking.customer_email}
                          </span>
                        </div>
                      </td>
                      <td>{booking.service_name}</td>
                      <td>{booking.barber_name}</td>
                      <td>{formatDate(booking.appointment_date)}</td>
                      <td>{formatTime(booking.appointment_time)}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="price-cell">
                        {formatCurrency(booking.service_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>📭 No bookings yet</p>
            </div>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="dashboard-card revenue-chart">
          <div className="card-header">
            <h2>Monthly Revenue</h2>
            <span className="chart-subtitle">Last 6 Months</span>
          </div>

          {monthlyRevenue.length > 0 ? (
            <div className="chart-container">
              {monthlyRevenue.map((month, index) => {
                const maxRevenue = Math.max(
                  ...monthlyRevenue.map((m) => parseFloat(m.revenue))
                );
                const height =
                  maxRevenue > 0
                    ? (parseFloat(month.revenue) / maxRevenue) * 100
                    : 0;

                return (
                  <div key={index} className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={formatCurrency(month.revenue)}
                    >
                      <span className="chart-value">
                        {formatCurrency(month.revenue)}
                      </span>
                    </div>
                    <span className="chart-label">{month.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>📊 No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card recent-activities">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <span className="activities-subtitle">Last 7 Days</span>
          </div>

          {activities.length > 0 ? (
            <div className="activities-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.actor}</strong> {activity.action}
                    </p>
                    <span className="activity-time">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>🔔 No recent activities</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button
              className="action-btn action-services"
              onClick={() => {
                navigate("/admin/services");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="action-icon">💈</span>
              <span className="action-text">Manage Services</span>
            </button>
            <button
              className="action-btn action-barbers"
              onClick={() => {
                navigate("/admin/barbers");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="action-icon">✂️</span>
              <span className="action-text">Manage Barbers</span>
            </button>
            <button
              className="action-btn action-bookings"
              onClick={() => {
                alert("View bookings - Coming soon!");
                // navigate("/admin/bookings");
                // window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="action-icon">📅</span>
              <span className="action-text">View Bookings</span>
            </button>
            <button
              className="action-btn action-reports"
              onClick={() => alert("Generate reports - Coming soon!")}
            >
              <span className="action-icon">📊</span>
              <span className="action-text">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
