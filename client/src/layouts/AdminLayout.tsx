import { DashboardLayout } from './DashboardLayout'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/bins', label: 'Bin Management' },
  { to: '/admin/users', label: 'User Management' },
  { to: '/admin/alerts', label: 'Alerts' },
  { to: '/admin/collections', label: 'Collections' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/activity', label: 'System Activity' },
  { to: '/admin/settings', label: 'Settings' },
]

export function AdminLayout() {
  return <DashboardLayout navItems={adminNavItems} roleLabel="Administrator" />
}
