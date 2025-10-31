import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import barberService from "../../services/barberService";
import { formatTime, formatCurrency } from "../../utils/formatters";
import { getInitials } from "../../utils/helpers";
import "./BarberDashboard.css";

const BarberDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, appointments: [] });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await barberService.getDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await barberService.updateStatus(
        appointmentId,
        newStatus
      );
      if (response.success) {
        // Refresh dashboard to show updated stats
        await fetchDashboard();

        // Show success message for completed appointments
        if (newStatus === "completed") {
          Swal.fire({
            title: "Success!",
            text: "Appointment marked as completed. Earnings updated!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loading) {
    return (
      <div className="barber-dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const { stats, appointments } = data;

  return (
    <div className="barber-dashboard">
      <h1>Barber Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Appointments</h3>
          <p className="stat-number">{stats.today_appointments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p className="stat-number">{stats.week_appointments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Earnings</h3>
          <p className="stat-number">
            {formatCurrency(stats.today_earnings || 0)}
          </p>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="appointments-section">
        <h2>Today's Appointments</h2>

        {appointments.length === 0 ? (
          <p className="no-data">No appointments today</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="apt-header">
                  <div className="customer-info">
                    <div className="avatar">
                      {getInitials(apt.customer_name)}
                    </div>
                    <div>
                      <h4>{apt.customer_name}</h4>
                      <p>{apt.customer_phone}</p>
                    </div>
                  </div>
                  <span className={`status ${apt.status}`}>{apt.status}</span>
                </div>

                <div className="apt-details">
                  <p>
                    <strong>Service:</strong> {apt.service_name}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(apt.appointment_time)}
                  </p>
                  <p>
                    <strong>Duration:</strong> {apt.duration} min
                  </p>
                  <p>
                    <strong>Price:</strong> {formatCurrency(apt.price)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="apt-actions">
                  {apt.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                        className="btn-confirm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate(apt.id, "completed")}
                      className="btn-complete"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberDashboard;
