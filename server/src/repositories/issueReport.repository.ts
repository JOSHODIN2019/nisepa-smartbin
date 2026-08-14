import { IssueReport, type IssueReportStatus } from '../models/IssueReport.js'

export const issueReportRepository = {
  create(input: { reporterId?: string; description: string; locationText?: string }) {
    return IssueReport.create(input)
  },
  findAll(limit = 100) {
    return IssueReport.find().sort({ createdAt: -1 }).limit(limit).populate('reporterId', 'name email')
  },
  countByStatus(status: IssueReportStatus) {
    return IssueReport.countDocuments({ status })
  },
}
