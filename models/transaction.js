import { Schema, model } from 'mongoose'

const TransactionSchema = new Schema(
  {
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be a positive integer'],
    },
    date: {
      type: Date,
      required: true,
    },
    transactor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'TransactionCategory',
    },
    status: {
      type: String,
      enum: ['pending', 'pendingReimbursement', 'pendingConfirmation', 'rejected', 'completed'],
    },
  },
  { timestamps: true }
)

const Transaction = model('Transaction', TransactionSchema)

export default Transaction
