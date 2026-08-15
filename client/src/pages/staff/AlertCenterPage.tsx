import { alertsApi } from '@/features/alerts/api'
import { useLiveAlerts } from '@/features/alerts/useLiveAlerts'
import { AlertList } from '@/components/AlertList'

export function AlertCenterPage() {
  const { alerts, setAlerts } = useLiveAlerts()

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
      <h1 className="text-2xl font-semibold text-neutral-900">Alert center</h1>
      <p className="mt-1 text-neutral-500">80%, 90%, and 100% threshold alerts across all bins, live.</p>

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
