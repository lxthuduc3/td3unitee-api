import { Router } from 'express'
import { subscribe, unsubscribe, getSubscriptions, getAdminSubscriptions } from '../controllers/subcriptions.js'
import {
  getNotifications,
  getNotification,
  markNotificationAsRead,
  createNotification,
  sendNotification,
  deleteNotification,
} from '../controllers/notifications.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const notificationsRouter = Router()

notificationsRouter.get('/notifications/subscriptions', authenticateUser, getSubscriptions)
notificationsRouter.get('/notifications/subscriptions/admin', authenticateUser, getAdminSubscriptions)
notificationsRouter.post('/notifications', authenticateUser, checkAdminPermission, createNotification)
notificationsRouter.post('/notifications/send', authenticateUser, sendNotification)
notificationsRouter.delete('/notifications/:id', authenticateUser, checkAdminPermission, deleteNotification)

notificationsRouter.post('/notifications/subscribe', authenticateUser, subscribe)
notificationsRouter.post('/notifications/unsubscribe', authenticateUser, unsubscribe)
notificationsRouter.get('/notifications', authenticateUser, getNotifications)
notificationsRouter.get('/notifications/:id', authenticateUser, getNotification)
notificationsRouter.patch('/notifications/:id/mark-as-read', authenticateUser, markNotificationAsRead)

export default notificationsRouter
