import express from 'express'
import { connectToDB } from './lib/db.js'
import cors from 'cors'
import { corsBoth } from './lib/cors-configs.js'

import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import mealRegistrationRouter from './routes/meal-registrations.js'
import transactionsRouter from './routes/transactions.js'
import transactionCategoriesRouter from './routes/transaction-categories.js'
import absencesRouter from './routes/absences.js'
import dishesRouter from './routes/dishes.js'
import mealsRouter from './routes/meals.js'
import notificationsRouter from './routes/notifications.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors(corsBoth))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectToDB()

app.use(authRouter)
app.use(usersRouter)
app.use(mealRegistrationRouter)
app.use(transactionsRouter)
app.use(transactionCategoriesRouter)
app.use(absencesRouter)
app.use(dishesRouter)
app.use(mealsRouter)
app.use(notificationsRouter)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
