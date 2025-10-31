const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes are protected (require authentication)

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Private (Any authenticated user)
 * @usage   Viewing any user's public profile
 * @params  id - User ID (integer)
 * @header  Authorization: Bearer <token>
 * @returns { success, data: { user } }
 * @note    Password is excluded from response
 * @note    Can view any user's profile (public info)
 */
router.get("/:id", authenticateToken, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile information
 * @access  Private (Own profile only)
 * @usage   Edit profile page
 * @params  id - User ID (integer)
 * @header  Authorization: Bearer <token>
 * @body    { name?, phone?, profile_image? }
 * @returns { success, message, data: { user } }
 * @note    Users can only update their own profile
 * @note    Only provided fields will be updated
 */
router.put("/:id", authenticateToken, userController.updateProfile);

/**
 * @route   PUT /api/users/password/change
 * @desc    Change user password
 * @access  Private (Own account only)
 * @usage   Change password page, security settings
 * @header  Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 * @returns { success, message }
 * @note    Validates current password before changing
 * @note    New password must be at least 6 characters
 * @note    Cannot reuse current password
 */
router.put(
  "/password/change",
  authenticateToken,
  userController.changePassword
);

/**
 * @route   POST /api/users/avatar
 * @desc    Upload user profile avatar/picture
 * @access  Private (Own account only)
 * @usage   Profile picture upload
 * @header  Authorization: Bearer <token>
 * @body    FormData with 'avatar' field
 * @returns { success, message, data: { profile_image, user } }
 * @note    Accepts: JPEG, PNG, WebP (max 5MB)
 * @note    Automatically deletes old avatar when uploading new one
 * @note    File saved to /uploads/avatars/
 * @note    Accessible at: /uploads/avatars/filename.jpg
 */
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  (err, req, res, next) => {
    // Multer error handler
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
    next();
  },
  userController.uploadAvatar
);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (soft or hard delete)
 * @access  Private (Own account only)
 * @usage   Account deletion from profile settings
 * @header  Authorization: Bearer <token>
 * @body    { password }
 * @returns { success, message }
 * @note    Requires password confirmation
 * @note    Deletes all user data and associated records
 * @note    Also deletes profile image if exists
 * @note    This action cannot be undone
 */
router.delete("/account", authenticateToken, userController.deleteAccount);

module.exports = router;
