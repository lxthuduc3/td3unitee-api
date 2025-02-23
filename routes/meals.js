import { Router } from 'express'
import { getMeals, createMeal, updateMeal, deleteMeal, getMeal } from '../controllers/meals.js'
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const mealsRouter = Router()

mealsRouter.get('/meals', authenticateToken, checkAdminPermission, getMeals)
mealsRouter.post('/meals', authenticateToken, checkAdminPermission, createMeal)
mealsRouter.patch('/meals/:id', authenticateToken, checkAdminPermission, updateMeal)
mealsRouter.delete('/meals/:id', authenticateToken, checkAdminPermission, deleteMeal)
mealsRouter.get('/meals/:day/:meal', authenticateToken, getMeal)

export default mealsRouter
