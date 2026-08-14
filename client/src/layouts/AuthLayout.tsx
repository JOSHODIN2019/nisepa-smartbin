import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const benefits = [
  'Real-time visibility into every monitored bin',
  'Automatic 80% / 90% / 100% threshold alerts',
  'A clear, auditable collection history',
]

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-brand-700 to-brand-900 p-10 text-white lg:flex">
        <Link to="/">
          <Logo variant="light" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold">Monitoring waste, together.</h2>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-brand-50">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-brand-200">NISEPA SmartBin — an academic prototype.</p>
      </div>

      <div className="flex flex-col">
        <div className="p-6 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
