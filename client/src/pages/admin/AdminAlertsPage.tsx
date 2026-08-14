import { useEffect, useState } from 'react'
import { alertsApi } from '@/features/alerts/api'
import type { Alert } from '@/features/alerts/types'
import { AlertList } from '@/components/AlertList'

export function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null)

  useEffect(() => {
    alertsApi.list().then(({ alerts }) => setAlerts(alerts))
  }, [])

  async function handleAcknowledge(id: string) {
    const { alert } = await alertsApi.acknowledge(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  async function handleResolve(id: string) {
    const { alert } = await alertsApi.resolve(id)
    setAlerts((prev) => prev?.map((a) => (a._id === id ? alert : a)) ?? prev)
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Alert management</h1>
      <p className="mt-1 text-neutral-500">All threshold alerts across the bin network.</p>

      <div className="mt-6">
        {alerts === null ? (
          <p className="text-sm text-neutral-500">Loading alerts…</p>
        ) : (
          <AlertList alerts={alerts} onAcknowledge={handleAcknowledge} onResolve={handleResolve} />
        )}
      </div>
    </div>
  )
}
