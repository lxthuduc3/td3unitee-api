import { Router } from 'express'
import {
  updateProfile,
  getOwnProfile,
  getMembers,
  getProfile,
  updateMember,
  maskMemberAsLeft,
  getRequests,
  approveRequest,
  rejectAndDeleteRequest,
} from '../controllers/users.js'
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const usersRouter = Router()

usersRouter.get('/me/profile', authenticateToken, getOwnProfile)
usersRouter.patch('/me/profile/edit', authenticateToken, updateProfile)
usersRouter.get('/members', authenticateToken, getMembers)
usersRouter.get('/members/:id', authenticateToken, getProfile)

usersRouter.patch('/members/:id', authenticateToken, checkAdminPermission, updateMember)
usersRouter.patch('/members/:id/mark-as-left', authenticateToken, checkAdminPermission, maskMemberAsLeft)

usersRouter.get('/requests', authenticateToken, checkAdminPermission, getRequests)
usersRouter.patch('/requests/:id', authenticateToken, checkAdminPermission, approveRequest)
usersRouter.delete('/requests/:id', authenticateToken, checkAdminPermission, rejectAndDeleteRequest)

export default usersRouter
