import { Router } from 'express'
import {
  getOwnMealRegistrations,
  createMealRegistration,
  updateMealRegistration,
  deleteMealRegistration,
  getMealRegistrationsByMeal,
} from '../controllers/meal-registrations.js'
import { authenticateToken } from '../middlewares/auth.js'

const mealRegistrationRouter = Router()

mealRegistrationRouter.get('/me/meal-registrations', authenticateToken, getOwnMealRegistrations)
mealRegistrationRouter.post('/me/meal-registrations', authenticateToken, createMealRegistration)
mealRegistrationRouter.patch('/me/meal-registrations/:id', authenticateToken, updateMealRegistration)
mealRegistrationRouter.delete('/me/meal-registrations/:id', authenticateToken, deleteMealRegistration)

mealRegistrationRouter.get('/meal-registrations/:date/:meal', authenticateToken, getMealRegistrationsByMeal)

export default mealRegistrationRouter
