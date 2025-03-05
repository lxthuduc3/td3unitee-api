import { Schema, model } from 'mongoose'

const SubscriptionSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Subscription = model('Subscription', SubscriptionSchema)

export default Subscription
