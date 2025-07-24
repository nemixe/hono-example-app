import type { Context, Next } from "hono"
import { z } from "zod"
import { errorResponse } from "../utils/response"

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json()
      const validatedData = schema.parse(body)
      c.set("validatedData", validatedData)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string[]> = {}
        
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          if (!validationErrors[path]) {
            validationErrors[path] = []
          }
          validationErrors[path].push(err.message)
        })
        
        return c.json(
          errorResponse("Validation failed", validationErrors),
          422
        )
      }
      
      return c.json(
        errorResponse("Invalid request body"),
        400
      )
    }
  }
}

export function validateParams<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const params = c.req.param()
      const validatedParams = schema.parse(params)
      c.set("validatedParams", validatedParams)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string[]> = {}
        
        error.errors.forEach((err) => {
          const path = err.path.join(".")
          if (!validationErrors[path]) {
            validationErrors[path] = []
          }
          validationErrors[path].push(err.message)
        })
        
        return c.json(
          errorResponse("Parameter validation failed", validationErrors),
          422
        )
      }
      
      return c.json(
        errorResponse("Invalid parameters"),
        400
      )
    }
  }
}