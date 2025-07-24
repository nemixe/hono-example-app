import type { Config } from "drizzle-kit"

export default {
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  driver: "bun:sqlite",
  dbCredentials: {
    url: "./database.db"
  }
} satisfies Config