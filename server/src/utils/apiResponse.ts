import type { Response } from 'express'

// Consistent response envelope — PROJECT_MEMORY.md Section 18.
export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data })
}

export function sendError(res: Response, statusCode: number, code: string, message: string) {
  return res.status(statusCode).json({ success: false, error: { code, message } })
}
