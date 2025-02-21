import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    dateOfBirth: Date,
    baptismalName: String,
    phone: String,
    facebook: String,
    hometown: String,
    school: String,
    firstSchoolYear: Number,
    major: String,
    room: String,
    role: {
      type: String,
      enum: ['executiveBoard', 'roomLeader', 'member'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'left'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const User = model('User', UserSchema)

export default User
