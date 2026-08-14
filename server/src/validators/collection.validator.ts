import { z } from 'zod'

export const recordCollectionSchema = z.object({
  notes: z.string().trim().max(500).optional(),
})
export type RecordCollectionInput = z.infer<typeof recordCollectionSchema>
