import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'

const quickActions = [
  {
    to: '/smart-bin',
    title: 'View the smart bin',
    description: 'See simulated bins and their current fill levels.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l-1 13H7L6 7Zm2-3h8l1 3H7l1-3Z" />
      </svg>
    ),
  },
  {
    to: '/waste-info',
    title: 'Waste information',
    description: 'Learn how NISEPA categorizes and manages waste levels.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3l9 16H3L12 3Z" />
      </svg>
    ),
  },
  {
    to: '/waste-info',
    title: 'Report an issue',
    description: 'Flag a waste problem near you for NISEPA to review.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-4.03-7-7.5-7-10.5A7 7 0 0 1 19 10.5c0 3-2.5 6.47-7 10.5Z" />
        <circle cx="12" cy="10.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function PublicDashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome back, {firstName}</h1>
      <p className="mt-1 text-neutral-500">Here's what you can do on SmartBin.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className="rounded-lg border border-neutral-200 bg-neutral-0 p-5 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              {action.icon}
            </div>
            <h2 className="mt-3 text-sm font-semibold text-neutral-900">{action.title}</h2>
            <p className="mt-1 text-sm text-neutral-500">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-neutral-900">Notifications</h2>
        <div className="mt-3 rounded-lg border border-dashed border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-500">
            No notifications yet. You'll see bin alerts and updates here once you start interacting with a smart bin.
          </p>
        </div>
      </div>
    </div>
  )
}
