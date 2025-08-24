import { Router } from 'express'
import { authenticateUser } from '../middlewares/auth.js'
import eventController from '../controllers/events.js'

const eventRouter = Router()

eventRouter.get('/events', authenticateUser, eventController.getEventsByWeek)
eventRouter.post('/events', eventController.create)
eventRouter.put('/events/:id', eventController.update)
eventRouter.delete('/events/:id', authenticateUser, eventController.delete)

export default eventRouter
