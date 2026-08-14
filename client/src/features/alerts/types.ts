export type AlertStatus = 'new' | 'acknowledged' | 'resolved'

export interface Alert {
  _id: string
  binId: { _id: string; name: string; code: string; location: { address: string } } | string
  threshold: 80 | 90 | 100
  status: AlertStatus
  message: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedAt?: string
  createdAt: string
}
