import type { Config } from "drizzle-kit"

console.log("DATABASE_URL", process.env.DATABASE_URL)

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  connectionString: process.env.DATABASE_URL,
} satisfies Config
