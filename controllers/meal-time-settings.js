import MealTimeSetting from '../models/meal-time-setting.js'

// Lấy cài đặt thời gian ăn của home hiện tại (tạo mặc định nếu chưa có)
export const getMealTimeSetting = async (req, res) => {
  const { home } = req.user

  try {
    let setting = await MealTimeSetting.findOne({ home })

    if (!setting) {
      setting = await MealTimeSetting.create({ home })
    }

    return res.status(200).json(setting)
  } catch (error) {
    console.error('[getMealTimeSetting]', error)
    return res.status(500).json('Internal Server Error')
  }
}

// Tạo/cập nhật (upsert) cài đặt thời gian ăn của home hiện tại
export const updateMealTimeSetting = async (req, res) => {
  const { home } = req.user
  const {
    lunchTime,
    dinnerTime,
    lunchLateCutoffTime,
    dinnerLateCutoffTime,
    registrationOpenDay,
    registrationOpenTime,
    registrationCloseTime,
    registrationEditCutoffTime,
  } = req.body

  try {
    const setting = await MealTimeSetting.findOneAndUpdate(
      { home },
      {
        lunchTime,
        dinnerTime,
        lunchLateCutoffTime,
        dinnerLateCutoffTime,
        registrationOpenDay,
        registrationOpenTime,
        registrationCloseTime,
        registrationEditCutoffTime,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json(setting)
  } catch (error) {
    console.error('[updateMealTimeSetting]', error)
    return res.status(500).json('Internal Server Error')
  }
}
