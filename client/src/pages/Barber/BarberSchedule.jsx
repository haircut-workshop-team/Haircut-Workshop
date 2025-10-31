import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import barberService from "../../services/barberService";
import "./BarberSchedule.css";

const BarberSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState([]);

  // Days of week names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await barberService.getSchedule();

      // Create schedule for all 7 days, using data from database if available
      const scheduleData = dayNames.map((dayName, index) => {
        const existing = response.data?.find((d) => d.day_of_week === index);

        if (existing) {
          return {
            dayOfWeek: index,
            dayName: dayName,
            startTime: existing.start_time,
            endTime: existing.end_time,
            isAvailable: existing.is_available,
          };
        }

        // If no data in database, return empty/unavailable day
        return {
          dayOfWeek: index,
          dayName: dayName,
          startTime: "09:00",
          endTime: "17:00",
          isAvailable: false,
        };
      });

      setSchedule(scheduleData);
    } catch (error) {
      console.error("Error loading schedule:", error);
      // Create empty schedule structure if fetch fails
      const emptySchedule = dayNames.map((dayName, index) => ({
        dayOfWeek: index,
        dayName: dayName,
        startTime: "09:00",
        endTime: "17:00",
        isAvailable: false,
      }));
      setSchedule(emptySchedule);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Format data correctly - remove dayName field
      const scheduleData = schedule.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime,
        isAvailable: day.isAvailable,
      }));

      const response = await barberService.updateSchedule({
        schedule: scheduleData,
      });

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Schedule updated successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh schedule from database to confirm save
        await fetchSchedule();
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update schedule. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="barber-schedule">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="barber-schedule">
      <div className="schedule-header">
        <h1>My Schedule</h1>
        <p className="subtitle">
          Set your working hours for each day of the week
        </p>
      </div>

      <form onSubmit={handleSubmit} className="schedule-form">
        <div className="days-container">
          {schedule.map((day, index) => (
            <div
              key={day.dayOfWeek}
              className={`day-card ${!day.isAvailable ? "closed" : ""}`}
            >
              <div className="day-header">
                <div className="day-toggle">
                  <input
                    type="checkbox"
                    checked={day.isAvailable}
                    onChange={(e) =>
                      handleChange(index, "isAvailable", e.target.checked)
                    }
                    id={`available-${day.dayOfWeek}`}
                    className="toggle-checkbox"
                  />
                  <label
                    htmlFor={`available-${day.dayOfWeek}`}
                    className="toggle-label"
                  >
                    <span className="day-name">{day.dayName}</span>
                    {!day.isAvailable && (
                      <span className="closed-badge">Closed</span>
                    )}
                  </label>
                </div>
              </div>

              <div className="day-body">
                {day.isAvailable ? (
                  <div className="time-inputs">
                    <div className="time-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) =>
                          handleChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>

                    <span className="time-separator">→</span>

                    <div className="time-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) =>
                          handleChange(index, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="closed-message">
                    <span>🚫</span>
                    <p>Not available on this day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? (
            <>
              <span className="btn-spinner"></span>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save Schedule
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BarberSchedule;
