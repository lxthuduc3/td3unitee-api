import express from 'express'
import dutyScheduleController from '../controllers/duty-schedule.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const dutyScheduleRouter = express.Router()

dutyScheduleRouter.get('/cooking/:date/:meal', authenticateUser, dutyScheduleController.getCookingByDateAndMeal)
dutyScheduleRouter.get('/type/:type', authenticateUser, dutyScheduleController.getByType)
dutyScheduleRouter.get('/', authenticateUser, dutyScheduleController.getAll)
dutyScheduleRouter.post('/', authenticateUser, checkAdminPermission, dutyScheduleController.upsert)
dutyScheduleRouter.delete('/:id', authenticateUser, checkAdminPermission, dutyScheduleController.delete)

export default dutyScheduleRouter
