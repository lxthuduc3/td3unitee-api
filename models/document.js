import { Schema, model } from 'mongoose'

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'meeting', 'report'],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const Document = model('Document', DocumentSchema)

export default Document
