import { Router } from 'express'
import {
  calculateBalance,
  calculateIncome,
  calculateExpense,
  listExpenseCategories,
  listBoardingFeeDebts,
  countActiveMembers,
  listNewMembers,
  listLeftMembers,
  listLAbsencesForEachMember,
} from '../controllers/statistics.js'
import { authenticateUser, checkAdminPermission } from '../middlewares/auth.js'

const statisticsRouter = Router()

statisticsRouter.get('/statistics/balance', authenticateUser, checkAdminPermission, calculateBalance)
statisticsRouter.get('/statistics/income', authenticateUser, checkAdminPermission, calculateIncome)
statisticsRouter.get('/statistics/expense', authenticateUser, checkAdminPermission, calculateExpense)
statisticsRouter.get('/statistics/expense-categories', authenticateUser, checkAdminPermission, listExpenseCategories)
statisticsRouter.get('/statistics/boarding-fee-debts', authenticateUser, checkAdminPermission, listBoardingFeeDebts)

statisticsRouter.get('/statistics/active-members', authenticateUser, checkAdminPermission, countActiveMembers)
statisticsRouter.get('/statistics/new-members', authenticateUser, checkAdminPermission, listNewMembers)
statisticsRouter.get('/statistics/left-members', authenticateUser, checkAdminPermission, listLeftMembers)
statisticsRouter.get('/statistics/absences', authenticateUser, checkAdminPermission, listLAbsencesForEachMember)

export default statisticsRouter
