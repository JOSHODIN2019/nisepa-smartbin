import { useAuth } from '@/features/auth/AuthContext'

export function AdminDashboardPage() {
  const { user } = useAuth()
  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {user?.name}</h1>
      <p className="mt-2 text-neutral-500">Full administrator dashboard arrives in Stage 37.</p>
    </div>
  )
}
