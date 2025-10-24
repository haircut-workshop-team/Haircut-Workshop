const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool with configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Pool configuration
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to PostgreSQL database:", err.message);
    process.exit(1);
  } else {
    console.log(
      `✅ Connected to PostgreSQL database "${process.env.DB_NAME}" on port ${process.env.DB_PORT}`
    );
    release();
  }
});

// Handle unexpected errors on idle clients
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle PostgreSQL client:", err.message);
  // Don't exit - let the app handle it gracefully
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("\n🔄 Closing database connections...");
  try {
    await pool.end();
    console.log("✅ Database pool has ended");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during database shutdown:", err.message);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

module.exports = pool;
