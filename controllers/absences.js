import Absence from '../models/absence.js'

import { getStartOfDate, getEndOfDate } from '../lib/datetime.js'

export const getOwnAbsences = async (req, res) => {
  const { id: user } = req.user
  const { dateFrom, dateTo } = req.query

  const query = { user }
  if (dateFrom) query.date = { ...query.date, $gte: getStartOfDate(dateFrom) }
  if (dateTo) query.date = { ...query.date, $lte: getEndOfDate(dateTo) }

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

  if (dateFrom) query.date = { ...query.date, $gte: getStartOfDate(dateFrom) }
  if (dateTo) query.date = { ...query.date, $lte: getEndOfDate(dateTo) }

  try {
    const absences = await Absence.find(query).populate('user')
    return res.status(200).json(absences)
  } catch (error) {
    console.error('[getAbsences]', error)
    return res.status(500).json('Internal Server Error')
  }
}
