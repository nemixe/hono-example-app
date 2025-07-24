import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { db } from "./src/models/database"

console.log("Running migrations...")

try {
  migrate(db, { migrationsFolder: "./drizzle" })
  console.log("Migrations completed successfully!")
} catch (error) {
  console.error("Migration failed:", error)
  process.exit(1)
}