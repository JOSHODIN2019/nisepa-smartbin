import type { UserRole } from '@/features/auth/types'

export interface ManagedUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  address: string
}
