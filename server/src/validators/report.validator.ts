import { z } from 'zod'

export const generateReportSchema = z.object({
  type: z.literal('collections-summary'),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
})
export type GenerateReportInput = z.infer<typeof generateReportSchema>
