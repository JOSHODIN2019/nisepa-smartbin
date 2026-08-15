import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { alertsApi } from '@/features/alerts/api'
import { issuesApi } from '@/features/issues/api'
import { useLiveBins } from '@/features/bins/useLiveBins'
import { useLiveAlerts } from '@/features/alerts/useLiveAlerts'
import { StatTile } from '@/components/StatTile'
import { AlertList } from '@/components/AlertList'

export function AdminDashboardPage() {
  const { user } = useAuth()
  const { bins } = useLiveBins()
  const { alerts, setAlerts } = useLiveAlerts()
  const [newReportCount, setNewReportCount] = useState<number | null>(null)

  useEffect(() => {
    issuesApi.stats().then(({ newCount }) => setNewReportCount(newCount))
  }, [])

  async function handleAcknowledge(id: string) {
    const { alert } = await alertsApi.acknowledge(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  async function handleResolve(id: string) {
    const { alert } = await alertsApi.resolve(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  const activeAlertCount = alerts?.filter((a) => a.status !== 'resolved').length ?? 0
  const newAlerts = alerts?.filter((a) => a.status !== 'resolved').slice(0, 5) ?? []

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome, {user?.name}</h1>
      <p className="mt-1 text-neutral-500">System-wide overview of the SmartBin network, live.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="Registered bins" value={bins?.length ?? 0} accentBg="bg-neutral-100" accentDot="bg-neutral-400" />
        <StatTile label="Active alerts" value={activeAlertCount} accentBg="bg-status-full-bg" accentDot="bg-status-full" />
        <StatTile label="New issue reports" value={newReportCount ?? 0} accentBg="bg-status-warning-bg" accentDot="bg-status-warning" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Active alerts</h2>
        <Link to="/admin/alerts" className="text-sm font-medium text-brand-700 hover:underline">
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
