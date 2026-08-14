import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError.js'
import type { UserRole } from '../types/enums.js'

// Must run after requireAuth. Usage: requireRole('staff', 'admin')
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw ApiError.unauthorized()
    }
    if (!allowedRoles.includes(req.auth.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action')
    }
    next()
  }
}
