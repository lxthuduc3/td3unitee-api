import { Schema, model } from 'mongoose'

const EventSchema = new Schema(
  {
    home: { type: Schema.Types.ObjectId, ref: 'Home', required: true },
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
