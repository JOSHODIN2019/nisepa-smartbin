import { IssueReport } from '../models/IssueReport.js'

export const issueReportRepository = {
  create(input: { reporterId?: string; description: string; locationText?: string }) {
    return IssueReport.create(input)
  },
}
