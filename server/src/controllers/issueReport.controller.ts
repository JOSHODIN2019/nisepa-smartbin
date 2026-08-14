import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { createIssueReportSchema } from '../validators/issueReport.validator.js'
import { submitIssueReport, listIssueReports, countNewIssueReports } from '../services/issueReport.service.js'

export const createIssueReport = asyncHandler(async (req: Request, res: Response) => {
  const input = createIssueReportSchema.parse(req.body)
  const report = await submitIssueReport(input, req.auth?.userId)
  sendSuccess(res, { report: { id: report.id, status: report.status, createdAt: report.createdAt } }, 201)
})

export const getIssueReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await listIssueReports()
  sendSuccess(res, { reports })
})

export const getIssueReportStats = asyncHandler(async (_req: Request, res: Response) => {
  const newCount = await countNewIssueReports()
  sendSuccess(res, { newCount })
})
