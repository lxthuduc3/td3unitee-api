import { Schema, model } from 'mongoose'

const DutyScheduleSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['cooking', 'cleaning', 'shopping', 'other'],
    },
    // Chỉ áp dụng cho type = 'cooking'
    day: {
      type: Number,
      min: 0,
      max: 6,
      required: function () {
        return this.type === 'cooking'
      },
    },
    // Chỉ áp dụng cho type = 'cooking'
    meal: {
      type: String,
      enum: ['lunch', 'dinner'],
      required: function () {
        return this.type === 'cooking'
      },
    },
    // Mô tả công việc (cho type = 'other')
    description: {
      type: String,
      required: function () {
        return this.type === 'other'
      },
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
)

DutyScheduleSchema.index(
  { type: 1, day: 1, meal: 1 },
  {
    unique: true,
    partialFilterExpression: { type: 'cooking' },
  }
)

const DutySchedule = model('DutySchedule', DutyScheduleSchema)

export default DutySchedule
