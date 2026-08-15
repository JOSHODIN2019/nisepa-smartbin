// In local dev this stays relative and Vite's proxy (vite.config.ts) forwards
// it to the local Express server. In production the client (Vercel) and
// server (Render) are on different domains, so the build needs a full URL —
// set via VITE_API_BASE_URL at build time on Vercel. Exported so
// useEventStream can build the same absolute URL for its raw EventSource
// connection, which doesn't go through this file's fetch wrapper.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiClientError extends Error {
  code: string
  status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
    this.name = 'ApiClientError'
  }
}

type SuccessEnvelope<T> = { success: true; data: T }
type ErrorEnvelope = { success: false; error: { code: string; message: string } }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = (await res.json()) as SuccessEnvelope<T> | ErrorEnvelope

  if (!body.success) {
    throw new ApiClientError(res.status, body.error.code, body.error.message)
  }

  return body.data
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
