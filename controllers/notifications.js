import Notification from '../models/notification.js'
import Subscription from '../models/subscription.js'

import mongoose from 'mongoose'
import webpush from '../lib/webpush.js'

export const createNotification = async (req, res) => {
  const { id: user } = req.user
  const { title, body, url } = req.body

  try {
    const subscriptions = await Subscription.find({ topic: 'general' }, 'endpoint keys')
    if (subscriptions.length === 0) {
      return res.status(400).json('No Subscription')
    }

    const notification = await Notification.create({ title, body, url, sender: user })

    const payload = JSON.stringify({ title, body, url })

    let successCount = 0

    await Promise.all(
      subscriptions.map(async ({ endpoint, keys }) => {
        const pushSubscription = { endpoint, keys }

        try {
          await webpush.sendNotification(pushSubscription, payload)
          successCount++
        } catch (error) {
          console.error('[createNotification]', error)
        }
      })
    )

    return res.status(200).json({
      total: subscriptions.length,
      success: successCount,
    })
  } catch (error) {
    console.error('[createNotification]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getNotifications = async (req, res) => {
  const { id: user } = req.user

  try {
    const notifications = await Notification.aggregate([
      {
        $addFields: {
          seen: { $in: [user, '$seenBy'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      {
        $unwind: '$senderInfo',
      },
      {
        $project: {
          seen: 1,
          title: 1,
          body: 1,
          createdAt: 1,
          sender: {
            _id: '$senderInfo._id',
            familyName: '$senderInfo.familyName',
            givenName: '$senderInfo.givenName',
            avatar: '$senderInfo.avatar',
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])

    return res.status(200).json(notifications)
  } catch (error) {
    console.error('[getNotifications]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getNotification = async (req, res) => {
  const { id: user } = req.user
  const { id } = req.params

  try {
    const notifications = await Notification.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $addFields: {
          seen: { $in: [user, '$seenBy'] },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderInfo',
        },
      },
      {
        $unwind: '$senderInfo',
      },
      {
        $project: {
          seen: 1,
          title: 1,
          body: 1,
          createdAt: 1,
          sender: {
            _id: '$senderInfo._id',
            familyName: '$senderInfo.familyName',
            givenName: '$senderInfo.givenName',
            avatar: '$senderInfo.avatar',
          },
        },
      },
    ])

    if (notifications.length == 0) {
      return res.status(404).json({ error: 'Notification Not Found' })
    }

    return res.status(200).json(notifications[0])
  } catch (error) {
    console.error('[getNotification]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const markNotificationAsRead = async (req, res) => {
  const { id: user } = req.user
  const { id } = req.params

  try {
    const notification = await Notification.findById(id)

    if (!notification) {
      return res.status(404).json('Notification Not Found')
    }

    if (!notification.seenBy.includes(user)) {
      notification.seenBy.push(user)
      await notification.save()
    }

    return res.status(200).json('Notification Marked As Read Successfully')
  } catch (error) {
    console.error('[markNotificationAsRead]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteNotification = async (req, res) => {
  const { id } = req.params
  try {
    const notification = await Notification.findByIdAndDelete(id)

    if (!notification) {
      return res.status(404).json('Notification Not Found')
    }

    return res.status(200).json(notification)
  } catch (error) {
    console.error('[deleteNotification]', error)
    return res.status(500).json('Internal Server Error')
  }
}
