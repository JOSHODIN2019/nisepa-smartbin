import { EventEmitter } from 'node:events'

// In-memory pub/sub for Server-Sent Events (Stage 25). Sufficient for a
// single-process prototype; a real multi-instance deployment would replace
// this with Redis pub/sub or similar, but every publisher/subscriber below
// only depends on this module's two functions, so that swap wouldn't touch
// calling code.
export type EventScope = 'public' | 'staff'

export interface AppEvent {
  type: string
  scope: EventScope
  data: unknown
}

const emitter = new EventEmitter()
emitter.setMaxListeners(0) // unbounded — one listener per connected SSE client

const CHANNEL = 'app-event'

export function emitEvent(event: AppEvent): void {
  emitter.emit(CHANNEL, event)
}

export function subscribe(listener: (event: AppEvent) => void): () => void {
  emitter.on(CHANNEL, listener)
  return () => emitter.off(CHANNEL, listener)
}
