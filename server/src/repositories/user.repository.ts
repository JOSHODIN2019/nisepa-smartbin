import { User } from '../models/User.js'
import type { UserRole } from '../types/enums.js'

export const userRepository = {
  findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  },
  findById(id: string) {
    return User.findById(id)
  },
  create(input: { name: string; email: string; passwordHash: string; role: UserRole; address?: string }) {
    return User.create(input)
  },
  findAll() {
    return User.find().sort({ createdAt: -1 })
  },
  findActiveByRoles(roles: UserRole[]) {
    return User.find({ role: { $in: roles }, isActive: true })
  },
  updateById(id: string, input: { role?: UserRole; isActive?: boolean }) {
    return User.findByIdAndUpdate(id, input, { returnDocument: 'after' })
  },
}
