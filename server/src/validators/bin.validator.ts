import { z } from 'zod'

export const addWasteSchema = z.object({
  amountPercent: z.number().min(1).max(100).optional(),
})
export type AddWasteInput = z.infer<typeof addWasteSchema>
