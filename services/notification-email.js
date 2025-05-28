import nodemailer from 'nodemailer'
import { CronJob } from 'cron'
import User from '../models/user.js'
import pLimit from 'p-limit'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASS,
  },
})

const generateMailOptions = (toEmail) => ({
  from: 'TD3 Unitee',
  to: toEmail,
  subject: 'TD3 Unitee',
  html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
    <h2 style="color: #2c3e50;">🍽️ ĐĂNG KÝ CƠM!</h2>
   <p style="font-size: 16px; color: #333;">
    Hello anh em! 👋<br><br>
    Hệ thống đã mở đăng ký cơm cho tuần tới!<br><br>
    Đừng quên đăng ký nhé!
  </p>
    <img src="https://td3unitee.online/icon.png" alt="TD3 Unitee" width="120" style="display: block; margin: 16px auto;" />
    <a href="https://td3unitee.online" style="
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #FFD700;
      color: #000;
      text-decoration: none;
      font-weight: bold;
      border-radius: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease;
    "
      onmouseover="this.style.backgroundColor='#FFC300';"
      onmouseout="this.style.backgroundColor='#FFD700';"
    >
      👉 Truy cập hệ thống
    </a>
    <p style="margin-top: 20px; font-size: 13px; color: #999;">
      Nếu bạn đã đăng ký rồi, vui lòng bỏ qua email này.
    </p>
  </div>
  `,
})

// Chia mảng thành từng nhóm nhỏ
const chunkArray = (array, size) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export const initNotificationCronJobsEmail = () => {
  const job = new CronJob(
    '0 20 * * 6',
    async () => {
      try {
        const users = await User.find({}, { email: 1, _id: 0 }).lean()
        if (!users.length) {
          console.log('No users found to send emails.')
          return
        }

        const batchSize = 10
        const delayMs = 2000
        const chunks = chunkArray(users, batchSize)

        let totalSuccess = 0

        for (const chunk of chunks) {
          const limit = pLimit(batchSize)

          const sendTasks = chunk.map((user) =>
            limit(() =>
              transporter
                .sendMail(generateMailOptions(user.email))
                .then(() => {
                  //console.log(`Email sent to ${user.email}`)
                  return true
                })
                .catch((err) => {
                  console.error(`Failed to send email to ${user.email}:`, err.message)
                  return false
                })
            )
          )

          const results = await Promise.all(sendTasks)
          totalSuccess += results.filter(Boolean).length

          // Nếu chưa phải batch cuối, chờ 2s
          if (chunk !== chunks[chunks.length - 1]) {
            await new Promise((resolve) => setTimeout(resolve, delayMs))
          }
        }

        console.log(`Done: ${totalSuccess}/${users.length} emails sent successfully.`)
      } catch (error) {
        console.error('Error in email notification cron job:', error)
      }
    },
    null,
    true,
    'Asia/Ho_Chi_Minh'
  )
}
