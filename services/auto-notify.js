import { CronJob } from 'cron'
import webpush from '../lib/webpush.js'
import Subscription from '../models/subscription.js'

const CRON_TIMEZONE = 'Asia/Ho_Chi_Minh'


const sendPushToTopic = async ({ topic, title, body }) => {
  const subscriptions = await Subscription.find({ topic })
  const icon = "/public/image/icon.png"
  if (subscriptions.length === 0) {
    console.log(`No one is subscribed to receive notifications for topic: ${topic}`)
    return
  }

  const payload = JSON.stringify({ title, body, icon })

  const pushResults = await Promise.all(
    subscriptions.map(async ({ endpoint, keys, _id }) => {
      try {
        await webpush.sendNotification({ endpoint, keys }, payload)
        return true
      } catch (err) {
        if (err.statusCode === 410 || err.body?.includes('unsubscribed')) {
          console.warn(`Subscription expired or invalid: ${endpoint}`)
          await Subscription.deleteOne({ _id })
        } else {
          console.error(`[Error sending to: ${endpoint}]`, err)
        }
        return false
      }
    })
  )

  const successCount = pushResults.filter(Boolean).length
  console.log(`[${new Date().toLocaleString('vi-VN', { timeZone: CRON_TIMEZONE })}] Successfully sent: ${successCount}/${subscriptions.length}`)

}

export const initNotificationCronJobs = () => {
  new CronJob(
    '0 20 * * 6',
    () => sendPushToTopic({
      topic: 'general',
      title: 'Đăng ký cơm',
      body: 'Hệ thống đã mở đăng ký cơm cho tuần tới, anh em nhớ vào đăng ký nhé!',
    }),
    null,
    true,
    CRON_TIMEZONE
  )

  new CronJob(
    '40 10 * * *',
    () => sendPushToTopic({
      topic: 'general',
      title: 'Chốt cơm trễ',
      body: 'Hệ thống sẽ chốt cơm trễ trưa sau 5 phút nữa!',
    }),
    null,
    true,
    CRON_TIMEZONE
  )

  new CronJob(
    '10 18 * * *',
    () => sendPushToTopic({
      topic: 'general',
      title: 'Chốt cơm trễ',
      body: 'Hệ thống sẽ chốt cơm trễ tối sau 5 phút nữa!',
    }),
    null,
    true,
    CRON_TIMEZONE
  )
} 