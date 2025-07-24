import type { Context, Next } from "hono"
import { errorResponse } from "../utils/response"

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error("Server error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown server error"
    
    return c.json(
      errorResponse("There was an error on the server", errorMessage),
      500
    )
  }
}