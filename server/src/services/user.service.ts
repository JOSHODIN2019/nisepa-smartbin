import bcrypt from 'bcryptjs'
import { userRepository } from '../repositories/user.repository.js'
import { ApiError } from '../utils/ApiError.js'
import type { CreateUserInput, UpdateUserInput } from '../validators/user.validator.js'

const SALT_ROUNDS = 12

export async function listUsers() {
  return userRepository.findAll()
}

export async function createStaffOrAdmin(input: CreateUserInput) {
  const existing = await userRepository.findByEmail(input.email)
  if (existing) {
    throw ApiError.conflict('An account with this email already exists', 'EMAIL_IN_USE')
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
  return userRepository.create({ name: input.name, email: input.email, passwordHash, role: input.role })
}

export async function updateUser(id: string, input: UpdateUserInput, actingUserId: string) {
  if (id === actingUserId && input.role && input.role !== 'admin') {
    throw ApiError.badRequest('You cannot change your own admin role', 'CANNOT_DEMOTE_SELF')
  }
  if (id === actingUserId && input.isActive === false) {
    throw ApiError.badRequest('You cannot deactivate your own account', 'CANNOT_DEACTIVATE_SELF')
  }

  const user = await userRepository.updateById(id, input)
  if (!user) throw ApiError.notFound('User not found')
  return user
}
