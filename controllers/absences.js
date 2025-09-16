import Absence from '../models/absence.js'

import { tzfStartOfDay, tzfEndOfDay } from '../lib/timezone-free.js'
import { startOfWeek, endOfWeek } from 'date-fns'
import { tzNow } from '../lib/timezone-free.js'

export const getOwnAbsences = async (req, res) => {
  const { id: user } = req.user
  const { dateFrom, dateTo } = req.query

  const query = { user }
  if (dateFrom) query.date = { ...query.date, $gte: tzfStartOfDay(dateFrom) }
  if (dateTo) query.date = { ...query.date, $lte: tzfEndOfDay(dateTo) }

  try {
    const absences = await Absence.find(query)
    return res.status(200).json(absences)
  } catch (error) {
    console.error('[getOwnAbsences]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createAbsence = async (req, res) => {
  const { id: user } = req.user
  const { date, title, reason } = req.body

  try {
    const absence = await Absence.create({ user, date, title, reason })
    return res.status(201).json(absence)
  } catch (error) {
    console.error('[createAbsence]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const cancelAbsence = async (req, res) => {
  const { id: user } = req.user
  const { id } = req.params

  try {
    const absence = await Absence.findOneAndUpdate({ _id: id, user }, { canceled: true })

    if (!absence) {
      return res.status(404).json('Absence Not Found ')
    }

    return res.status(200).json(absence)
  } catch (error) {
    console.error('[cancelAbsence]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getAbsences = async (req, res) => {
  const { dateFrom, dateTo } = req.query
  const query = {}

  if (dateFrom) query.date = { ...query.date, $gte: tzfStartOfDay(dateFrom) }
  if (dateTo) query.date = { ...query.date, $lte: tzfEndOfDay(dateTo) }

  try {
    const absences = await Absence.find(query).populate('user', 'givenName familyName avatar room')

    // Gom nhóm theo room
    const groupedAbsences = absences.reduce((acc, absence) => {
      const room = absence.user?.room || '0'

      if (!acc[room]) {
        acc[room] = []
      }

      acc[room].push(absence)
      return acc
    }, {})

    return res.status(200).json({
      status: 1,
      absences: groupedAbsences,
    })
  } catch (error) {
    console.error('[getAbsences]', error)
    return res.status(500).json({ status: 0, message: 'Internal Server Error' })
  }
}

export const getAbsencesByWeek = async (req, res) => {
  try {
    const now = tzNow()
    const dateFrom = tzfStartOfDay(startOfWeek(now, { weekStartsOn: 1 }))
    const dateTo = tzfEndOfDay(endOfWeek(now, { weekStartsOn: 1 }))

    const query = {
      date: {
        $gte: dateFrom,
        $lte: dateTo,
      },
    }

    const absences = await Absence.find(query)
      .populate('user', 'givenName familyName avatar room')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      status: 1,
      week: {
        from: dateFrom,
        to: dateTo,
      },
      absences,
    })
  } catch (error) {
    console.error('[getAbsencesByWeek]', error)
    return res.status(500).json({ status: 0, message: 'Internal Server Error' })
  }
}
