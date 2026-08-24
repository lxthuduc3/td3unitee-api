import { CronJob } from 'cron'
import webpush from '../lib/webpush.js'
import Subscription from '../models/subscription.js'
import Event from '../models/event.js'
import Home from '../models/home.js'
import MealTimeSetting from '../models/meal-time-setting.js'
import { tzNow } from '../lib/timezone-free.js'
import { startOfDay, endOfDay } from 'date-fns'

const CRON_TIMEZONE = 'Asia/Ho_Chi_Minh'

const pad2 = (n) => String(n).padStart(2, '0')

const currentHHmm = (now) => `${pad2(now.getHours())}:${pad2(now.getMinutes())}`

// Lùi/tiến 1 giờ "HH:mm" đi số phút chỉ định (dùng để tính mốc "báo trước 5 phút")
const shiftTime = (hhmm, minutesDelta) => {
  const [h, m] = (hhmm || '').split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null

  const dayMinutes = 24 * 60
  const total = (((h * 60 + m + minutesDelta) % dayMinutes) + dayMinutes) % dayMinutes

  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`
}

const sendPushToTopic = async ({ home, topic, title, body }) => {
  const subscriptions = await Subscription.find({ home, topic })
  const icon = '/public/image/icon.png'
  if (subscriptions.length === 0) {
    console.log(`No one is subscribed to receive notifications for topic: ${topic} (home: ${home})`)
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
  console.log(
    `[${new Date().toLocaleString('vi-VN', { timeZone: CRON_TIMEZONE })}] Successfully sent: ${successCount}/${
      subscriptions.length
    }`
  )
}

// Chạy 1 tác vụ cho từng home đang hoạt động - đảm bảo thông báo chỉ gửi cho
// đúng thành viên của home đó, không gửi lẫn sang các nhà khác.
const forEachActiveHome = async (job) => {
  const homes = await Home.find({ isActive: true }).select('_id')

  await Promise.all(homes.map(({ _id: home }) => job(home)))
}

export const initNotificationCronJobs = () => {
  // Chạy mỗi phút, đối chiếu với cấu hình "thời gian ăn" (MealTimeSetting) của TỪNG home
  // để quyết định có gửi thông báo hay không - không còn lịch cố định chung cho cả hệ thống.
  new CronJob(
    '* * * * *',
    async () => {
      try {
        const now = tzNow()
        const hhmm = currentHHmm(now)
        const dayOfWeek = now.getDay() // 0 = Chủ nhật ... 6 = Thứ 7

        const activeHomeIds = (await Home.find({ isActive: true }).select('_id')).map((h) => h._id)
        if (activeHomeIds.length === 0) return

        const settings = await MealTimeSetting.find({ home: { $in: activeHomeIds } })

        await Promise.all(
          settings.map(async (setting) => {
            const home = setting.home

            // Mở đăng ký cơm cho tuần tới - đúng ngày + giờ cấu hình của home
            if (setting.registrationOpenDay === dayOfWeek && setting.registrationOpenTime === hhmm) {
              await sendPushToTopic({
                home,
                topic: 'general',
                title: 'Đăng ký cơm',
                body: 'Hệ thống đã mở đăng ký cơm cho tuần tới, anh em nhớ vào đăng ký nhé!',
              })
            }

            // Báo trước 5 phút trước khi chốt cơm trễ trưa
            if (shiftTime(setting.lunchLateCutoffTime, -5) === hhmm) {
              await sendPushToTopic({
                home,
                topic: 'general',
                title: 'Chốt cơm trễ',
                body: 'Hệ thống sẽ chốt cơm trễ trưa sau 5 phút nữa!',
              })
            }

            // Báo trước 5 phút trước khi chốt cơm trễ tối
            if (shiftTime(setting.dinnerLateCutoffTime, -5) === hhmm) {
              await sendPushToTopic({
                home,
                topic: 'general',
                title: 'Chốt cơm trễ',
                body: 'Hệ thống sẽ chốt cơm trễ tối sau 5 phút nữa!',
              })
            }
          })
        )
      } catch (error) {
        console.error('[mealTimeSettingCron]', error)
      }
    },
    null,
    true,
    CRON_TIMEZONE
  )

  // Thông báo sự kiện trong ngày - không thuộc cấu hình thời gian ăn nên vẫn chạy cố định 7h sáng,
  // nhưng vẫn tách riêng theo từng home.
  new CronJob(
    '0 7 * * *',
    async () => {
      const today = tzNow()

      await forEachActiveHome(async (home) => {
        const todayEvents = await Event.find({
          home,
          date: {
            $gte: startOfDay(today),
            $lte: endOfDay(today),
          },
        })

        if (todayEvents.length > 0) {
          const eventTitles = todayEvents
            .map((e) => {
              const eventDate = new Date(e.date)
              const timeString = eventDate.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: CRON_TIMEZONE,
              })
              return `${e.title} lúc ${timeString}`
            })
            .join(', ')

          await sendPushToTopic({
            home,
            topic: 'general',
            title: 'Sự kiện hôm nay',
            body: `${eventTitles}`,
          })
        }
      })
    },
    null,
    true,
    CRON_TIMEZONE
  )
}
