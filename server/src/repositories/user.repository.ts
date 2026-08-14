import { User } from '../models/User.js'
import type { UserRole } from '../types/enums.js'

export const userRepository = {
  findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  },
  findById(id: string) {
    return User.findById(id)
  },
  create(input: { name: string; email: string; passwordHash: string; role: UserRole }) {
    return User.create(input)
  },
}
