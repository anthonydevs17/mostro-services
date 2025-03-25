import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../../../.env.development")
});

async function migrate() {
  const scriptArgs = process.argv.slice(2);
  const shouldInsertData = scriptArgs.includes("--insert-data");

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // Run table creation migration
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, "migrations/0000_create_agent_config.sql"),
      "utf-8"
    );
    await pool.query(createTableSQL);
    console.log("Table creation migration completed successfully");

    // Run data insertion migration only if flag is set
    if (shouldInsertData) {
      const insertDataSQL = fs.readFileSync(
        path.join(__dirname, "migrations/0001_insert_sample_agents.sql"),
        "utf-8"
      );
      await pool.query(insertDataSQL);
      console.log("Data insertion migration completed successfully");
    } else {
      console.log("Skipping data insertion migration");
    }

    console.log("All migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
