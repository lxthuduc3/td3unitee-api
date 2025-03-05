import { Router } from 'express'
import {
  getTransactionCategories,
  createTransactionCategory,
  editTransactionCategory,
} from '../controllers/transaction-categories.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const transactionCategoriesRouter = Router()

transactionCategoriesRouter.get(
  '/transaction-categories',
  authenticateUser,
  checkAdminPermission,
  getTransactionCategories
)
transactionCategoriesRouter.post(
  '/transaction-categories',
  authenticateUser,
  checkAdminPermission,
  createTransactionCategory
)
transactionCategoriesRouter.patch(
  '/transaction-categories/:id',
  authenticateUser,
  checkAdminPermission,
  editTransactionCategory
)

export default transactionCategoriesRouter
