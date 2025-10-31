const reviewModel = require("../models/reviewModel");
const appointmentModel = require("../models/appointmentModel");

const reviewController = {
  // Create a new review
  createReview: async (req, res) => {
    try {
      const { appointment_id, barber_id, rating, comment } = req.body;
      const customer_id = req.user.id;

      // Validate required fields
      if (!appointment_id || !barber_id || !rating) {
        return res
          .status(400)
          .json({ message: "Appointment, barber, and rating are required" });
      }

      // Validate rating range
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      // Check if appointment exists and belongs to customer
      const appointment = await appointmentModel.getAppointmentById(
        appointment_id
      );
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (appointment.customer_id !== customer_id) {
        return res
          .status(403)
          .json({ message: "You can only review your own appointments" });
      }

      // Check if appointment is completed
      if (appointment.status !== "completed") {
        return res
          .status(400)
          .json({ message: "You can only review completed appointments" });
      }

      // Check if review already exists
      const existingReview = await reviewModel.checkExistingReview(
        appointment_id,
        customer_id
      );
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this appointment" });
      }

      // Create review
      const review = await reviewModel.createReview(
        appointment_id,
        barber_id,
        customer_id,
        rating,
        comment || ""
      );

      // Update barber's average rating
      await reviewModel.updateBarberRating(barber_id);

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        review,
      });
    } catch (err) {
      console.error("Error creating review:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get all reviews for a barber
  getBarberReviews: async (req, res) => {
    try {
      const { barberId } = req.params;

      const reviews = await reviewModel.getBarberReviews(barberId);

      res.json({
        success: true,
        reviews,
      });
    } catch (err) {
      console.error("Error fetching barber reviews:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update a review
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const customer_id = req.user.id;

      // Validate rating
      if (rating && (rating < 1 || rating > 5)) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      // Check if review exists and belongs to customer
      const review = await reviewModel.getReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review.customer_id !== customer_id) {
        return res
          .status(403)
          .json({ message: "You can only update your own reviews" });
      }

      // Update review
      const updatedReview = await reviewModel.updateReview(id, rating, comment);

      // Update barber's average rating
      await reviewModel.updateBarberRating(review.barber_id);

      res.json({
        success: true,
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (err) {
      console.error("Error updating review:", err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete a review
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const customer_id = req.user.id;

      // Check if review exists and belongs to customer
      const review = await reviewModel.getReviewById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review.customer_id !== customer_id) {
        return res
          .status(403)
          .json({ message: "You can only delete your own reviews" });
      }

      const barberId = review.barber_id;

      // Delete review
      await reviewModel.deleteReview(id);

      // Update barber's average rating
      await reviewModel.updateBarberRating(barberId);

      res.json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = reviewController;
