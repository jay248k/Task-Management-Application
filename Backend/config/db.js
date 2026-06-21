import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("✅ Database connected successfully");

    client.release(); // Return connection to the pool
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error.message);
  }
};