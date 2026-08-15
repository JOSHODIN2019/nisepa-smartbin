import { Router } from 'express'
import { attachAuthIfPresent } from '../middleware/auth.middleware.js'
import { subscribe } from '../realtime/eventBus.js'
import { UserRole } from '../types/enums.js'

export const eventsRouter = Router()

// Server-Sent Events (Stage 25) — one-directional, simplest reliable option
// per PROJECT_MEMORY.md Section 27. Open to anyone (bin fill levels are
// already public data via GET /api/bins), but "staff"-scoped events (alerts,
// collections — internal to NISEPA) are only forwarded to authenticated
// staff/admin connections.
eventsRouter.get('/', attachAuthIfPresent, (req, res) => {
  const canSeeStaffEvents = req.auth?.role === UserRole.STAFF || req.auth?.role === UserRole.ADMIN

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no', // disable proxy buffering (nginx et al.) if ever deployed behind one
  })
  res.write(':ok\n\n') // opening comment so the client knows the stream is live

  const unsubscribe = subscribe((event) => {
    if (event.scope === 'staff' && !canSeeStaffEvents) return
    res.write(`event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`)
  })

  // Keep the connection alive through idle proxies/load balancers.
  const heartbeat = setInterval(() => res.write(':heartbeat\n\n'), 25000)

  req.on('close', () => {
    clearInterval(heartbeat)
    unsubscribe()
  })
})
