import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { alertsApi } from '@/features/alerts/api'
import { useLiveBins } from '@/features/bins/useLiveBins'
import { useLiveAlerts } from '@/features/alerts/useLiveAlerts'
import { StatTile } from '@/components/StatTile'
import { AlertList } from '@/components/AlertList'

export function StaffDashboardPage() {
  const { user } = useAuth()
  const { bins } = useLiveBins()
  const { alerts, setAlerts } = useLiveAlerts()

  async function handleAcknowledge(id: string) {
    const { alert } = await alertsApi.acknowledge(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  async function handleResolve(id: string) {
    const { alert } = await alertsApi.resolve(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  const counts = {
    normal: bins?.filter((b) => b.status === 'normal').length ?? 0,
    warning: bins?.filter((b) => b.status === 'warning').length ?? 0,
    high_priority: bins?.filter((b) => b.status === 'high_priority').length ?? 0,
    full: bins?.filter((b) => b.status === 'full').length ?? 0,
  }

  const newAlerts = alerts?.filter((a) => a.status !== 'resolved').slice(0, 5) ?? []

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {user?.name}</h1>
      <p className="mt-1 text-neutral-500">Here's the current state of the bin network, live.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Normal bins" value={counts.normal} accentBg="bg-status-normal-bg" accentDot="bg-status-normal" />
        <StatTile label="Warning bins" value={counts.warning} accentBg="bg-status-warning-bg" accentDot="bg-status-warning" />
        <StatTile label="High priority bins" value={counts.high_priority} accentBg="bg-status-high-bg" accentDot="bg-status-high" />
        <StatTile label="Full bins" value={counts.full} accentBg="bg-status-full-bg" accentDot="bg-status-full" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Active alerts</h2>
        <Link to="/staff/alerts" className="text-sm font-medium text-brand-700 hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-3">
        {alerts === null ? (
          <p className="text-sm text-neutral-500">Loading alerts…</p>
        ) : (
          <AlertList alerts={newAlerts} onAcknowledge={handleAcknowledge} onResolve={handleResolve} />
        )}
      </div>
    </div>
  )
}
