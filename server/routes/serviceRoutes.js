const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

/**
 * @route   GET /api/services
 * @desc    Get all services (public)
 * @access  Public
 * @usage   Customer browsing services page
 */
router.get("/", serviceController.getAllServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get single service by ID (public)
 * @access  Public
 * @usage   Customer viewing service details
 */
router.get("/:id", serviceController.getServiceById);

module.exports = router;
