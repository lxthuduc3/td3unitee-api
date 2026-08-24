import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    home: {
      type: Schema.Types.ObjectId,
      ref: 'Home',
      // Chưa bắt buộc ngay khi tạo user (đăng nhập Google lần đầu) vì user cần
      // chọn home (nhà) trước khi được duyệt vào hệ thống.
    },
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
      enum: ['executiveBoard', 'roomLeader', 'member', 'shopper'],
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
