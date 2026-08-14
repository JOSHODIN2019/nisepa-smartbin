import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { sendError } from '../utils/apiResponse.js'

export function notFoundHandler(req: Request, res: Response) {
  sendError(res, 404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`)
}

// Must have 4 params to be recognized as Express error middleware.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.code, err.message)
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
    return sendError(res, 400, 'VALIDATION_ERROR', message)
  }

  console.error('[unhandled error]', err)

  // Never leak stack traces — PROJECT_MEMORY.md Section 19.
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : (err as Error)?.message || 'Internal server error'
  return sendError(res, 500, 'INTERNAL_ERROR', message)
}
