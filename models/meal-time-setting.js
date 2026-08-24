import { Schema, model } from 'mongoose'

// Cài đặt "thời gian ăn" của một Home (nhà):
// - Giờ ăn trưa / ăn tối
// - Giờ chốt cơm trễ trưa / trễ tối
// - Ngày + giờ hệ thống mở đăng ký cơm cho tuần tới
// - Giờ chốt việc đăng ký / chỉnh sửa đăng ký cơm cho từng ngày
const MealTimeSettingSchema = new Schema(
  {
    home: {
      type: Schema.Types.ObjectId,
      ref: 'Home',
      required: true,
      unique: true,
    },
    // Giờ ăn trưa, ăn tối, dạng "HH:mm"
    lunchTime: {
      type: String,
      default: '11:30',
    },
    dinnerTime: {
      type: String,
      default: '18:00',
    },
    // Giờ chốt cơm trễ trưa / trễ tối trong ngày, dạng "HH:mm"
    lunchLateCutoffTime: {
      type: String,
      default: '10:45',
    },
    dinnerLateCutoffTime: {
      type: String,
      default: '18:15',
    },
    // Ngày trong tuần (0 = Chủ nhật ... 6 = Thứ 7) và giờ hệ thống mở đăng ký cơm cho tuần tới
    registrationOpenDay: {
      type: Number,
      min: 0,
      max: 6,
      default: 6,
    },
    registrationOpenTime: {
      type: String,
      default: '20:00',
    },
    // Giờ chốt đăng ký / chỉnh sửa đăng ký cơm cho chính ngày đó, dạng "HH:mm"
    registrationCloseTime: {
      type: String,
      default: '10:00',
    },
    registrationEditCutoffTime: {
      type: String,
      default: '10:00',
    },
  },
  { timestamps: true }
)

const MealTimeSetting = model('MealTimeSetting', MealTimeSettingSchema)

export default MealTimeSetting
