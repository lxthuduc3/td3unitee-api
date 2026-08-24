import MealRegistration from '../models/meal-registration.js'

import { startOfWeek, endOfWeek, addDays } from 'date-fns'
import { tzfStartOfDay, tzfEndOfDay, tzNow } from '../lib/timezone-free.js'

export const createMealRegistration = async (req, res) => {
  const { id: user, home } = req.user
  const { date, meal, late } = req.body

  try {
    const registration = await MealRegistration.create({ user, home, date, meal, late })

    return res.status(201).json(registration)
  } catch (error) {
    console.error('[createMealRegistration]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getOwnMealRegistrations = async (req, res) => {
  const { id: user, home } = req.user

  let now = tzNow()
  if (now.getDay() == 6 && now.getHours() >= 19) {
    now = addDays(now, 1)
  }
  const { dateFrom = tzfStartOfDay(startOfWeek(now)), dateTo = tzfEndOfDay(endOfWeek(now)) } = req.query

  try {
    const registrations = await MealRegistration.find({
      user,
      home,
      date: { $gte: dateFrom, $lte: dateTo },
    })

    return res.status(200).json(registrations)
  } catch (error) {
    console.error('[getOwnMealRegistrations]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const updateMealRegistration = async (req, res) => {
  const { id: user, home } = req.user
  const { id } = req.params
  const { late } = req.body

  try {
    const registration = await MealRegistration.findOneAndUpdate({ _id: id, user, home }, { late }, { new: true })

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
  const { id: user, home } = req.user
  const { id } = req.params

  try {
    const registration = await MealRegistration.findOneAndDelete({ _id: id, user, home })

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
  const { home } = req.user
  const { date, meal } = req.params

  const dateFrom = tzfStartOfDay(date)
  const dateTo = tzfEndOfDay(date)

  try {
    const registrations = await MealRegistration.find({
      home,
      date: { $gte: dateFrom, $lte: dateTo },
      meal,
    }).populate('user', 'avatar givenName familyName')

    return res.status(200).json(registrations)
  } catch (error) {
    console.error('[getMealRegistrationsByMeal]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
