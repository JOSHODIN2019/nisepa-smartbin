import { z } from 'zod'
import { BinLocationType } from '../types/enums.js'

export const addWasteSchema = z.object({
  amountPercent: z.number().min(1).max(100).optional(),
})
export type AddWasteInput = z.infer<typeof addWasteSchema>

export const createBinSchema = z.object({
  code: z.string().trim().min(2).max(50),
  name: z.string().trim().min(2).max(100),
  address: z.string().trim().min(2).max(200),
  capacityLiters: z.number().int().min(1).max(10000),
  locationType: z.enum([BinLocationType.ROADSIDE, BinLocationType.HOUSE]).optional(),
  assignedUserId: z.string().trim().min(1).optional(),
})
export type CreateBinInput = z.infer<typeof createBinSchema>

export const updateBinSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  address: z.string().trim().min(2).max(200).optional(),
  capacityLiters: z.number().int().min(1).max(10000).optional(),
  isActive: z.boolean().optional(),
  locationType: z.enum([BinLocationType.ROADSIDE, BinLocationType.HOUSE]).optional(),
  assignedUserId: z.string().trim().min(1).nullable().optional(),
})
export type UpdateBinInput = z.infer<typeof updateBinSchema>
