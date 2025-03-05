import { Router } from 'express'
import { subscribe, unsubscribe } from '../controllers/subcriptions.js'
import {
  getNotifications,
  getNotification,
  createNotification,
  deleteNotification,
} from '../controllers/notifications.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const notificationsRouter = Router()

notificationsRouter.post('/notifications/subscribe', authenticateUser, subscribe)
notificationsRouter.post('/notifications/unsubscribe', authenticateUser, unsubscribe)
notificationsRouter.get('/notifications', authenticateUser, getNotifications)
notificationsRouter.get('/notifications/:id', authenticateUser, getNotification)

notificationsRouter.post('/notifications', authenticateUser, checkAdminPermission, createNotification)
notificationsRouter.delete('/notifications/:id', authenticateUser, checkAdminPermission, deleteNotification)

export default notificationsRouter
