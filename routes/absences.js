import { Router } from 'express'
import {
  getOwnAbsences,
  createAbsence,
  cancelAbsence,
  getAbsences,
  getAbsencesByWeek,
} from '../controllers/absences.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const absencesRouter = Router()

absencesRouter.get('/me/absences', authenticateUser, getOwnAbsences)
absencesRouter.post('/me/absences', authenticateUser, createAbsence)
absencesRouter.patch('/me/absences/:id', authenticateUser, cancelAbsence)

absencesRouter.get('/absences/week', authenticateUser, checkAdminPermission, getAbsencesByWeek)
absencesRouter.get('/absences', authenticateUser, checkAdminPermission, getAbsences)

export default absencesRouter
