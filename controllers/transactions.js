import Transaction from '../models/transaction.js'

import { getStartOfDate, getEndOfDate } from '../lib/datetime.js'

export const getOwnExpenses = async (req, res) => {
  const { id: transactor } = req.user
  const { dateFrom, dateTo, status } = req.query

  const query = {
    type: 'expense',
    transactor,
  }

  if (dateFrom) query.date.$gte = getStartOfDate(dateFrom)
  if (dateTo) query.date.$lte = getEndOfDate(dateTo)
  if (status) query.status = Array.isArray(status) ? { $in: status } : status

  try {
    const transactions = await Transaction.find(query)

    return res.status(200).json(transactions)
  } catch (error) {
    console.error('[getOwnExpenses]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createExpense = async (req, res) => {
  const { id: transactor } = req.user
  const { desc, amount, date, funded } = req.body

  try {
    const transaction = await Transaction.create({
      desc,
      amount,
      date,
      transactor,
      type: 'expense',
      status: funded ? 'pendingReimbursement' : 'pending',
    })

    return res.status(201).json(transaction)
  } catch (error) {
    console.error('[createExpense]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getOwnExpense = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params
  try {
    const transaction = await Transaction.findOne({ _id: id, transactor })

    if (!transaction) {
      return res.status(404).json('Transaction Not Found')
    }

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[getOwnExpense]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const editExpense = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params
  const { date, amount, desc } = req.body

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, transactor, status: { $in: ['pending', 'pendingReimbursement'] } },
      date,
      amount,
      desc,
      { new: true }
    )

    if (!transaction) {
      return res.status(404).json('Transaction Not Found Or Can No Longer Be Edited')
    }

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[editExpense]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteExpense = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      transactor,
      status: { $in: ['pending', 'pendingReimbursement'] },
    })

    if (!transaction) return res.status(404).json('Transaction Not Found Or No Longer Be Deleted')

    return res.status(200).json('Transaction Deleted Successfully')
  } catch (error) {
    console.error('[deleteExpense]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getOwnBoardingFees = async (req, res) => {
  const { id: transactor } = req.user
  const { dateFrom, dateTo, status } = req.query

  const query = {
    type: 'income',
    transactor,
  }

  if (dateFrom) query.date.$gte = getStartOfDate(dateFrom)
  if (dateTo) query.date.$lte = getEndOfDate(dateTo)
  if (status) query.status = Array.isArray(status) ? { $in: status } : status

  try {
    const transactions = await Transaction.find(query)

    return res.status(200).json(transactions)
  } catch (error) {
    console.error('[getOwnBoardingFees]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const createBoardingFee = async (req, res) => {
  const { id: transactor } = req.user
  const { desc, amount, date } = req.body

  try {
    const transaction = await Transaction.create({
      desc,
      amount,
      date,
      transactor,
      type: 'income',
      status: 'pending',
    })

    return res.status(201).json(transaction)
  } catch (error) {
    console.error('[createBoardingFee]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getOwnBoardingFee = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params
  try {
    const transaction = await Transaction.findOne({ _id: id, transactor })

    if (!transaction) {
      return res.status(404).json('Transaction Not Found')
    }

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[getOwnBoardingFee]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const editBoardingFee = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params
  const { date, amount, desc } = req.body

  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, transactor, status: 'pending' },
      date,
      amount,
      desc,
      { new: true }
    )

    if (!transaction) {
      return res.status(404).json('Transaction Not Found Or Can No Longer Be Edited')
    }

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[editBoardingFee]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const deleteBoardingFee = async (req, res) => {
  const { id: transactor } = req.user
  const { id } = req.params

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      transactor,
      status: 'pending',
    })

    if (!transaction) return res.status(404).json('Transaction Not Found Or No Longer Be Deleted')

    return res.status(200).json('Transaction Deleted Successfully')
  } catch (error) {
    console.error('[deleteBoardingFee]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getTransactions = async (req, res) => {
  const { dateFrom, dateTo, status, category } = req.query
  const query = {}

  if (dateFrom) query.date = { $gte: getStartOfDate(dateFrom) }
  if (dateTo) query.date = { ...query.date, $lte: getEndOfDate(dateTo) }
  if (status) query.status = Array.isArray(status) ? { $in: status } : status
  if (category) query.category = category

  try {
    const transactions = await Transaction.find(query)

    return res.status(200).json(transactions)
  } catch (error) {
    console.error('[getTransactions]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const getTransaction = async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await Transaction.findById(id)

    if (!transaction) return res.status(404).json('Transaction Not Found')

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[getTransaction]', error)
    return res.status(500).json('Internal Server Error')
  }
}

export const updateTransaction = async (req, res) => {
  const { id } = req.params
  const { category, status } = req.body

  try {
    const transaction = await Transaction.findByIdAndUpdate(id, { category, status }, { new: true })

    if (!transaction) return res.status(404).json('Transaction Not Found')

    return res.status(200).json(transaction)
  } catch (error) {
    console.error('[updateTransaction]', error)
    return res.status(500).json('Internal Server Error')
  }
}
