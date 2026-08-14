export type UserRole = 'public' | 'staff' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}
