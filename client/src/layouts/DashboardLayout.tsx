import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/features/auth/AuthContext'

export interface DashboardNavItem {
  to: string
  label: string
}

export function DashboardLayout({ navItems, roleLabel }: { navItems: DashboardNavItem[]; roleLabel: string }) {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-neutral-0">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <p className="truncate text-sm font-medium text-neutral-900">{user?.name}</p>
          <p className="text-xs text-neutral-500">{roleLabel}</p>
          <button
            onClick={() => logout()}
            className="mt-3 w-full rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
