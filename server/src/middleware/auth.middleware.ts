import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { verifyToken } from '../services/auth.service.js'
import type { UserRole } from '../types/enums.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: { userId: string; role: UserRole }
    }
  }
}

const COOKIE_NAME = 'token'

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined

  if (!token) {
    throw ApiError.unauthorized('Authentication required')
  }

  try {
    const payload = verifyToken(token)
    req.auth = { userId: payload.sub, role: payload.role }
    next()
  } catch {
    throw ApiError.unauthorized('Invalid or expired session')
  }
}

// Attaches req.auth if a valid token is present, but never rejects the
// request — for routes that behave differently for logged-in vs anonymous
// public users without requiring login.
export function attachAuthIfPresent(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined
  if (token) {
    try {
      const payload = verifyToken(token)
      req.auth = { userId: payload.sub, role: payload.role }
    } catch {
      // ignore invalid/expired token for optional-auth routes
    }
  }
  next()
}

export { COOKIE_NAME }
