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
import { authenticateToken, checkAdminPermission } from '../middlewares/auth.js'

const transactionsRouter = Router()

transactionsRouter.get('/me/expenses', authenticateToken, getOwnExpenses)
transactionsRouter.post('/me/expenses', authenticateToken, createExpense)
transactionsRouter.get('/me/expenses/:id', authenticateToken, getOwnExpense)
transactionsRouter.patch('/me/expenses/:id', authenticateToken, editExpense)
transactionsRouter.patch('/me/expenses/:id/confirm', authenticateToken, confirmExpense)
transactionsRouter.delete('/me/expenses/:id', authenticateToken, deleteExpense)

transactionsRouter.get('/me/boarding-fees', authenticateToken, getOwnBoardingFees)
transactionsRouter.post('/me/boarding-fees', authenticateToken, createBoardingFee)
transactionsRouter.get('/me/boarding-fees/:id', authenticateToken, getOwnBoardingFee)
transactionsRouter.patch('/me/boarding-fees/:id', authenticateToken, editBoardingFee)
transactionsRouter.delete('/me/boarding-fees/:id', authenticateToken, deleteBoardingFee)

transactionsRouter.get('/transactions', authenticateToken, checkAdminPermission, getTransactions)
transactionsRouter.get('/transactions/:id', authenticateToken, checkAdminPermission, getTransaction)
transactionsRouter.patch('/transactions/:id', authenticateToken, checkAdminPermission, updateTransaction)

export default transactionsRouter
