import { z } from 'zod'

export const updateSettingsSchema = z
  .object({
    simulatedWasteMinPercent: z.number().int().min(1).max(100).optional(),
    simulatedWasteMaxPercent: z.number().int().min(1).max(100).optional(),
  })
  .refine(
    (v) => v.simulatedWasteMinPercent === undefined || v.simulatedWasteMaxPercent === undefined || v.simulatedWasteMinPercent <= v.simulatedWasteMaxPercent,
    { message: 'simulatedWasteMinPercent must be <= simulatedWasteMaxPercent' },
  )
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
