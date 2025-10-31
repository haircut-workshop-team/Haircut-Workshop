const pool = require("../config/database");

const barberModel = {
  // Get all barbers with user info
  findAll: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          b.id,
          b.user_id,
          u.name,
          u.email,
          u.phone,
          u.profile_image,
          b.specialties,
          b.years_experience,
          b.bio,
          b.rating,
          b.total_reviews,
          b.created_at,
          (SELECT COUNT(*) FROM appointments WHERE barber_id = b.id) as total_appointments,
          (SELECT COUNT(*) FROM appointments WHERE barber_id = b.id AND status = 'completed') as completed_appointments
        FROM barbers b
        INNER JOIN users u ON b.user_id = u.id
        WHERE u.role = 'barber'
        ORDER BY b.created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error("Error finding all barbers:", error);
      throw error;
    }
  },

  // Get barber by ID
  findById: async (id) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          b.id,
          b.user_id,
          u.name,
          u.email,
          u.phone,
          u.profile_image,
          b.specialties,
          b.years_experience,
          b.bio,
          b.rating,
          b.total_reviews,
          b.created_at
        FROM barbers b
        INNER JOIN users u ON b.user_id = u.id
        WHERE b.id = $1
      `,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding barber by id:", error);
      throw error;
    }
  },

  // Create barber profile
  create: async (userId, barberData) => {
    try {
      const { specialties, years_experience, bio } = barberData;
      const result = await pool.query(
        "INSERT INTO barbers (user_id, specialties, years_experience, bio, rating, total_reviews) VALUES ($1, $2, $3, $4, 0.0, 0) RETURNING *",
        [userId, specialties || null, years_experience || 0, bio || null]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating barber:", error);
      throw error;
    }
  },

  // Update barber profile
  update: async (id, barberData) => {
    try {
      const { specialties, years_experience, bio } = barberData;
      const result = await pool.query(
        `UPDATE barbers 
         SET specialties = COALESCE($1, specialties),
             years_experience = COALESCE($2, years_experience),
             bio = COALESCE($3, bio)
         WHERE id = $4
         RETURNING *`,
        [specialties, years_experience, bio, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating barber:", error);
      throw error;
    }
  },

  // Delete barber
  delete: async (id) => {
    try {
      const result = await pool.query(
        "DELETE FROM barbers WHERE id = $1 RETURNING *",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting barber:", error);
      throw error;
    }
  },

  // Check if barber has pending/confirmed appointments
  hasPendingAppointments: async (barberId) => {
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as count 
         FROM appointments 
         WHERE barber_id = $1 
         AND status IN ('pending', 'confirmed')`,
        [barberId]
      );
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error("Error checking pending appointments:", error);
      throw error;
    }
  },

  // Get barber's dashboard stats
  getStats: async (barberId) => {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND a.status != 'cancelled') as today_appointments,
          COUNT(*) FILTER (WHERE appointment_date >= DATE_TRUNC('week', CURRENT_DATE) AND a.status != 'cancelled') as week_appointments,
          COALESCE(SUM(s.price::numeric) FILTER (WHERE appointment_date = CURRENT_DATE AND a.status = 'completed'), 0)::numeric as today_earnings
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.barber_id = $1
      `;

      const result = await pool.query(statsQuery, [barberId]);

      // Convert numeric strings to numbers for proper JSON serialization
      const stats = result.rows[0];
      return {
        today_appointments: parseInt(stats.today_appointments) || 0,
        week_appointments: parseInt(stats.week_appointments) || 0,
        today_earnings: parseFloat(stats.today_earnings) || 0,
      };
    } catch (error) {
      throw new Error(`Error fetching stats: ${error.message}`);
    }
  },

  // Get today's appointments
  getTodayAppointments: async (barberId) => {
    try {
      const query = `
        SELECT 
          a.*,
          s.name as service_name,
          s.price,
          s.duration,
          u.name as customer_name,
          u.email as customer_email,
          u.phone as customer_phone
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN users u ON a.customer_id = u.id
        WHERE a.barber_id = $1 
          AND a.appointment_date = CURRENT_DATE
        ORDER BY a.appointment_time ASC
      `;

      const result = await pool.query(query, [barberId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
  },

  // Update appointment status
  updateStatus: async (appointmentId, status, barberId) => {
    try {
      const query = `
        UPDATE appointments
        SET status = $1
        WHERE id = $2 AND barber_id = $3
        RETURNING *
      `;

      const result = await pool.query(query, [status, appointmentId, barberId]);

      if (result.rows.length === 0) {
        throw new Error("Appointment not found");
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating status: ${error.message}`);
    }
  },

  // Get all appointments for a barber
  getAllAppointments: async (barberId) => {
    try {
      const query = `
        SELECT 
          a.id, a.appointment_date, a.appointment_time, a.status, a.notes,
          u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
          s.name AS service_name, s.price, s.duration
        FROM appointments a
        JOIN users u ON a.customer_id = u.id
        JOIN services s ON a.service_id = s.id
        WHERE a.barber_id = $1
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `;
      const result = await pool.query(query, [barberId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching all appointments: ${error.message}`);
    }
  },
};

module.exports = barberModel;
