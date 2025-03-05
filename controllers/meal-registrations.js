import MealRegistration from '../models/meal-registration.js'

import { getCurrentWeek, generateDateArray, isSameDate } from '../lib/datetime.js'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from 'date-fns'

export const createMealRegistration = async (req, res) => {
  const user = req.user.id
  const { date, meal, late } = req.body

  try {
    const registration = await MealRegistration.create({ user, date, meal, late })

    return res.status(201).json(registration)
  } catch (error) {
    console.error('[createMealRegistration]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getOwnMealRegistrations = async (req, res) => {
  const user = req.user.id

  let today = new Date()
  if (today.getDay() == 6 && today.getHours() >= 19) {
    today = addDays(today, 1)
  }
  const { dateFrom = startOfDay(startOfWeek(today)), dateTo = endOfDay(endOfWeek(today)) } = req.query

  try {
    const registrations = await MealRegistration.find({
      user,
      date: { $gte: dateFrom, $lte: dateTo },
    })

    return res.status(200).json(registrations)
  } catch (error) {
    console.error('[getOwnMealRegistrations]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateMealRegistration = async (req, res) => {
  const user = req.user.id
  const { id } = req.params
  const { late } = req.body

  try {
    const registration = await MealRegistration.findOneAndUpdate({ _id: id, user }, { late }, { new: true })

    if (!registration) {
      return res.status(404).json('Registration Not Found')
    }

    return res.status(200).json(registration)
  } catch (error) {
    console.error('[updateMealRegistration]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteMealRegistration = async (req, res) => {
  const user = req.user.id
  const { id } = req.params

  try {
    const registration = await MealRegistration.findOneAndDelete({ _id: id, user })

    if (!registration) {
      return res.status(404).json('Registration Not Found')
    }

    return res.status(200).json('Registration deleted successfully')
  } catch (error) {
    console.error('[deleteOneMealRegistration]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const getMealRegistrationsByMeal = async (req, res) => {
  const { date, meal } = req.params

  const startOfDate = new Date(date)
  startOfDate.setHours(0, 0, 0, 0)

  const endOfDate = new Date(date)
  endOfDate.setHours(23, 59, 59, 999)

  try {
    const registrations = await MealRegistration.find({
      date: { $gte: startOfDate, $lte: endOfDate },
      meal,
    }).populate('user', 'avatar givenName familyName')

    return res.status(200).json(registrations)
  } catch (error) {
    console.error('[getMealRegistrationsByMeal]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
