const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
const upload = require("../middleware/upload");

// All routes are protected (require authentication)
router.get("/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateProfile);
router.put(
  "/password/change",
  authenticateToken,
  userController.changePassword
);
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

module.exports = router;
