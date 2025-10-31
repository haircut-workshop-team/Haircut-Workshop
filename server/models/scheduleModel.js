const pool = require("../config/database");

const scheduleModel = {
  // Get barber's schedule
  getSchedule: async (barberId) => {
    try {
      const query = `
        SELECT * FROM working_hours
        WHERE barber_id = $1
        ORDER BY day_of_week ASC
      `;

      const result = await pool.query(query, [barberId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching schedule: ${error.message}`);
    }
  },

  // Update or create schedule for a day
  upsertSchedule: async (
    barberId,
    dayOfWeek,
    startTime,
    endTime,
    isAvailable
  ) => {
    try {
      const query = `
        INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_available)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (barber_id, day_of_week)
        DO UPDATE SET 
          start_time = $3,
          end_time = $4,
          is_available = $5,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const result = await pool.query(query, [
        barberId,
        dayOfWeek,
        startTime,
        endTime,
        isAvailable,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating schedule: ${error.message}`);
    }
  },
};

module.exports = scheduleModel;
