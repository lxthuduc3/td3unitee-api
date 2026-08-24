import { Schema, model } from 'mongoose'

const TransactionCategorySchema = new Schema(
  {
    home: {
      type: Schema.Types.ObjectId,
      ref: 'Home',
      required: true,
    },
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
