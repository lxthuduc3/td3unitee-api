import { Schema, model } from 'mongoose'

const MealRegistrationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    meal: {
      type: String,
      enum: ['lunch', 'dinner'],
      required: true,
    },
    late: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

MealRegistrationSchema.index({ user: 1, date: 1, meal: 1 }, { unique: true })

const MealRegistration = model('MealRegistration', MealRegistrationSchema)

export default MealRegistration
