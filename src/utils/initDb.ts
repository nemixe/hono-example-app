import { db } from "../models/database"
import { alatKategori } from "../models/schema"

export async function initializeDatabase() {
  try {
    await db.insert(alatKategori).values([
      {
        alat_kategori_nama: "Smartphone",
        alat_kategori_deskripsi: "Mobile phones and tablets"
      },
      {
        alat_kategori_nama: "Laptop",
        alat_kategori_deskripsi: "Portable computers and notebooks"
      },
      {
        alat_kategori_nama: "Camera",
        alat_kategori_deskripsi: "Digital cameras and video equipment"
      }
    ]).onConflictDoNothing()
    
    console.log("Database initialized with sample categories")
  } catch (error) {
    console.log("Categories may already exist, skipping initialization")
  }
}