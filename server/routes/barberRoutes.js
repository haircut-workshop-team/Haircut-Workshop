const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const barberController = require("../controllers/barberController");
const scheduleController = require("../controllers/scheduleController");

//  Get all barbers (for booking page)
/**
 * @route   GET /api/barber/list
 * @desc    Get all barbers (public - for customers to view when booking)
 * @access  Public
 * @usage   Booking page barber selection
 */
router.get("/list", barberController.getAllBarbers);

// All routes below require auth and barber role
router.use(auth);
router.use(roleCheck(["barber"]));

// Dashboard
/**
 * @route   GET /api/barber/dashboard
 * @desc    Get barber dashboard
 * @access  Private (Barber only)
 * @usage   Barber dashboard
 */
router.get("/dashboard", barberController.getDashboard);

// Update appointment status
/**
 * @route   PUT /api/barber/appointments/:id/status
 * @desc    Update appointment status
 * @access  Private (Barber only)
 * @usage   Barber updating appointment status
 */
router.put("/appointments/:id/status", barberController.updateStatus);

// Schedule

/**
 * @route   GET /api/barber/schedule
 * @desc    Get barber schedule
 * @access  Private (Barber only)
 * @usage   Barber schedule
 */
router.get("/schedule", scheduleController.getSchedule);

/**
 * @route   POST /api/barber/schedule
 * @desc    Update barber schedule
 * @access  Private (Barber only)
 * @usage   Barber updating schedule
 * @body    { schedule: [{ day, startTime, endTime, isAvailable }] }
 */
router.post("/schedule", scheduleController.updateSchedule);

/**
 * @route   GET /api/barber/appointments
 * @desc    Get all appointments for the logged-in barber
 * @access  Private (Barber only)
 * @usage   Barber viewing all appointments
 */
router.get("/appointments", barberController.getAllAppointments);

module.exports = router;
