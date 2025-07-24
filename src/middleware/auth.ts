import type { Context, Next } from "hono"
import { verifyToken } from "../utils/jwt"
import { errorResponse } from "../utils/response"

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(errorResponse("Unauthorized access"), 401)
    }
    
    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)
    
    c.set("user", decoded)
    await next()
  } catch (error) {
    return c.json(errorResponse("Invalid or expired token"), 401)
  }
}