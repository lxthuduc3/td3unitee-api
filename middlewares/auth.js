import { OAuth2Client } from 'google-auth-library'
import { performance } from 'node:perf_hooks'
import User from '../models/user.js'

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_ID)

const CRON_TIMEZONE = 'Asia/Ho_Chi_Minh'
const formatVNTime = (date) => date.toLocaleString('vi-VN', { timeZone: CRON_TIMEZONE, hour12: false })

export const warmUpGoogleCerts = async () => {
  const startedAt = new Date()
  const startedAtMs = performance.now()

  try {
    await oAuth2Client.getFederatedSignonCertsAsync()
    const durationMs = performance.now() - startedAtMs
    console.log(`[warmUpGoogleCerts] ${formatVNTime(startedAt)} - ${durationMs.toFixed(1)}ms`)
  } catch (error) {
    const durationMs = performance.now() - startedAtMs
    console.error(`[warmUpGoogleCerts] ${formatVNTime(startedAt)} - failed after ${durationMs.toFixed(1)}ms:`, error)
  }
}

const verifyGoogleToken = async (req) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  })

  return ticket.getPayload()
}

export const authenticateUser = async (req, res, next) => {
  try {
    const payload = await verifyGoogleToken(req)
    if (!payload) {
      return res.status(401).json('Unauthorized: No token provided')
    }

    const user = await User.findOne({ email: payload.email })
    if (!user) {
      return res.status(401).json('Unauthorized: User not found')
    }

    if (user.status != 'active') {
      return res.status(403).json('Permission Denied')
    }

    if (!user.home) {
      return res.status(403).json('Permission Denied: User chưa thuộc home nào')
    }

    req.user = { id: user._id, role: user.role, home: user.home }
    next()
  } catch (error) {
    console.error('[authenticateUser]', error)
    return res.status(401).json('Unauthorized: Token verification failed')
  }
}

// Dùng cho các bước diễn ra trước khi tài khoản được kích hoạt hoàn toàn
// (vd: chọn home sau khi đăng nhập Google lần đầu) - không chặn theo status/home.
export const authenticateUserAnyStatus = async (req, res, next) => {
  try {
    const payload = await verifyGoogleToken(req)
    if (!payload) {
      return res.status(401).json('Unauthorized: No token provided')
    }

    const user = await User.findOne({ email: payload.email })
    if (!user) {
      return res.status(401).json('Unauthorized: User not found')
    }

    req.user = { id: user._id, role: user.role, home: user.home, status: user.status }
    next()
  } catch (error) {
    console.error('[authenticateUserAnyStatus]', error)
    return res.status(401).json('Unauthorized: Token verification failed')
  }
}

export const checkAdminPermission = (req, res, next) => {
  if (req.user.role != 'executiveBoard') {
    return res.status(403).json('Permission Denied')
  }
  next()
}

export const checkUserPermission = (req, res, next) => {
  if (req.user.role != 'executiveBoard' && req.user.role != 'roomLeader' && req.user.role != 'shopper') {
    return res.status(403).json('Permission Denied')
  }
  next()
}
