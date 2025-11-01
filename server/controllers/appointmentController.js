const appointmentModel = require("../models/appointmentModel");
const scheduleModel = require("../models/scheduleModel");
const serviceModel = require("../models/serviceModel");

const appointmentController = {
  // Create a new appointment
  createAppointment: async (req, res) => {
    try {
      const {
        service_id,
        barber_id,
        appointment_date,
        appointment_time,
        notes,
      } = req.body;
      const user_id = req.user.id;

      // Validate required fields
      if (!service_id || !barber_id || !appointment_date || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Create appointment
      const appointment = await appointmentModel.createAppointment({
        user_id,
        barber_id,
        service_id,
        appointment_date,
        appointment_time,
        notes: notes || null,
      });

      res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create appointment",
        error: error.message,
      });
    }
  },

  // Get all appointments for logged-in user (customer)
  getMyAppointments: async (req, res) => {
    try {
      const user_id = req.user.id;
      const appointments = await appointmentModel.getAppointmentsByUser(
        user_id
      );

      res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
      });
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load appointments",
        error: error.message,
      });
    }
  },

  // Delete appointment (customer cancels)
  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deleted = await appointmentModel.deleteAppointment(id, user_id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found or you don't have permission to cancel it",
        });
      }

      res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error("Delete appointment error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel appointment",
        error: error.message,
      });
    }
  },

  // Get available time slots for a barber on a specific date
  getAvailability: async (req, res) => {
    try {
      const { barberId } = req.params;
      const { date, service_id } = req.query;

      if (!date || !service_id) {
        return res.status(400).json({
          success: false,
          message: "Date and service_id are required",
        });
      }

      // Get the day of week (0-6, where 0 is Sunday)
      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.getDay();

      // Get barber's working hours for this day
      const schedule = await scheduleModel.getSchedule(barberId);
      const daySchedule = schedule.find((s) => s.day_of_week === dayOfWeek);

      if (!daySchedule || !daySchedule.is_available) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Barber is not available on this day",
        });
      }

      // Get service duration
      const services = await serviceModel.findAll();
      const service = services.find((s) => s.id == service_id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      const serviceDuration = parseInt(service.duration);

      // Get already booked times
      const bookedTimes = await appointmentModel.getBookedTimes(barberId, date);

      // Generate available time slots
      const availableSlots = [];
      const startTime = parseTime(daySchedule.start_time);
      const endTime = parseTime(daySchedule.end_time);

      // Get current time in minutes if the appointment is for today
      const today = new Date();
      const isToday = appointmentDate.toDateString() === today.toDateString();
      const currentTimeInMinutes = isToday
        ? today.getHours() * 60 + today.getMinutes()
        : 0;

      let currentSlot = startTime;
      while (currentSlot + serviceDuration <= endTime) {
        const slotTime = formatTime(currentSlot);
        const slotEndTime = currentSlot + serviceDuration;

        // Skip past time slots if booking for today
        if (isToday && currentSlot <= currentTimeInMinutes) {
          currentSlot += 30; // Move to next 30-minute slot
          continue;
        }

        // Check if this slot overlaps with any booked appointment
        const isBooked = bookedTimes.some((booked) => {
          const bookedStart = parseTime(booked.appointment_time);
          const bookedEnd = bookedStart + parseInt(booked.duration);
          return (
            (currentSlot >= bookedStart && currentSlot < bookedEnd) ||
            (slotEndTime > bookedStart && slotEndTime <= bookedEnd) ||
            (currentSlot <= bookedStart && slotEndTime >= bookedEnd)
          );
        });

        if (!isBooked) {
          availableSlots.push(slotTime);
        }

        currentSlot += 30; // Move to next 30-minute slot
      }

      res.status(200).json({
        success: true,
        data: availableSlots,
      });
    } catch (error) {
      console.error("Get availability error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch availability",
        error: error.message,
      });
    }
  },

  // Get all appointments for a specific user
  getUserAppointments: async (req, res) => {
    try {
      const { userId } = req.params;

      if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view these appointments",
        });
      }

      const appointments = await appointmentModel.getAppointmentsByUser(userId);

      res.status(200).json({
        success: true,
        data: appointments,
        count: appointments.length,
      });
    } catch (error) {
      console.error("Get user appointments error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch appointments",
        error: error.message,
      });
    }
  },
};

// Helper functions for time parsing
function parseTime(timeStr) {
  // Parse "HH:MM:SS" or "HH:MM" to minutes since midnight
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function formatTime(minutes) {
  // Convert minutes since midnight to "HH:MM:SS" format
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}:00`;
}

module.exports = appointmentController;
