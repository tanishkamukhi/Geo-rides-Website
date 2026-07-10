import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../drizzle/schema";

const databaseUrl = process.env.DATABASE_URL || "postgres://user:pass@dummy-placeholder-url.com:5432/georides";

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
