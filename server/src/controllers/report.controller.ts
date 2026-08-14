import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { generateReportSchema } from '../validators/report.validator.js'
import { generateCollectionsSummaryReport, listReports, getReport } from '../services/report.service.js'

export const postReport = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const { periodStart, periodEnd } = generateReportSchema.parse(req.body)
  const report = await generateCollectionsSummaryReport(req.auth.userId, periodStart, periodEnd)
  sendSuccess(res, { report }, 201)
})

export const getReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await listReports()
  sendSuccess(res, { reports })
})

export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const report = await getReport(req.params.id as string)
  sendSuccess(res, { report })
})
