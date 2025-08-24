import { Schema, model } from 'mongoose'

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
)

const Event = model('Event', EventSchema)

export default Event
