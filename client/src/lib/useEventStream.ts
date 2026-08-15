import { useEffect, useRef } from 'react'

type EventHandlers = Record<string, (data: unknown) => void>

// Stage 25/33 — subscribes to the server's SSE stream (/api/events) for the
// lifetime of the calling component. Handlers are read via a ref so the
// subscription itself only opens once per mount (stable connection) while
// always calling the latest closures — callers don't need to memoize.
export function useEventStream(handlers: EventHandlers) {
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers

  useEffect(() => {
    const source = new EventSource('/api/events')
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
