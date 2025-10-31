const scheduleModel = require("../models/scheduleModel");
const pool = require("../config/database");

const scheduleController = {
  // Get schedule
  getSchedule: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get barber ID
      const barberResult = await pool.query(
        "SELECT id FROM barbers WHERE user_id = $1",
        [userId]
      );

      if (barberResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Barber profile not found",
        });
      }

      const barberId = barberResult.rows[0].id;
      const schedule = await scheduleModel.getSchedule(barberId);

      res.json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      console.error("Error in getSchedule:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Update schedule
  updateSchedule: async (req, res) => {
    try {
      const userId = req.user.id;
      const { schedule } = req.body;

      // console.log("Received schedule data:", schedule);

      if (!schedule || !Array.isArray(schedule)) {
        return res.status(400).json({
          success: false,
          message: "Schedule array is required",
        });
      }

      // Get barber ID
      const barberResult = await pool.query(
        "SELECT id FROM barbers WHERE user_id = $1",
        [userId]
      );

      if (barberResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Barber profile not found",
        });
      }

      const barberId = barberResult.rows[0].id;

      // Update each day
      const results = [];
      for (const day of schedule) {
        const result = await scheduleModel.upsertSchedule(
          barberId,
          day.dayOfWeek,
          day.startTime,
          day.endTime,
          day.isAvailable
        );
        results.push(result);
      }

      res.json({
        success: true,
        message: "Schedule updated successfully",
        data: results,
      });
    } catch (error) {
      console.error("Error in updateSchedule:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = scheduleController;
