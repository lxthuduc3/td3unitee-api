import Event from '../models/event.js'

import { startOfWeek, endOfWeek, addDays } from 'date-fns'
import { tzfStartOfDay, tzfEndOfDay, tzNow } from '../lib/timezone-free.js'

const timeZone = 'Asia/Ho_Chi_Minh'

class eventController {
  constructor() {}

  async getEventsByWeek(req, res) {
    try {
      let now = tzNow()
      if (now.getDay() == 6 && now.getHours() >= 19) {
        now = addDays(now, 1)
      }
      const { dateFrom = tzfStartOfDay(startOfWeek(now)), dateTo = tzfEndOfDay(endOfWeek(now)) } = req.query

      const events = await Event.find({
        date: {
          $gte: dateFrom,
          $lte: dateTo,
        },
      })

      const formattedEvents = events.map((event) => {
        const dateObj = new Date(event.date)

        const dayOfWeek = new Intl.DateTimeFormat('vi-VN', {
          weekday: 'long',
          timeZone,
        }).format(dateObj)

        return {
          id: event._id,
          title: event.title,
          date: event.date,
          dayOfWeek,
        }
      })

      return res.status(200).json({ status: 1, events: formattedEvents })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 0, message: 'Internal Server Error' })
    }
  }

  async create(req, res) {
    try {
      const { title, date } = req.body

      if (!title || title.trim() === '' || !date) {
        return res.status(400).json({ message: 'Invalid value' })
      }

      const event = await Event.create({ title, date })

      return res.status(201).json({ message: 'Create event success', event })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { title, date } = req.body
      if (!id) {
        return res.status(400).json({ message: 'Invalid value' })
      }
      const event = await Event.findById(id)
      if (!event) {
        return res.status(404).json({ message: 'Event not found!' })
      }
      event.title = title
      event.date = date
      await event.save()

      return res.status(200).json({ message: 'Update event success', event })
    } catch (error) {
      console.log('[eventController]: ', error.message)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({ message: 'Invalid value' })
      }
      const result = await Event.findByIdAndDelete(id)
      if (!result) {
        return res.status(404).json({ message: 'Event not found!' })
      }
      return res.status(200).json({ message: 'Delete event success!' })
    } catch (error) {
      console.log('[EventController]', error.message)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export default new eventController()
