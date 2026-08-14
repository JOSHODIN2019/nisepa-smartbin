import { useAuth } from '@/features/auth/AuthContext'

export function PublicDashboardPage() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {user?.name}</h1>
      <p className="mt-2 text-neutral-500">Full public dashboard arrives in Stage 15.</p>
    </div>
  )
}
