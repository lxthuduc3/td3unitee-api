import Event from '../models/event.js'

import { startOfWeek, endOfWeek, addDays, addWeeks } from 'date-fns'
import { tzfStartOfDay, tzfEndOfDay, tzNow } from '../lib/timezone-free.js'

const timeZone = 'Asia/Ho_Chi_Minh'

class eventController {
  constructor() {}

  async getEventsByWeek(req, res) {
    try {
      const { home } = req.user
      let now = tzNow()

      // tuần hiện tại: Thứ 2 → Chủ nhật
      const dateFrom = tzfStartOfDay(startOfWeek(now, { weekStartsOn: 1 }))
      const dateTo = tzfEndOfDay(endOfWeek(now, { weekStartsOn: 1 }))

      const events = await Event.find({
        home,
        date: {
          $gte: dateFrom,
          $lte: dateTo,
        },
      })

      const groupedEventsObj = events.reduce((acc, event) => {
        const dateObj = new Date(event.date)
        const dayOfWeek = new Intl.DateTimeFormat('vi-VN', {
          weekday: 'long',
          timeZone,
        }).format(dateObj)

        if (!acc[dayOfWeek]) acc[dayOfWeek] = []
        acc[dayOfWeek].push({
          id: event._id,
          title: event.title,
          date: event.date,
        })

        return acc
      }, {})

      const groupedEvents = Object.keys(groupedEventsObj).map((dayOfWeek) => ({
        dayOfWeek,
        events: groupedEventsObj[dayOfWeek],
      }))

      const eventAd = events.map((e) => {
        const dateObj = new Date(e.date)
        const dayOfWeek = new Intl.DateTimeFormat('vi-VN', {
          weekday: 'long',
          timeZone,
        }).format(dateObj)

        return {
          id: e._id,
          title: e.title,
          date: e.date,
          dayOfWeek,
        }
      })

      return res.status(200).json({ status: 1, events: groupedEvents, eventAd })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ status: 0, message: 'Internal Server Error' })
    }
  }

  async create(req, res) {
    try {
      const { home } = req.user
      const { title, date } = req.body

      if (!title || title.trim() === '' || !date) {
        return res.status(400).json({ message: 'Invalid value' })
      }

      const event = await Event.create({ home, title, date })

      return res.status(201).json({ message: 'Create event success', event })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  async update(req, res) {
    try {
      const { home } = req.user
      const { id } = req.params
      const { title, date } = req.body
      if (!id) {
        return res.status(400).json({ message: 'Invalid value' })
      }
      const event = await Event.findOne({ _id: id, home })
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
      const { home } = req.user
      const { id } = req.params
      if (!id) {
        return res.status(400).json({ message: 'Invalid value' })
      }
      const result = await Event.findOneAndDelete({ _id: id, home })
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
