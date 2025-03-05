import { Router } from 'express'
import {
  getOwnExpenses,
  createExpense,
  getOwnExpense,
  editExpense,
  confirmExpense,
  deleteExpense,
  getOwnBoardingFees,
  createBoardingFee,
  getOwnBoardingFee,
  editBoardingFee,
  deleteBoardingFee,
  getTransactions,
  getTransaction,
  updateTransaction,
} from '../controllers/transactions.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const transactionsRouter = Router()

transactionsRouter.get('/me/expenses', authenticateUser, getOwnExpenses)
transactionsRouter.post('/me/expenses', authenticateUser, createExpense)
transactionsRouter.get('/me/expenses/:id', authenticateUser, getOwnExpense)
transactionsRouter.patch('/me/expenses/:id', authenticateUser, editExpense)
transactionsRouter.patch('/me/expenses/:id/confirm', authenticateUser, confirmExpense)
transactionsRouter.delete('/me/expenses/:id', authenticateUser, deleteExpense)

transactionsRouter.get('/me/boarding-fees', authenticateUser, getOwnBoardingFees)
transactionsRouter.post('/me/boarding-fees', authenticateUser, createBoardingFee)
transactionsRouter.get('/me/boarding-fees/:id', authenticateUser, getOwnBoardingFee)
transactionsRouter.patch('/me/boarding-fees/:id', authenticateUser, editBoardingFee)
transactionsRouter.delete('/me/boarding-fees/:id', authenticateUser, deleteBoardingFee)

transactionsRouter.get('/transactions', authenticateUser, checkAdminPermission, getTransactions)
transactionsRouter.get('/transactions/:id', authenticateUser, checkAdminPermission, getTransaction)
transactionsRouter.patch('/transactions/:id', authenticateUser, checkAdminPermission, updateTransaction)

export default transactionsRouter
