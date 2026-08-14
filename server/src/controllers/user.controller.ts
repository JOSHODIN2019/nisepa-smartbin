import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { createUserSchema, updateUserSchema } from '../validators/user.validator.js'
import { listUsers, createStaffOrAdmin, updateUser } from '../services/user.service.js'
import type { UserDoc } from '../models/User.js'
import type { HydratedDocument } from 'mongoose'

function toUserDTO(user: HydratedDocument<UserDoc>) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }
}

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await listUsers()
  sendSuccess(res, { users: users.map(toUserDTO) })
})

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const input = createUserSchema.parse(req.body)
  const user = await createStaffOrAdmin(input)
  sendSuccess(res, { user: toUserDTO(user) }, 201)
})

export const patchUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const input = updateUserSchema.parse(req.body)
  const user = await updateUser(req.params.id as string, input, req.auth.userId)
  sendSuccess(res, { user: toUserDTO(user) })
})
