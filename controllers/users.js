import User from '../models/user.js'

import { endOfMonth, startOfMonth } from 'date-fns'
import { tzfEndOfDay, tzfStartOfDay } from '../lib/timezone-free.js'

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

export const updateMember = async (req, res) => {
  const { id } = req.params
  const { room, role } = req.body

  try {
    const member = await User.findOneAndUpdate(
      { _id: id, status: 'active' },
      {
        room,
        role,
      },
      { new: true }
    )

    if (!member) {
      return res.status(404).json('Member Not Found')
    }

    return res.status(200).json(member)
  } catch (error) {
    console.error('[updateMember]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const newOrLeftMembers = async (req, res) => {
  const { month, status } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))
  let query = {
    status: status,
  }
  if (status === 'active') {
    query.createdAt = { $gte: dateFrom, $lte: dateTo }
  } else {
    query.updatedAt = { $gte: dateFrom, $lte: dateTo }
  }

  try {
    const members = await User.find(query)

    return res.json({
      members,
      count: members.length,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const maskMemberAsLeft = async (req, res) => {
  const { id } = req.params

  try {
    const member = await User.findOneAndUpdate(
      { _id: id, status: 'active' },
      {
        status: 'left',
      },
      { new: true }
    )

    if (!member) {
      return res.status(404).json('Member Not Found')
    }

    return res.status(200).json(member)
  } catch (error) {
    console.error('[maskMemberAsLeft]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getRequests = async (req, res) => {
  try {
    const requests = await User.find({ status: 'pending' }).sort({ createdAt: -1 })

    return res.status(200).json(requests)
  } catch (error) {
    console.error('[getRequests]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const approveRequest = async (req, res) => {
  const { id } = req.params

  try {
    const request = await User.findOneAndUpdate(
      { _id: id, status: 'pending' },
      {
        status: 'active',
      },
      { new: true }
    )

    if (!request) {
      return res.status(404).json('Request Not Found')
    }

    return res.status(200).json(request)
  } catch (error) {
    console.error('[approveRequest]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const rejectAndDeleteRequest = async (req, res) => {
  const { id } = req.params

  try {
    const request = await User.findOneAndDelete({ _id: id, status: 'pending' })

    if (!request) {
      return res.status(404).json('Request Not Found')
    }

    return res.status(200).json('Request Rejected And Deleted Successfully')
  } catch (error) {
    console.error('[rejectAndDeleteRequest]', error)
    return res.status(500).json('Internal Server Error')
  }
}
