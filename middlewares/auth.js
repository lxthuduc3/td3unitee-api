import { OAuth2Client } from 'google-auth-library'
import User from '../models/user.js'

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_ID)

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json('Unauthorized: No token provided')
    }

    const token = authHeader.split(' ')[1]
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(401).json('Unauthorized: Invalid token')
    }

    const user = await User.findOne({ email: payload.email })
    if (!user) {
      return res.status(401).json('Unauthorized: User not found')
    }

    if (req.user.status != 'active') {
      return res.status(403).json('Permission Denied')
    }

    req.user = { id: user._id, role: user.role }
    next()
  } catch (error) {
    console.error('[authenticateUser]', error)
    return res.status(401).json('Unauthorized: Token verification failed')
  }
}

export const checkAdminPermission = (req, res, next) => {
  if (req.user.role != 'executiveBoard') {
    return res.status(403).json('Permission Denied')
  }
  next()
}
