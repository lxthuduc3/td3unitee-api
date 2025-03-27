import Transaction from '../models/transaction.js'
import User from '../models/user.js'
import Absence from '../models/absence.js'

import { endOfMonth, startOfMonth } from 'date-fns'
import { tzfEndOfDay, tzfStartOfDay } from '../lib/timezone-free.js'

export const calculateBalance = async (req, res) => {
  const { month } = req.query
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          date: { $lte: dateTo },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          balance: { $subtract: ['$totalIncome', '$totalExpense'] },
          totalIncome: 1,
          totalExpense: 1,
        },
      },
    ])

    return res.status(200).json(result.length > 0 ? { balance: result[0].balance } : { balance: 0 })
  } catch (error) {
    console.error('[calculateBalance]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const calculateIncome = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          type: 'income',
          status: 'completed',
          date: { $gte: dateFrom, $lte: dateTo },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ])

    return res.json(result.length > 0 ? { income: result[0].totalIncome } : { income: 0 })
  } catch (error) {
    console.error('[calculateIncome]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const calculateExpense = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          status: 'completed',
          date: { $gte: dateFrom, $lte: dateTo },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          totalExpense: 1,
        },
      },
    ])

    return res.json(result.length > 0 ? { expense: result[0].totalExpense } : { expense: 0 })
  } catch (error) {
    console.error('[calculateExpense]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listExpenseCategories = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const expenseCategories = await Transaction.aggregate([
      {
        $match: {
          type: 'expense',
          status: 'completed',
          date: { $gte: dateFrom, $lte: dateTo },
          category: { $ne: null }, // Ensure category exists
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'transactioncategories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          _id: 1,
          title: '$categoryDetails.title',
          amount: '$totalAmount',
        },
      },
    ])

    return res.status(200).json(expenseCategories)
  } catch (error) {
    console.error('[listExpenseCategories]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listBoardingFeeDebts = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const boardingFeeDebts = await User.aggregate([
      {
        $match: { status: 'active' },
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'transactor',
          as: 'transactions',
          pipeline: [
            {
              $match: {
                type: 'income',
                status: 'completed',
                date: { $gte: dateFrom, $lte: dateTo },
              },
            },
          ],
        },
      },
      {
        $match: { transactions: { $size: 0 } },
      },
      {
        $project: {
          _id: 1,
          avatar: 1,
          familyName: 1,
          givenName: 1,
        },
      },
    ])

    return res.status(200).json(boardingFeeDebts)
  } catch (error) {
    console.error('[listBoardingFeeDebt]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const countActiveMembers = async (req, res) => {
  const { month } = req.query
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const activeMembers = await User.countDocuments({
      status: 'active',
      createdAt: { $lte: dateTo },
    })

    return res.status(200).json({ activeMembers })
  } catch (error) {
    console.error('[countActiveMembers]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listNewMembers = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const newMembers = await User.find({
      status: 'active',
      createdAt: { $gte: dateFrom, $lte: dateTo },
    })
      .sort({ createdAt: 1 })
      .select('avatar familyName givenName')

    return res.status(200).json(newMembers)
  } catch (error) {
    console.error('[listNewMembers]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listLeftMembers = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const leftMembers = await User.find({
      status: 'left',
      updatedAt: { $gte: dateFrom, $lte: dateTo },
    })
      .sort({ updatedAt: 1 })
      .select('avatar familyName givenName')

    return res.status(200).json(leftMembers)
  } catch (error) {
    console.error('[listLeftMembers]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listLAbsencesForEachMember = async (req, res) => {
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))
  try {
    const absences = await Absence.aggregate([
      {
        $match: {
          title: 'Vắng kinh tối',
          date: { $gte: dateFrom, $lte: dateTo },
          canceled: false,
        },
      },
      {
        $group: {
          _id: '$user',
          absences: { $sum: 1 }, // Count absences per user
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: '$userInfo._id',
          familyName: '$userInfo.familyName',
          givenName: '$userInfo.givenName',
          absences: 1,
        },
      },
      {
        $sort: { absences: -1 },
      },
    ])

    return res.status(200).json(absences)
  } catch (error) {
    console.error('[listLAbsencesForEachMember]', error)
    return res.status(500).json('Internal Server Error')
  }
}
