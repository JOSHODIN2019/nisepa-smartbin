import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/features/auth/AuthContext'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/waste-info', label: 'Waste Info' },
  { to: '/smart-bin', label: 'Smart Bin' },
  { to: '/report', label: 'Report Issue' },
]

export function PublicLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-neutral-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-700' : 'text-neutral-600 hover:text-neutral-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-0 py-8">
        <div className="mx-auto max-w-6xl px-6 text-sm text-neutral-500">
          NISEPA SmartBin — an academic prototype for the Niger State Environmental Protection Agency.
        </div>
      </footer>
    </div>
  )
}
