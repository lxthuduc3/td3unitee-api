import Home from '../models/home.js'

// Danh sách home (nhà) đang hoạt động - dùng để FE hiển thị cho user chọn
// sau khi đăng nhập Google thành công.
export const listHomes = async (req, res) => {
  try {
    const homes = await Home.find({ isActive: true }).select('name code address').sort({ name: 1 })

    return res.status(200).json(homes)
  } catch (error) {
    console.error('[listHomes]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getHome = async (req, res) => {
  const { id } = req.params

  try {
    const home = await Home.findById(id)

    if (!home) {
      return res.status(404).json('Home Not Found')
    }

    return res.status(200).json(home)
  } catch (error) {
    console.error('[getHome]', error)
    return res.status(500).json('Internal Server Error')
  }
}

// Tạo home mới (nhà mới). Việc này không thuộc về admin của một home cụ thể
// (executiveBoard chỉ có quyền trong home của họ) nên được bảo vệ bằng khóa thiết lập riêng.
export const createHome = async (req, res) => {
  const setupKey = req.headers['x-setup-key']
  if (!process.env.HOME_SETUP_KEY || setupKey !== process.env.HOME_SETUP_KEY) {
    return res.status(403).json('Permission Denied')
  }

  const { name, code, address } = req.body

  if (!name) {
    return res.status(400).json('name là bắt buộc')
  }

  try {
    const home = await Home.create({ name, code, address })

    return res.status(201).json(home)
  } catch (error) {
    console.error('[createHome]', error)
    return res.status(500).json('Internal Server Error')
  }
}
