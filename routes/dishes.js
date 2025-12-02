import { Router } from 'express'
import { getDishes, createDish, updateDish, deleteDish } from '../controllers/dishes.js'
import { authenticateUser, checkAdminPermission, checkUserPermission } from '../middlewares/auth.js'

const dishesRouter = Router()

dishesRouter.get('/dishes', authenticateUser, checkUserPermission, getDishes)
dishesRouter.post('/dishes', authenticateUser, checkUserPermission, createDish)
dishesRouter.patch('/dishes/:id', authenticateUser, checkUserPermission, updateDish)
dishesRouter.delete('/dishes/:id', authenticateUser, checkUserPermission, deleteDish)

export default dishesRouter
