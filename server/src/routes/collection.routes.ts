import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { postCollection, getCollections } from '../controllers/collection.controller.js'

export const collectionRouter = Router()

collectionRouter.use(requireAuth, requireRole(UserRole.STAFF, UserRole.ADMIN))
collectionRouter.get('/', getCollections)
collectionRouter.post('/:binId', postCollection)
