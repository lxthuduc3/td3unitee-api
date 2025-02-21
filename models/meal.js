import { Schema, model } from 'mongoose'

const MealSchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    meal: {
      type: String,
      required: true,
      enum: ['lunch', 'dinner']
    },
    mainDish: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
    },
    vegie: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
    },
    soup: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
    }
  },
  { timestamps: true }
)

MealSchema.index({ day: 1, meal: 1 }, { unique: true })

const Meal = model('Meal', MealSchema)

export default Meal
