import User from '../models/user.js'
import Home from '../models/home.js'
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
      // FE dựa vào cờ này để hiển thị màn hình chọn home (nhà) sau khi đăng nhập Google
      needsHomeSelection: !user.home,
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

// Sau khi đăng nhập Google, FE lấy danh sách home (nhà) từ DB cho user chọn.
// Chọn xong thì user vẫn giữ nguyên logic cũ: chờ admin của home đó duyệt (status = pending).
export const selectHome = async (req, res) => {
  const { id } = req.user
  const { homeId } = req.body

  if (!homeId) {
    return res.status(400).json({ status: 0, message: 'homeId là bắt buộc' })
  }

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ status: 0, message: 'User Not Found' })
    }

    if (user.status === 'active') {
      return res.status(400).json({ status: 0, message: 'Tài khoản đã được duyệt, không thể đổi home' })
    }

    const home = await Home.findOne({ _id: homeId, isActive: true })
    if (!home) {
      return res.status(404).json({ status: 0, message: 'Home Not Found' })
    }

    user.home = home._id
    // Đảm bảo vẫn giữ trạng thái chờ duyệt sau khi chọn home
    if (user.status !== 'pending') {
      user.status = 'pending'
    }
    await user.save()

    return res.status(200).json({
      status: 1,
      user,
      message: 'Chọn nhà thành công. Vui lòng chờ quản trị viên của nhà duyệt tài khoản.',
    })
  } catch (error) {
    console.error('[selectHome]', error)
    return res.status(500).json({ status: 0, message: error.message || 'Internal Server Error' })
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
