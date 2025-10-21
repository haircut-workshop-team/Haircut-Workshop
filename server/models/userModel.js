const pool = require("../config/database");

// using pormise
const userModel = {
  // Find a user by email
  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  // Find a user by id
  findById: async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    return result.rows[0];
  },

  // Create a new user
  create: async (userData) => {
    const { name, email, password, phone, role } = userData;
    const result = await pool.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [name, email, password, phone, role]
    );
    return result.rows[0];
  },

  // Update a user
  update: async (id, userData) => {
    const { name, phone, profile_image } = userData;
    const result = await pool.query(
      "UPDATE users SET name = $1, phone = $2, profile_image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, phone, role, profile_image",
      [name, phone, profile_image, id]
    );
    return result.rows[0];
  },

  // Update a user password
  updatePassword: async (id, hashedPassword) => {
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, id]
    );
  },
};

module.exports = userModel;
