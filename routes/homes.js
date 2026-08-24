import { Router } from 'express'
import { listHomes, getHome, createHome } from '../controllers/homes.js'

const homesRouter = Router()

// Public: FE cần danh sách home ngay sau khi đăng nhập Google, trước khi tài khoản được duyệt.
homesRouter.get('/homes', listHomes)
homesRouter.get('/homes/:id', getHome)
homesRouter.post('/homes', createHome)

export default homesRouter
