import { Router } from 'express'
import { findUserByEmailOrCreate, refreshToken } from '../controllers/auth.js'

const authRouter = Router()

authRouter.post('/auth/google', findUserByEmailOrCreate)
authRouter.post('/auth/google/refresh', refreshToken)

export default authRouter
