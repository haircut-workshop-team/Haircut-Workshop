const barberModel = require("../models/barberModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const barberController = {
  // Get all barbers
  getAllBarbers: async (req, res) => {
    try {
      const barbers = await barberModel.findAll();
      res.status(200).json({
        success: true,
        data: barbers,
      });
    } catch (error) {
      console.error("Get all barbers error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch barbers",
        error: error.message,
      });
    }
  },

  // Get single barber by ID
  getBarberById: async (req, res) => {
    try {
      const { id } = req.params;
      const barber = await barberModel.findById(id);

      if (!barber) {
        return res.status(404).json({
          success: false,
          message: "Barber not found",
        });
      }

      res.status(200).json({
        success: true,
        data: barber,
      });
    } catch (error) {
      console.error("Get barber error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch barber",
        error: error.message,
      });
    }
  },

  // Create new barber
  createBarber: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        specialties,
        years_experience,
        bio,
      } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      // Check if email exists
      const emailExists = await userModel.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: "barber",
      });

      // Create barber profile
      await barberModel.create(newUser.id, {
        specialties: specialties || null,
        years_experience: years_experience || 0,
        bio: bio || null,
      });

      // Get complete barber info
      const completeBarber = await barberModel.findById(newUser.id);

      res.status(201).json({
        success: true,
        message: "Barber created successfully",
        data: completeBarber,
      });
    } catch (error) {
      console.error("Create barber error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create barber",
        error: error.message,
      });
    }
  },

  // Update barber
  updateBarber: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, specialties, years_experience, bio } =
        req.body;

      // Check if barber exists
      const existingBarber = await barberModel.findById(id);
      if (!existingBarber) {
        return res.status(404).json({
          success: false,
          message: "Barber not found",
        });
      }

      // Update user info
      if (name || email || phone) {
        await userModel.update(existingBarber.user_id, { name, email, phone });
      }

      // Update barber profile
      await barberModel.update(id, { specialties, years_experience, bio });

      // Get updated barber
      const updatedBarber = await barberModel.findById(id);

      res.status(200).json({
        success: true,
        message: "Barber updated successfully",
        data: updatedBarber,
      });
    } catch (error) {
      console.error("Update barber error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update barber",
        error: error.message,
      });
    }
  },

  // Delete barber
  deleteBarber: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if barber exists
      const existingBarber = await barberModel.findById(id);
      if (!existingBarber) {
        return res.status(404).json({
          success: false,
          message: "Barber not found",
        });
      }

      // Check for pending/confirmed appointments
      const hasPending = await barberModel.hasPendingAppointments(id);
      if (hasPending) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete barber with pending or confirmed appointments",
        });
      }

      // Delete barber profile
      await barberModel.delete(id);

      // Change user role to customer
      await userModel.update(existingBarber.user_id, { role: "customer" });

      res.status(200).json({
        success: true,
        message: "Barber deleted successfully",
      });
    } catch (error) {
      console.error("Delete barber error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete barber",
        error: error.message,
      });
    }
  },
};

module.exports = barberController;
