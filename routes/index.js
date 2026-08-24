import { Router } from 'express'
import authRouter from './auth.js'
import usersRouter from './users.js'
import mealRegistrationRouter from './meal-registrations.js'
import transactionsRouter from './transactions.js'
import transactionCategoriesRouter from './transaction-categories.js'
import absencesRouter from './absences.js'
import dishesRouter from './dishes.js'
import mealsRouter from './meals.js'
import notificationsRouter from './notifications.js'
import documentsRouter from './documents.js'
import statisticsRouter from './statistics.js'
import eventRouter from './events.js'
import dutyScheduleRouter from './duty-schedule.js'
import homesRouter from './homes.js'
import mealTimeSettingsRouter from './meal-time-settings.js'

const indexRouter = Router()

indexRouter.use(authRouter)
indexRouter.use(homesRouter)
indexRouter.use(mealTimeSettingsRouter)
indexRouter.use(usersRouter)
indexRouter.use(mealRegistrationRouter)
indexRouter.use(transactionsRouter)
indexRouter.use(transactionCategoriesRouter)
indexRouter.use(absencesRouter)
indexRouter.use(dishesRouter)
indexRouter.use(mealsRouter)
indexRouter.use(notificationsRouter)
indexRouter.use(documentsRouter)
indexRouter.use(statisticsRouter)
indexRouter.use(eventRouter)
indexRouter.use('/duty-schedules', dutyScheduleRouter)

export default indexRouter
