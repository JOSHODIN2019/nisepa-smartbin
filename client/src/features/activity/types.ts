export interface ActivityLogEntry {
  _id: string
  userId?: { _id: string; name: string; email: string; role: string } | string
  action: string
  targetType: string
  targetId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}
