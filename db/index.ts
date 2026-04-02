import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });
export default db;
