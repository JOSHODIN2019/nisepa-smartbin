import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { getUsers, createUser, patchUser } from '../controllers/user.controller.js'

export const userRouter = Router()

// Admin-exclusive per Section 6.3 — Staff cannot manage other users.
userRouter.use(requireAuth, requireRole(UserRole.ADMIN))
userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.patch('/:id', patchUser)
