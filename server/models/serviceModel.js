const pool = require("../config/database");

const serviceModel = {
  // Get all services
  findAll: async () => {
    try {
      const result = await pool.query(
        "SELECT id, name, description, price, duration, image_url, created_at FROM services ORDER BY created_at DESC"
      );

      return result.rows;
    } catch (error) {
      console.error("Error finding all services:", error);
      throw new Error("Failed to retrieve services from database");
    }
  },

  // Get sevice by ID
  findById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT id, name, description, price, duration, image_url, created_at FROM services WHERE id = $1",
        [id]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error finding service by id:", error);
      throw new Error("Failed to retrieve service from database");
    }
  },

  // check if servie name exists (for duplication prevention)
  nameExists: async (name, excludeId = null) => {
    try {
      let query =
        "SELECT EXISTS(SELECT 1 FROM services WHERE LOWER(name) = LOWER($1)";
      const params = [name];

      if (excludeId) {
        query += " AND id != $2";
        params.push(excludeId);
      }

      query += ") as exists";

      const result = await pool.query(query, params);
      return result.rows[0].exists;
    } catch (error) {
      console.error("Error checking service name:", error);
      throw new Error("Failed to validate service name");
    }
  },

  // Create a new service
  create: async (serviceData) => {
    try {
      const { name, description, price, duration, image_url } = serviceData;

      // Insert the new service into the database
      const result = await pool.query(
        `INSERT INTO services (name, description, price, duration, image_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name, description, price, duration, image_url, created_at`,
        [name, description, price, duration, image_url || null]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error creating service:", error);
      throw new Error("Failed to create service in database");
    }
  },

  // update service
  update: async (id, serviceData) => {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // check if any fields are provided
      if (serviceData.name !== undefined) {
        fields.push(`name = $${paramCount}`);
        values.push(serviceData.name);
        paramCount++;
      }

      if (serviceData.description !== undefined) {
        fields.push(`description = $${paramCount}`);
        values.push(serviceData.description);
        paramCount++;
      }

      if (serviceData.price !== undefined) {
        fields.push(`price = $${paramCount}`);
        values.push(serviceData.price);
        paramCount++;
      }

      if (serviceData.duration !== undefined) {
        fields.push(`duration = $${paramCount}`);
        values.push(serviceData.duration);
        paramCount++;
      }

      if (serviceData.image_url !== undefined) {
        fields.push(`image_url = $${paramCount}`);
        values.push(serviceData.image_url);
        paramCount++;
      }

      if (fields.length === 0) {
        return null;
      }

      values.push(id);

      const query = `
        UPDATE services 
        SET ${fields.join(", ")} 
        WHERE id = $${paramCount}
        RETURNING id, name, description, price, duration, image_url, created_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service in database");
    }
  },

  // Delete service
  delete: async (id) => {
    try {
      // Check if service has appointments
      const appointmentsCheck = await pool.query(
        "SELECT COUNT(*) as count FROM appointments WHERE service_id = $1",
        [id]
      );

      if (parseInt(appointmentsCheck.rows[0].count) > 0) {
        throw new Error("Cannot delete service with existing appointments");
      }

      const result = await pool.query(
        "DELETE FROM services WHERE id = $1 RETURNING id, name",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },

  // Get service statistics (for dashboard)
  getStats: async () => {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_services,
          AVG(price) as average_price,
          MIN(price) as lowest_price,
          MAX(price) as highest_price
        FROM services
      `);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting service stats:", error);
      throw new Error("Failed to retrieve service statistics");
    }
  },
};

module.exports = serviceModel;
