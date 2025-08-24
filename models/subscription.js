import { Schema, model } from 'mongoose'

const SubscriptionSchema = new Schema(
  {
    endpoint: {
      type: String,
      required: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: ['general', 'admin'],
    },
  },
  { timestamps: true }
)

const Subscription = model('Subscription', SubscriptionSchema)

export default Subscription
