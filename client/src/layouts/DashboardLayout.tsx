import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/features/auth/AuthContext'
import { NotificationBell } from '@/components/NotificationBell'

export interface DashboardNavItem {
  to: string
  label: string
}

export function DashboardLayout({ navItems, roleLabel }: { navItems: DashboardNavItem[]; roleLabel: string }) {
  const { user, logout } = useAuth()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b border-neutral-200 px-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.endsWith('dashboard')}
            onClick={() => setIsNavOpen(false)}
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
    </>
  )

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-neutral-0 px-4 lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <NotificationBell />
          <button
            onClick={() => setIsNavOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile off-canvas backdrop */}
      {isNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-950/40 lg:hidden"
          onClick={() => setIsNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full transform flex-col border-r border-neutral-200 bg-neutral-0 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isNavOpen ? 'translate-x-0' : ''
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="hidden h-14 items-center justify-end border-b border-neutral-200 bg-neutral-0 px-6 lg:flex">
          <NotificationBell />
        </div>
        <Outlet />
      </main>
    </div>
  )
}
