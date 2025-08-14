import { Hono } from "hono"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "../models/database"
import { alat, alatKategori } from "../models/schema"
import { validateBody, validateParams } from "../middleware/validation"
import { authMiddleware } from "../middleware/auth"
import { successResponse, errorResponse } from "../utils/response"

const alatRouter = new Hono()

const createAlatSchema = z.object({
  alat_kategori_id: z.number().int().positive("Category ID must be a positive integer"),
  alat_nama: z.string().min(1, "Equipment name is required"),
  alat_deskripsi: z.string().optional(),
  alat_harga_sewa_perhari: z.number().int().positive("Daily rental price must be a positive number"),
  alat_stok: z.number().int().min(0, "Stock must be zero or positive")
})

const updateAlatSchema = z.object({
  alat_kategori_id: z.number().int().positive("Category ID must be a positive integer").optional(),
  alat_nama: z.string().min(1, "Equipment name is required").optional(),
  alat_deskripsi: z.string().optional(),
  alat_harga_sewa_perhari: z.number().int().positive("Daily rental price must be a positive number").optional(),
  alat_stok: z.number().int().min(0, "Stock must be zero or positive").optional()
})

const paramSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number)
})

alatRouter.get("/", authMiddleware, async (c) => {
  try {
    const result = await db
      .select({
        alat_id: alat.alat_id,
        alat_kategori_id: alat.alat_kategori_id,
        alat_nama: alat.alat_nama,
        alat_deskripsi: alat.alat_deskripsi,
        alat_harga_sewa_perhari: alat.alat_harga_sewa_perhari,
        alat_stok: alat.alat_stok
      })
      .from(alat)

    return c.json(successResponse("Successfully get alat data", result))
  } catch (error) {
    throw error
  }
})

alatRouter.get("/:id", authMiddleware, validateParams(paramSchema), async (c) => {
  try {
    const { id } = c.get("validatedParams")
    
    const result = await db
      .select({
        alat_id: alat.alat_id,
        alat_kategori_id: alat.alat_kategori_id,
        alat_nama: alat.alat_nama,
        alat_deskripsi: alat.alat_deskripsi,
        alat_harga_sewa_perhari: alat.alat_harga_sewa_perhari,
        alat_stok: alat.alat_stok
      })
      .from(alat)
      .where(eq(alat.alat_id, id))
      .limit(1)

    if (result.length === 0) {
      return c.json(errorResponse("Equipment not found"), 404)
    }

    return c.json(successResponse("Successfully get alat data", result[0]))
  } catch (error) {
    throw error
  }
})

alatRouter.post("/", authMiddleware, validateBody(createAlatSchema), async (c) => {
  try {
    const validatedData = c.get("validatedData")
    
    const categoryExists = await db
      .select({ alat_kategori_id: alatKategori.alat_kategori_id })
      .from(alatKategori)
      .where(eq(alatKategori.alat_kategori_id, validatedData.alat_kategori_id))
      .limit(1)

    if (categoryExists.length === 0) {
      return c.json(
        errorResponse("Gagal menambahkan data alat!", { 
          alat_kategori_id: ["Category not found"] 
        }),
        422
      )
    }

    const result = await db
      .insert(alat)
      .values(validatedData)
      .returning({
        alat_id: alat.alat_id,
        alat_kategori_id: alat.alat_kategori_id,
        alat_nama: alat.alat_nama,
        alat_deskripsi: alat.alat_deskripsi,
        alat_harga_sewa_perhari: alat.alat_harga_sewa_perhari,
        alat_stok: alat.alat_stok
      })

    return c.json(successResponse("Successfully created alat data", result[0]), 201)
  } catch (error) {
    throw error
  }
})

alatRouter.patch("/:id", authMiddleware, validateParams(paramSchema), validateBody(updateAlatSchema), async (c) => {
  try {
    const { id } = c.get("validatedParams")
    const validatedData = c.get("validatedData")

    const existingAlat = await db
      .select({ alat_id: alat.alat_id })
      .from(alat)
      .where(eq(alat.alat_id, id))
      .limit(1)

    if (existingAlat.length === 0) {
      return c.json(errorResponse("Equipment not found"), 404)
    }

    if (validatedData.alat_kategori_id) {
      const categoryExists = await db
        .select({ alat_kategori_id: alatKategori.alat_kategori_id })
        .from(alatKategori)
        .where(eq(alatKategori.alat_kategori_id, validatedData.alat_kategori_id))
        .limit(1)

      if (categoryExists.length === 0) {
        return c.json(
          errorResponse("Gagal mengupdate data alat!", { 
            alat_kategori_id: ["Category not found"] 
          }),
          422
        )
      }
    }

    const result = await db
      .update(alat)
      .set(validatedData)
      .where(eq(alat.alat_id, id))
      .returning({
        alat_id: alat.alat_id,
        alat_kategori_id: alat.alat_kategori_id,
        alat_nama: alat.alat_nama,
        alat_deskripsi: alat.alat_deskripsi,
        alat_harga_sewa_perhari: alat.alat_harga_sewa_perhari,
        alat_stok: alat.alat_stok
      })

    return c.json(successResponse("Successfully updated alat data", result[0]))
  } catch (error) {
    throw error
  }
})

alatRouter.delete("/:id", authMiddleware, validateParams(paramSchema), async (c) => {
  try {
    const { id } = c.get("validatedParams")

    const existingAlat = await db
      .select({ alat_id: alat.alat_id })
      .from(alat)
      .where(eq(alat.alat_id, id))
      .limit(1)

    if (existingAlat.length === 0) {
      return c.json(errorResponse("Equipment not found"), 404)
    }

    await db
      .delete(alat)
      .where(eq(alat.alat_id, id))

    return c.json(successResponse("Successfully deleted alat data", null))
  } catch (error) {
    throw error
  }
})

export default alatRouter