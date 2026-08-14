import { z } from 'zod'

export const createIssueReportSchema = z.object({
  description: z.string().trim().min(10, 'Please describe the issue in at least 10 characters').max(1000),
  locationText: z.string().trim().max(200).optional(),
})
export type CreateIssueReportInput = z.infer<typeof createIssueReportSchema>
