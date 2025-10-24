const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticateToken, authController.getCurrentUser);

// Password reset routes
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
