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
};

module.exports = barberModel;
