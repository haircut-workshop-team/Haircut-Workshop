const pool = require("../config/database");

const appointmentModel = {
  // Create an appointment
  createAppointment: async ({
    user_id,
    barber_id,
    service_id,
    appointment_date,
    appointment_time,
  }) => {
    try {
      const result = await pool.query(
        `INSERT INTO appointments 
         (customer_id, barber_id, service_id, appointment_date, appointment_time)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, barber_id, service_id, appointment_date, appointment_time]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  // Get appointments by user ID with service and barber details
  getAppointmentsByUser: async (user_id) => {
    try {
      const result = await pool.query(
        `SELECT 
          a.id,
          a.barber_id,
          a.appointment_date,
          a.appointment_time,
          a.status,
          a.notes,
          a.created_at,
          s.name AS service_name, 
          s.price AS service_price,
          s.duration AS service_duration,
          bu.name AS barber_name,
          bu.email AS barber_email,
          bu.phone AS barber_phone
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         JOIN barbers b ON a.barber_id = b.id
         JOIN users bu ON b.user_id = bu.id
         WHERE a.customer_id = $1
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [user_id]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },

  getAppointmentById: async (appointmentId) => {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE id = $1",
      [appointmentId]
    );
    return result.rows[0];
  },

  // Delete appointment (customer cancels)
  deleteAppointment: async (id, user_id) => {
    try {
      const result = await pool.query(
        `DELETE FROM appointments 
         WHERE id = $1 AND customer_id = $2 
         RETURNING *`,
        [id, user_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  },

  // Get booked appointment times for a barber on a specific date
  getBookedTimes: async (barber_id, appointment_date) => {
    try {
      const result = await pool.query(
        `SELECT appointment_time, s.duration
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.barber_id = $1 
         AND a.appointment_date = $2 
         AND a.status NOT IN ('cancelled', 'no-show')
         ORDER BY a.appointment_time`,
        [barber_id, appointment_date]
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching booked times:", error);
      throw error;
    }
  },
};

module.exports = appointmentModel;
