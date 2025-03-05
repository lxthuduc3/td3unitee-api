import { Router } from 'express'
import { getMeals, createMeal, updateMeal, deleteMeal, getMeal } from '../controllers/meals.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const mealsRouter = Router()

mealsRouter.get('/meals', authenticateUser, checkAdminPermission, getMeals)
mealsRouter.post('/meals', authenticateUser, checkAdminPermission, createMeal)
mealsRouter.patch('/meals/:id', authenticateUser, checkAdminPermission, updateMeal)
mealsRouter.delete('/meals/:id', authenticateUser, checkAdminPermission, deleteMeal)
mealsRouter.get('/meals/:day/:meal', authenticateUser, getMeal)

export default mealsRouter
