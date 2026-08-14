import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { getNotifications, markRead } from '../controllers/notification.controller.js'

export const notificationRouter = Router()

notificationRouter.use(requireAuth)
notificationRouter.get('/', getNotifications)
notificationRouter.patch('/:id/read', markRead)
