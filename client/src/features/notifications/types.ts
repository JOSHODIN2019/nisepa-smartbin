export interface AppNotification {
  _id: string
  title: string
  message: string
  read: boolean
  relatedBinId?: string
  createdAt: string
}
