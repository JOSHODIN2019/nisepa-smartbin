import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/features/auth/AuthContext'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { SplashScreen } from '@/components/SplashScreen'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { StaffLayout } from '@/layouts/StaffLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LandingPage } from '@/pages/public/LandingPage'
import { PublicDashboardPage } from '@/pages/public/PublicDashboardPage'
import { PlaceholderPage } from '@/pages/public/PlaceholderPage'
import { WasteInfoPage } from '@/pages/public/WasteInfoPage'
import { SmartBinPage } from '@/pages/public/SmartBinPage'
import { ReportIssuePage } from '@/pages/public/ReportIssuePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { StaffDashboardPage } from '@/pages/staff/StaffDashboardPage'
import { BinMonitoringPage } from '@/pages/staff/BinMonitoringPage'
import { AlertCenterPage } from '@/pages/staff/AlertCenterPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminBinsPage } from '@/pages/admin/AdminBinsPage'
import { AdminAlertsPage } from '@/pages/admin/AdminAlertsPage'
import { UserManagementPage } from '@/pages/admin/UserManagementPage'
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
        <Route path="waste-info" element={<WasteInfoPage />} />
        <Route path="smart-bin" element={<SmartBinPage />} />
        <Route path="report" element={<ReportIssuePage />} />

        <Route element={<RequireAuth allowedRoles={['public', 'staff', 'admin']} />}>
          <Route path="dashboard" element={<PublicDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth allowedRoles={['staff', 'admin']} />}>
        <Route path="staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboardPage />} />
          <Route path="bins" element={<BinMonitoringPage />} />
          <Route path="alerts" element={<AlertCenterPage />} />
          <Route path="collections" element={<PlaceholderPage title="Collection Management" stage="Stage 35" />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={['admin']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="bins" element={<AdminBinsPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="alerts" element={<AdminAlertsPage />} />
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
