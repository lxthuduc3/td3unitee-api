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
  newOrLeftMembers,
} from '../controllers/users.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const usersRouter = Router()

usersRouter.get('/me/profile', authenticateUser, getOwnProfile)
usersRouter.patch('/me/profile/edit', authenticateUser, updateProfile)
usersRouter.get('/members', authenticateUser, getMembers)
usersRouter.get('/members/neworleft', authenticateUser, newOrLeftMembers)
usersRouter.get('/members/:id', authenticateUser, getProfile)

usersRouter.patch('/members/:id', authenticateUser, checkAdminPermission, updateMember)
usersRouter.patch('/members/:id/mark-as-left', authenticateUser, checkAdminPermission, maskMemberAsLeft)

usersRouter.get('/requests', authenticateUser, checkAdminPermission, getRequests)
usersRouter.patch('/requests/:id', authenticateUser, checkAdminPermission, approveRequest)
usersRouter.delete('/requests/:id', authenticateUser, checkAdminPermission, rejectAndDeleteRequest)

export default usersRouter
