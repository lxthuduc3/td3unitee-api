import { Router } from 'express'
import { getDishes, createDish, updateDish, deleteDish } from '../controllers/dishes.js'
import { authenticateUser, checkAdminPermission, checkRoomLeaderPermission } from '../middlewares/auth.js'

const dishesRouter = Router()

dishesRouter.get('/dishes', authenticateUser, checkRoomLeaderPermission, getDishes)
dishesRouter.post('/dishes', authenticateUser, checkAdminPermission, createDish)
dishesRouter.patch('/dishes/:id', authenticateUser, checkAdminPermission, updateDish)
dishesRouter.delete('/dishes/:id', authenticateUser, checkAdminPermission, deleteDish)

export default dishesRouter
