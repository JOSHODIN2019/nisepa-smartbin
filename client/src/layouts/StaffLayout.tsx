import { DashboardLayout } from './DashboardLayout'

const staffNavItems = [
  { to: '/staff/dashboard', label: 'Dashboard' },
  { to: '/staff/bins', label: 'Bin Monitoring' },
  { to: '/staff/alerts', label: 'Alert Center' },
  { to: '/staff/collections', label: 'Collections' },
]

export function StaffLayout() {
  return <DashboardLayout navItems={staffNavItems} roleLabel="NISEPA Staff" />
}
