import { Pool } from "pg";
//import dotenv from "dotenv";

import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// export const pool = new Pool({
//   host: "127.0.0.1",
//   port: 5432,
//   user: "postgres",
//   password: "root", // <- hardcoded, no quotes
//   database: "Student",
// });

// (async () => {
//   try {
//     await pool.connect();
//     console.log("✅ Connected to PostgreSQL (single client)");
//   } catch (err: any) {
//     console.error("❌ PostgreSQL connection failed:", err.message);
//     process.exit(1);
//   }
// })();
