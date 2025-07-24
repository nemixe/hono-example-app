import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const alatKategori = sqliteTable("alat_kategori", {
  alat_kategori_id: integer("alat_kategori_id").primaryKey({ autoIncrement: true }),
  alat_kategori_nama: text("alat_kategori_nama").notNull(),
  alat_kategori_deskripsi: text("alat_kategori_deskripsi")
})

export const alat = sqliteTable("alat", {
  alat_id: integer("alat_id").primaryKey({ autoIncrement: true }),
  alat_kategori_id: integer("alat_kategori_id").notNull().references(() => alatKategori.alat_kategori_id),
  alat_nama: text("alat_nama").notNull(),
  alat_deskripsi: text("alat_deskripsi"),
  alat_harga_sewa_perhari: integer("alat_harga_sewa_perhari").notNull(),
  alat_stok: integer("alat_stok").notNull().default(0)
})

export const users = sqliteTable("users", {
  user_id: integer("user_id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: text("created_at").notNull()
})