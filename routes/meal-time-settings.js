import { Router } from 'express'
import { getMealTimeSetting, updateMealTimeSetting } from '../controllers/meal-time-settings.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const mealTimeSettingsRouter = Router()

mealTimeSettingsRouter.get('/meal-time-settings', authenticateUser, getMealTimeSetting)
mealTimeSettingsRouter.put('/meal-time-settings', authenticateUser, checkAdminPermission, updateMealTimeSetting)

export default mealTimeSettingsRouter
