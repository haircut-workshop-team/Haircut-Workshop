const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

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

// Helper function: Delete file
const deleteFile = (filePath) => {
  const fs = require("fs");
  const path = require("path");
  const fullPath = path.join(__dirname, "..", filePath);

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log("🗑️ Deleted file:", filePath);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }
  return false;
};

const userController = {
  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const user = await userModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: formatUserResponse(user),
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, profile_image } = req.body;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      // Check if user is updating their own profile
      if (req.user.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own profile",
        });
      }

      // Validate at least one field is provided
      if (!name && !phone && !profile_image) {
        return res.status(400).json({
          success: false,
          message:
            "At least one field (name, phone, or profile_image) is required",
        });
      }

      // Build update object with only provided fields
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (profile_image) updateData.profile_image = profile_image;

      const updatedUser = await userModel.update(id, updateData);

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: formatUserResponse(updatedUser),
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      // Check if new password is same as current password
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from current password",
        });
      }

      // Get user with password
      const user = await userModel.findByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await userModel.updatePassword(userId, hashedPassword);

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Upload avatar
  uploadAvatar: async (req, res) => {
    try {
      const userId = req.user.id;

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image",
        });
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        // Delete uploaded file
        deleteFile(`uploads/avatars/${req.file.filename}`);

        return res.status(400).json({
          success: false,
          message: "Only JPEG, PNG, and WebP images are allowed",
        });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (req.file.size > maxSize) {
        // Delete uploaded file
        deleteFile(`uploads/avatars/${req.file.filename}`);

        return res.status(400).json({
          success: false,
          message: "Image size must be less than 5MB",
        });
      }

      // Get user's current avatar
      const user = await userModel.findById(userId);

      if (!user) {
        // Delete uploaded file if user not found
        deleteFile(`uploads/avatars/${req.file.filename}`);

        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete old avatar if exists
      if (user.profile_image) {
        deleteFile(user.profile_image);
      }

      // Create URL for the uploaded file
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Update user profile with avatar URL
      const updatedUser = await userModel.update(userId, {
        profile_image: avatarUrl,
      });

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          profile_image: avatarUrl,
          user: formatUserResponse(updatedUser),
        },
      });
    } catch (error) {
      console.error("Upload avatar error:", error);

      // Delete uploaded file if database update fails
      if (req.file) {
        deleteFile(`uploads/avatars/${req.file.filename}`);
      }

      res.status(500).json({
        success: false,
        message: "Failed to upload avatar",
      });
    }
  },
};

module.exports = userController;
