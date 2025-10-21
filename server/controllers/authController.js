const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/userModel");

const authController = {
  // register new user
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;

      //   check if the user exist
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exist" });
      }

      // Hash paswword
      const hashedPassword = await bcrypt.hash(password, 10);

      // create the user
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "customer",
      });

      // generate token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      // send response
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // Login function
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // check if the user exist
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalied credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Invalied credentials" });
      }

      // generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      // send response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            created_at: user.created_at,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // get current user
  getCurrentUser: async (req, res) => {
    try {
      // check if the user exist
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // send response
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profile_image: user.profile_image,
        },
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
};

module.exports = authController;
