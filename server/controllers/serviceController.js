const serviceModel = require("../models/serviceModel");

const serviceController = {
  // Get all services (puplic - no auth needed - can used by customers too)
  getAllServices: async (req, res) => {
    try {
      const services = await serviceModel.findAll();

      res.status(200).json({
        success: true,
        message: "Services retrieved successfully",
        data: services,
        count: services.length,
      });
    } catch (error) {
      console.error("Get all services error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load services. Please try again later.",
      });
    }
  },

  // Get service by ID (public)
  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }

      const service = await serviceModel.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Service retrieved successfully",
        data: service,
      });
    } catch (error) {
      console.error("Get service by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load service details. Please try again later.",
      });
    }
  },

  // Create service (Admin only)
  createService: async (req, res) => {
    try {
      const { name, description, price, duration, image_url } = req.body;

      // Validate required fields
      if (!name || !description || !price || !duration) {
        return res.status(400).json({
          success: false,
          message: "Name, description, price, and duration are required",
        });
      }

      // Validate name length
      if (name.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Service name must be at least 3 characters long",
        });
      }

      if (name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: "Service name must be less than 100 characters",
        });
      }

      // Validate price
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
      }

      if (priceNum > 10000) {
        return res.status(400).json({
          success: false,
          message: "Price cannot exceed 10,000",
        });
      }

      // Validate duration
      const durationNum = parseInt(duration);
      if (isNaN(durationNum) || durationNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Duration must be a positive number (in minutes)",
        });
      }

      if (durationNum > 480) {
        return res.status(400).json({
          success: false,
          message: "Duration cannot exceed 8 hours (480 minutes)",
        });
      }

      // Check if service name already exists
      const nameExists = await serviceModel.nameExists(name.trim());
      if (nameExists) {
        return res.status(409).json({
          success: false,
          message: `A service named "${name.trim()}" already exists`,
        });
      }

      // Create service
      const newService = await serviceModel.create({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        duration: durationNum,
        image_url: image_url?.trim() || null,
      });

      res.status(201).json({
        success: true,
        message: `Service "${newService.name}" created successfully`,
        data: newService,
      });
    } catch (error) {
      console.error("Create service error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create service. Please try again later.",
      });
    }
  },

  // Update service (Admin only)
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, duration, image_url } = req.body;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }

      // Check if service exists
      const existingService = await serviceModel.findById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // Validate if at least one field is provided
      if (
        !name &&
        !description &&
        !price &&
        !duration &&
        image_url === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one field must be provided to update",
        });
      }

      // Build update data object
      const updateData = {};

      // Validate and add name
      if (name !== undefined) {
        if (name.trim().length < 3) {
          return res.status(400).json({
            success: false,
            message: "Service name must be at least 3 characters long",
          });
        }

        if (name.trim().length > 100) {
          return res.status(400).json({
            success: false,
            message: "Service name must be less than 100 characters",
          });
        }

        // Check if new name already exists (excluding current service)
        const nameExists = await serviceModel.nameExists(name.trim(), id);
        if (nameExists) {
          return res.status(409).json({
            success: false,
            message: `A service named "${name.trim()}" already exists`,
          });
        }

        updateData.name = name.trim();
      }

      // Validate and add description
      if (description !== undefined) {
        if (description.trim().length < 10) {
          return res.status(400).json({
            success: false,
            message: "Description must be at least 10 characters long",
          });
        }
        updateData.description = description.trim();
      }

      // Validate and add price
      if (price !== undefined) {
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
          return res.status(400).json({
            success: false,
            message: "Price must be a positive number",
          });
        }

        if (priceNum > 10000) {
          return res.status(400).json({
            success: false,
            message: "Price cannot exceed 10,000",
          });
        }

        updateData.price = priceNum;
      }

      // Validate and add duration
      if (duration !== undefined) {
        const durationNum = parseInt(duration);
        if (isNaN(durationNum) || durationNum <= 0) {
          return res.status(400).json({
            success: false,
            message: "Duration must be a positive number (in minutes)",
          });
        }

        if (durationNum > 480) {
          return res.status(400).json({
            success: false,
            message: "Duration cannot exceed 8 hours (480 minutes)",
          });
        }

        updateData.duration = durationNum;
      }

      // Add image_url
      if (image_url !== undefined) {
        updateData.image_url = image_url?.trim() || null;
      }

      // Update service
      const updatedService = await serviceModel.update(id, updateData);

      res.json({
        success: true,
        message: `Service "${updatedService.name}" updated successfully`,
        data: updatedService,
      });
    } catch (error) {
      console.error("Update service error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update service. Please try again later.",
      });
    }
  },

  // Delete service (Admin only)
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ID
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID",
        });
      }

      // Check if service exists
      const existingService = await serviceModel.findById(id);
      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // Delete service
      const deletedService = await serviceModel.delete(id);

      res.status(200).json({
        success: true,
        message: `Service "${deletedService.name}" deleted successfully`,
      });
    } catch (error) {
      console.error("Delete service error:", error);

      // Handle specific error for services with appointments
      if (error.message.includes("existing appointments")) {
        return res.status(409).json({
          success: false,
          message:
            "Cannot delete this service because it has existing appointments. Please cancel or complete all appointments first.",
        });
      }
      res.status(500).json({
        success: false,
        message: "Failed to delete service. Please try again later.",
      });
    }
  },

  // Get service statistics (Admin only)
  getServiceStats: async (req, res) => {
    try {
      const stats = await serviceModel.getStats();

      res.json({
        success: true,
        message: "Service statistics retrieved successfully",
        data: {
          total_services: parseInt(stats.total_services),
          average_price: parseFloat(stats.average_price || 0).toFixed(2),
          lowest_price: parseFloat(stats.lowest_price || 0).toFixed(2),
          highest_price: parseFloat(stats.highest_price || 0).toFixed(2),
        },
      });
    } catch (error) {
      console.error("Get service stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load service statistics. Please try again later.",
      });
    }
  },
};

module.exports = serviceController;
