import "dotenv/config";
import assert from "node:assert";
import { defineConfig } from "drizzle-kit";

assert(
  process.env.DATABASE_URL,
  "DATABASE_URL environment variable is required",
);

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
