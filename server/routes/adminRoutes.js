const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const adminController = require("../controllers/adminController");
const barberController = require("../controllers/barberController");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/roleCheck");

/**
 * ============================================
 * DASHBOARD ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics (services, bookings, revenue, barbers)
 * @access  Private (Admin only)
 * @usage   Admin dashboard main stats
 */
router.get(
  "/dashboard/stats",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getDashboardStats
);

/**
 * @route   GET /api/admin/dashboard/activities
 * @desc    Get recent activities
 * @access  Private (Admin only)
 * @usage   Admin dashboard activity feed
 */
router.get(
  "/dashboard/activities",
  authenticateToken,
  authorizeRole("admin"),
  adminController.getRecentActivities
);

/**
 * ============================================
 * SERVICE ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/services
 * @desc    Get all services (admin view with stats)
 * @access  Private (Admin only)
 * @usage   Admin services management page
 */
router.get(
  "/services",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.getAllServices
);

/**
 * @route   GET /api/admin/services/stats
 * @desc    Get service statistics
 * @access  Private (Admin only)
 * @usage   Admin dashboard
 * @note    Must be BEFORE /:id route to avoid conflict
 */
router.get(
  "/services/stats",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.getServiceStats
);

/**
 * @route   GET /api/admin/services/:id
 * @desc    Get single service (admin view)
 * @access  Private (Admin only)
 * @usage   Admin viewing/editing service
 */
router.get(
  "/services/:id",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.getServiceById
);

/**
 * @route   POST /api/admin/services
 * @desc    Create new service
 * @access  Private (Admin only)
 * @usage   Admin adding new service
 * @body    { name, description, price, duration, image_url }
 */
router.post(
  "/services",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.createService
);

/**
 * @route   PUT /api/admin/services/:id
 * @desc    Update existing service
 * @access  Private (Admin only)
 * @usage   Admin editing service
 * @body    { name?, description?, price?, duration?, image_url? }
 */
router.put(
  "/services/:id",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.updateService
);

/**
 * @route   DELETE /api/admin/services/:id
 * @desc    Delete service
 * @access  Private (Admin only)
 * @usage   Admin deleting service
 * @warning Cannot delete if service has appointments
 */
router.delete(
  "/services/:id",
  authenticateToken,
  authorizeRole("admin"),
  serviceController.deleteService
);

/**
 * ============================================
 * BARBER ROUTES
 * ============================================
 */

/**
 * @route   GET /api/admin/barbers
 * @desc    Get all barbers
 * @access  Private (Admin only)
 * @usage   Admin barber management page
 */
router.get(
  "/barbers",
  authenticateToken,
  authorizeRole("admin"),
  barberController.getAllBarbers
);

/**
 * @route   GET /api/admin/barbers/:id
 * @desc    Get single barber by ID
 * @access  Private (Admin only)
 * @usage   Admin viewing/editing barber
 */
router.get(
  "/barbers/:id",
  authenticateToken,
  authorizeRole("admin"),
  barberController.getBarberById
);

/**
 * @route   POST /api/admin/barbers
 * @desc    Create new barber (creates user + barber profile)
 * @access  Private (Admin only)
 * @usage   Admin adding new barber
 * @body    { name, email, password, phone?, specialties?, years_experience?, bio? }
 */
router.post(
  "/barbers",
  authenticateToken,
  authorizeRole("admin"),
  barberController.createBarber
);

/**
 * @route   PUT /api/admin/barbers/:id
 * @desc    Update barber information
 * @access  Private (Admin only)
 * @usage   Admin editing barber
 * @body    { name?, email?, phone?, specialties?, years_experience?, bio? }
 */
router.put(
  "/barbers/:id",
  authenticateToken,
  authorizeRole("admin"),
  barberController.updateBarber
);

/**
 * @route   DELETE /api/admin/barbers/:id
 * @desc    Delete barber
 * @access  Private (Admin only)
 * @usage   Admin deleting barber
 * @warning Cannot delete if barber has pending/confirmed appointments
 */
router.delete(
  "/barbers/:id",
  authenticateToken,
  authorizeRole("admin"),
  barberController.deleteBarber
);

module.exports = router;
