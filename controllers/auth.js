import User from '../models/user.js'
import { OAuth2Client, UserRefreshClient } from 'google-auth-library'

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_ID, process.env.GOOGLE_SECRET, 'postmessage')

// Login or Register
export const findUserByEmailOrCreate = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code)

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const { email, picture: avatar, family_name: familyName, given_name: givenName } = await userInfoResponse.json()

    let user = await User.findOneAndUpdate({ email }, { givenName, familyName, avatar }, { new: true })

    if (!user) {
      user = await User.create({ email, givenName, familyName, avatar })
    }

    res.json({ tokens, user })
  } catch (error) {
    console.error('[findUserByEmailOrCreate]', error)
    res.status(500).json('Internal Server Error')
  }
}

export const refreshToken = async (req, res) => {
  try {
    const user = new UserRefreshClient(process.env.GOOGLE_ID, process.env.GOOGLE_SECRET, req.body.refreshToken)
    const { credentials } = await user.refreshAccessToken() // optain new tokens

    return res.status(200).json(credentials)
  } catch (error) {
    console.error('[refreshToken]', error)
    res.status(500).json('Internal Server Error')
  }
}
