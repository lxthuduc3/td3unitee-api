
import { connectToDB, disconnectToDB } from '../lib/db.js'
import Home from '../models/home.js'
import User from '../models/user.js'
import Absence from '../models/absence.js'
import Dish from '../models/dish.js'
import Document from '../models/document.js'
import DutySchedule from '../models/duty-schedule.js'
import Event from '../models/event.js'
import Meal from '../models/meal.js'
import MealRegistration from '../models/meal-registration.js'
import Notification from '../models/notification.js'
import Subscription from '../models/subscription.js'
import TransactionCategory from '../models/transaction-category.js'
import Transaction from '../models/transaction.js'
import MealTimeSetting from '../models/meal-time-setting.js'

const DEFAULT_HOME_NAME = process.env.DEFAULT_HOME_NAME || 'Nhà 3'
const DEFAULT_HOME_CODE = process.env.DEFAULT_HOME_CODE || '3'

// Các model có field "home" cần backfill, cùng nhãn để log cho dễ theo dõi.
const MODELS_TO_BACKFILL = [
  { label: 'User', model: User },
  { label: 'Absence', model: Absence },
  { label: 'Dish', model: Dish },
  { label: 'Document', model: Document },
  { label: 'DutySchedule', model: DutySchedule },
  { label: 'Event', model: Event },
  { label: 'Meal', model: Meal },
  { label: 'MealRegistration', model: MealRegistration },
  { label: 'Notification', model: Notification },
  { label: 'Subscription', model: Subscription },
  { label: 'TransactionCategory', model: TransactionCategory },
  { label: 'Transaction', model: Transaction },
]

const migrate = async () => {
  try {
    await connectToDB()

    // 1. Tạo (hoặc lấy) home mặc định đại diện cho dữ liệu hiện tại
    let defaultHome = await Home.findOne({ code: DEFAULT_HOME_CODE })
    if (!defaultHome) {
      defaultHome = await Home.findOne({ name: DEFAULT_HOME_NAME })
    }

    if (!defaultHome) {
      defaultHome = await Home.create({
        name: DEFAULT_HOME_NAME,
        code: DEFAULT_HOME_CODE,
      })
      console.log(`Đã tạo home mặc định: ${defaultHome.name} (${defaultHome._id})`)
    } else {
      console.log(`Sử dụng home mặc định đã tồn tại: ${defaultHome.name} (${defaultHome._id})`)
    }

    // 2. Backfill home cho toàn bộ bản ghi hiện có chưa có field home
    for (const { label, model } of MODELS_TO_BACKFILL) {
      const filter = { $or: [{ home: { $exists: false } }, { home: null }] }
      const result = await model.updateMany(filter, { $set: { home: defaultHome._id } })
      console.log(`[${label}] Đã gán home cho ${result.modifiedCount ?? result.nModified ?? 0} bản ghi.`)
    }

    // 3. Khởi tạo cài đặt thời gian ăn mặc định cho home này nếu chưa có
    const existingSetting = await MealTimeSetting.findOne({ home: defaultHome._id })
    if (!existingSetting) {
      await MealTimeSetting.create({ home: defaultHome._id })
      console.log(`Đã tạo cài đặt thời gian ăn mặc định cho home ${defaultHome.name}.`)
    }

    console.log('Migration hoàn tất.')
  } catch (error) {
    console.error('Lỗi khi migrate dữ liệu sang home:', error)
  } finally {
    await disconnectToDB()
  }
}

migrate()
