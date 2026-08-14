import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { UserRole } from './types'

export function RequireAuth({ allowedRoles }: { allowedRoles: UserRole[] }) {
  // Safe to read synchronously: <AppRoutes> only renders this tree once the
  // initial /api/auth/me check has resolved (see App.tsx's SplashScreen gate).
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
