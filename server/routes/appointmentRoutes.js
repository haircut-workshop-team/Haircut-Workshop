const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");
const authorizeRole = require("../middleware/roleCheck");

// Customer: create appointment
/**
 * @route   POST /api/appointments
 * @desc    Create a new appointment
 * @access  Private (Customer only)
 * @usage   Customer creating an appointment
 */
router.post(
  "/",
  authenticateToken,
  authorizeRole("customer"),
  appointmentController.createAppointment
);

// Customer: get their appointments
/**
 * @route   GET /api/appointments/my
 * @desc    Get all appointments for the logged-in user
 * @access  Private (Customer only)
 * @usage   Customer retrieving their appointments
 */
router.get(
  "/my",
  authenticateToken,
  authorizeRole("customer"),
  appointmentController.getMyAppointments
);

// Customer: delete (cancel) appointment
/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete appointment (user cancels)
 * @access  Private (Customer only)
 * @usage   Customer canceling an appointment
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("customer"),
  appointmentController.deleteAppointment
);

// Get barber availability for a specific date
/**
 * @route   GET /api/appointments/:barberId/availability
 * @desc    Get available time slots for a barber on a specific date
 * @access  Public
 * @usage   Booking page when selecting time slots
 */
router.get("/:barberId/availability", appointmentController.getAvailability);

// Get appointments for a specific user (alternative to /my)
/**
 * @route   GET /api/appointments/user/:userId
 * @desc    Get all appointments for a specific user
 * @access  Private
 * @usage   Customer viewing their appointment history
 */
router.get(
  "/user/:userId",
  authenticateToken,
  appointmentController.getUserAppointments
);

module.exports = router;
