import { Router } from 'express'
import { findUserByEmailOrCreate, refreshToken, selectHome } from '../controllers/auth.js'
import { authenticateUserAnyStatus } from '../middlewares/auth.js'

const authRouter = Router()

authRouter.post('/auth/google', findUserByEmailOrCreate)
authRouter.post('/auth/google/refresh', refreshToken)
authRouter.post('/auth/select-home', authenticateUserAnyStatus, selectHome)

export default authRouter
