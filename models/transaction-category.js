import { Schema, model } from 'mongoose'

const TransactionCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
  },
  { timestamps: true }
)

const TransactionCategory = model('TransactionCategory', TransactionCategorySchema)

export default TransactionCategory
