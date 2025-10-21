const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool "CONFIGURATION"
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Connect to the database
pool.on("connect", () => {
  console.log(
    "Connected to PostgreSQL database on prot " + process.env.DB_PORT
  );
});

// Handle errors
pool.on("error", (err) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
