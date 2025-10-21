const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");

// All routes are protected (require authentication)
router.get("/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateProfile);
router.put("/password/:id", authenticateToken, userController.changePassword);

module.exports = router;
