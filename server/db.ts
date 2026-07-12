import "dotenv/config";

console.log("=================================");
console.log("DATABASE_URL =", process.env.DATABASE_URL);
console.log("=================================");

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../drizzle/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error:", err);
});

export const db = drizzle(pool, { schema });

export { schema };