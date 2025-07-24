import { Hono } from "hono"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "../models/database"
import { users } from "../models/schema"
import { validateBody } from "../middleware/validation"
import { generateToken } from "../utils/jwt"
import { successResponse, errorResponse } from "../utils/response"

const authRouter = new Hono()

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
})

authRouter.post("/register", validateBody(registerSchema), async (c) => {
  try {
    const { username, email, password } = c.get("validatedData")

    const existingUser = await db
      .select({ user_id: users.user_id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (existingUser.length > 0) {
      return c.json(
        errorResponse("Gagal mendaftarkan user!", { 
          username: ["Username already exists"] 
        }),
        422
      )
    }

    const existingEmail = await db
      .select({ user_id: users.user_id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingEmail.length > 0) {
      return c.json(
        errorResponse("Gagal mendaftarkan user!", { 
          email: ["Email already exists"] 
        }),
        422
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        created_at: new Date().toISOString()
      })
      .returning({
        user_id: users.user_id,
        username: users.username,
        email: users.email,
        created_at: users.created_at
      })

    const token = generateToken({ 
      user_id: result[0].user_id, 
      username: result[0].username 
    })

    return c.json(
      successResponse("Successfully registered user", {
        user: result[0],
        token
      }),
      201
    )
  } catch (error) {
    throw error
  }
})

authRouter.post("/login", validateBody(loginSchema), async (c) => {
  try {
    const { username, password } = c.get("validatedData")

    const user = await db
      .select({
        user_id: users.user_id,
        username: users.username,
        email: users.email,
        password: users.password,
        created_at: users.created_at
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1)

    if (user.length === 0) {
      return c.json(
        errorResponse("Login failed!", { 
          username: ["Invalid username or password"] 
        }),
        422
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password)

    if (!isPasswordValid) {
      return c.json(
        errorResponse("Login failed!", { 
          password: ["Invalid username or password"] 
        }),
        422
      )
    }

    const token = generateToken({ 
      user_id: user[0].user_id, 
      username: user[0].username 
    })

    const { password: _, ...userWithoutPassword } = user[0]

    return c.json(
      successResponse("Successfully logged in", {
        user: userWithoutPassword,
        token
      })
    )
  } catch (error) {
    throw error
  }
})

export default authRouter