const fs = require("fs");
const pool = require("../config/database");

async function runSQLFiles() {
  try {
    const schema = fs.readFileSync("./schema.sql", "utf8");
    const addResetToken = fs.readFileSync("./add_reset_token.sql", "utf8");

    await pool.query(schema);
    console.log("✅ schema.sql executed successfully!");

    await pool.query(addResetToken);
    console.log("✅ add_reset_token.sql executed successfully!");

    pool.end();
  } catch (err) {
    console.error("❌ Error executing SQL files:", err);
    pool.end();
  }
}

runSQLFiles();
