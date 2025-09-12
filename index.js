import express from 'express'
import { connectToDB } from './lib/db.js'
import cors from 'cors'
import { corsBoth } from './lib/cors-configs.js'

import indexRouter from './routes/index.js'

import { initNotificationCronJobs } from './services/auto-notify.js'
import { initNotificationCronJobsEmail } from './services/notification-email.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors(corsBoth))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connectToDB()

app.use(indexRouter)

initNotificationCronJobs()
initNotificationCronJobsEmail()

app.use((req, res) => {
  return res.status(404).json('Not Found')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
