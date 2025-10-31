import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import barberService from "../../services/barberService";
import "./BarberAppointments.css";

// Helper function to format date and time
const formatDateTime = (dateString, timeString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format time to 12-hour format
  const [hours, minutes] = timeString.split(":");
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} at ${formattedTime}`;
};

const statusColors = {
  pending: "#f1c40f",
  confirmed: "#3498db",
  completed: "#27ae60",
  cancelled: "#e74c3c",
  "no-show": "#8e44ad",
};

export default function BarberAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await barberService.getAllAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="barber-appointments-page">
      <h1>My Appointments</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="no-appointments">No appointments found.</div>
      ) : (
        <div className="appointments-list">
          {appointments.map((apt) => (
            <div className="appointment-card" key={apt.id}>
              <div className="appointment-header">
                <span
                  className="status-badge"
                  style={{ background: statusColors[apt.status] || "#ccc" }}
                >
                  {apt.status}
                </span>
                <span className="appointment-date">
                  {formatDateTime(apt.appointment_date, apt.appointment_time)}
                </span>
              </div>
              <div className="appointment-body">
                <div>
                  <strong>Customer:</strong> {apt.customer_name} (
                  {apt.customer_email})
                </div>
                <div>
                  <strong>Phone:</strong> {apt.customer_phone}
                </div>
                <div>
                  <strong>Service:</strong> {apt.service_name}
                </div>
                <div>
                  <strong>Price:</strong> ${apt.price}
                </div>
                <div>
                  <strong>Duration:</strong> {apt.duration} min
                </div>
                {apt.notes && (
                  <div>
                    <strong>Notes:</strong> {apt.notes}
                  </div>
                )}

                {/* Status update controls */}
                <div className="status-update-controls">
                  <label htmlFor={`status-select-${apt.id}`}>
                    Update Status:
                  </label>
                  <select
                    id={`status-select-${apt.id}`}
                    className="status-select"
                    value={apt.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await barberService.updateStatus(apt.id, newStatus);
                        // Refetch appointments to update UI
                        await fetchAppointments();

                        // Show success message for completed appointments
                        if (newStatus === "completed") {
                          Swal.fire({
                            title: "Success!",
                            text: "Appointment completed! Check your dashboard for updated earnings.",
                            icon: "success",
                            timer: 2500,
                            showConfirmButton: false,
                          });
                        }
                      } catch (err) {
                        Swal.fire({
                          title: "Error!",
                          text:
                            "Failed to update status: " +
                            (err.message || "Unknown error"),
                          icon: "error",
                          confirmButtonColor: "#d33",
                        });
                      }
                    }}
                  >
                    {/* Only show relevant status options based on current status */}
                    {apt.status === "pending" && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                      </>
                    )}
                    {apt.status === "confirmed" && (
                      <>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Mark Complete</option>
                        <option value="no-show">No-show</option>
                        <option value="cancelled">Cancel</option>
                      </>
                    )}
                    {(apt.status === "completed" ||
                      apt.status === "cancelled" ||
                      apt.status === "no-show") && (
                      <>
                        <option value={apt.status}>
                          {apt.status.charAt(0).toUpperCase() +
                            apt.status.slice(1)}
                        </option>
                        {apt.status !== "confirmed" && (
                          <option value="confirmed">Reactivate</option>
                        )}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
