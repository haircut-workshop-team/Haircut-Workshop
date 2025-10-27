const pool = require("../config/database");

const adminModel = {
  // Get total services count
  getTotalServices: async () => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) as total FROM services WHERE is_active = true"
      );
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error("Error getting total services:", error);
      throw error;
    }
  },

  // Get total appointments count
  getTotalAppointments: async () => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) as total FROM appointments"
      );
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error("Error getting total appointments:", error);
      throw error;
    }
  },

  // Get total revenue
  getTotalRevenue: async () => {
    try {
      const result = await pool.query(`
        SELECT COALESCE(SUM(s.price), 0) as total 
        FROM appointments a 
        JOIN services s ON a.service_id = s.id 
        WHERE a.status = 'completed'
      `);
      return parseFloat(result.rows[0].total);
    } catch (error) {
      console.error("Error getting total revenue:", error);
      throw error;
    }
  },

  // Get total barbers count
  getTotalBarbers: async () => {
    try {
      const result = await pool.query("SELECT COUNT(*) as total FROM barbers");
      return parseInt(result.rows[0].total);
    } catch (error) {
      console.error("Error getting total barbers:", error);
      throw error;
    }
  },

  // Get recent bookings
  getRecentBookings: async (limit = 5) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          a.id,
          a.appointment_date,
          a.appointment_time,
          a.status,
          u.name as customer_name,
          u.email as customer_email,
          bu.name as barber_name,
          s.name as service_name,
          s.price as service_price
        FROM appointments a
        JOIN users u ON a.customer_id = u.id
        JOIN barbers b ON a.barber_id = b.id
        JOIN users bu ON b.user_id = bu.id
        JOIN services s ON a.service_id = s.id
        ORDER BY a.created_at DESC
        LIMIT $1
      `,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting recent bookings:", error);
      throw error;
    }
  },

  // Get monthly revenue
  getMonthlyRevenue: async (months = 6) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          TO_CHAR(a.appointment_date, 'Mon') as month,
          EXTRACT(MONTH FROM a.appointment_date) as month_num,
          COALESCE(SUM(s.price), 0) as revenue
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.status = 'completed'
          AND a.appointment_date >= CURRENT_DATE - INTERVAL '${months} months'
        GROUP BY month, month_num
        ORDER BY month_num
      `
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting monthly revenue:", error);
      throw error;
    }
  },

  // Get appointments by status
  getStatusBreakdown: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM appointments
        GROUP BY status
      `);
      return result.rows;
    } catch (error) {
      console.error("Error getting status breakdown:", error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async (days = 7, limit = 10) => {
    try {
      const result = await pool.query(
        `
        SELECT * FROM (
          -- New user registrations
          SELECT 
            'user_registered' as type,
            u.name as actor,
            u.role as role,
            u.created_at as timestamp,
            'registered as ' || u.role as action
          FROM users u
          WHERE u.created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
          
          UNION ALL
          
          -- New appointments
          SELECT 
            'appointment_created' as type,
            u.name as actor,
            'customer' as role,
            a.created_at as timestamp,
            'booked ' || s.name as action
          FROM appointments a
          JOIN users u ON a.customer_id = u.id
          JOIN services s ON a.service_id = s.id
          WHERE a.created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
          
          UNION ALL
          
          -- New reviews
          SELECT 
            'review_added' as type,
            u.name as actor,
            'customer' as role,
            r.created_at as timestamp,
            'left a ' || r.rating || ' star review' as action
          FROM reviews r
          JOIN users u ON r.customer_id = u.id
          WHERE r.created_at >= CURRENT_TIMESTAMP - INTERVAL '${days} days'
        ) activities
        ORDER BY timestamp DESC
        LIMIT $1
      `,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error("Error getting recent activities:", error);
      throw error;
    }
  },
};

module.exports = adminModel;
