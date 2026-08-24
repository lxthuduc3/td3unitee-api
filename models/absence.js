import { Schema, model } from 'mongoose'

const AbsenceSchema = new Schema(
  {
    home: {
      type: Schema.Types.ObjectId,
      ref: 'Home',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Absence = model('Absence', AbsenceSchema)

export default Absence
