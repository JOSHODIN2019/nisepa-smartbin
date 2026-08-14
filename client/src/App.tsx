import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/features/auth/AuthContext'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { SplashScreen } from '@/components/SplashScreen'
import { PublicLayout } from '@/layouts/PublicLayout'
import { StaffLayout } from '@/layouts/StaffLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LandingPage } from '@/pages/public/LandingPage'
import { PublicDashboardPage } from '@/pages/public/PublicDashboardPage'
import { PlaceholderPage } from '@/pages/public/PlaceholderPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { StaffDashboardPage } from '@/pages/staff/StaffDashboardPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function AppRoutes() {
  const { isLoading } = useAuth()

  // Stage 11: brief branded gate while the initial session check (/api/auth/me)
  // resolves, so the UI doesn't flash between logged-out and logged-in states.
  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="waste-info" element={<PlaceholderPage title="Waste Information" stage="Stage 16" />} />
        <Route path="smart-bin" element={<PlaceholderPage title="Smart Bin Interaction" stage="Stage 17–18" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route element={<RequireAuth allowedRoles={['public', 'staff', 'admin']} />}>
          <Route path="dashboard" element={<PublicDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={['staff', 'admin']} />}>
        <Route path="staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboardPage />} />
          <Route path="bins" element={<PlaceholderPage title="Bin Monitoring" stage="Stage 31" />} />
          <Route path="alerts" element={<PlaceholderPage title="Alert Center" stage="Stage 34" />} />
          <Route path="collections" element={<PlaceholderPage title="Collection Management" stage="Stage 35" />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={['admin']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="bins" element={<PlaceholderPage title="Bin Management" stage="Stage 39" />} />
          <Route path="users" element={<PlaceholderPage title="User Management" stage="Stage 38" />} />
          <Route path="alerts" element={<PlaceholderPage title="Alert Management" stage="Stage 40" />} />
          <Route path="collections" element={<PlaceholderPage title="Collection Records" stage="Stage 41" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" stage="Stage 42" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" stage="Stage 44" />} />
        </Route>
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
