const pool = require("../config/database");

// User model using promises
const userModel = {
  // Find a user by email (includes password - use for authentication only)
  findByEmail: async (email) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  },

  // Find a user by id (excludes password - safe for general use)
  findById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT id, name, email, phone, role, profile_image, created_at, updated_at FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  },

  // Find user by id with password (use for password verification only)
  findByIdWithPassword: async (id) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by id with password:", error);
      throw error;
    }
  },

  // Create a new user
  create: async (userData) => {
    try {
      const { name, email, password, phone, role } = userData;
      const result = await pool.query(
        "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role, created_at",
        [name, email, password, phone, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update a user (only updates provided fields)
  update: async (id, userData) => {
    try {
      // Build dynamic query based on provided fields
      const fields = [];
      const values = [];
      let paramCount = 1;

      if (userData.name !== undefined) {
        fields.push(`name = $${paramCount}`);
        values.push(userData.name);
        paramCount++;
      }

      if (userData.phone !== undefined) {
        fields.push(`phone = $${paramCount}`);
        values.push(userData.phone);
        paramCount++;
      }

      if (userData.profile_image !== undefined) {
        fields.push(`profile_image = $${paramCount}`);
        values.push(userData.profile_image);
        paramCount++;
      }

      // Always update the updated_at timestamp
      fields.push(`updated_at = CURRENT_TIMESTAMP`);

      // If no fields to update, return null
      if (fields.length === 1) {
        // Only updated_at would be updated
        return null;
      }

      // Add the id as the last parameter
      values.push(id);

      const query = `
        UPDATE users 
        SET ${fields.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING id, name, email, phone, role, profile_image, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (id, hashedPassword) => {
    try {
      await pool.query(
        "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, id]
      );
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  // Save reset token
  saveResetToken: async (email, token, expires) => {
    try {
      const result = await pool.query(
        "UPDATE users SET reset_token = $1, reset_token_expires = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3 RETURNING id",
        [token, expires, email]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error saving reset token:", error);
      throw error;
    }
  },

  // Find user by reset token (only if not expired)
  findByResetToken: async (token) => {
    try {
      const result = await pool.query(
        "SELECT id, name, email FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",
        [token]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error finding user by reset token:", error);
      throw error;
    }
  },

  // Clear reset token
  clearResetToken: async (id) => {
    try {
      await pool.query(
        "UPDATE users SET reset_token = NULL, reset_token_expires = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        [id]
      );
      return true;
    } catch (error) {
      console.error("Error clearing reset token:", error);
      throw error;
    }
  },

  // Check if email exists (useful for registration validation)
  emailExists: async (email) => {
    try {
      const result = await pool.query(
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists",
        [email]
      );
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking email existence:", error);
      throw error;
    }
  },

  // Delete user account
  deleteUser: async (userId) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete all related data first
      // Delete reviews by this customer
      await client.query("DELETE FROM reviews WHERE customer_id = $1", [
        userId,
      ]);

      // Delete appointments by this customer
      await client.query("DELETE FROM appointments WHERE customer_id = $1", [
        userId,
      ]);

      // If user is a barber, delete barber-related data
      const barberCheck = await client.query(
        "SELECT id FROM barbers WHERE user_id = $1",
        [userId]
      );

      if (barberCheck.rows.length > 0) {
        const barberId = barberCheck.rows[0].id;

        // Delete reviews for this barber
        await client.query("DELETE FROM reviews WHERE barber_id = $1", [
          barberId,
        ]);

        // Delete appointments for this barber
        await client.query("DELETE FROM appointments WHERE barber_id = $1", [
          barberId,
        ]);

        // Delete working hours
        await client.query("DELETE FROM working_hours WHERE barber_id = $1", [
          barberId,
        ]);

        // Delete barber record
        await client.query("DELETE FROM barbers WHERE id = $1", [barberId]);
      }

      // Finally, delete the user
      const result = await client.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

module.exports = userModel;
