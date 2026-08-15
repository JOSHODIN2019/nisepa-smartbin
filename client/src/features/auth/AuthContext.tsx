import { createContext, use, useCallback, useEffect, useState, type ReactNode } from 'react'
import { api, ApiClientError } from '@/lib/api'
import type { AuthUser } from './types'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (name: string, email: string, password: string, address: string) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get<{ user: AuthUser }>('/auth/me')
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api.post<{ user: AuthUser }>('/auth/login', { email, password })
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, address: string) => {
    const { user } = await api.post<{ user: AuthUser }>('/auth/register', { name, email, password, address })
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await api.post('/auth/logout')
    setUser(null)
  }, [])

  return <AuthContext value={{ user, isLoading, login, register, logout }}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { ApiClientError }
