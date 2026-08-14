import { issueReportRepository } from '../repositories/issueReport.repository.js'
import type { CreateIssueReportInput } from '../validators/issueReport.validator.js'

export async function submitIssueReport(input: CreateIssueReportInput, reporterId?: string) {
  return issueReportRepository.create({
    reporterId,
    description: input.description,
    locationText: input.locationText,
  })
}

export async function listIssueReports() {
  return issueReportRepository.findAll()
}

export async function countNewIssueReports() {
  return issueReportRepository.countByStatus('new')
}
