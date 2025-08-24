import { Router } from 'express'
import {
  getOwnMealRegistrations,
  createMealRegistration,
  updateMealRegistration,
  deleteMealRegistration,
  getMealRegistrationsByMeal,
} from '../controllers/meal-registrations.js'
import { authenticateUser } from '../middlewares/auth.js'

const mealRegistrationRouter = Router()

mealRegistrationRouter.get('/me/meal-registrations', authenticateUser, getOwnMealRegistrations)
mealRegistrationRouter.post('/me/meal-registrations', authenticateUser, createMealRegistration)
mealRegistrationRouter.patch('/me/meal-registrations/:id', authenticateUser, updateMealRegistration)
mealRegistrationRouter.delete('/me/meal-registrations/:id', authenticateUser, deleteMealRegistration)

mealRegistrationRouter.get('/meal-registrations/:date/:meal', authenticateUser, getMealRegistrationsByMeal)

export default mealRegistrationRouter
