export interface CollectionRecord {
  _id: string
  binId: { _id: string; name: string; code: string; location: { address: string } } | string
  staffId: { _id: string; name: string } | string
  status: 'pending' | 'in_progress' | 'completed'
  levelBeforeCollection: number
  notes?: string
  completedAt?: string
  createdAt: string
}
