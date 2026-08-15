import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { userRepository } from '../repositories/user.repository.js'
import { UserRole } from '../types/enums.js'
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js'

const SALT_ROUNDS = 12

export interface AuthTokenPayload {
  sub: string
  role: UserRole
}

function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload
}

// Public self-registration always creates a `public` role account. Staff and
// Administrator accounts are provisioned separately (Stage 09 / Stage 38),
// never through this open endpoint.
export async function registerPublicUser(input: RegisterInput) {
  const existing = await userRepository.findByEmail(input.email)
  if (existing) {
    throw ApiError.conflict('An account with this email already exists', 'EMAIL_IN_USE')
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: UserRole.PUBLIC,
    address: input.address,
  })

  const token = signToken({ sub: user.id, role: user.role as UserRole })
  return { user, token }
}

export async function login(input: LoginInput) {
  const user = await userRepository.findByEmail(input.email)
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS')
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash)
  if (!isValid) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS')
  }

  const token = signToken({ sub: user.id, role: user.role as UserRole })
  return { user, token }
}
