import api from "../../services/api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AppointmentCard from "../../components/Card/AppointmentCard";
import "./MyBookings.css";

export default function MyBookings() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // upcoming | past

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        setAppointments([]);
        return;
      }

      // Extract userId from JWT token
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded.user_id;

      const res = await api.request(`/appointments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelSuccess = () => {
    fetchAppointments();
  };

  const upcomingAppointments = appointments.filter((a) => {
    // Extract just the date part from the ISO timestamp
    const appointmentDateStr = a.appointment_date.split("T")[0];
    const status = a.status;

    // Create date objects for proper comparison
    const appointmentDate = new Date(appointmentDateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Consider appointments from yesterday to future as "upcoming" to account for timezone issues
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Upcoming: from yesterday onwards (to account for timezone), AND not cancelled/completed
    return (
      appointmentDate >= yesterday &&
      status !== "cancelled" &&
      status !== "completed"
    );
  });

  const pastAppointments = appointments.filter((a) => {
    // Extract just the date part from the ISO timestamp
    const appointmentDateStr = a.appointment_date.split("T")[0];
    const status = a.status;

    // Create date objects for proper comparison
    const appointmentDate = new Date(appointmentDateStr + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Past: before yesterday OR completed/cancelled status
    return (
      appointmentDate < yesterday ||
      status === "completed" ||
      status === "cancelled"
    );
  });

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>

      <div className="bookings-tabs">
        <button
          className={tab === "upcoming" ? "active" : ""}
          onClick={() => setTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={tab === "past" ? "active" : ""}
          onClick={() => setTab("past")}
        >
          Past
        </button>
      </div>

      {loading ? (
        <p>Loading your appointments...</p>
      ) : (
        <div className="appointments-list">
          {tab === "upcoming" &&
            (upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))
            ) : (
              <p>No upcoming appointments.</p>
            ))}

          {tab === "past" &&
            (pastAppointments.length > 0 ? (
              pastAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancelSuccess={handleCancelSuccess}
                />
              ))
            ) : (
              <p>No past appointments.</p>
            ))}
        </div>
      )}
    </div>
  );
}
