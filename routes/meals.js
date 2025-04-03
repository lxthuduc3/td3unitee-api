import { Router } from 'express'
import {
  getMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  getMeal,
  calculateIngredientsToBuy,
} from '../controllers/meals.js'
import { authenticateUser, checkAdminPermission, checkRoomLeaderPermission } from '../middlewares/auth.js'

const mealsRouter = Router()

mealsRouter.get('/meals', authenticateUser, checkAdminPermission, getMeals)
mealsRouter.post('/meals', authenticateUser, checkAdminPermission, createMeal)
mealsRouter.patch('/meals/:id', authenticateUser, checkRoomLeaderPermission, updateMeal)
mealsRouter.delete('/meals/:id', authenticateUser, checkAdminPermission, deleteMeal)
mealsRouter.get('/meals/:day/:meal', authenticateUser, getMeal)
mealsRouter.post('/meals/ingredients', authenticateUser, calculateIngredientsToBuy)

export default mealsRouter
