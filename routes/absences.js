import { Router } from 'express'
import { getOwnAbsences, createAbsence, cancelAbsence, getAbsences } from '../controllers/absences.js'
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const absencesRouter = Router()

absencesRouter.get('/me/absences', authenticateToken, getOwnAbsences)
absencesRouter.post('/me/absences', authenticateToken, createAbsence)
absencesRouter.patch('/me/absences/:id', authenticateToken, cancelAbsence)

absencesRouter.get('/absences', authenticateToken, checkAdminPermission, getAbsences)

export default absencesRouter
