import { Router } from 'express'
import { updateProfile, getOwnProfile, getMembers, getProfile } from '../controllers/profiles.js'
import { authenticateToken } from '../middlewares/auth.js'

const profilesRouter = Router()

profilesRouter.get('/me/profile', authenticateToken, getOwnProfile)
profilesRouter.patch('/me/profile/edit', authenticateToken, updateProfile)
profilesRouter.get('/members', authenticateToken, getMembers)
profilesRouter.get('/members/:id', authenticateToken, getProfile)

export default profilesRouter
