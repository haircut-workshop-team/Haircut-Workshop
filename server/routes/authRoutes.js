const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 * @usage   Registration page
 * @body    { name, email, password, phone, role }
 * @returns { success, message, data: { user, token } }
 * @note    Role defaults to 'customer' if not specified
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 * @usage   Login page
 * @body    { email, password }
 * @returns { success, message, data: { user, token } }
 * @note    Returns JWT token valid for 24 hours
 */
router.post("/login", authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user's profile
 * @access  Private (Any authenticated user)
 * @usage   Loading user data on app startup, profile page
 * @header  Authorization: Bearer <token>
 * @returns { success, data: { user } }
 * @note    Does not include password in response
 */
router.get("/me", authenticateToken, authController.getCurrentUser);

// Password reset routes \\

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset token
 * @access  Public
 * @usage   Forgot password page
 * @body    { email }
 * @returns { success, message, resetToken? }
 * @note    In development, returns resetToken for testing
 * @note    In production, should send email instead
 */
router.post("/forgot-password", authController.requestPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 * @usage   Reset password page (from email link)
 * @body    { token, newPassword }
 * @returns { success, message }
 * @note    Token expires after 1 hour
 */
router.post("/reset-password", authController.resetPassword);

module.exports = router;
