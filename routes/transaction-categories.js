import { Router } from 'express'
import {
  getTransactionCategories,
  createTransactionCategory,
  editTransactionCategory,
} from '../controllers/transaction-categories.js'
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const transactionCategoriesRouter = Router()

transactionCategoriesRouter.get(
  '/transaction-categories',
  authenticateToken,
  checkAdminPermission,
  getTransactionCategories
)
transactionCategoriesRouter.post(
  '/transaction-categories',
  authenticateToken,
  checkAdminPermission,
  createTransactionCategory
)
transactionCategoriesRouter.patch(
  '/transaction-categories/:id',
  authenticateToken,
  checkAdminPermission,
  editTransactionCategory
)

export default transactionCategoriesRouter
