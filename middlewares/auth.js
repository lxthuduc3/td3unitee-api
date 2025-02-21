import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json('Authorization header missing')
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const { id, status, role } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (status != 'active') {
      return res.status(403).json('User Not Active')
    }
    req.user = { id }
    next()
  } catch (error) {
    return res.status(403).json('Invalid or expired token')
  }
}
