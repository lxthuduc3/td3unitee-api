import Transaction from '../models/transaction.js'
import User from '../models/user.js'
import Absence from '../models/absence.js'

import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'
import { tzfEndOfDay, tzfStartOfDay } from '../lib/timezone-free.js'
import { tzNow } from '../lib/timezone-free.js'

const TIMEZONE = 'Asia/Ho_Chi_Minh'

export const calculateBalance = async (req, res) => {
  const { home } = req.user
  const { month } = req.query
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const expenseCategories = await Transaction.aggregate([
      {
        $match: {
          home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const boardingFeeDebts = await User.aggregate([
      {
        $match: { home, status: 'active' },
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
                home,
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
  const { home } = req.user
  const { month } = req.query
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const activeMembers = await User.countDocuments({
      home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const newMembers = await User.find({
      home,
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
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const leftMembers = await User.find({
      home,
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

export const countLeftMembers = async (req, res) => {
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))

  try {
    const leftMembers = await User.countDocuments({
      home,
      status: 'left',
      updatedAt: { $gte: dateFrom, $lte: dateTo },
    })

    return res.status(200).json({ leftMembers })
  } catch (error) {
    console.error('[countLeftMembers]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const countPendingRequests = async (req, res) => {
  const { home } = req.user
  const { month } = req.query

  const query = {
    home,
    status: 'pending',
  }

  if (month) {
    query.createdAt = {
      $gte: tzfStartOfDay(startOfMonth(new Date(`${month}-01`))),
      $lte: tzfEndOfDay(endOfMonth(new Date(`${month}-01`))),
    }
  }

  try {
    const pendingRequests = await User.countDocuments(query)

    return res.status(200).json({ pendingRequests })
  } catch (error) {
    console.error('[countPendingRequests]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const statisticAbsencesByTitle = async (req, res) => {
  const { home } = req.user
  const { month } = req.query

  const now = tzNow()
  const weekFrom = tzfStartOfDay(startOfWeek(now, { weekStartsOn: 1 }))
  const weekTo = tzfEndOfDay(endOfWeek(now, { weekStartsOn: 1 }))
  const monthFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : now))
  const monthTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : now))

  try {
    const [week, monthData] = await Promise.all([
      Absence.aggregate([
        {
          $match: {
            home,
            canceled: false,
            date: { $gte: weekFrom, $lte: weekTo },
          },
        },
        {
          $group: {
            _id: '$title',
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            title: { $ifNull: ['$_id', 'Không rõ tiêu đề'] },
            total: 1,
          },
        },
        {
          $sort: { total: -1, title: 1 },
        },
      ]),
      Absence.aggregate([
        {
          $match: {
            home,
            canceled: false,
            date: { $gte: monthFrom, $lte: monthTo },
          },
        },
        {
          $group: {
            _id: '$title',
            total: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            title: { $ifNull: ['$_id', 'Không rõ tiêu đề'] },
            total: 1,
          },
        },
        {
          $sort: { total: -1, title: 1 },
        },
      ]),
    ])

    return res.status(200).json({
      week: {
        from: weekFrom,
        to: weekTo,
        titles: week,
        total: week.reduce((sum, item) => sum + item.total, 0),
      },
      month: {
        from: monthFrom,
        to: monthTo,
        titles: monthData,
        total: monthData.reduce((sum, item) => sum + item.total, 0),
      },
    })
  } catch (error) {
    console.error('[statisticAbsencesByTitle]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const statisticAbsencesByDay = async (req, res) => {
  const { home } = req.user
  const { month } = req.query
  const monthStart = startOfMonth(month ? new Date(`${month}-01`) : new Date())
  const monthEnd = endOfMonth(month ? new Date(`${month}-01`) : new Date())
  const dateFrom = tzfStartOfDay(monthStart)
  const dateTo = tzfEndOfDay(monthEnd)

  try {
    const result = await Absence.aggregate([
      {
        $match: {
          home,
          canceled: false,
          date: { $gte: dateFrom, $lte: dateTo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date', timezone: TIMEZONE } },
            title: { $ifNull: ['$title', 'Không rõ tiêu đề'] },
          },
          count: { $sum: 1 },
        },
      },
    ])

    const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((day) => format(day, 'yyyy-MM-dd'))
    const dayIndex = new Map(days.map((date, index) => [date, index]))
    const seriesByTitle = new Map()

    for (const { _id, count } of result) {
      if (!dayIndex.has(_id.date)) continue
      if (!seriesByTitle.has(_id.title)) {
        seriesByTitle.set(_id.title, { title: _id.title, total: 0, counts: days.map(() => 0) })
      }
      const series = seriesByTitle.get(_id.title)
      series.counts[dayIndex.get(_id.date)] = count
      series.total += count
    }

    const series = [...seriesByTitle.values()].sort((a, b) => b.total - a.total || a.title.localeCompare(b.title))

    return res.status(200).json({ days, series })
  } catch (error) {
    console.error('[statisticAbsencesByDay]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const listLAbsencesForEachMember = async (req, res) => {
  const { home } = req.user
  const { month } = req.query
  const dateFrom = tzfStartOfDay(startOfMonth(month ? new Date(`${month}-01`) : new Date()))
  const dateTo = tzfEndOfDay(endOfMonth(month ? new Date(`${month}-01`) : new Date()))
  try {
    const absences = await Absence.aggregate([
      {
        $match: {
          home,
          title: { $in: ['Vắng kinh tối', 'Về trễ'] },
          date: { $gte: dateFrom, $lte: dateTo },
          canceled: false,
        },
      },
      {
        $group: {
          _id: '$user',
          absences: { $sum: { $cond: [{ $eq: ['$title', 'Vắng kinh tối'] }, 1, 0] } }, // Count absences per user
          lateReturns: { $sum: { $cond: [{ $eq: ['$title', 'Về trễ'] }, 1, 0] } },
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
          lateReturns: 1,
        },
      },
      {
        $sort: { absences: -1, lateReturns: -1 },
      },
    ])

    return res.status(200).json(absences)
  } catch (error) {
    console.error('[listLAbsencesForEachMember]', error)
    return res.status(500).json('Internal Server Error')
  }
}
