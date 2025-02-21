import User from '../models/user.js'
import { generateAccessToken, generateRefreshToken } from '../lib/jwt.js'
import jwt from 'jsonwebtoken'

// Session
export const getUserByEmail = async (req, res) => {
  const { email } = req.params

  try {
    if (!email) {
      return res.status(400).json('Email Is Required')
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json('User Not Found')
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('[getUserByEmail]', error)
    return res.status(500).json('Internal server error')
  }
}

// Login or Register
export const findUserByEmailOrCreate = async (req, res) => {
  const { email, givenName, familyName, avatar } = req.body

  try {
    let user = await User.findOneAndUpdate({ email }, { givenName, familyName }, { new: true })

    if (!user) {
      user = await User.create({ email, givenName, familyName, avatar })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    return res.status(200).json({ user, accessToken, refreshToken })
  } catch (error) {
    console.error('[findUserByEmailOrCreate]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(400).json('Refresh Token Is Required')
  }

  try {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json('Invalid Refresh Token')
      }

      // Validate the user exists
      const user = await User.findById(decoded.id)
      if (!user) {
        return res.status(404).json('User Not Found')
      }

      // Generate a new access token
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
      return res.status(200).json({ accessToken, refreshToken })
    })
  } catch (error) {
    console.error('[refreshAccessToken]', error)
    return res.status(500).json('Internal Server Error')
  }
}
