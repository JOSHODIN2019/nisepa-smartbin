import { useEffect, useRef } from 'react'
import { API_BASE } from './api'

type EventHandlers = Record<string, (data: unknown) => void>

// Stage 25/33 — subscribes to the server's SSE stream (/api/events) for the
// lifetime of the calling component. Handlers are read via a ref so the
// subscription itself only opens once per mount (stable connection) while
// always calling the latest closures — callers don't need to memoize.
export function useEventStream(handlers: EventHandlers) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    // withCredentials is required once client and server are on different
    // origins (production) — without it the browser won't attach the auth
    // cookie, so the server can never tell a staff/admin connection apart
    // from a public one and staff-scoped events silently stop arriving.
    const source = new EventSource(`${API_BASE}/events`, { withCredentials: true })
    const types = Object.keys(handlersRef.current)
    const listeners = types.map((type) => {
      const listener = (e: MessageEvent) => handlersRef.current[type]?.(JSON.parse(e.data))
      source.addEventListener(type, listener)
      return { type, listener }
    })

    return () => {
      listeners.forEach(({ type, listener }) => source.removeEventListener(type, listener))
      source.close()
    }
    // Intentionally empty — see the ref pattern above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
