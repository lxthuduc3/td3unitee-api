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

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        status: 0,
        message: 'Email không được cung cấp từ Google',
        field: 'email',
      })
    }

    if (!givenName || !familyName) {
      return res.status(400).json({
        status: 0,
        message: 'Tài khoản Google thiếu thông tin tên. Vui lòng cập nhật tên trong tài khoản Google và thử lại.',
        field: 'name',
        missingFields: ['givenName', 'familyName'],
      })
    }

    const userData = {
      email,
      givenName: givenName,
      familyName: familyName,
      avatar: avatar || null,
    }

    let user = await User.findOneAndUpdate({ email }, userData, { new: true })

    if (!user) {
      user = await User.create(userData)
    }

    return res.status(200).json({
      status: 1,
      tokens,
      user,
      message:
        !givenName || !familyName
          ? 'Đăng nhập thành công. Vui lòng cập nhật thông tin cá nhân.'
          : 'Đăng nhập thành công',
    })
  } catch (error) {
    console.error('[findUserByEmailOrCreate]', error)
    return res.status(500).json({
      status: 0,
      message: error.message || 'Internal Server Error',
    })
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
