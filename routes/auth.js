import { Router } from 'express'
import { getUserByEmail, findUserByEmailOrCreate, refreshAccessToken } from '../controllers/auth.js'

const authRouter = Router()

authRouter.get('/auth/session/:email', getUserByEmail)
authRouter.post('/auth/login-or-register', findUserByEmailOrCreate)
authRouter.post('/auth/refresh-access-token', refreshAccessToken)

export default authRouter
