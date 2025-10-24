const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const userModel = require("../models/userModel");

// Helper function: Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "24h" }
  );
};

// Helper function: Format user response (exclude password)
const formatUserResponse = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profile_image: user.profile_image,
    created_at: user.created_at,
  };
};

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if user exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "customer",
      });

      // Generate token
      const token = generateToken(newUser);

      // Send response
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: formatUserResponse(newUser),
          token,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Login user
  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Check if user exists
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password", // ✅ Clear message
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password", // ✅ Clear message
        });
      }

      // Generate token
      const token = generateToken(user);

      // Send response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: formatUserResponse(user),
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      // Find user by ID from JWT token
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Send response
      res.status(200).json({
        success: true,
        data: formatUserResponse(user),
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Request password reset
  // Request password reset
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Find user
      const user = await userModel.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not (security best practice)
        return res.json({
          success: true,
          message: "If that email exists, a reset link has been sent",
        });
      }

      // Generate reset token (random string)
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Token expires in 1 hour
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      // Save token to database
      await userModel.saveResetToken(email, resetToken, expires);

      // For development only - log to console
      if (process.env.NODE_ENV === "development") {
        console.log("🔑 Reset Token:", resetToken);
        console.log(
          "🔗 Reset Link:",
          `${
            process.env.CLIENT_URL || "http://localhost:5173"
          }/reset-password/${resetToken}`
        );
      }

      // Response - include token ONLY in development
      const response = {
        success: true,
        message: "If that email exists, a reset link has been sent",
      };

      // Add token to response in development (for testing)
      if (process.env.NODE_ENV === "development") {
        response.resetToken = resetToken;
      }

      res.json(response);
    } catch (error) {
      console.error("Request reset error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
  // Reset password with token
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Validate required fields
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Token and new password are required",
        });
      }

      // Find user by reset token
      const user = await userModel.findByResetToken(token);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await userModel.updatePassword(user.id, hashedPassword);

      // Clear reset token
      await userModel.clearResetToken(user.id);

      res.json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = authController;
