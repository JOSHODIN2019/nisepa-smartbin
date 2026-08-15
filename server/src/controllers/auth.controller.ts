import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'
import { registerPublicUser, login as loginService } from '../services/auth.service.js'
import { userRepository } from '../repositories/user.repository.js'
import { COOKIE_NAME } from '../middleware/auth.middleware.js'

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // aligned with default JWT_EXPIRES_IN (7d)

function setAuthCookie(res: Response, token: string) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  })
}

function toPublicUser(user: { id: string; name: string; email: string; role: string; address?: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address ?? '' }
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body)
  const { user, token } = await registerPublicUser(input)
  setAuthCookie(res, token)
  sendSuccess(res, { user: toPublicUser(user) }, 201)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body)
  const { user, token } = await loginService(input)
  setAuthCookie(res, token)
  sendSuccess(res, { user: toPublicUser(user) })
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME)
  sendSuccess(res, { loggedOut: true })
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw ApiError.unauthorized()
  }
  const user = await userRepository.findById(req.auth.userId)
  if (!user) {
    throw ApiError.unauthorized('Account no longer exists')
  }
  sendSuccess(res, { user: toPublicUser(user) })
})
