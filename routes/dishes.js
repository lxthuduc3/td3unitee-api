import { Router } from 'express'
import { getDishes, createDish, updateDish, deleteDish } from '../controllers/dishes.js'
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const dishesRouter = Router()

dishesRouter.get('/dishes', authenticateToken, checkAdminPermission, getDishes)
dishesRouter.post('/dishes', authenticateToken, checkAdminPermission, createDish)
dishesRouter.patch('/dishes/:id', authenticateToken, checkAdminPermission, updateDish)
dishesRouter.delete('/dishes/:id', authenticateToken, checkAdminPermission, deleteDish)

export default dishesRouter
