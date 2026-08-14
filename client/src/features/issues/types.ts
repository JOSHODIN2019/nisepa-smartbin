export type IssueReportStatus = 'new' | 'reviewed' | 'resolved'

export interface IssueReport {
  _id: string
  reporterId?: { _id: string; name: string; email: string } | string
  description: string
  locationText?: string
  status: IssueReportStatus
  createdAt: string
}
