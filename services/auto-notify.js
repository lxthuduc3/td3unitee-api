import cron from 'node-cron'
import webpush from '../lib/webpush.js'
import Subscription from '../models/subscription.js'


const sendPushToTopic = async ({ topic, title, body }) => {
  const subscriptions = await Subscription.find({ topic })
  const icon = "/public/image/icon.png"
  if (subscriptions.length === 0) {
    console.log(`Không có ai đăng ký nhận thông báo cho topic: ${topic}`)
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
          console.warn(`Subscription hết hạn: ${endpoint}`)
          await Subscription.deleteOne({ _id })
        } else {
          console.error(`[Lỗi gửi tới ${endpoint}]`, err)
        }
        return false
      }
    })
  )

  const successCount = pushResults.filter(Boolean).length
  console.log(`Đã gửi thành công: ${successCount}/${subscriptions.length}`)
}

export const initNotificationCronJobs = () => {

  cron.schedule('0 22 * * 6', async () => {
    await sendPushToTopic({
      topic: 'general',
      title: 'Đăng ký cơm',
      body: 'Bạn nhớ đăng ký cơm cho tuần tới nhé!',
    })
  })


  cron.schedule('40 10 * * *', async () => {
    await sendPushToTopic({
      topic: 'general',
      title: 'Chốt cơm trễ',
      body: 'Anh em còn 5 phút để đăng ký/huỷ cơm trễ trưa!',
    })
  })


  cron.schedule('10 18 * * *', async () => {
    await sendPushToTopic({
      topic: 'general',
      title: 'Chốt cơm trễ',
      body: 'Anh em còn 5 phút để đăng ký/huỷ cơm trễ tối!',
    })
  })

}
