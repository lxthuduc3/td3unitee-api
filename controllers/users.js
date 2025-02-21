import User from '../models/user.js'

export const getOwnProfile = async (req, res) => {
  const { id } = req.user

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json('User Not Found')
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('[getOwnProfile]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const updateProfile = async (req, res) => {
  const { id } = req.user
  const { baptismalName, dateOfBirth, hometown, school, firstSchoolYear, major, phone, facebook } = req.body

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        baptismalName,
        dateOfBirth,
        hometown,
        school,
        firstSchoolYear,
        major,
        phone,
        facebook,
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json('User Not Found')
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('[updateProfile]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getProfile = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json('User Not Found')
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error('[getProfile]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getMembers = async (req, res) => {
  try {
    const users = await User.find({ status: 'active' })

    return res.status(200).json(users)
  } catch (error) {
    console.error('[getMembers]', error)
    return res.status(500).json('Internal Server Error')
  }
}
