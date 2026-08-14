import { api } from '@/lib/api'
import type { ManagedUser } from './types'

export const usersApi = {
  list: () => api.get<{ users: ManagedUser[] }>('/users'),
  create: (input: { name: string; email: string; password: string; role: 'staff' | 'admin' }) =>
    api.post<{ user: ManagedUser }>('/users', input),
  update: (id: string, input: { role?: string; isActive?: boolean }) =>
    api.patch<{ user: ManagedUser }>(`/users/${id}`, input),
}
