import { Schema, model } from 'mongoose'

// Home = một "nhà" (tenant) sử dụng chung hệ thống.
// Mỗi User, và hầu hết dữ liệu nghiệp vụ (bữa ăn, chi tiêu, thông báo, ...)
// đều thuộc về một Home duy nhất.
const HomeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    address: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const Home = model('Home', HomeSchema)

export default Home
