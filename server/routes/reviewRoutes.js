const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

// Get all reviews for a barber
router.get("/barber/:barberId", reviewController.getBarberReviews);

// Create a review (authenticated customers only)
router.post("/", authenticateToken, reviewController.createReview);

// Update a review (authenticated user, owner only)
router.put("/:id", authenticateToken, reviewController.updateReview);

// Delete a review (authenticated user, owner only)
router.delete("/:id", authenticateToken, reviewController.deleteReview);

module.exports = router;
