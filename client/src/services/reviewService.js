import api from "./api";

const reviewService = {
  // Create a new review
  createReview: async (reviewData) => {
    const response = await api.request("/reviews", {
      method: "POST",
      body: reviewData,
    });
    return response.data;
  },

  // Get all reviews for a barber
  getBarberReviews: async (barberId) => {
    const response = await api.request(`/reviews/barber/${barberId}`);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.request(`/reviews/${reviewId}`, {
      method: "PUT",
      body: reviewData,
    });
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.request(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
    return response.data;
  },
};

export default reviewService;
