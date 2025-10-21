const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const userController = {
  // get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // update user profile
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, profile_image } = req.body;

      // check if user is updating their own profile
      if (req.user.id !== parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own profile",
        });
      }

      const updatedUser = await userModel.update(id, {
        name,
        phone,
        profile_image,
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // get user with password
      const user = await userModel.findByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      // verify current password
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

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // update password
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
};

module.exports = userController;
