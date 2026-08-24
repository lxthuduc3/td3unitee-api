import DutySchedule from '../models/duty-schedule.js'
import { startOfWeek, endOfWeek } from 'date-fns'
import { tzNow } from '../lib/timezone-free.js'

class DutyScheduleController {
  constructor() {}

  async getCookingByDateAndMeal(req, res) {
    try {
      const { home } = req.user
      const { date, meal } = req.params

      // Validate input
      if (!date || !meal) {
        return res.status(400).json({ message: 'Date and meal are required' })
      }

      if (!['lunch', 'dinner'].includes(meal)) {
        return res.status(400).json({ message: 'Meal must be lunch or dinner' })
      }

      // Chuyển date thành day of week
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' })
      }

      const dayOfWeek = dateObj.getDay() // 0=Sunday, 1=Monday, ...

      const schedule = await DutySchedule.findOne({
        home,
        type: 'cooking',
        day: dayOfWeek,
        meal: meal,
      }).populate('users', 'avatar familyName givenName')

      return res.status(200).json({
        status: 1,
        schedule,
        info: {
          date,
          dayOfWeek,
          meal,
        },
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 0, message: 'Internal Server Error' })
    }
  }

  // Tạo hoặc Cập nhật lịch trực
  async upsert(req, res) {
    try {
      const { home } = req.user
      const { id } = req.query // nếu có id -> update
      const { type, day, meal, description, users } = req.body

      // Validate input chung
      if (!type || !users || users.length === 0) {
        return res.status(400).json({ message: 'Invalid input data' })
      }

      // Validate cho cooking
      if (type === 'cooking') {
        if (day === undefined || !meal) {
          return res.status(400).json({ message: 'Day and meal are required for cooking schedule' })
        }
      }

      // Validate cho other
      if (type === 'other' && !description) {
        return res.status(400).json({ message: 'Description is required for other type' })
      }

      // Nếu có id thì update
      if (id) {
        const schedule = await DutySchedule.findOne({ _id: id, home })
        if (!schedule) {
          return res.status(404).json({ message: 'Schedule not found' })
        }

        schedule.type = type
        schedule.users = users

        if (type === 'cooking') {
          schedule.day = day
          schedule.meal = meal
          schedule.description = undefined
        }

        if (type === 'other') {
          schedule.description = description
          schedule.day = undefined
          schedule.meal = undefined
        }

        await schedule.save()
        const updatedSchedule = await DutySchedule.findById(id).populate('users', 'name email')

        return res.status(200).json({
          message: 'Update duty schedule success',
          schedule: updatedSchedule,
        })
      }

      // Nếu không có id thì create mới
      const scheduleData = { home, type, users }
      if (type === 'cooking') {
        scheduleData.day = day
        scheduleData.meal = meal
      }
      if (type === 'other') {
        scheduleData.description = description
      }

      const schedule = await DutySchedule.create(scheduleData)
      const populatedSchedule = await DutySchedule.findById(schedule._id).populate('users', 'name email')

      return res.status(201).json({
        message: 'Create duty schedule success',
        schedule: populatedSchedule,
      })
    } catch (error) {
      console.error(error)
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Schedule conflict with existing schedule' })
      }
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Xóa lịch trực
  async delete(req, res) {
    try {
      const { home } = req.user
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ message: 'Invalid schedule ID' })
      }

      const result = await DutySchedule.findOneAndDelete({ _id: id, home })
      if (!result) {
        return res.status(404).json({ message: 'Schedule not found' })
      }

      return res.status(200).json({ message: 'Delete duty schedule success' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async getAll(req, res) {
    try {
      const { home } = req.user
      const schedules = await DutySchedule.find({ home })
        .populate('users', 'avatar familyName givenName')
        .sort({ type: 1, day: 1, meal: 1 })

      const groupedSchedules = schedules.reduce((acc, schedule) => {
        const { type } = schedule
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(schedule)
        return acc
      }, {})

      return res.status(200).json({
        status: 1,
        schedules: groupedSchedules,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 0, message: 'Internal Server Error' })
    }
  }

  // Lấy lịch trực theo type
  async getByType(req, res) {
    try {
      const { home } = req.user
      const { type } = req.params

      const schedules = await DutySchedule.find({ home, type })
        .populate('users', 'avatar familyName givenName')
        .sort({ day: 1, meal: 1 })

      return res.status(200).json({
        status: 1,
        type,
        schedules,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 0, message: 'Internal Server Error' })
    }
  }
}

export default new DutyScheduleController()
