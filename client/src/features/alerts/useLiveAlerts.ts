import { useEffect, useState } from 'react'
import { alertsApi } from './api'
import type { Alert } from './types'
import { useEventStream } from '@/lib/useEventStream'

// Stage 33 — refetches whenever any alert is created, acknowledged, or
// resolved anywhere (including a collection auto-resolving one), not just
// from this tab's own actions.
export function useLiveAlerts() {
  const [alerts, setAlerts] = useState<Alert[] | null>(null)

  function refetch() {
    alertsApi.list().then(({ alerts }) => setAlerts(alerts))
  }

  useEffect(refetch, [])
  useEventStream({ 'alert.created': refetch, 'alert.updated': refetch })

  return { alerts, setAlerts, refetch }
}
