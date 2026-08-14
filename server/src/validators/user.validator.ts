import { z } from 'zod'
import { UserRole } from '../types/enums.js'

// Admin can only provision staff/admin accounts here — public accounts come
// through open self-registration (auth.validator.ts), never this endpoint.
export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
  role: z.enum([UserRole.STAFF, UserRole.ADMIN]),
})
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  role: z.enum([UserRole.PUBLIC, UserRole.STAFF, UserRole.ADMIN]).optional(),
  isActive: z.boolean().optional(),
})
export type UpdateUserInput = z.infer<typeof updateUserSchema>
