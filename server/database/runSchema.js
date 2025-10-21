const fs = require("fs");
const pool = require("../config/database");

// Read the SQL file as plain text
const schema = fs.readFileSync("./schema.sql", "utf8");

// Run the SQL commands in the file
pool
  .query(schema)
  .then(() => {
    console.log("✅ All tables created successfully!");
    pool.end(); // close connection
  })
  .catch((err) => {
    console.error("❌ Error creating tables:", err);
    pool.end(); // close connection
  });
