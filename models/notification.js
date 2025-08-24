import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    url: { type: String },
  },
  { timestamps: true }
)

const Notification = model('Notification', NotificationSchema)

export default Notification
