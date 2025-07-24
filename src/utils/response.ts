import type { ApiResponse } from "../types/api"

export function createResponse<T>(
  success: boolean,
  message: string,
  data: T | null = null,
  errors: Record<string, string[]> | string | null = null
): ApiResponse<T> {
  return {
    success,
    message,
    data,
    errors
  }
}

export function successResponse<T>(message: string, data: T): ApiResponse<T> {
  return createResponse(true, message, data, null)
}

export function errorResponse(
  message: string,
  errors: Record<string, string[]> | string | null = null
): ApiResponse<null> {
  return createResponse(false, message, null, errors)
}