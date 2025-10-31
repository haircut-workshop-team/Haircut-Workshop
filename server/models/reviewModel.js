const pool = require("../config/database");

const reviewModel = {
  // Create a new review
  createReview: async (
    appointmentId,
    barberId,
    customerId,
    rating,
    comment
  ) => {
    const result = await pool.query(
      `INSERT INTO reviews (appointment_id, barber_id, customer_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
      [appointmentId, barberId, customerId, rating, comment]
    );
    return result.rows[0];
  },

  // Check if review already exists for appointment
  checkExistingReview: async (appointmentId, customerId) => {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE appointment_id = $1 AND customer_id = $2",
      [appointmentId, customerId]
    );
    return result.rows[0];
  },

  // Get all reviews for a barber
  getBarberReviews: async (barberId) => {
    const result = await pool.query(
      `SELECT r.*, u.name AS customer_name, u.profile_image
         FROM reviews r
         JOIN users u ON r.customer_id = u.id
         WHERE r.barber_id = $1
         ORDER BY r.created_at DESC`,
      [barberId]
    );
    return result.rows;
  },

  // Update a review
  updateReview: async (reviewId, rating, comment) => {
    const result = await pool.query(
      `UPDATE reviews 
         SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
      [rating, comment, reviewId]
    );
    return result.rows[0];
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [
      reviewId,
    ]);
    return result.rows[0];
  },

  // Update barber rating after review changes
  updateBarberRating: async (barberId) => {
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
         FROM reviews
         WHERE barber_id = $1`,
      [barberId]
    );

    const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
    const totalReviews = parseInt(result.rows[0].total_reviews) || 0;

    await pool.query(
      `UPDATE barbers
        SET rating = $1, total_reviews = $2
         WHERE id = $3`,
      [avgRating, totalReviews, barberId]
    );
  },
};

module.exports = reviewModel;
