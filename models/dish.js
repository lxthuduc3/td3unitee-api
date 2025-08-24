import { Schema, model } from 'mongoose'

const DishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['main', 'vegie', 'soup']
    },
    ingredients: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
          },
        },
      ],
      validate: {
        validator: (v) => {
          return v && v.length > 0;
        },
        message: 'A dish must have at least one ingredient.',
      },
    },
  },
  { timestamps: true }
)

const Dish = model('Dish', DishSchema)

export default Dish
